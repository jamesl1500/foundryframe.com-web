import { describe, expect, it } from "vitest";
import { scoreProspect } from "@/lib/lead-finder/scoring";
import type { ProspectCandidate, SiteCheck } from "@/lib/lead-finder/types";

const YEAR = new Date().getFullYear();

function candidate(overrides: Partial<ProspectCandidate> = {}): ProspectCandidate {
  return {
    source: "google_places",
    businessName: "Acme Plumbing",
    websiteUrl: "https://acme.example/",
    category: "Plumber",
    location: "Lorain, OH",
    address: null,
    phone: null,
    email: null,
    sourceUrl: null,
    googlePlaceId: null,
    rating: null,
    reviewCount: null,
    intentSignal: null,
    intentStrength: null,
    ...overrides,
  } as ProspectCandidate;
}

function site(overrides: Partial<SiteCheck> = {}): SiteCheck {
  return {
    checkedUrl: "https://acme.example/",
    reachable: true,
    blocked: false,
    statusCode: 200,
    finalUrl: "https://acme.example/",
    https: true,
    responseTimeMs: 400,
    hasViewportMeta: true,
    hasMetaDescription: true,
    hasTitle: true,
    hasH1: true,
    copyrightYear: YEAR,
    builder: null,
    looksParkedOrUnderConstruction: false,
    isSocialOrDirectoryProfile: false,
    error: null,
    ...overrides,
  };
}

describe("scoreProspect", () => {
  it("scores a healthy, modern site at zero", () => {
    expect(scoreProspect(candidate(), site())).toEqual({ score: 0, reasons: [] });
  });

  it("scores the missing-site cases", () => {
    expect(scoreProspect(candidate({ websiteUrl: null }), site()).score).toBe(45);
    expect(scoreProspect(candidate(), site({ isSocialOrDirectoryProfile: true })).score).toBe(40);
    expect(scoreProspect(candidate(), site({ reachable: false, statusCode: 500 })).reasons[0].signal).toBe(
      "Website returns HTTP 500"
    );
    expect(scoreProspect(candidate(), site({ reachable: false, statusCode: null })).reasons[0].signal).toBe(
      "Website doesn't load"
    );
  });

  it("doesn't guess about a site hidden by bot protection", () => {
    const { score } = scoreProspect(candidate(), site({ blocked: true, reachable: false, https: false, hasViewportMeta: false }));
    expect(score).toBe(0);
  });

  it("adds up site problems and sorts reasons by weight", () => {
    const { score, reasons } = scoreProspect(
      candidate(),
      site({
        https: false,
        hasViewportMeta: false,
        copyrightYear: YEAR - 6,
        hasMetaDescription: false,
        hasTitle: false,
        hasH1: false,
        responseTimeMs: 4200,
      })
    );
    expect(score).toBe(12 + 15 + 12 + 5 + 4 + 4 + 8);
    expect(reasons.map((r) => r.points)).toEqual([...reasons.map((r) => r.points)].sort((a, b) => b - a));
    expect(reasons).toContainEqual({ points: 8, signal: "Slow to respond (4.2s)" });
  });

  it("grades copyright age in two steps", () => {
    expect(scoreProspect(candidate(), site({ copyrightYear: YEAR - 3 })).score).toBe(7);
    expect(scoreProspect(candidate(), site({ copyrightYear: YEAR - 5 })).score).toBe(12);
    expect(scoreProspect(candidate(), site({ copyrightYear: YEAR - 2 })).score).toBe(0);
  });

  it("scores builders", () => {
    expect(scoreProspect(candidate(), site({ builder: "Wix (free subdomain)" })).score).toBe(15);
    expect(scoreProspect(candidate(), site({ builder: "Joomla" })).score).toBe(10);
    expect(scoreProspect(candidate(), site({ builder: "WordPress" })).score).toBe(0);
  });

  it("adds intent and established-business signals", () => {
    const { score, reasons } = scoreProspect(
      candidate({ intentStrength: "high", intentSignal: "Asked for web designer on Reddit", reviewCount: 40, rating: 4.6 }),
      site()
    );
    expect(score).toBe(35);
    expect(reasons[0]).toEqual({ points: 30, signal: "Asked for web designer on Reddit" });
    expect(reasons[1].signal).toBe("40 reviews at 4.6★");
  });

  it("caps the score at 100", () => {
    const { score } = scoreProspect(
      candidate({ websiteUrl: null, intentStrength: "high", reviewCount: 100, rating: 5 }),
      site()
    );
    expect(score).toBe(80);
    const maxed = scoreProspect(
      candidate({ intentStrength: "high", reviewCount: 100, rating: 5 }),
      site({ looksParkedOrUnderConstruction: true, builder: "x free subdomain", https: false, hasViewportMeta: false, copyrightYear: 2000, hasMetaDescription: false, hasTitle: false, hasH1: false, responseTimeMs: 9000 })
    );
    expect(maxed.score).toBe(100);
  });
});
