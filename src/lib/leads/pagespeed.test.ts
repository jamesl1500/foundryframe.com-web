import { beforeEach, describe, expect, it, vi } from "vitest";
import { runPageSpeed, runPageSpeedAudit } from "@/lib/leads/pagespeed";

const fetchMock = vi.fn();

const LIGHTHOUSE = {
  lighthouseResult: {
    finalUrl: "https://acme.example/",
    categories: {
      performance: { score: 0.42 },
      accessibility: { score: 0.9 },
      "best-practices": { score: 1 },
      seo: { score: null },
    },
    audits: {
      "first-contentful-paint": { numericValue: 1234.4 },
      "largest-contentful-paint": { numericValue: 3456.6 },
      "total-blocking-time": { numericValue: 310 },
      "speed-index": { numericValue: 2100 },
      "cumulative-layout-shift": { numericValue: 0.08 },
      "unused-javascript": { title: "Reduce unused JavaScript", score: 0.3, displayValue: "Save 120 KiB", details: { overallSavingsMs: 900 } },
      "render-blocking": { title: "Eliminate render-blocking resources", score: 0.5, metricSavings: { LCP: 1500, FCP: 200 } },
      "already-good": { title: "Uses HTTP/2", score: 1, details: { overallSavingsMs: 5000 } },
      "no-savings": { title: "Minify CSS", score: 0.2 },
    },
  },
  loadingExperience: {
    overall_category: "SLOW",
    metrics: {
      LARGEST_CONTENTFUL_PAINT_MS: { percentile: 4100 },
      INTERACTION_TO_NEXT_PAINT: { percentile: 250 },
      CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 12 },
    },
  },
};

const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

beforeEach(() => {
  fetchMock.mockReset().mockImplementation(() => ok(LIGHTHOUSE));
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("GOOGLE_PAGESPEED_API_KEY", "psi-key");
});

describe("runPageSpeed", () => {
  it("asks for all four categories with the API key and a timeout", async () => {
    await runPageSpeed("https://acme.example/", "mobile", 5000);
    const [url, init] = fetchMock.mock.calls[0];
    const params = new URL(url).searchParams;
    expect(params.get("url")).toBe("https://acme.example/");
    expect(params.get("strategy")).toBe("mobile");
    expect(params.getAll("category")).toEqual(["performance", "accessibility", "best-practices", "seo"]);
    expect(params.get("key")).toBe("psi-key");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("falls back to the Places key, then no key", async () => {
    vi.stubEnv("GOOGLE_PAGESPEED_API_KEY", "");
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "places-key");
    await runPageSpeed("https://a.example/", "desktop");
    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get("key")).toBe("places-key");

    vi.stubEnv("GOOGLE_PLACES_API_KEY", "");
    await runPageSpeed("https://a.example/", "desktop");
    expect(new URL(fetchMock.mock.calls[1][0]).searchParams.has("key")).toBe(false);
  });

  it("maps scores, lab metrics and field data", async () => {
    const result = await runPageSpeed("https://acme.example/", "mobile");
    expect(result).toMatchObject({
      strategy: "mobile",
      performanceScore: 42,
      accessibilityScore: 90,
      bestPracticesScore: 100,
      seoScore: null,
      lab: {
        firstContentfulPaintMs: 1234,
        largestContentfulPaintMs: 3457,
        totalBlockingTimeMs: 310,
        speedIndexMs: 2100,
        cumulativeLayoutShift: 0.08,
      },
      field: { overallCategory: "SLOW", largestContentfulPaintMs: 4100, interactionToNextPaintMs: 250, cumulativeLayoutShift: 0.12 },
    });
  });

  it("lists failing opportunities with real savings, biggest first", async () => {
    const { opportunities } = await runPageSpeed("https://acme.example/", "mobile");
    expect(opportunities).toEqual([
      { title: "Eliminate render-blocking resources", displayValue: "", savingsMs: 1500 },
      { title: "Reduce unused JavaScript", displayValue: "Save 120 KiB", savingsMs: 900 },
    ]);
  });

  it("returns null field data for low-traffic sites", async () => {
    fetchMock.mockImplementation(() => ok({ lighthouseResult: { categories: {}, audits: {} } }));
    const result = await runPageSpeed("https://a.example/", "mobile");
    expect(result.field).toBeNull();
    expect(result.performanceScore).toBeNull();
    expect(result.opportunities).toEqual([]);
  });

  it("throws the API's error message", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ error: { message: "Quota exceeded" } }), { status: 429 }))
    );
    await expect(runPageSpeed("https://a.example/", "mobile")).rejects.toThrow("Quota exceeded");
  });

  it("throws when there's no Lighthouse result", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(new Response("{}", { status: 500 })));
    await expect(runPageSpeed("https://a.example/", "mobile")).rejects.toThrow(/status 500/);
  });
});

describe("runPageSpeedAudit", () => {
  it("runs mobile and desktop and records failures instead of throwing", async () => {
    fetchMock
      .mockImplementationOnce(() => ok(LIGHTHOUSE))
      .mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ error: { message: "Timed out" } }), { status: 500 })));
    const summary = await runPageSpeedAudit("https://acme.example/");
    expect(summary.mobile?.performanceScore).toBe(42);
    expect(summary.desktop).toBeNull();
    expect(summary.error).toBe("Timed out");
  });

  it("de-duplicates identical errors", async () => {
    fetchMock.mockImplementation(() => Promise.reject(new Error("network down")));
    expect((await runPageSpeedAudit("https://a.example/")).error).toBe("network down");
  });
});
