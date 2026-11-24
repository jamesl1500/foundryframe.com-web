import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/blog/[slug]/page", () => ({
  generateStaticParams: async () => [{ slug: "why-small-businesses-need-websites" }],
}));
vi.mock("@/lib/cms/public-data", () => ({
  getPublishedCaseStudies: async () => [
    { slug: "acme-rebrand", updated_at: "2026-10-01T00:00:00Z" },
    { slug: "no-date", updated_at: null },
  ],
}));

async function load(siteUrl?: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl ?? "");
  const [{ default: sitemap }, { default: robots }] = await Promise.all([import("@/app/sitemap"), import("@/app/robots")]);
  return { entries: await sitemap(), robots: robots() };
}

describe("sitemap", () => {
  it("lists absolute, unique URLs on the canonical host", async () => {
    const { entries } = await load();
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url).toMatch(/^https:\/\/www\.foundryframe\.com(\/|$)/);
      expect(url.slice("https://".length)).not.toContain("//");
    }
    expect(urls[0]).toBe("https://www.foundryframe.com");
  });

  it("includes landing pages, blog posts and case studies", async () => {
    const urls = (await load()).entries.map((entry) => entry.url);
    expect(urls).toContain("https://www.foundryframe.com/packages/print-shop");
    expect(urls).toContain("https://www.foundryframe.com/blog/why-small-businesses-need-websites");
    expect(urls).toContain("https://www.foundryframe.com/case-studies/acme-rebrand");
    expect(urls.some((url) => url.includes("/locations/"))).toBe(true);
    expect(urls.some((url) => /\/industries\/[^/]+\/[^/]+$/.test(url))).toBe(true);
  });

  it("leaves out private and noindex pages", async () => {
    const urls = (await load()).entries.map((entry) => entry.url);
    for (const fragment of ["/admin", "/api/", "/go/", "/lead-preview", "/audit/"]) {
      expect(urls.filter((url) => url.includes(fragment)), fragment).toEqual([]);
    }
  });

  it("uses real CMS dates for case studies and fixed dates elsewhere", async () => {
    const { entries } = await load();
    const study = entries.find((entry) => entry.url.endsWith("/acme-rebrand"));
    expect(study?.lastModified).toEqual(new Date("2026-10-01T00:00:00Z"));
    const now = Date.now();
    for (const entry of entries) {
      expect(new Date(entry.lastModified as Date).getTime()).toBeLessThanOrEqual(now);
    }
  });

  it("normalizes a configured site URL with a trailing slash", async () => {
    const { entries, robots } = await load("https://preview.foundryframe.com/");
    expect(entries[1].url).toBe("https://preview.foundryframe.com/about");
    expect(robots.sitemap).toBe("https://preview.foundryframe.com/sitemap.xml");
  });
});

describe("robots", () => {
  it("allows the site, blocks admin and API, and points at the sitemap", async () => {
    const { robots } = await load();
    expect(robots.rules).toEqual([{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }]);
    expect(robots.sitemap).toBe("https://www.foundryframe.com/sitemap.xml");
  });
});
