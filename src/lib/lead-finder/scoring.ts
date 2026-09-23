import type { ProspectCandidate, ScoreReason, SiteCheck } from "@/lib/lead-finder/types";

const INTENT_POINTS = { high: 30, medium: 18, low: 8 } as const;

/**
 * Scores how likely a business is to buy a new website, 0-100. Each reason is stored with the
 * prospect so the admin can see why it ranked where it did.
 */
export function scoreProspect(
  candidate: ProspectCandidate,
  site: SiteCheck
): { score: number; reasons: ScoreReason[] } {
  const reasons: ScoreReason[] = [];
  const add = (points: number, signal: string) => reasons.push({ points, signal });

  if (!candidate.websiteUrl) {
    add(45, "No website listed");
  } else if (site.isSocialOrDirectoryProfile) {
    add(40, "Only has a social or directory profile, no site of their own");
  } else if (site.blocked) {
    // Bot protection hid the site; score only on the other signals rather than guess.
  } else if (!site.reachable) {
    add(35, site.statusCode ? `Website returns HTTP ${site.statusCode}` : "Website doesn't load");
  } else {
    if (site.looksParkedOrUnderConstruction) add(25, "Site is parked, for sale, or \"coming soon\"");
    if (site.builder?.includes("free subdomain") || site.builder?.includes("staging")) {
      add(15, `Runs on a ${site.builder}`);
    } else if (site.builder === "FrontPage" || site.builder === "Joomla") {
      add(10, `Built on dated ${site.builder}`);
    }
    if (!site.https) add(12, "No HTTPS");
    if (!site.hasViewportMeta) add(15, "Not set up for mobile");

    const currentYear = new Date().getFullYear();
    if (site.copyrightYear && site.copyrightYear <= currentYear - 5) {
      add(12, `Footer copyright is ${site.copyrightYear}`);
    } else if (site.copyrightYear && site.copyrightYear <= currentYear - 3) {
      add(7, `Footer copyright is ${site.copyrightYear}`);
    }

    if (!site.hasMetaDescription) add(5, "Missing meta description");
    if (!site.hasTitle) add(4, "Missing page title");
    if (!site.hasH1) add(4, "No main heading (H1)");
    if (site.responseTimeMs && site.responseTimeMs > 3000) {
      add(8, `Slow to respond (${(site.responseTimeMs / 1000).toFixed(1)}s)`);
    }
  }

  if (candidate.intentStrength) {
    add(INTENT_POINTS[candidate.intentStrength], candidate.intentSignal ?? "Public buying signal found");
  }

  // Established, well-reviewed businesses can afford a project and have something to lose.
  if ((candidate.reviewCount ?? 0) >= 25 && (candidate.rating ?? 0) >= 4) {
    add(5, `${candidate.reviewCount} reviews at ${candidate.rating}★`);
  }

  const score = Math.min(100, reasons.reduce((sum, reason) => sum + reason.points, 0));
  return { score, reasons: reasons.sort((a, b) => b.points - a.points) };
}
