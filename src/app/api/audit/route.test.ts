import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  after: vi.fn(),
  insertSiteAudit: vi.fn(),
  runSiteAudit: vi.fn(),
  throttleHit: vi.fn(),
  sendMetaLead: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/audit/repository", () => ({ insertSiteAudit: mocks.insertSiteAudit }));
vi.mock("@/lib/audit/run", () => ({ runSiteAudit: mocks.runSiteAudit }));
vi.mock("@/lib/server/meta-capi", () => ({ sendMetaLead: mocks.sendMetaLead }));
vi.mock("@/lib/server/request-guard", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/server/request-guard")>()),
  throttleHit: mocks.throttleHit,
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.sendEmail };
  },
}));

vi.stubEnv("RESEND_API_KEY", "re_test");
const { POST } = await import("@/app/api/audit/route");

const AUDIT = { id: "0b9f7c1e-3c55-4b8e-9f6a-2d1c3b4a5e6f", url: "https://acme.example/", status: "pending" };

function post(body: unknown, headers: Record<string, string> = { origin: "https://www.foundryframe.com" }) {
  return POST(
    new Request("https://www.foundryframe.com/api/audit", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.9", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
}

beforeEach(() => {
  for (const fn of Object.values(mocks)) fn.mockReset();
  mocks.throttleHit.mockResolvedValue(true);
  mocks.insertSiteAudit.mockResolvedValue(AUDIT);
  mocks.sendMetaLead.mockResolvedValue(undefined);
  mocks.sendEmail.mockResolvedValue({ error: null });
  mocks.runSiteAudit.mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("POST /api/audit", () => {
  it("rejects cross-site requests", async () => {
    const res = await post({ url: "acme.example", email: "a@b.co" }, { origin: "https://evil.example" });
    expect(res.status).toBe(403);
    expect(mocks.insertSiteAudit).not.toHaveBeenCalled();
  });

  it("rejects requests with no origin or referer", async () => {
    expect((await post({ url: "acme.example", email: "a@b.co" }, {})).status).toBe(403);
  });

  it("accepts a same-site referer when there's no Origin", async () => {
    const res = await post({ url: "acme.example", email: "a@b.co" }, { referer: "https://foundryframe.com/audit" });
    expect(res.status).toBe(201);
  });

  it.each([
    [{ email: "a@b.co" }, /Missing required fields/],
    [{ url: "acme.example" }, /Missing required fields/],
    [{ url: "acme.example", email: "not-an-email" }, /valid email/],
    [{ url: "   ", email: "a@b.co" }, /Missing required fields/],
    [{ url: 42, email: "a@b.co" }, /Missing required fields/],
  ])("400s on %j", async (body, message) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(message);
  });

  it("400s on a non-object body", async () => {
    expect((await post("null")).status).toBe(400);
  });

  it("500s on malformed JSON without leaking details", async () => {
    const res = await post("{bad json");
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Something went wrong. Please try again.");
  });

  it.each([
    ["localhost", /public website/],
    ["http://169.254.169.254/latest/meta-data", /can't be audited/],
    ["https://acme.example:8443", /standard web ports/],
    ["ftp://acme.example", /Only http and https/],
    ["file:///etc/passwd", /Only http and https/],
  ])("refuses to audit %s before any rate limit or insert", async (url, message) => {
    const res = await post({ url, email: "a@b.co" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(message);
    expect(mocks.throttleHit).not.toHaveBeenCalled();
    expect(mocks.insertSiteAudit).not.toHaveBeenCalled();
  });

  it("normalizes a bare domain to https and trims the inputs", async () => {
    await post({ url: "  acme.example/services ", email: " a@b.co ", name: " Jane ", company: "", phone: "555" });
    expect(mocks.insertSiteAudit).toHaveBeenCalledWith({
      url: "https://acme.example/services",
      email: "a@b.co",
      name: "Jane",
      company: null,
      phone: "555",
      source: null,
    });
  });

  it("caps field lengths", async () => {
    await post({ url: "acme.example", email: "a@b.co", name: "n".repeat(500) });
    expect(mocks.insertSiteAudit.mock.calls[0][0].name).toHaveLength(120);
  });

  it("returns the new audit, schedules the run, and notifies the team", async () => {
    const res = await post({ url: "acme.example", email: "a@b.co", name: "Jane" });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(AUDIT);
    expect(mocks.after).toHaveBeenCalledTimes(1);
    expect(mocks.runSiteAudit).not.toHaveBeenCalled();

    await mocks.after.mock.calls[0][0]();
    expect(mocks.runSiteAudit).toHaveBeenCalledWith(AUDIT.id);
    const email = mocks.sendEmail.mock.calls[0][0];
    expect(email.replyTo).toBe("a@b.co");
    expect(email.html).toContain(`/audit/${AUDIT.id}`);
    expect(mocks.sendMetaLead).toHaveBeenCalled();
  });

  it("escapes visitor input in the team email", async () => {
    await post({ url: "acme.example", email: "a@b.co", name: "<script>x</script>" });
    await mocks.after.mock.calls[0][0]();
    const { html } = mocks.sendEmail.mock.calls[0][0];
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("still runs the audit when the team email fails", async () => {
    mocks.sendEmail.mockRejectedValue(new Error("resend down"));
    await post({ url: "acme.example", email: "a@b.co" });
    await expect(mocks.after.mock.calls[0][0]()).resolves.toBeUndefined();
    expect(mocks.runSiteAudit).toHaveBeenCalled();
  });

  it("rate limits per IP (hashed) and site-wide", async () => {
    await post({ url: "acme.example", email: "a@b.co" });
    const [[ipBucket, ipLimit, ipWindow], [siteBucket, siteLimit]] = mocks.throttleHit.mock.calls;
    expect(ipBucket).toMatch(/^audit:ip:[0-9a-f]{32}$/);
    expect(ipBucket).not.toContain("203.0.113.9");
    expect([ipLimit, ipWindow]).toEqual([5, 3600]);
    expect([siteBucket, siteLimit]).toEqual(["audit:all", 60]);
  });

  it("429s when over a limit, without counting against the site-wide bucket", async () => {
    mocks.throttleHit.mockResolvedValueOnce(false);
    const res = await post({ url: "acme.example", email: "a@b.co" });
    expect(res.status).toBe(429);
    expect(mocks.throttleHit).toHaveBeenCalledTimes(1);
    expect(mocks.insertSiteAudit).not.toHaveBeenCalled();
  });

  it("429s when the site-wide limit is hit", async () => {
    mocks.throttleHit.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    expect((await post({ url: "acme.example", email: "a@b.co" })).status).toBe(429);
  });

  it("fails closed (503) when the rate limiter is unavailable", async () => {
    mocks.throttleHit.mockResolvedValueOnce(null);
    expect((await post({ url: "acme.example", email: "a@b.co" })).status).toBe(503);
    mocks.throttleHit.mockResolvedValueOnce(true).mockResolvedValueOnce(null);
    expect((await post({ url: "acme.example", email: "a@b.co" })).status).toBe(503);
    expect(mocks.insertSiteAudit).not.toHaveBeenCalled();
  });

  it("500s when the insert fails", async () => {
    mocks.insertSiteAudit.mockRejectedValue(new Error("db down"));
    const res = await post({ url: "acme.example", email: "a@b.co" });
    expect(res.status).toBe(500);
    expect(mocks.after).not.toHaveBeenCalled();
  });
});
