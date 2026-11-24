/* The public form routes share one shape: same-site only, honeypot, typed
   and length-capped fields, durable per-IP and site-wide rate limits that
   fail closed, a team email with escaped values, and a Meta Lead event
   only after success. These tests hold each route to it. */
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  throttleHit: vi.fn(),
  sendMetaLead: vi.fn(),
  sendEmail: vi.fn(),
  insertQuote: vi.fn(),
  updateQuote: vi.fn(),
  insertFoundingApplication: vi.fn(),
  markFoundingApplicationEmailed: vi.fn(),
  createLead: vi.fn(),
}));

vi.mock("@/lib/server/request-guard", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/server/request-guard")>()),
  throttleHit: mocks.throttleHit,
}));
vi.mock("@/lib/server/meta-capi", () => ({ sendMetaLead: mocks.sendMetaLead }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.sendEmail };
  },
}));
vi.mock("@/lib/package-builder/repository", () => ({ insertQuote: mocks.insertQuote, updateQuote: mocks.updateQuote }));
vi.mock("@/lib/founding/repository", () => ({
  insertFoundingApplication: mocks.insertFoundingApplication,
  markFoundingApplicationEmailed: mocks.markFoundingApplicationEmailed,
}));
vi.mock("@/lib/leads/repository", () => ({ createLead: mocks.createLead }));

vi.stubEnv("RESEND_API_KEY", "re_test");

/* Imported up front, while RESEND_API_KEY is set: each route builds its
   Resend client when it loads, and env stubs are undone after every test. */
const routeModules = {
  contact: await import("@/app/api/contact/route"),
  "package-quote": await import("@/app/api/package-quote/route"),
  founding: await import("@/app/api/founding/route"),
  "ad-lead": await import("@/app/api/ad-lead/route"),
};

const { FOUNDING_BUDGETS, FOUNDING_TIMELINES } = await import("@/lib/founding/options");
const { funnels } = await import("@/lib/funnels");

type Route = {
  name: string;
  load: () => Promise<{ POST: (request: Request) => Promise<Response> }>;
  valid: Record<string, unknown>;
  bucket: string;
  hasHoneypot: boolean;
  required: string[];
};

const ROUTES: Route[] = [
  {
    name: "contact",
    load: async () => routeModules["contact"],
    valid: { firstName: "Jane", lastName: "Doe", email: "jane@acme.example", message: "Need a site." },
    bucket: "contact",
    hasHoneypot: false,
    required: ["firstName", "lastName", "email", "message"],
  },
  {
    name: "package-quote",
    load: async () => routeModules["package-quote"],
    valid: { name: "Jane", email: "jane@acme.example", selection: { foundationId: "spark", addons: {} } },
    bucket: "package-quote",
    hasHoneypot: true,
    required: ["name", "email"],
  },
  {
    name: "founding",
    load: async () => routeModules["founding"],
    valid: {
      name: "Jane",
      email: "jane@acme.example",
      business: "Acme",
      timeline: FOUNDING_TIMELINES[0],
      budget: FOUNDING_BUDGETS[0],
    },
    bucket: "founding",
    hasHoneypot: true,
    required: ["name", "email", "business", "timeline", "budget"],
  },
  {
    name: "ad-lead",
    load: async () => routeModules["ad-lead"],
    valid: { funnel: funnels[0].slug, name: "Jane", email: "jane@acme.example", business: "Acme", link: "instagram.com/acme" },
    bucket: "ad-lead",
    hasHoneypot: true,
    required: ["name", "email", "business", "link"],
  },
];

function post(route: Route, body: unknown, headers: Record<string, string> = { origin: "https://www.foundryframe.com" }) {
  return route.load().then(({ POST }) =>
    POST(
      new Request(`https://www.foundryframe.com/api/${route.name}`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.9", ...headers },
        body: JSON.stringify(body),
      })
    )
  );
}

beforeEach(() => {
  for (const fn of Object.values(mocks)) fn.mockReset();
  mocks.throttleHit.mockResolvedValue(true);
  mocks.sendEmail.mockResolvedValue({ data: { id: "e1" }, error: null });
  mocks.insertQuote.mockResolvedValue({ id: "q1" });
  mocks.updateQuote.mockResolvedValue(undefined);
  mocks.insertFoundingApplication.mockResolvedValue({ id: "f1" });
  mocks.markFoundingApplicationEmailed.mockResolvedValue(undefined);
  mocks.createLead.mockResolvedValue({ id: "l1" });
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe.each(ROUTES)("POST /api/$name", (route) => {
  it("accepts a valid same-site submission and emails the team", async () => {
    const res = await post(route, { ...route.valid, conversionId: "11111111-2222" });
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
    expect(mocks.sendEmail.mock.calls[0][0].replyTo).toBe("jane@acme.example");
    expect(mocks.sendMetaLead).toHaveBeenCalledTimes(1);
  });

  it("rejects cross-site and header-less requests", async () => {
    expect((await post(route, route.valid, { origin: "https://evil.example" })).status).toBe(403);
    expect((await post(route, route.valid, {})).status).toBe(403);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it.each(["required"])("400s when a required field is missing or not a string", async () => {
    for (const field of route.required) {
      expect((await post(route, { ...route.valid, [field]: "" })).status).toBe(400);
      expect((await post(route, { ...route.valid, [field]: { $gt: "" } })).status).toBe(400);
    }
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("400s on an invalid email", async () => {
    const res = await post(route, { ...route.valid, email: "jane@" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/valid email/);
  });

  it("rate limits per IP, then site-wide", async () => {
    await post(route, route.valid);
    expect(mocks.throttleHit.mock.calls[0][0]).toMatch(new RegExp(`^${route.bucket}:ip:[0-9a-f]{32}$`));
    expect(mocks.throttleHit.mock.calls[1][0]).toBe(`${route.bucket}:all`);

    mocks.throttleHit.mockReset().mockResolvedValueOnce(false);
    expect((await post(route, route.valid)).status).toBe(429);
    expect(mocks.throttleHit).toHaveBeenCalledTimes(1);
  });

  it("fails closed when the limiter is down", async () => {
    mocks.throttleHit.mockResolvedValue(null);
    expect((await post(route, route.valid)).status).toBe(503);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("escapes visitor input in the email", async () => {
    const field = route.required.find((key) => !["email", "timeline", "budget", "link"].includes(key))!;
    await post(route, { ...route.valid, [field]: '<img src=x onerror="alert(1)">' });
    const { html } = mocks.sendEmail.mock.calls[0][0];
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img src=x");
  });

  it("doesn't send a Meta Lead when the submission fails", async () => {
    mocks.sendEmail.mockResolvedValue({ data: null, error: { message: "Resend internal detail" } });
    mocks.insertQuote.mockRejectedValue(new Error("db"));
    mocks.insertFoundingApplication.mockRejectedValue(new Error("db"));
    mocks.createLead.mockRejectedValue(new Error("db"));
    const res = await post(route, route.valid);
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("Resend internal detail");
    expect(mocks.sendMetaLead).not.toHaveBeenCalled();
  });

  it("500s on malformed JSON", async () => {
    const { POST } = await route.load();
    const res = await POST(
      new Request(`https://www.foundryframe.com/api/${route.name}`, {
        method: "POST",
        headers: { origin: "https://www.foundryframe.com" },
        body: "{oops",
      })
    );
    expect(res.status).toBe(500);
  });

  if (route.hasHoneypot) {
    it("quietly accepts and drops honeypot submissions", async () => {
      const res = await post(route, { ...route.valid, fax: "555-0100" });
      expect(res.status).toBe(200);
      expect(mocks.sendEmail).not.toHaveBeenCalled();
      expect(mocks.throttleHit).not.toHaveBeenCalled();
    });
  }
});

describe("route specifics", () => {
  const [contact, quote, founding, adLead] = ROUTES;

  it("contact caps the message length", async () => {
    await post(contact, { ...contact.valid, message: "x".repeat(20_000) });
    const { html } = mocks.sendEmail.mock.calls[0][0];
    expect(html).toContain("x".repeat(5000));
    expect(html).not.toContain("x".repeat(5001));
  });

  it("package-quote re-prices on the server and ignores client totals", async () => {
    const res = await post(quote, { ...quote.valid, oneTimeTotal: 1, quote: { oneTimeTotal: 1 } });
    const body = await res.json();
    expect(body.quote.oneTimeTotal).toBe(1500);
    expect(mocks.insertQuote.mock.calls[0][0].one_time_total).toBe(1500);
  });

  it("package-quote rejects an unknown foundation and drops past or malformed dates", async () => {
    expect((await post(quote, { ...quote.valid, selection: { foundationId: "free" } })).status).toBe(400);
    await post(quote, { ...quote.valid, preferredDate: "2001-01-01", preferredWindow: "midnight" });
    const row = mocks.insertQuote.mock.calls[0][0];
    expect(row.preferred_date).toBeNull();
    expect(row.preferred_window).toBeNull();
  });

  it("package-quote still succeeds when only the email works", async () => {
    mocks.insertQuote.mockRejectedValue(new Error("db down"));
    expect((await post(quote, quote.valid)).status).toBe(200);
    expect(mocks.sendEmail.mock.calls[0][0].html).toMatch(/this email is the only copy/);
  });

  it("founding only accepts listed timelines and budgets", async () => {
    expect((await post(founding, { ...founding.valid, budget: "$1 million" })).status).toBe(400);
  });

  it("ad-lead rejects unknown funnels and normalizes bare links", async () => {
    expect((await post(adLead, { ...adLead.valid, funnel: "nope" })).status).toBe(400);
    await post(adLead, adLead.valid);
    expect(mocks.createLead.mock.calls[0][0].website_url).toBe("https://instagram.com/acme");
    await post(adLead, { ...adLead.valid, link: "@acme" });
    expect(mocks.createLead.mock.calls[1][0].website_url).toBe("@acme");
  });
});
