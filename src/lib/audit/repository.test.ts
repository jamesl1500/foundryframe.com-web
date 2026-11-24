import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "@/test/supabase-fake";

let db = fakeSupabase();
vi.mock("@/lib/supabase/admin", () => ({ getSupabaseAdminClient: () => db.client }));

const repo = await import("@/lib/audit/repository");

const ID = "0b9f7c1e-3c55-4b8e-9f6a-2d1c3b4a5e6f";
const NOW = new Date("2026-11-24T12:00:00Z");

function row(overrides: Record<string, unknown> = {}) {
  return {
    id: ID,
    url: "https://acme.example/",
    status: "completed",
    overall_score: 70,
    updated_at: NOW.toISOString(),
    error_message: null,
    ...overrides,
  };
}

beforeEach(() => {
  db = fakeSupabase();
  vi.useFakeTimers({ now: NOW, toFake: ["Date"] });
  return () => vi.useRealTimers();
});

describe("isAuditId", () => {
  it("accepts UUIDs in either case and rejects anything else", () => {
    expect(repo.isAuditId(ID)).toBe(true);
    expect(repo.isAuditId(ID.toUpperCase())).toBe(true);
    expect(repo.isAuditId("not-a-uuid")).toBe(false);
    expect(repo.isAuditId(`${ID}x`)).toBe(false);
    expect(repo.isAuditId("' or 1=1 --")).toBe(false);
  });
});

describe("insertSiteAudit", () => {
  it("inserts the request and selects only public columns", async () => {
    db.queue({ data: row({ status: "pending" }), error: null });
    const audit = await repo.insertSiteAudit({
      url: "https://acme.example/",
      email: "a@b.co",
      name: null,
      company: null,
      phone: "555",
      source: null,
    });
    expect(audit.status).toBe("pending");
    expect(db.chains[0].table).toBe("site_audits");
    const [columns] = db.call(0, "select") as [string];
    expect(columns.split(",")).not.toContain("email");
    expect(columns.split(",")).not.toContain("phone");
    expect(columns.split(",")).toContain("overall_score");
  });

  it("throws the database error", async () => {
    db.queue({ data: null, error: { message: "violates check constraint" } });
    await expect(
      repo.insertSiteAudit({ url: "x", email: "y", name: null, company: null, phone: null, source: null })
    ).rejects.toThrow("violates check constraint");
  });
});

describe("getPublicSiteAudit", () => {
  it("returns null for a malformed id without querying", async () => {
    expect(await repo.getPublicSiteAudit("nope")).toBeNull();
    expect(db.chains).toHaveLength(0);
  });

  it("returns null when the audit doesn't exist", async () => {
    db.queue({ data: null, error: null });
    expect(await repo.getPublicSiteAudit(ID)).toBeNull();
  });

  it("returns a finished audit as stored", async () => {
    db.queue({ data: row(), error: null });
    expect(await repo.getPublicSiteAudit(ID)).toMatchObject({ status: "completed", overall_score: 70 });
    expect(db.chains).toHaveLength(1);
  });

  it("returns a recent pending audit as pending", async () => {
    db.queue({ data: row({ status: "running", updated_at: new Date(NOW.getTime() - 60_000).toISOString() }), error: null });
    expect((await repo.getPublicSiteAudit(ID))?.status).toBe("running");
  });

  it("reports an audit stuck for over 7 minutes as failed and records it", async () => {
    const stuck = row({ status: "running", updated_at: new Date(NOW.getTime() - 8 * 60_000).toISOString() });
    db.queue({ data: stuck, error: null }, { data: null, error: null });

    const audit = await repo.getPublicSiteAudit(ID);
    expect(audit).toMatchObject({ status: "failed", error_message: expect.stringMatching(/interrupted/) });

    const [patch] = db.call(1, "update") as [Record<string, unknown>];
    expect(patch.status).toBe("failed");
    // Only overwrite if it's still in the stale state (a late finish wins).
    expect(db.chains[1].calls).toContainEqual(["eq", "status", "running"]);
  });

  it("still answers when recording the stale failure fails", async () => {
    const stuck = row({ status: "pending", updated_at: new Date(NOW.getTime() - 60 * 60_000).toISOString() });
    db.queue({ data: stuck, error: null });
    db.setDefault({ data: null, error: { message: "ignored" } });
    expect((await repo.getPublicSiteAudit(ID))?.status).toBe("failed");
  });

  it("throws read errors", async () => {
    db.queue({ data: null, error: { message: "timeout" } });
    await expect(repo.getPublicSiteAudit(ID)).rejects.toThrow("timeout");
  });
});

describe("claimSiteAudit", () => {
  it("moves a pending row to running and returns it", async () => {
    db.queue({ data: [{ id: ID, url: "u", email: "e", name: null, company: null, status: "running" }], error: null });
    expect((await repo.claimSiteAudit(ID))?.id).toBe(ID);
    const calls = db.chains[0].calls;
    expect(calls).toContainEqual(["eq", "status", "pending"]);
    expect(calls).toContainEqual(["update", { status: "running", started_at: NOW.toISOString() }]);
  });

  it("returns null when nothing was pending (already claimed)", async () => {
    db.queue({ data: [], error: null });
    expect(await repo.claimSiteAudit(ID)).toBeNull();
  });
});

describe("result writes", () => {
  it("completeSiteAudit saves the results and clears any error", async () => {
    db.queue({ error: null });
    await repo.completeSiteAudit(ID, {
      overall_score: 80,
      category_scores: { seo: 80 },
      findings: {},
      ai_summary: "s",
      ai_recommendations: { items: [] },
      lighthouse_scores: null,
      lighthouse_metrics: null,
      lighthouse_opportunities: null,
      lighthouse_error: null,
      final_url: "https://acme.example/",
      scan_snapshot: null,
    });
    const [patch] = db.call(0, "update") as [Record<string, unknown>];
    expect(patch).toMatchObject({ status: "completed", error_message: null, overall_score: 80 });
    expect(patch.completed_at).toBe(NOW.toISOString());
  });

  it("failSiteAudit records the message and only includes a snapshot when given", async () => {
    db.queue({ error: null }, { error: null });
    await repo.failSiteAudit(ID, "blocked");
    await repo.failSiteAudit(ID, "blocked", { facts: {} });
    expect(db.call(0, "update")?.[0]).not.toHaveProperty("scan_snapshot");
    expect(db.call(1, "update")?.[0]).toMatchObject({ status: "failed", error_message: "blocked", scan_snapshot: { facts: {} } });
  });

  it("markSiteAuditEmailed stamps the time", async () => {
    db.queue({ error: null });
    await repo.markSiteAuditEmailed(ID);
    expect(db.call(0, "update")?.[0]).toEqual({ results_emailed_at: NOW.toISOString() });
  });

  it.each([
    ["completeSiteAudit", () => repo.completeSiteAudit(ID, {} as never)],
    ["failSiteAudit", () => repo.failSiteAudit(ID, "x")],
    ["markSiteAuditEmailed", () => repo.markSiteAuditEmailed(ID)],
  ])("%s throws database errors", async (_name, write) => {
    db.queue({ error: { message: "nope" } });
    await expect(write()).rejects.toThrow("nope");
  });
});
