import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "@/test/supabase-fake";

let db = fakeSupabase();
let adminThrows = false;
vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdminClient: () => {
    if (adminThrows) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
    return db.client;
  },
}));

const { clientIp, ipBucket, isSameSiteRequest, isSiteUrl, throttleHit } = await import("@/lib/server/request-guard");

const req = (headers: Record<string, string>) => new Request("https://www.foundryframe.com/api/x", { headers });

beforeEach(() => {
  db = fakeSupabase();
  adminThrows = false;
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("isSiteUrl", () => {
  it.each([
    ["https://www.foundryframe.com/audit", true],
    ["https://foundryframe.com", true],
    ["http://localhost:3000/", true],
    ["https://foundryframe.com.evil.example/", false],
    ["https://evilfoundryframe.com/", false],
    ["not a url", false],
    [null, false],
  ])("%s -> %s", (value, expected) => {
    expect(isSiteUrl(value)).toBe(expected);
  });
});

describe("isSameSiteRequest", () => {
  it("trusts Origin first, then Referer", () => {
    expect(isSameSiteRequest(req({ origin: "https://www.foundryframe.com" }))).toBe(true);
    expect(isSameSiteRequest(req({ origin: "https://evil.example", referer: "https://www.foundryframe.com/" }))).toBe(false);
    expect(isSameSiteRequest(req({ referer: "https://www.foundryframe.com/contact" }))).toBe(true);
    expect(isSameSiteRequest(req({}))).toBe(false);
  });
});

describe("clientIp and ipBucket", () => {
  it("uses the first forwarded address", () => {
    expect(clientIp(req({ "x-forwarded-for": " 203.0.113.9 , 10.0.0.1" }))).toBe("203.0.113.9");
    expect(clientIp(req({}))).toBe("unknown");
  });

  it("hashes the address into a stable bucket", () => {
    const a = ipBucket("contact", req({ "x-forwarded-for": "203.0.113.9" }));
    expect(a).toMatch(/^contact:ip:[0-9a-f]{32}$/);
    expect(a).toBe(ipBucket("contact", req({ "x-forwarded-for": "203.0.113.9" })));
    expect(a).not.toBe(ipBucket("contact", req({ "x-forwarded-for": "203.0.113.10" })));
  });
});

describe("throttleHit", () => {
  it("calls the throttle function and reports whether the hit is allowed", async () => {
    db.queue({ data: true, error: null });
    expect(await throttleHit("b", 5, 3600)).toBe(true);
    expect(db.rpcCalls[0]).toEqual(["throttle_hit", { p_bucket: "b", p_limit: 5, p_window_seconds: 3600 }]);

    db.queue({ data: false, error: null });
    expect(await throttleHit("b", 5, 3600)).toBe(false);
  });

  it("returns null when the limiter errors or can't be reached", async () => {
    db.queue({ data: null, error: { message: "function throttle_hit does not exist" } });
    expect(await throttleHit("b", 5, 60)).toBeNull();

    adminThrows = true;
    expect(await throttleHit("b", 5, 60)).toBeNull();
  });

  it("treats anything but literal true as not allowed", async () => {
    db.queue({ data: "true", error: null });
    expect(await throttleHit("b", 5, 60)).toBe(false);
  });
});
