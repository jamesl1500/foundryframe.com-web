/**
 * Package Builder Catalog - Foundry Frame
 * =========================================
 * The single source of truth for what a visitor can pick in the package
 * builder and what it costs. Prices mirror the public package pages
 * (/packages/website, /launch, /maintenance, /marketing) — update both
 * together. The quote API re-prices every submission with priceQuote(),
 * so the browser's total is never trusted.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export type FoundationGroup = "website" | "bundle" | "none";

export type FoundationOption = {
  id: string;
  group: FoundationGroup;
  name: string;
  /** One-time starting price in USD; null means scoped on a discovery call. */
  price: number | null;
  summary: string;
  timeline: string;
  /** Months of maintenance a launch bundle already includes. */
  includedMaintenanceMonths?: number;
  includesEcommerce?: boolean;
  href?: string;
};

export type MonthlyOption = {
  id: string;
  name: string;
  price: number;
  summary: string;
};

export type AddonOption = {
  id: string;
  name: string;
  price: number;
  billing: "one_time" | "monthly";
  /** Per-unit add-ons (extra pages) take a quantity; the rest are on/off. */
  perUnit?: boolean;
  maxQuantity?: number;
  /** True when the listed price is a floor ("$2,500+", "From $250/mo"). */
  isFloor?: boolean;
  summary: string;
};

export const FOUNDATIONS: FoundationOption[] = [
  {
    id: "spark",
    group: "website",
    name: "The Spark",
    price: 1500,
    summary: "Up to 5 custom pages, mobile-first, SEO foundations, contact form.",
    timeline: "About 6 weeks",
    href: "/packages/website",
  },
  {
    id: "blueprint",
    group: "website",
    name: "The Blueprint",
    price: 3500,
    summary: "Up to 10 pages, custom design system, CMS, blog, GA4 conversion tracking.",
    timeline: "6 to 10 weeks",
    href: "/packages/website",
  },
  {
    id: "architect",
    group: "website",
    name: "The Architect",
    price: 7000,
    summary: "Up to 20 pages, e-commerce, CRM and email integrations, technical SEO audit.",
    timeline: "8 to 12 weeks",
    includesEcommerce: true,
    href: "/packages/website",
  },
  {
    id: "monument",
    group: "website",
    name: "The Monument",
    price: null,
    summary: "Enterprise build with no page limits, custom integrations, WCAG 2.1 AA.",
    timeline: "Scoped on your discovery call",
    includesEcommerce: true,
    href: "/packages/website",
  },
  {
    id: "ignite",
    group: "bundle",
    name: "Ignite Launch Bundle",
    price: 2500,
    summary: "Spark website, logo design, social profile setup, domain and hosting.",
    timeline: "6 to 8 weeks",
    includedMaintenanceMonths: 1,
    href: "/packages/launch",
  },
  {
    id: "velocity",
    group: "bundle",
    name: "Velocity Launch Bundle",
    price: 6500,
    summary: "Blueprint website, full brand identity kit, SEO strategy, competitor analysis.",
    timeline: "8 to 12 weeks",
    includedMaintenanceMonths: 3,
    href: "/packages/launch",
  },
  {
    id: "ascend",
    group: "bundle",
    name: "Ascend Launch Bundle",
    price: 14000,
    summary: "Architect website, brand identity, ad funnel, 3 months of social management.",
    timeline: "10 to 14 weeks",
    includedMaintenanceMonths: 6,
    includesEcommerce: true,
    href: "/packages/launch",
  },
  {
    id: "apex",
    group: "bundle",
    name: "Apex Launch Bundle",
    price: 28000,
    summary: "Monument website, custom app feature, brand strategy, SEO and ads management.",
    timeline: "12 to 16 weeks",
    includedMaintenanceMonths: 12,
    includesEcommerce: true,
    href: "/packages/launch",
  },
  {
    id: "none",
    group: "none",
    name: "No new website",
    price: 0,
    summary: "I already have a site and only want care, marketing, or add-ons.",
    timeline: "Starts within a week of kickoff",
  },
];

export const MAINTENANCE_PLANS: MonthlyOption[] = [
  { id: "steady", name: "Steady", price: 99, summary: "Updates, security, uptime monitoring, monthly backups." },
  { id: "active", name: "Active", price: 249, summary: "Weekly backups, 1 dev hour and 2 content updates a month." },
  { id: "elite", name: "Elite", price: 499, summary: "Daily backups, 3 dev hours, 6 content updates, 4-hour SLA." },
];

export const MARKETING_PLANS: MonthlyOption[] = [
  { id: "presence", name: "Presence", price: 500, summary: "Local SEO, Google Business Profile, 2 social platforms." },
  { id: "momentum", name: "Momentum", price: 1200, summary: "Ongoing SEO, 2 blog posts, email campaign, 3 social platforms." },
  { id: "dominate", name: "Dominate", price: 2500, summary: "Full-funnel SEO, Google and Meta ads, weekly email, 4 platforms." },
];

export const ADDONS: AddonOption[] = [
  {
    id: "extra_pages",
    name: "Additional pages",
    price: 500,
    billing: "one_time",
    perUnit: true,
    maxQuantity: 30,
    summary: "More pages designed to match your site.",
  },
  {
    id: "seo_audit",
    name: "SEO audit and optimization",
    price: 800,
    billing: "one_time",
    summary: "Technical and on-page audit with the fixes applied.",
  },
  {
    id: "ecommerce",
    name: "E-commerce setup",
    price: 2500,
    billing: "one_time",
    isFloor: true,
    summary: "Custom storefront, checkout, payments, and inventory.",
  },
  {
    id: "social_media",
    name: "Social media management",
    price: 250,
    billing: "monthly",
    isFloor: true,
    summary: "Platform-native posts scheduled on your existing accounts.",
  },
];

export const MEETING_WINDOWS = ["Weekday evening (6pm to 9pm)", "Saturday morning (10am to 1pm)", "Saturday afternoon (1pm to 4pm)"] as const;

export type PackageSelection = {
  foundationId: string;
  maintenanceId: string | null;
  marketingId: string | null;
  addons: Record<string, number>;
};

export type QuoteLine = {
  label: string;
  detail: string;
  amount: number | null;
  billing: "one_time" | "monthly";
  isFloor: boolean;
};

export type PricedQuote = {
  lines: QuoteLine[];
  oneTimeTotal: number;
  monthlyTotal: number;
  /** True when some item is scoped on the call, so the total is a partial. */
  hasCustomItems: boolean;
  /** True when some item is a floor price, so the real number may be higher. */
  hasFloorPrices: boolean;
  timeline: string;
  includedMaintenanceMonths: number;
  notes: string[];
};

export function findFoundation(id: string) {
  return FOUNDATIONS.find((option) => option.id === id) ?? null;
}

/** Why an add-on can't be picked with the current selection, or null if it can. */
export function addonUnavailableReason(addonId: string, selection: Pick<PackageSelection, "foundationId" | "marketingId">) {
  const foundation = findFoundation(selection.foundationId);
  if (addonId === "ecommerce" && foundation?.includesEcommerce) {
    return `Included with ${foundation.name}`;
  }
  if (addonId === "extra_pages" && foundation?.id === "none") {
    return "Needs a website package";
  }
  if (addonId === "social_media" && selection.marketingId) {
    return "Included in your marketing plan";
  }
  return null;
}

/** Prices a selection. Unknown ids and unavailable add-ons are dropped. */
export function priceQuote(selection: PackageSelection): PricedQuote {
  const lines: QuoteLine[] = [];
  const notes: string[] = [];
  const foundation = findFoundation(selection.foundationId) ?? findFoundation("none")!;

  if (foundation.id !== "none") {
    lines.push({
      label: foundation.name,
      detail: foundation.summary,
      amount: foundation.price,
      billing: "one_time",
      isFloor: foundation.price !== null,
    });
  }

  for (const addon of ADDONS) {
    const requested = Math.floor(Number(selection.addons[addon.id] ?? 0));
    if (!Number.isFinite(requested) || requested <= 0) continue;
    if (addonUnavailableReason(addon.id, selection)) continue;

    const quantity = addon.perUnit ? Math.min(requested, addon.maxQuantity ?? requested) : 1;
    lines.push({
      label: addon.perUnit ? `${addon.name} × ${quantity}` : addon.name,
      detail: addon.summary,
      amount: addon.price * quantity,
      billing: addon.billing,
      isFloor: Boolean(addon.isFloor),
    });
  }

  const maintenance = MAINTENANCE_PLANS.find((plan) => plan.id === selection.maintenanceId);
  if (maintenance) {
    lines.push({
      label: `${maintenance.name} maintenance`,
      detail: maintenance.summary,
      amount: maintenance.price,
      billing: "monthly",
      isFloor: true,
    });
  }

  const marketing = MARKETING_PLANS.find((plan) => plan.id === selection.marketingId);
  if (marketing) {
    lines.push({
      label: `${marketing.name} marketing`,
      detail: marketing.summary,
      amount: marketing.price,
      billing: "monthly",
      isFloor: true,
    });
  }

  const includedMaintenanceMonths = foundation.includedMaintenanceMonths ?? 0;
  if (includedMaintenanceMonths > 0) {
    notes.push(
      maintenance
        ? `${foundation.name} already includes ${includedMaintenanceMonths} month${includedMaintenanceMonths === 1 ? "" : "s"} of maintenance, so ${maintenance.name} billing starts after that.`
        : `${foundation.name} includes ${includedMaintenanceMonths} month${includedMaintenanceMonths === 1 ? "" : "s"} of maintenance.`
    );
  }
  if (marketing?.id === "dominate" || foundation.id === "ascend" || foundation.id === "apex") {
    notes.push("Ad spend on Google and Meta is billed separately from management fees.");
  }

  const sum = (billing: QuoteLine["billing"]) =>
    lines.filter((line) => line.billing === billing).reduce((total, line) => total + (line.amount ?? 0), 0);

  return {
    lines,
    oneTimeTotal: sum("one_time"),
    monthlyTotal: sum("monthly"),
    hasCustomItems: lines.some((line) => line.amount === null),
    hasFloorPrices: lines.some((line) => line.isFloor),
    timeline: foundation.timeline,
    includedMaintenanceMonths,
    notes,
  };
}

/** Coerces untrusted JSON into a selection limited to known ids. */
export function parseSelection(input: unknown): PackageSelection | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;

  const foundationId = typeof raw.foundationId === "string" ? raw.foundationId : "";
  if (!findFoundation(foundationId)) return null;

  const maintenanceId =
    typeof raw.maintenanceId === "string" && MAINTENANCE_PLANS.some((plan) => plan.id === raw.maintenanceId)
      ? raw.maintenanceId
      : null;
  const marketingId =
    typeof raw.marketingId === "string" && MARKETING_PLANS.some((plan) => plan.id === raw.marketingId)
      ? raw.marketingId
      : null;

  const addons: Record<string, number> = {};
  const rawAddons = raw.addons && typeof raw.addons === "object" ? (raw.addons as Record<string, unknown>) : {};
  for (const addon of ADDONS) {
    const quantity = Math.floor(Number(rawAddons[addon.id] ?? 0));
    if (Number.isFinite(quantity) && quantity > 0) {
      addons[addon.id] = Math.min(quantity, addon.maxQuantity ?? 1);
    }
  }

  return { foundationId, maintenanceId, marketingId, addons };
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

/** "$3,500+" for floor prices, "Custom" for scoped items. */
export function formatLineAmount(line: QuoteLine) {
  if (line.amount === null) return "Custom";
  const base = formatUsd(line.amount);
  const suffix = line.billing === "monthly" ? "/mo" : "";
  return `${base}${line.isFloor ? "+" : ""}${suffix}`;
}
