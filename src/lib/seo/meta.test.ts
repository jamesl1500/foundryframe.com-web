import { describe, expect, it } from "vitest";
import { seoTitle, summarize } from "@/lib/seo/meta";

describe("seoTitle", () => {
  it("keeps the layout suffix when the full title fits in 60 characters", () => {
    expect(seoTitle("Web Design in Lorain, Ohio")).toBe("Web Design in Lorain, Ohio");
    // 44 + " | Foundry Frame" (16) = 60
    expect(seoTitle("x".repeat(44))).toBe("x".repeat(44));
  });

  it("drops the suffix when it would push the title past 60", () => {
    expect(seoTitle("x".repeat(45))).toEqual({ absolute: "x".repeat(45) });
  });
});

describe("summarize", () => {
  it("leaves short text alone", () => {
    expect(summarize("Short and sweet.")).toBe("Short and sweet.");
    expect(summarize("x".repeat(155))).toBe("x".repeat(155));
  });

  it("cuts at a word boundary and adds an ellipsis", () => {
    const text = `${"word ".repeat(40)}end`;
    const out = summarize(text);
    expect(out.length).toBeLessThanOrEqual(156);
    expect(out.endsWith("word…")).toBe(true);
  });

  it("drops trailing punctuation before the ellipsis", () => {
    expect(summarize("alpha beta, gamma delta", 13)).toBe("alpha beta…");
    expect(summarize("alpha beta — gamma delta", 14)).toBe("alpha beta…");
  });

  it("hard-cuts a single long word instead of dropping a character", () => {
    expect(summarize("x".repeat(200), 10)).toBe(`${"x".repeat(10)}…`);
  });

  it("respects a custom length", () => {
    expect(summarize("one two three four five", 10)).toBe("one two…");
  });
});
