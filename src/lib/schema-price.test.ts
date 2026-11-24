import { describe, expect, it } from "vitest";
import { parsePriceSpecification } from "@/lib/schema-price";

describe("parsePriceSpecification", () => {
  it.each([
    ["Starting at $1,500", { minPrice: 1500 }],
    ["From $99/mo", { minPrice: 99, unitText: "MONTH" }],
    ["$15,000+", { minPrice: 15000 }],
    ["$150", { minPrice: 150, maxPrice: 150 }],
    ["$1,500 - $3,000", { minPrice: 1500, maxPrice: 3000 }],
    ["$249/mo", { minPrice: 249, maxPrice: 249, unitText: "MONTH" }],
  ])("%j", (label, expected) => {
    expect(parsePriceSpecification(label)).toEqual({ "@type": "PriceSpecification", priceCurrency: "USD", ...expected });
  });

  it("publishes only the currency for labels without a number", () => {
    expect(parsePriceSpecification("Custom")).toEqual({ "@type": "PriceSpecification", priceCurrency: "USD" });
  });

  it("never publishes a ceiling for open-ended labels", () => {
    expect(parsePriceSpecification("from $2,500 to $9,000")).not.toHaveProperty("maxPrice");
  });
});
