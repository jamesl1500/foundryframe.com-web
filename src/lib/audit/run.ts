/**
 * Audit Runner - Foundry Frame
 * ==============================
 * Server-only. Runs one free website audit end to end, inside the Next.js
 * app (POST /api/audit schedules it with after()):
 *
 *   1. claim the pending row in public.site_audits (so it never runs twice)
 *   2. scan the homepage and run Google PageSpeed (mobile) in parallel
 *   3. score each category from the checks, blended with Lighthouse
 *   4. have Claude write the summary and fix list (rule-based fallback)
 *   5. save the results and email the requester a link to them
 *
 * Any failure is recorded on the row with a visitor-safe message, which the
 * polling form and the /audit/[id] page show.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { Resend } from "resend";
import { writeAuditCopy } from "@/lib/audit/ai";
import {
  claimSiteAudit,
  completeSiteAudit,
  failSiteAudit,
  markSiteAuditEmailed,
  type SiteAuditRequestRow,
  type SiteAuditResults,
} from "@/lib/audit/repository";
import { scanSite, scoreChecks, ScanError, type AuditCategory, type AuditCheck } from "@/lib/audit/scanner";
import type { AuditFinding } from "@/lib/audit/types";
import { runPageSpeed } from "@/lib/leads/pagespeed";
import type { PageSpeedResult } from "@/lib/leads/types";

/* Lighthouse usually takes 20-60s. The browser polls for up to 150s, and the
   scan + Claude step need time after it, so PageSpeed gets 80s at most. */
const PAGESPEED_TIMEOUT_MS = 80_000;

const GENERIC_FAILURE = "Something went wrong while scanning this site. Please try again in a few minutes.";

/* How much each category counts toward the overall score. */
const CATEGORY_WEIGHTS: Record<AuditCategory, number> = {
  seo: 3,
  performance: 3,
  mobile: 2,
  accessibility: 2,
  security: 2,
  content: 2,
  conversion: 2,
};

const CATEGORY_NAMES: Record<AuditCategory, string> = {
  seo: "SEO",
  performance: "performance",
  mobile: "mobile experience",
  accessibility: "accessibility",
  security: "security",
  content: "content",
  conversion: "lead generation",
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.foundryframe.com").replace(/\/+$/, "");
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blend(own: number | null, lighthouse: number | null | undefined, lighthouseShare: number): number | null {
  if (own === null) return lighthouse ?? null;
  if (lighthouse === null || lighthouse === undefined) return own;
  return Math.round(own * (1 - lighthouseShare) + lighthouse * lighthouseShare);
}

/** Most important problems first: heavier checks, and fails before partials. */
function bySeverity(a: AuditCheck, b: AuditCheck): number {
  const rank = (item: AuditCheck) => item.weight * 2 + (item.result === "fail" ? 1 : 0);
  return rank(b) - rank(a);
}

function toFinding(item: AuditCheck): AuditFinding {
  return { title: item.issue, detail: item.fix };
}

function formatMs(ms: number | null): string | null {
  if (ms === null) return null;
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`;
}

function lighthouseFields(pageSpeed: PageSpeedResult | null, error: string | null) {
  if (!pageSpeed) {
    return {
      lighthouse_scores: null,
      lighthouse_metrics: null,
      lighthouse_opportunities: null,
      lighthouse_error: error,
    };
  }

  // Stored as 0-1 fractions, the Lighthouse convention toLighthouseScore() expects.
  const scores: Record<string, number> = {};
  const add = (key: string, value: number | null) => {
    if (value !== null) scores[key] = value / 100;
  };
  add("performance", pageSpeed.performanceScore);
  add("accessibility", pageSpeed.accessibilityScore);
  add("best_practices", pageSpeed.bestPracticesScore);
  add("seo", pageSpeed.seoScore);

  const metrics: Record<string, { display_value: string }> = {};
  const metric = (key: string, value: string | null) => {
    if (value) metrics[key] = { display_value: value };
  };
  const { lab } = pageSpeed;
  metric("first_contentful_paint", formatMs(lab.firstContentfulPaintMs));
  metric("largest_contentful_paint", formatMs(lab.largestContentfulPaintMs));
  metric("total_blocking_time", lab.totalBlockingTimeMs === null ? null : `${lab.totalBlockingTimeMs} ms`);
  metric("speed_index", formatMs(lab.speedIndexMs));
  metric(
    "cumulative_layout_shift",
    lab.cumulativeLayoutShift === null ? null : lab.cumulativeLayoutShift.toFixed(3)
  );

  return {
    lighthouse_scores: Object.keys(scores).length > 0 ? scores : null,
    lighthouse_metrics: Object.keys(metrics).length > 0 ? metrics : null,
    lighthouse_opportunities: pageSpeed.opportunities.map((item) => ({
      title: item.title,
      description: item.displayValue || `Could save about ${(item.savingsMs / 1000).toFixed(1)} s`,
    })),
    lighthouse_error: null,
  };
}

function fallbackSummary(overall: number, scores: Partial<Record<AuditCategory, number>>, problems: AuditCheck[]): string {
  const ranked = (Object.entries(scores) as [AuditCategory, number][]).sort((a, b) => b[1] - a[1]);
  const strongest = ranked.slice(0, 1).map(([key]) => CATEGORY_NAMES[key]);
  const weakest = ranked.slice(-2).reverse().filter(([, score]) => score < 80).map(([key]) => CATEGORY_NAMES[key]);

  const parts = [`Your site scored ${overall}/100 overall.`];
  if (strongest.length > 0) parts.push(`Its strongest area is ${strongest[0]}.`);
  if (weakest.length > 0) {
    parts.push(`The biggest opportunities are in ${weakest.join(" and ")}, starting with: ${problems[0]?.issue.toLowerCase() ?? "the items below"}.`);
  } else {
    parts.push("It's in good shape; the items below are refinements rather than urgent fixes.");
  }
  return parts.join(" ");
}

/** Emails the requester their results link. Returns false when email isn't configured. */
async function emailResults(audit: SiteAuditRequestRow, overall: number): Promise<boolean> {
  if (!resend) return false;

  const link = `${siteOrigin()}/audit/${audit.id}`;
  const host = new URL(audit.url).hostname.replace(/^www\./, "");
  const greeting = audit.name ? `Hi ${esc(audit.name.split(" ")[0])},` : "Hi,";

  const { error } = await resend.emails.send({
    from: process.env.LEAD_PROPOSAL_EMAIL_FROM || "Foundry Frame <noreply@foundryframe.com>",
    to: audit.email,
    replyTo: "jlatten@foundryframe.com",
    subject: `Your website audit for ${host}: ${overall}/100`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#1a1a1a;line-height:1.5;">
        <p>${greeting}</p>
        <p>Your free website audit for <strong>${esc(host)}</strong> is ready. The site scored <strong>${overall}/100</strong>.</p>
        <p>The full report breaks down SEO, speed, mobile, accessibility, security and lead generation, with the fixes that will make the biggest difference first.</p>
        <p style="margin:28px 0;">
          <a href="${esc(link)}" style="background:#111;color:#fff;padding:12px 22px;text-decoration:none;display:inline-block;">View your results</a>
        </p>
        <p>Want help with any of it? Just reply to this email and we'll walk you through it, no obligation.</p>
        <p>The Foundry Frame team</p>
        <p style="color:#777;font-size:12px;margin-top:32px;">You're getting this because you requested a free audit at foundryframe.com. Your results link: ${esc(link)}</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return true;
}

/** Runs the audit for a pending row. Never throws; failures are saved on the row. */
export async function runSiteAudit(auditId: string): Promise<void> {
  let audit: SiteAuditRequestRow | null;
  try {
    audit = await claimSiteAudit(auditId);
  } catch (error) {
    console.error(`Audit ${auditId}: could not claim row:`, error);
    return;
  }
  if (!audit) return;

  let results: SiteAuditResults;
  try {
    const pageSpeedPromise = runPageSpeed(audit.url, "mobile", PAGESPEED_TIMEOUT_MS).then(
      (result) => ({ result, error: null as string | null }),
      (error: unknown) => {
        console.warn(`Audit ${auditId}: PageSpeed failed:`, error instanceof Error ? error.message : error);
        return { result: null, error: "Google PageSpeed couldn't test this page right now." };
      }
    );
    const [scan, pageSpeed] = await Promise.all([scanSite(audit.url), pageSpeedPromise]);
    const psi = pageSpeed.result;

    const categories = Array.from(new Set(scan.checks.map((item) => item.category)));
    const scores: Partial<Record<AuditCategory, number>> = {};
    const findings: Record<string, AuditFinding[]> = {};

    for (const category of categories) {
      const own = scoreChecks(scan.checks.filter((item) => item.category === category));
      let score = own;
      if (category === "performance") score = blend(own, psi?.performanceScore, 0.75);
      if (category === "accessibility") score = blend(own, psi?.accessibilityScore, 0.5);
      if (category === "seo") score = blend(own, psi?.seoScore, 0.5);
      if (category === "mobile") score = blend(own, psi?.performanceScore, 0.4);
      if (score === null) continue;

      scores[category] = score;
      findings[category] = scan.checks
        .filter((item) => item.category === category && item.result !== "pass")
        .sort(bySeverity)
        .map(toFinding);
    }

    const weighted = (Object.entries(scores) as [AuditCategory, number][]).reduce(
      (acc, [category, score]) => ({
        total: acc.total + score * CATEGORY_WEIGHTS[category],
        weight: acc.weight + CATEGORY_WEIGHTS[category],
      }),
      { total: 0, weight: 0 }
    );
    const overall = weighted.weight > 0 ? Math.round(weighted.total / weighted.weight) : 0;
    const problems = scan.checks.filter((item) => item.result !== "pass").sort(bySeverity);

    const aiCopy = await writeAuditCopy({
      url: scan.facts.finalUrl,
      auditData: {
        overall_score: overall,
        category_scores: scores,
        problems: problems.map((item) => ({
          category: item.category,
          issue: item.issue,
          severity: item.result === "fail" ? "fail" : "partial",
          importance: item.weight,
        })),
        passed: scan.checks.filter((item) => item.result === "pass").map((item) => item.label),
        page: {
          title: scan.facts.title,
          meta_description: scan.facts.metaDescription,
          h1: scan.facts.h1,
          word_count: scan.facts.wordCount,
          server_response_ms: scan.facts.responseTimeMs,
        },
        lighthouse_mobile: psi
          ? {
              performance: psi.performanceScore,
              accessibility: psi.accessibilityScore,
              best_practices: psi.bestPracticesScore,
              seo: psi.seoScore,
              largest_contentful_paint_ms: psi.lab.largestContentfulPaintMs,
              total_blocking_time_ms: psi.lab.totalBlockingTimeMs,
              top_opportunities: psi.opportunities.map((item) => item.title),
            }
          : "unavailable",
      },
      siteContent: [scan.facts.headings.join(" | "), scan.facts.textExcerpt].filter(Boolean).join("\n\n"),
    });

    results = {
      final_url: scan.facts.finalUrl,
      overall_score: overall,
      category_scores: scores,
      findings,
      ai_summary: aiCopy?.summary ?? fallbackSummary(overall, scores, problems),
      ai_recommendations: { items: aiCopy?.recommendations ?? problems.slice(0, 6).map(toFinding) },
      ...lighthouseFields(psi, pageSpeed.error),
      scan_snapshot: {
        facts: scan.facts,
        checks: scan.checks,
        pageSpeedMobile: psi,
        aiWritten: Boolean(aiCopy),
      },
    };
  } catch (error) {
    const message = error instanceof ScanError ? error.message : GENERIC_FAILURE;
    if (!(error instanceof ScanError)) console.error(`Audit ${auditId}: run failed:`, error);
    await failSiteAudit(auditId, message).catch((saveError) =>
      console.error(`Audit ${auditId}: could not record failure:`, saveError)
    );
    return;
  }

  try {
    await completeSiteAudit(auditId, results);
  } catch (error) {
    console.error(`Audit ${auditId}: could not save results:`, error);
    await failSiteAudit(auditId, GENERIC_FAILURE).catch(() => undefined);
    return;
  }

  try {
    if (await emailResults(audit, results.overall_score ?? 0)) {
      await markSiteAuditEmailed(auditId);
    }
  } catch (error) {
    console.error(`Audit ${auditId}: results email failed:`, error);
  }
}
