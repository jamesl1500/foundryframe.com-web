// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }));
const trackConversion = vi.fn();
vi.mock("@/lib/analytics", () => ({ newConversionId: () => "conv-123", trackConversion }));

const { default: AuditForm } = await import("@/components/AuditForm");

const ID = "0b9f7c1e-3c55-4b8e-9f6a-2d1c3b4a5e6f";

function json(body: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));
}

/** Queues fetch responses: the POST first, then each poll. */
function mockFetch(...responses: (() => Promise<Response>)[]) {
  const fetchMock = vi.fn();
  for (const respond of responses) fetchMock.mockImplementationOnce(respond);
  fetchMock.mockImplementation(() => json({ id: ID, status: "running" }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

function enterUrl(url = "acme.example") {
  fireEvent.change(screen.getByRole("textbox", { name: "Your website address" }), { target: { value: url } });
  fireEvent.click(screen.getByRole("button", { name: "Start My Free Audit" }));
}

function enterContact(email = "owner@acme.example") {
  fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), { target: { value: email } });
  fireEvent.click(screen.getByRole("button", { name: "Send Me My Free Audit" }));
}

beforeEach(() => {
  vi.useFakeTimers();
  push.mockReset();
  trackConversion.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AuditForm", () => {
  it("labels every input for assistive tech", () => {
    render(<AuditForm />);
    expect(screen.getByRole("textbox", { name: "Your website address" })).toBeRequired();
    enterUrl();
    expect(screen.getByRole("textbox", { name: "Email address" })).toBeRequired();
    expect(screen.getByRole("textbox", { name: "Your name (optional)" })).not.toBeRequired();
    expect(screen.getByRole("textbox", { name: "Company (optional)" })).not.toBeRequired();
  });

  it("doesn't advance on a blank URL", () => {
    render(<AuditForm />);
    fireEvent.change(screen.getByRole("textbox", { name: "Your website address" }), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("button", { name: "Start My Free Audit" }).closest("form")!);
    expect(screen.queryByRole("textbox", { name: "Email address" })).not.toBeInTheDocument();
  });

  it("shows the URL being audited and can go back", () => {
    render(<AuditForm />);
    enterUrl("acme.example");
    expect(screen.getByText("acme.example")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("textbox", { name: "Your website address" })).toHaveValue("acme.example");
  });

  it("starts the audit, tracks the conversion, polls, and opens the results", async () => {
    const fetchMock = mockFetch(
      () => json({ id: ID, status: "pending" }, 201),
      () => json({ id: ID, status: "running" }),
      () => json({ id: ID, status: "completed" })
    );
    render(<AuditForm />);
    enterUrl();
    fireEvent.change(screen.getByRole("textbox", { name: "Your name (optional)" }), { target: { value: "Jane" } });
    enterContact();
    await flush();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/audit");
    expect(JSON.parse(init.body)).toEqual({
      url: "acme.example",
      email: "owner@acme.example",
      name: "Jane",
      conversionId: "conv-123",
    });
    expect(trackConversion).toHaveBeenCalledWith("audit", { eventId: "conv-123" });
    expect(screen.getByRole("status")).toHaveTextContent("Crawling your website");
    expect(fetchMock).toHaveBeenCalledWith(`/api/audit/${ID}`, { cache: "no-store" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });
    expect(push).toHaveBeenCalledWith(`/audit/${ID}`);
  });

  it("advances the scan stage text while waiting", async () => {
    mockFetch(() => json({ id: ID, status: "pending" }, 201));
    render(<AuditForm />);
    enterUrl();
    enterContact();
    await flush();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Analyzing SEO fundamentals");
  });

  it("shows the server's error when the audit can't start, and resets", async () => {
    mockFetch(() => json({ error: "Please enter a public website address." }, 400));
    render(<AuditForm />);
    enterUrl("localhost");
    enterContact();
    await flush();

    expect(screen.getByRole("alert")).toHaveTextContent("Please enter a public website address.");
    expect(trackConversion).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Try Again" }));
    expect(screen.getByRole("textbox", { name: "Your website address" })).toBeInTheDocument();
  });

  it("shows the failure message when the audit fails", async () => {
    mockFetch(
      () => json({ id: ID, status: "pending" }, 201),
      () => json({ id: ID, status: "failed", error_message: "That website blocked our scanner." })
    );
    render(<AuditForm />);
    enterUrl();
    enterContact();
    await flush();
    expect(screen.getByRole("alert")).toHaveTextContent("That website blocked our scanner.");
  });

  it("tells the visitor results will be emailed when polling runs out", async () => {
    mockFetch(() => json({ id: ID, status: "pending" }, 201));
    render(<AuditForm />);
    enterUrl();
    enterContact();
    await flush();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(152_500);
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/email your results/);
    expect(push).not.toHaveBeenCalled();
  });

  it("keeps polling through transient network errors", async () => {
    mockFetch(
      () => json({ id: ID, status: "pending" }, 201),
      () => Promise.reject(new TypeError("Failed to fetch")),
      () => json({ id: ID, status: "completed" })
    );
    render(<AuditForm />);
    enterUrl();
    enterContact();
    await flush();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });
    expect(push).toHaveBeenCalledWith(`/audit/${ID}`);
  });

  it("never runs two polls at once when a response is slow", async () => {
    let release: (value: Response) => void = () => undefined;
    const fetchMock = mockFetch(
      () => json({ id: ID, status: "pending" }, 201),
      () => new Promise<Response>((resolve) => (release = resolve))
    );
    render(<AuditForm />);
    enterUrl();
    enterContact();
    await flush();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });
    // The POST plus the one poll still waiting: no ticks piled up behind it.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await act(async () => {
      release(new Response(JSON.stringify({ id: ID, status: "completed" })));
      await Promise.resolve();
    });
    await flush();
    expect(push).toHaveBeenCalledTimes(1);
  });
});
