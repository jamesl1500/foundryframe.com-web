import type {
  PageSpeedOpportunity,
  PageSpeedResult,
  PageSpeedStrategy,
  PageSpeedSummary,
} from "@/lib/leads/types";

const PAGESPEED_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

/* Lighthouse runs on Google's side and regularly takes 20-60 seconds. */
const REQUEST_TIMEOUT_MS = 120_000;

type LighthouseAudit = {
  title?: string;
  score?: number | null;
  displayValue?: string;
  numericValue?: number;
  metricSavings?: Record<string, number>;
  details?: { type?: string; overallSavingsMs?: number };
};

type PageSpeedApiResponse = {
  error?: { message?: string };
  loadingExperience?: {
    overall_category?: string;
    metrics?: Record<string, { percentile?: number; category?: string }>;
  };
  lighthouseResult?: {
    finalUrl?: string;
    categories?: Record<string, { score?: number | null }>;
    audits?: Record<string, LighthouseAudit>;
  };
};

function getApiKey() {
  /* The Places key works too if the PageSpeed Insights API is enabled on
     the same Google Cloud project and the key isn't restricted to Places. */
  return process.env.GOOGLE_PAGESPEED_API_KEY || process.env.GOOGLE_PLACES_API_KEY || "";
}

function toScore(value: number | null | undefined): number | null {
  return typeof value === "number" ? Math.round(value * 100) : null;
}

function auditValue(audits: Record<string, LighthouseAudit>, id: string): number | null {
  const value = audits[id]?.numericValue;
  return typeof value === "number" ? value : null;
}

function roundMs(value: number | null): number | null {
  return value === null ? null : Math.round(value);
}

function extractOpportunities(audits: Record<string, LighthouseAudit>): PageSpeedOpportunity[] {
  return Object.values(audits)
    .map((audit) => {
      const savingsMs = Math.max(
        audit.details?.overallSavingsMs ?? 0,
        audit.metricSavings?.LCP ?? 0,
        audit.metricSavings?.FCP ?? 0,
        audit.metricSavings?.TBT ?? 0,
      );

      return {
        title: audit.title ?? "",
        displayValue: audit.displayValue ?? "",
        savingsMs: Math.round(savingsMs),
        score: audit.score,
      };
    })
    .filter((audit) => audit.title && audit.savingsMs > 0 && typeof audit.score === "number" && audit.score < 0.9)
    .sort((a, b) => b.savingsMs - a.savingsMs)
    .slice(0, 6)
    .map(({ title, displayValue, savingsMs }) => ({ title, displayValue, savingsMs }));
}

async function runPageSpeed(url: string, strategy: PageSpeedStrategy): Promise<PageSpeedResult> {
  const params = new URLSearchParams({ url, strategy });
  for (const category of CATEGORIES) {
    params.append("category", category);
  }

  const apiKey = getApiKey();
  if (apiKey) {
    params.set("key", apiKey);
  }

  const response = await fetch(`${PAGESPEED_ENDPOINT}?${params.toString()}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });
  const data = (await response.json()) as PageSpeedApiResponse;

  if (!response.ok || !data.lighthouseResult) {
    throw new Error(data.error?.message || `PageSpeed request failed with status ${response.status}.`);
  }

  const categories = data.lighthouseResult.categories ?? {};
  const audits = data.lighthouseResult.audits ?? {};
  const field = data.loadingExperience?.metrics;

  return {
    strategy,
    performanceScore: toScore(categories.performance?.score),
    accessibilityScore: toScore(categories.accessibility?.score),
    bestPracticesScore: toScore(categories["best-practices"]?.score),
    seoScore: toScore(categories.seo?.score),
    lab: {
      firstContentfulPaintMs: roundMs(auditValue(audits, "first-contentful-paint")),
      largestContentfulPaintMs: roundMs(auditValue(audits, "largest-contentful-paint")),
      totalBlockingTimeMs: roundMs(auditValue(audits, "total-blocking-time")),
      speedIndexMs: roundMs(auditValue(audits, "speed-index")),
      cumulativeLayoutShift: auditValue(audits, "cumulative-layout-shift"),
    },
    field: field
      ? {
          overallCategory: data.loadingExperience?.overall_category ?? null,
          largestContentfulPaintMs: field.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
          interactionToNextPaintMs: field.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
          /* CrUX reports CLS multiplied by 100. */
          cumulativeLayoutShift:
            typeof field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile === "number"
              ? field.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100
              : null,
        }
      : null,
    opportunities: extractOpportunities(audits),
  };
}

/* Never throws: a PageSpeed failure (quota, timeout, unreachable site)
   shouldn't block the rest of the analysis, so errors are recorded instead. */
export async function runPageSpeedAudit(url: string): Promise<PageSpeedSummary> {
  const [mobile, desktop] = await Promise.allSettled([
    runPageSpeed(url, "mobile"),
    runPageSpeed(url, "desktop"),
  ]);

  const errors = [mobile, desktop]
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => (result.reason instanceof Error ? result.reason.message : "PageSpeed request failed."));

  return {
    fetchedAt: new Date().toISOString(),
    mobile: mobile.status === "fulfilled" ? mobile.value : null,
    desktop: desktop.status === "fulfilled" ? desktop.value : null,
    error: errors.length > 0 ? Array.from(new Set(errors)).join(" ") : null,
  };
}
