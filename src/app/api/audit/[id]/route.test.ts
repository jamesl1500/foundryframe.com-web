import { beforeEach, describe, expect, it, vi } from "vitest";

const getPublicSiteAudit = vi.fn();
vi.mock("@/lib/audit/repository", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/audit/repository")>()),
  getPublicSiteAudit,
}));
vi.mock("@/lib/supabase/admin", () => ({ getSupabaseAdminClient: () => ({}) }));

const { GET } = await import("@/app/api/audit/[id]/route");

const ID = "0b9f7c1e-3c55-4b8e-9f6a-2d1c3b4a5e6f";
const get = (id: string) => GET(new Request(`https://www.foundryframe.com/api/audit/${id}`), { params: Promise.resolve({ id }) });

beforeEach(() => {
  getPublicSiteAudit.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("GET /api/audit/[id]", () => {
  it("400s on a malformed id without reading", async () => {
    expect((await get("../../etc")).status).toBe(400);
    expect(getPublicSiteAudit).not.toHaveBeenCalled();
  });

  it("404s on an unknown audit", async () => {
    getPublicSiteAudit.mockResolvedValue(null);
    expect((await get(ID)).status).toBe(404);
  });

  it("returns the audit uncached", async () => {
    getPublicSiteAudit.mockResolvedValue({ id: ID, status: "running" });
    const res = await get(ID);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ id: ID, status: "running" });
  });

  it("500s without leaking the error", async () => {
    getPublicSiteAudit.mockRejectedValue(new Error("connection string leaked"));
    const res = await get(ID);
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("connection string");
  });
});
