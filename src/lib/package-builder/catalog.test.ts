import { describe, expect, it } from "vitest";
import {
  ADDONS,
  FOUNDATIONS,
  MAINTENANCE_PLANS,
  MARKETING_PLANS,
  addonUnavailableReason,
  formatLineAmount,
  formatUsd,
  parseSelection,
  priceQuote,
  type PackageSelection,
} from "@/lib/package-builder/catalog";
import { PRINT_SHOP } from "@/lib/packages/print-shop";

const select = (overrides: Partial<PackageSelection> = {}): PackageSelection => ({
  foundationId: "spark",
  maintenanceId: null,
  marketingId: null,
  addons: {},
  ...overrides,
});

describe("catalog data", () => {
  it("has unique ids in every list", () => {
    for (const list of [FOUNDATIONS, MAINTENANCE_PLANS, MARKETING_PLANS, ADDONS]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("prices Print Shop from its own module", () => {
    expect(ADDONS.find((addon) => addon.id === "print_shop")?.price).toBe(PRINT_SHOP.price);
  });
});

describe("priceQuote", () => {
  it("prices a foundation alone as a floor price", () => {
    const quote = priceQuote(select());
    expect(quote.lines).toHaveLength(1);
    expect(quote.oneTimeTotal).toBe(1500);
    expect(quote.monthlyTotal).toBe(0);
    expect(quote.hasFloorPrices).toBe(true);
    expect(quote.hasCustomItems).toBe(false);
  });

  it("totals one-time and monthly items separately", () => {
    const quote = priceQuote(
      select({
        foundationId: "blueprint",
        maintenanceId: "active",
        marketingId: "momentum",
        addons: { print_shop: 1, extra_pages: 3, seo_audit: 1 },
      })
    );
    expect(quote.oneTimeTotal).toBe(2500 + 150 + 1500 + 800);
    expect(quote.monthlyTotal).toBe(249 + 1200);
    expect(quote.lines.map((line) => line.label)).toContain("Additional pages × 3");
  });

  it("caps per-unit add-ons at their maximum", () => {
    const quote = priceQuote(select({ addons: { extra_pages: 500 } }));
    expect(quote.lines.find((line) => line.label.startsWith("Additional pages"))?.amount).toBe(30 * 500);
  });

  it("ignores zero, negative, fractional-below-one and non-numeric quantities", () => {
    const quote = priceQuote(select({ addons: { seo_audit: 0, print_shop: -1, extra_pages: 0.5, ecommerce: NaN } }));
    expect(quote.lines).toHaveLength(1);
  });

  it("marks custom-scoped foundations", () => {
    const quote = priceQuote(select({ foundationId: "monument" }));
    expect(quote.hasCustomItems).toBe(true);
    expect(quote.oneTimeTotal).toBe(0);
    expect(formatLineAmount(quote.lines[0])).toBe("Custom");
    expect(priceQuote(select({ foundationId: "apex" })).hasCustomItems).toBe(true);
  });

  it("drops add-ons that the foundation already includes", () => {
    const quote = priceQuote(select({ foundationId: "architect", addons: { ecommerce: 1 } }));
    expect(quote.lines.map((line) => line.label)).not.toContain("E-commerce setup");
  });

  it("drops social media when a marketing plan covers it", () => {
    const quote = priceQuote(select({ marketingId: "presence", addons: { social_media: 1 } }));
    expect(quote.lines.map((line) => line.label)).not.toContain("Social media management");
  });

  it("notes included maintenance months on launch bundles", () => {
    expect(priceQuote(select({ foundationId: "ignite" })).notes[0]).toMatch(/^Ignite.* includes 1 month of maintenance.$/);
    const withPlan = priceQuote(select({ foundationId: "velocity", maintenanceId: "steady" }));
    expect(withPlan.includedMaintenanceMonths).toBe(3);
    expect(withPlan.notes[0]).toMatch(/3 months of maintenance, so Steady billing starts after that/);
  });

  it("notes separate ad spend for ad-heavy plans", () => {
    expect(priceQuote(select({ marketingId: "dominate" })).notes.join(" ")).toMatch(/Ad spend/);
    expect(priceQuote(select({ foundationId: "apex" })).notes.join(" ")).toMatch(/Ad spend/);
  });

  it("falls back to no foundation for an unknown id", () => {
    const quote = priceQuote(select({ foundationId: "bogus", maintenanceId: "steady" }));
    expect(quote.lines.map((line) => line.label)).toEqual(["Steady maintenance"]);
  });
});

describe("addonUnavailableReason", () => {
  it("needs some package for Print Shop", () => {
    expect(addonUnavailableReason("print_shop", { foundationId: "none", marketingId: null, maintenanceId: null })).toBe(
      "Add it to any package"
    );
    expect(addonUnavailableReason("print_shop", { foundationId: "none", marketingId: null, maintenanceId: "steady" })).toBeNull();
    expect(addonUnavailableReason("print_shop", { foundationId: "spark", marketingId: null })).toBeNull();
  });

  it("includes Print Shop with every launch bundle, and only there", () => {
    for (const foundation of FOUNDATIONS) {
      const reason = addonUnavailableReason("print_shop", { foundationId: foundation.id, marketingId: null });
      if (foundation.group === "bundle") expect(reason).toBe(`Included with ${foundation.name}`);
      else if (foundation.group === "website") expect(reason).toBeNull();
    }
    const quote = priceQuote(select({ foundationId: "velocity", addons: { print_shop: 1 } }));
    expect(quote.oneTimeTotal).toBe(3500);
    expect(quote.lines.map((line) => line.label)).not.toContain("Print Shop");
  });

  it("needs a website for extra pages", () => {
    expect(addonUnavailableReason("extra_pages", { foundationId: "none", marketingId: null })).toBe("Needs a website package");
  });

  it("names the package that includes e-commerce", () => {
    expect(addonUnavailableReason("ecommerce", { foundationId: "ascend", marketingId: null })).toMatch(/^Included with Ascend/);
  });
});

describe("parseSelection", () => {
  it("rejects input without a known foundation", () => {
    expect(parseSelection(null)).toBeNull();
    expect(parseSelection("spark")).toBeNull();
    expect(parseSelection({ foundationId: "bogus" })).toBeNull();
  });

  it("keeps only known plans and add-ons, with bounded quantities", () => {
    expect(
      parseSelection({
        foundationId: "spark",
        maintenanceId: "steady",
        marketingId: "made-up",
        addons: { extra_pages: "4", seo_audit: 7, hacked: 99, print_shop: -2 },
      })
    ).toEqual({ foundationId: "spark", maintenanceId: "steady", marketingId: null, addons: { extra_pages: 4, seo_audit: 1 } });
  });

  it("isn't fooled by prototype keys", () => {
    const parsed = parseSelection(JSON.parse('{"foundationId":"spark","addons":{"__proto__":{"seo_audit":1}}}'));
    expect(parsed?.addons).toEqual({});
  });
});

describe("formatting", () => {
  it("formats whole dollars", () => {
    expect(formatUsd(3500)).toBe("$3,500");
    expect(formatUsd(0)).toBe("$0");
  });

  it("marks floors and monthly billing", () => {
    expect(formatLineAmount({ label: "", detail: "", amount: 249, billing: "monthly", isFloor: true })).toBe("$249+/mo");
    expect(formatLineAmount({ label: "", detail: "", amount: 800, billing: "one_time", isFloor: false })).toBe("$800");
  });
});
