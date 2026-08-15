/**
 * Audit Result Presentation Helpers - Foundry Frame
 * ====================================================
 * Normalizes the loosely-typed (additionalProperties: true) fields the
 * Python audit API returns into safe, renderable shapes.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export type CategoryRecommendation = {
  label: string;
  href: string;
  blurb: string;
};

const CATEGORY_RECOMMENDATIONS: Record<string, CategoryRecommendation> = {
  seo: { label: "Strategy & SEO", href: "/services/strategy", blurb: "Fix technical SEO and content structure so search engines (and customers) can find you." },
  content: { label: "Strategy & SEO", href: "/services/strategy", blurb: "Sharpen messaging and content to convert more visitors into leads." },
  performance: { label: "Web Design", href: "/services/web-design", blurb: "A rebuilt, performance-first site loads faster and ranks better." },
  design: { label: "Web Design", href: "/services/web-design", blurb: "Modernize the design so visitors trust you at first glance." },
  ux: { label: "Web Design", href: "/services/web-design", blurb: "Improve navigation and layout to keep visitors engaged." },
  usability: { label: "Web Design", href: "/services/web-design", blurb: "Improve navigation and layout to keep visitors engaged." },
  accessibility: { label: "Web Design", href: "/services/web-design", blurb: "Make your site usable for every visitor, and avoid compliance risk." },
  mobile: { label: "Web Design", href: "/services/web-design", blurb: "A responsive rebuild fixes mobile friction that costs you visitors." },
  security: { label: "Maintenance Plans", href: "/packages/maintenance", blurb: "Ongoing monitoring and hardening to keep your site safe and online." },
  conversion: { label: "Advertising", href: "/services/advertising", blurb: "Targeted campaigns to turn your traffic into paying customers." },
  branding: { label: "Branding", href: "/services/branding", blurb: "A stronger visual identity builds trust and recognition." },
  social: { label: "Social Media", href: "/services/social-media", blurb: "Consistent social presence to drive traffic back to your site." },
};

const DEFAULT_RECOMMENDATION: CategoryRecommendation = {
  label: "All Packages",
  href: "/packages",
  blurb: "See bundled packages tailored to fixing what matters most.",
};

export function getCategoryRecommendation(categoryKey: string): CategoryRecommendation {
  const normalized = categoryKey.trim().toLowerCase();
  return CATEGORY_RECOMMENDATIONS[normalized] ?? DEFAULT_RECOMMENDATION;
}

export function toTitleCase(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function scoreTone(score: number): { text: string; bar: string } {
  if (score >= 80) return { text: "text-green-400", bar: "bg-green-400" };
  if (score >= 50) return { text: "text-accent", bar: "bg-accent" };
  return { text: "text-red-400", bar: "bg-red-400" };
}

/** Coerce a numeric-ish category score value into a 0-100 number, or null if not numeric. */
export function toScore(value: unknown): number | null {
  const num = typeof value === "string" ? Number(value) : value;
  if (typeof num !== "number" || !Number.isFinite(num)) return null;
  return Math.max(0, Math.min(100, Math.round(num)));
}

/** Lighthouse category scores are typically 0-1 fractions; normalize to a 0-100 score. */
export function toLighthouseScore(value: unknown): number | null {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>).score : value;
  const num = typeof raw === "string" ? Number(raw) : raw;
  if (typeof num !== "number" || !Number.isFinite(num)) return null;
  const scaled = num <= 1 ? num * 100 : num;
  return Math.max(0, Math.min(100, Math.round(scaled)));
}

/** Renders a lighthouse metric value ({ display_value, value, unit } or a raw number/string) as a short label. */
export function formatMetricValue(value: unknown): string {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.display_value === "string") return record.display_value;
    if (typeof record.displayValue === "string") return record.displayValue;

    const numericValue = record.value ?? record.numericValue;
    if (typeof numericValue === "number") {
      const unit = typeof record.unit === "string" ? record.unit : typeof record.numericUnit === "string" ? record.numericUnit : "";
      return unit === "millisecond" ? `${Math.round(numericValue)} ms` : `${numericValue}${unit}`;
    }
  }

  if (typeof value === "number") return String(Math.round(value));
  if (typeof value === "string") return value;
  return "—";
}

/**
 * Flattens loosely-typed API output (arrays of strings, arrays of objects,
 * or nested objects of arrays) into a simple bullet list of strings.
 */
export function extractList(value: unknown, depth = 0): string[] {
  if (depth > 3 || value === null || value === undefined) return [];

  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractList(item, depth + 1));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    const titleLike = record.title ?? record.name ?? record.issue ?? record.finding;
    const detailLike =
      record.description ?? record.detail ?? record.recommendation ?? record.action ?? record.displayValue;

    if (typeof titleLike === "string") {
      return [detailLike && typeof detailLike === "string" ? `${titleLike} — ${detailLike}` : titleLike];
    }

    return Object.values(record).flatMap((item) => extractList(item, depth + 1));
  }

  return [String(value)];
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
