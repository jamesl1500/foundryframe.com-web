import { describe, expect, it } from "vitest";
import { refusalFallbacks, supportsServerFallbacks } from "@/lib/claude-fallbacks";

describe("refusalFallbacks", () => {
  it("adds the fallback beta for models that accept it", () => {
    for (const model of ["claude-opus-5-5", "claude-sonnet-5-5", "claude-fable-5-2"]) {
      expect(refusalFallbacks(model)).toEqual({ betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" });
    }
  });

  it("sends nothing extra for other models, so an env override can't 400 every request", () => {
    for (const model of ["claude-haiku-5-5", "claude-sonnet-4-6", "claude-opus-4-8", ""]) {
      expect(supportsServerFallbacks(model)).toBe(false);
      expect(refusalFallbacks(model)).toEqual({});
    }
  });
});
