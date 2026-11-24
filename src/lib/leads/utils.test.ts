import { describe, expect, it } from "vitest";
import { parseSearchInput } from "@/app/api/admin/lead-finder/_parse";
import { PROSPECT_SOURCES } from "@/lib/lead-finder/types";
import { clipText, ensureArrayStrings, normalizeWebsiteUrl, slugify } from "@/lib/leads/utils";

describe("normalizeWebsiteUrl", () => {
  it("adds https:// and normalizes", () => {
    expect(normalizeWebsiteUrl(" acme.example ")).toBe("https://acme.example/");
    expect(normalizeWebsiteUrl("HTTP://Acme.Example/a")).toBe("http://acme.example/a");
  });

  it("returns an empty string for blank or invalid input", () => {
    expect(normalizeWebsiteUrl("   ")).toBe("");
    expect(normalizeWebsiteUrl("http://")).toBe("");
  });
});

describe("slugify", () => {
  it.each([
    ["Acme Plumbing & Heating", "acme-plumbing-heating"],
    ["  --Hello   World--  ", "hello-world"],
    ["Café 2026!", "caf-2026"],
    ["", ""],
  ])("%j -> %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("ensureArrayStrings", () => {
  it("keeps trimmed non-empty strings", () => {
    expect(ensureArrayStrings([" a ", "", 3, null, "b"])).toEqual(["a", "b"]);
    expect(ensureArrayStrings("a,b")).toEqual([]);
  });
});

describe("clipText", () => {
  it("clips long text with an ellipsis", () => {
    expect(clipText("abcdef", 3)).toBe("abc...");
    expect(clipText("abc", 3)).toBe("abc");
  });
});

describe("parseSearchInput", () => {
  it("trims and bounds the query and location", () => {
    const parsed = parseSearchInput({ query: `  plumbers ${"x".repeat(200)}`, location: " Lorain, OH " });
    expect(parsed).toMatchObject({ location: "Lorain, OH", sources: PROSPECT_SOURCES });
    expect("query" in parsed && parsed.query).toHaveLength(120);
  });

  it("filters sources to known ones", () => {
    const parsed = parseSearchInput({ query: "q", location: "l", sources: [PROSPECT_SOURCES[0], "bogus"] });
    expect(parsed).toMatchObject({ sources: [PROSPECT_SOURCES[0]] });
  });

  it.each([
    [{ location: "l" }, "Enter the kind of business to look for."],
    [{ query: "q" }, "Enter a city or region."],
    [{ query: "q", location: "l", sources: ["bogus"] }, "Pick at least one source."],
  ])("errors on %j", (body, error) => {
    expect(parseSearchInput(body)).toEqual({ error });
  });
});
