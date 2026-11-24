import { describe, expect, it } from "vitest";
import {
  asRecord,
  extractList,
  formatMetricValue,
  getCategoryRecommendation,
  scoreTone,
  toLighthouseScore,
  toScore,
  toTitleCase,
} from "@/lib/audit/present";

describe("getCategoryRecommendation", () => {
  it("maps each scanner category to a service page", () => {
    for (const category of ["seo", "content", "performance", "accessibility", "mobile", "security", "conversion"]) {
      const rec = getCategoryRecommendation(category);
      expect(rec.href).toMatch(/^\/(services|packages)\//);
    }
  });

  it("normalizes case and whitespace and falls back to packages", () => {
    expect(getCategoryRecommendation("  SEO ").label).toBe("Strategy & SEO");
    expect(getCategoryRecommendation("unknown").href).toBe("/packages");
  });
});

describe("toTitleCase", () => {
  it.each([
    ["best_practices", "Best Practices"],
    ["largest-contentful-paint", "Largest Contentful Paint"],
    ["camelCaseKey", "Camel Case Key"],
    ["seo", "Seo"],
    ["  __x__ ", "X"],
  ])("%j -> %j", (input, expected) => {
    expect(toTitleCase(input)).toBe(expected);
  });
});

describe("scoreTone", () => {
  it("uses green from 80, accent from 50, red below", () => {
    expect(scoreTone(80).text).toBe("text-green-700");
    expect(scoreTone(79).text).toBe("text-accent-ink");
    expect(scoreTone(50).text).toBe("text-accent-ink");
    expect(scoreTone(49).text).toBe("text-red-700");
  });
});

describe("toScore", () => {
  it("clamps and rounds numbers and numeric strings", () => {
    expect(toScore(72.6)).toBe(73);
    expect(toScore("88")).toBe(88);
    expect(toScore(150)).toBe(100);
    expect(toScore(-5)).toBe(0);
  });

  it.each([null, undefined, "abc", NaN, Infinity, {}, []])("returns null for %j", (value) => {
    expect(toScore(value)).toBeNull();
  });
});

describe("toLighthouseScore", () => {
  it("scales 0-1 fractions and passes 0-100 values through", () => {
    expect(toLighthouseScore(0.42)).toBe(42);
    expect(toLighthouseScore(0.955)).toBe(96);
    expect(toLighthouseScore(88)).toBe(88);
    expect(toLighthouseScore({ score: 0.5 })).toBe(50);
    expect(toLighthouseScore("0.7")).toBe(70);
    expect(toLighthouseScore(0)).toBe(0);
  });

  it("returns null for non-numeric values", () => {
    expect(toLighthouseScore(null)).toBeNull();
    expect(toLighthouseScore({ score: null })).toBeNull();
  });
});

describe("formatMetricValue", () => {
  it("prefers the display value", () => {
    expect(formatMetricValue({ display_value: "1.2 s", value: 1200 })).toBe("1.2 s");
    expect(formatMetricValue({ displayValue: "300 ms" })).toBe("300 ms");
  });

  it("formats numeric values with their unit", () => {
    expect(formatMetricValue({ numericValue: 1234.6, numericUnit: "millisecond" })).toBe("1235 ms");
    expect(formatMetricValue({ value: 0.05, unit: "" })).toBe("0.05");
  });

  it("handles raw values and unknowns", () => {
    expect(formatMetricValue(12.7)).toBe("13");
    expect(formatMetricValue("fast")).toBe("fast");
    expect(formatMetricValue(null)).toBe("—");
    expect(formatMetricValue({})).toBe("—");
  });
});

describe("extractList", () => {
  it("flattens strings, findings and nested objects", () => {
    expect(
      extractList({
        seo: [{ title: "Missing title", detail: "Add one." }, "  Plain string  ", ""],
        other: { nested: [{ name: "No detail" }] },
      })
    ).toEqual(["Missing title — Add one.", "Plain string", "No detail"]);
  });

  it("reads the various title and detail keys", () => {
    expect(extractList([{ issue: "Slow", recommendation: "Cache" }, { finding: "F", action: "A" }])).toEqual([
      "Slow — Cache",
      "F — A",
    ]);
  });

  it("stops at a depth of 3 and ignores null", () => {
    expect(extractList({ a: { b: { c: { d: "too deep" } } } })).toEqual([]);
    expect(extractList(null)).toEqual([]);
  });

  it("stringifies numbers and booleans", () => {
    expect(extractList([1, true])).toEqual(["1", "true"]);
  });
});

describe("asRecord", () => {
  it("returns plain objects and an empty object for anything else", () => {
    expect(asRecord({ a: 1 })).toEqual({ a: 1 });
    expect(asRecord([1])).toEqual({});
    expect(asRecord(null)).toEqual({});
    expect(asRecord("x")).toEqual({});
  });
});
