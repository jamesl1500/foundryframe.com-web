import { describe, expect, it, vi } from "vitest";
import { serializeLeadSource } from "@/lib/lead-source";
import { insertWithSource, leadSourceEmailHtml, leadSourceFromRequest } from "@/lib/server/lead-source";

const withCookie = (cookie: string) => new Request("https://www.foundryframe.com/api/contact", { headers: { cookie } });

describe("leadSourceFromRequest", () => {
  it("reads the lead source cookie among others", () => {
    const value = serializeLeadSource({ utm_source: "google", landing_page: "/audit" });
    expect(leadSourceFromRequest(withCookie(`_ga=GA1.1; ff_src=${value}; other=1`))).toEqual({
      utm_source: "google",
      landing_page: "/audit",
    });
  });

  it("returns null without the cookie or with a bad one", () => {
    expect(leadSourceFromRequest(new Request("https://x.example/"))).toBeNull();
    expect(leadSourceFromRequest(withCookie("_ga=1"))).toBeNull();
    expect(leadSourceFromRequest(withCookie("ff_src=%%%"))).toBeNull();
  });
});

describe("leadSourceEmailHtml", () => {
  it("escapes values", () => {
    const html = leadSourceEmailHtml({ utm_source: "<b>x</b>", referrer: 'a"b' });
    expect(html).not.toContain("<b>x</b>");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).toContain("a&quot;b");
  });

  it("explains an unknown source with no table", () => {
    const html = leadSourceEmailHtml(null);
    expect(html).toContain("Unknown");
    expect(html).not.toContain("<table");
  });
});

describe("insertWithSource", () => {
  it("inserts once when it works", async () => {
    const insert = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null });
    await insertWithSource(insert, { name: "a", source: { utm_source: "x" } });
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("retries without the source column when the migration hasn't run", async () => {
    const insert = vi
      .fn()
      .mockResolvedValueOnce({ data: null, error: { message: "Could not find the 'source' column of 'contacts'" } })
      .mockResolvedValueOnce({ data: { id: 1 }, error: null });
    const result = await insertWithSource(insert, { name: "a", source: { utm_source: "x" } });
    expect(result.error).toBeNull();
    expect(insert.mock.calls[1][0]).toEqual({ name: "a" });
  });

  it("doesn't retry other errors", async () => {
    const insert = vi.fn().mockResolvedValue({ data: null, error: { message: "duplicate key" } });
    expect((await insertWithSource(insert, { source: null })).error?.message).toBe("duplicate key");
    expect(insert).toHaveBeenCalledTimes(1);
  });
});
