import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuditCheck, ScanResult } from "@/lib/audit/scanner";
import type { PageSpeedResult } from "@/lib/leads/types";

const mocks = vi.hoisted(() => ({
  claimSiteAudit: vi.fn(),
  completeSiteAudit: vi.fn(),
  failSiteAudit: vi.fn(),
  markSiteAuditEmailed: vi.fn(),
  scanSite: vi.fn(),
  runPageSpeed: vi.fn(),
  writeAuditCopy: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock("@/lib/audit/repository", () => ({
  claimSiteAudit: mocks.claimSiteAudit,
  completeSiteAudit: mocks.completeSiteAudit,
  failSiteAudit: mocks.failSiteAudit,
  markSiteAuditEmailed: mocks.markSiteAuditEmailed,
}));
vi.mock("@/lib/audit/scanner", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/audit/scanner")>()),
  scanSite: mocks.scanSite,
}));
vi.mock("@/lib/leads/pagespeed", () => ({ runPageSpeed: mocks.runPageSpeed }));
vi.mock("@/lib/audit/ai", () => ({ writeAuditCopy: mocks.writeAuditCopy }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.sendEmail };
  },
}));

const { ScanError } = await import("@/lib/audit/scanner");

/** Imports run.ts fresh, since it reads RESEND_API_KEY when it loads. */
async function loadRun({ resend = true } = {}) {
  vi.resetModules();
  vi.stubEnv("RESEND_API_KEY", resend ? "re_test" : "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.foundryframe.com/");
  return (await import("@/lib/audit/run")).runSiteAudit;
}

const AUDIT = {
  id: "11111111-1111-4111-8111-111111111111",
  url: "https://www.acme.example/",
  email: "owner@acme.example",
  name: "Jane <b>Doe</b>",
  company: "Acme",
  status: "running" as const,
};

function check(id: string, category: AuditCheck["category"], result: AuditCheck["result"], weight: AuditCheck["weight"]): AuditCheck {
  return { id, category, result, weight, label: `${id} label`, issue: `${id} Issue`, fix: `${id} fix` };
}

const CHECKS: AuditCheck[] = [
  check("title", "seo", "pass", 3),
  check("meta-description", "seo", "fail", 3),
  check("response-time", "performance", "partial", 2),
  check("viewport", "mobile", "pass", 3),
  check("lang", "accessibility", "fail", 2),
  check("https", "security", "pass", 3),
  check("word-count", "content", "partial", 3),
  check("cta", "conversion", "fail", 2),
];

const SCAN: ScanResult = {
  facts: {
    requestedUrl: AUDIT.url,
    finalUrl: "https://www.acme.example/home",
    status: 200,
    responseTimeMs: 1200,
    redirects: 1,
    htmlBytes: 5000,
    title: "Acme",
    metaDescription: "",
    h1: ["Acme"],
    headings: ["Acme", "Services"],
    wordCount: 150,
    imageCount: 0,
    imagesMissingAlt: 0,
    textExcerpt: "We fix pipes.",
  },
  checks: CHECKS,
};

const PSI: PageSpeedResult = {
  strategy: "mobile",
  performanceScore: 40,
  accessibilityScore: 80,
  bestPracticesScore: 95,
  seoScore: 90,
  lab: {
    firstContentfulPaintMs: 1200,
    largestContentfulPaintMs: 950,
    totalBlockingTimeMs: 300,
    speedIndexMs: null,
    cumulativeLayoutShift: 0.1234,
  },
  field: null,
  opportunities: [
    { title: "Reduce unused JavaScript", displayValue: "", savingsMs: 1500 },
    { title: "Serve images in modern formats", displayValue: "Potential savings of 120 KiB", savingsMs: 600 },
  ],
};

const AI_COPY = {
  summary: "Your site scored 54/100.",
  recommendations: [{ title: "Add a meta description", detail: "It shows in Google." }],
};

beforeEach(() => {
  for (const fn of Object.values(mocks)) fn.mockReset();
  mocks.claimSiteAudit.mockResolvedValue(AUDIT);
  mocks.scanSite.mockResolvedValue(SCAN);
  mocks.runPageSpeed.mockResolvedValue(PSI);
  mocks.writeAuditCopy.mockResolvedValue(AI_COPY);
  mocks.completeSiteAudit.mockResolvedValue(undefined);
  mocks.failSiteAudit.mockResolvedValue(undefined);
  mocks.markSiteAuditEmailed.mockResolvedValue(undefined);
  mocks.sendEmail.mockResolvedValue({ data: { id: "email_1" }, error: null });
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

function savedResults() {
  expect(mocks.completeSiteAudit).toHaveBeenCalledTimes(1);
  const [id, results] = mocks.completeSiteAudit.mock.calls[0];
  expect(id).toBe(AUDIT.id);
  return results;
}

describe("runSiteAudit", () => {
  it("does nothing when the audit was already claimed", async () => {
    const runSiteAudit = await loadRun();
    mocks.claimSiteAudit.mockResolvedValue(null);
    await runSiteAudit(AUDIT.id);
    expect(mocks.scanSite).not.toHaveBeenCalled();
    expect(mocks.completeSiteAudit).not.toHaveBeenCalled();
  });

  it("never throws when the claim itself fails", async () => {
    const runSiteAudit = await loadRun();
    mocks.claimSiteAudit.mockRejectedValue(new Error("db down"));
    await expect(runSiteAudit(AUDIT.id)).resolves.toBeUndefined();
    expect(mocks.scanSite).not.toHaveBeenCalled();
  });

  it("runs the scan and mobile PageSpeed against the requested URL", async () => {
    const runSiteAudit = await loadRun();
    await runSiteAudit(AUDIT.id);
    expect(mocks.scanSite).toHaveBeenCalledWith(AUDIT.url);
    expect(mocks.runPageSpeed).toHaveBeenCalledWith(AUDIT.url, "mobile", 80_000);
  });

  it("blends category scores with Lighthouse and weights the overall score", async () => {
    const runSiteAudit = await loadRun();
    await runSiteAudit(AUDIT.id);
    const results = savedResults();

    expect(results.category_scores).toEqual({
      seo: 70, // own 50 blended 50/50 with Lighthouse SEO 90
      performance: 43, // own 50 at 25%, Lighthouse 40 at 75% = 42.5
      mobile: 76, // own 100 at 60%, Lighthouse performance 40 at 40%
      accessibility: 40, // own 0 blended 50/50 with 80
      security: 100,
      content: 50,
      conversion: 0,
    });
    // (70*3 + 43*3 + 76*2 + 40*2 + 100*2 + 50*2 + 0*2) / 16 = 54.4
    expect(results.overall_score).toBe(54);
    expect(results.final_url).toBe("https://www.acme.example/home");
  });

  it("lists only non-passing checks as findings, keyed by category", async () => {
    const runSiteAudit = await loadRun();
    await runSiteAudit(AUDIT.id);
    const { findings } = savedResults();
    expect(findings.seo).toEqual([{ title: "meta-description Issue", detail: "meta-description fix" }]);
    expect(findings.security).toEqual([]);
    expect(Object.keys(findings).sort()).toEqual(
      ["accessibility", "content", "conversion", "mobile", "performance", "security", "seo"].sort()
    );
  });

  it("stores Lighthouse scores as fractions and formats the metrics", async () => {
    const runSiteAudit = await loadRun();
    await runSiteAudit(AUDIT.id);
    const results = savedResults();
    expect(results.lighthouse_scores).toEqual({ performance: 0.4, accessibility: 0.8, best_practices: 0.95, seo: 0.9 });
    expect(results.lighthouse_metrics).toEqual({
      first_contentful_paint: { display_value: "1.2 s" },
      largest_contentful_paint: { display_value: "950 ms" },
      total_blocking_time: { display_value: "300 ms" },
      cumulative_layout_shift: { display_value: "0.123" },
    });
    expect(results.lighthouse_opportunities).toEqual([
      { title: "Reduce unused JavaScript", description: "Could save about 1.5 s" },
      { title: "Serve images in modern formats", description: "Potential savings of 120 KiB" },
    ]);
    expect(results.lighthouse_error).toBeNull();
  });

  it("sends Claude the scores, problems by severity, and page content", async () => {
    const runSiteAudit = await loadRun();
    await runSiteAudit(AUDIT.id);
    const input = mocks.writeAuditCopy.mock.calls[0][0];
    expect(input.url).toBe("https://www.acme.example/home");
    expect(input.auditData.overall_score).toBe(54);
    expect(input.auditData.problems.map((p: { issue: string }) => p.issue)).toEqual([
      "meta-description Issue", // weight 3 fail
      "word-count Issue", // weight 3 partial
      "lang Issue", // weight 2 fail
      "cta Issue", // weight 2 fail
      "response-time Issue", // weight 2 partial
    ]);
    expect(input.auditData.passed).toEqual(["title label", "viewport label", "https label"]);
    expect(input.auditData.lighthouse_mobile.top_opportunities).toEqual([
      "Reduce unused JavaScript",
      "Serve images in modern formats",
    ]);
    expect(input.siteContent).toBe("Acme | Services\n\nWe fix pipes.");
  });

  it("uses Claude's copy when it's available", async () => {
    const runSiteAudit = await loadRun();
    await runSiteAudit(AUDIT.id);
    const results = savedResults();
    expect(results.ai_summary).toBe(AI_COPY.summary);
    expect(results.ai_recommendations).toEqual({ items: AI_COPY.recommendations });
    expect(results.scan_snapshot.aiWritten).toBe(true);
  });

  it("falls back to rule-based copy without Claude", async () => {
    const runSiteAudit = await loadRun();
    mocks.writeAuditCopy.mockResolvedValue(null);
    await runSiteAudit(AUDIT.id);
    const results = savedResults();
    expect(results.ai_summary).toBe(
      "Your site scored 54/100 overall. Its strongest area is security. " +
        "The biggest opportunities are in lead generation and accessibility, starting with: meta-description issue."
    );
    expect(results.ai_recommendations.items).toHaveLength(5);
    expect(results.ai_recommendations.items[0]).toEqual({ title: "meta-description Issue", detail: "meta-description fix" });
    expect(results.scan_snapshot.aiWritten).toBe(false);
  });

  it("says the site is in good shape when every category scores 80+", async () => {
    const runSiteAudit = await loadRun();
    mocks.writeAuditCopy.mockResolvedValue(null);
    mocks.runPageSpeed.mockRejectedValue(new Error("quota"));
    mocks.scanSite.mockResolvedValue({
      ...SCAN,
      checks: [check("title", "seo", "pass", 3), check("https", "security", "pass", 3)],
    });
    await runSiteAudit(AUDIT.id);
    expect(savedResults().ai_summary).toMatch(/good shape/);
  });

  it("still completes when PageSpeed fails, using its own scores", async () => {
    const runSiteAudit = await loadRun();
    mocks.runPageSpeed.mockRejectedValue(new Error("Lighthouse timed out"));
    await runSiteAudit(AUDIT.id);
    const results = savedResults();
    expect(results.category_scores.performance).toBe(50);
    expect(results.category_scores.seo).toBe(50);
    expect(results.lighthouse_scores).toBeNull();
    expect(results.lighthouse_error).toBe("Google PageSpeed couldn't test this page right now.");
    expect(mocks.writeAuditCopy.mock.calls[0][0].auditData.lighthouse_mobile).toBe("unavailable");
  });

  it("records a ScanError's message on the row", async () => {
    const runSiteAudit = await loadRun();
    mocks.scanSite.mockRejectedValue(new ScanError("That website blocked our scanner."));
    await runSiteAudit(AUDIT.id);
    expect(mocks.failSiteAudit).toHaveBeenCalledWith(AUDIT.id, "That website blocked our scanner.");
    expect(mocks.completeSiteAudit).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("hides unexpected errors behind a generic message", async () => {
    const runSiteAudit = await loadRun();
    mocks.scanSite.mockRejectedValue(new TypeError("secret internal detail"));
    await runSiteAudit(AUDIT.id);
    const message = mocks.failSiteAudit.mock.calls[0][1];
    expect(message).toMatch(/Something went wrong/);
    expect(message).not.toMatch(/secret/);
  });

  it("never throws, even when recording the failure fails", async () => {
    const runSiteAudit = await loadRun();
    mocks.scanSite.mockRejectedValue(new Error("boom"));
    mocks.failSiteAudit.mockRejectedValue(new Error("db down"));
    await expect(runSiteAudit(AUDIT.id)).resolves.toBeUndefined();
  });

  it("marks the audit failed and skips the email when saving results fails", async () => {
    const runSiteAudit = await loadRun();
    mocks.completeSiteAudit.mockRejectedValue(new Error("payload too large"));
    await runSiteAudit(AUDIT.id);
    expect(mocks.failSiteAudit).toHaveBeenCalledWith(AUDIT.id, expect.stringMatching(/Something went wrong/));
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("emails the requester a link to the results and marks the row", async () => {
    const runSiteAudit = await loadRun();
    await runSiteAudit(AUDIT.id);
    expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
    const email = mocks.sendEmail.mock.calls[0][0];
    expect(email.to).toBe(AUDIT.email);
    expect(email.subject).toBe("Your website audit for acme.example: 54/100");
    expect(email.html).toContain(`https://www.foundryframe.com/audit/${AUDIT.id}`);
    expect(mocks.markSiteAuditEmailed).toHaveBeenCalledWith(AUDIT.id);
  });

  it("escapes the requester's name in the email", async () => {
    const runSiteAudit = await loadRun();
    mocks.claimSiteAudit.mockResolvedValue({ ...AUDIT, name: "<img src=x onerror=alert(1)> Smith" });
    await runSiteAudit(AUDIT.id);
    const { html } = mocks.sendEmail.mock.calls[0][0];
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("Hi &lt;img,");
  });

  it("greets without a name when none was given", async () => {
    const runSiteAudit = await loadRun();
    mocks.claimSiteAudit.mockResolvedValue({ ...AUDIT, name: null });
    await runSiteAudit(AUDIT.id);
    expect(mocks.sendEmail.mock.calls[0][0].html).toContain("<p>Hi,</p>");
  });

  it("doesn't mark the row emailed when Resend reports an error", async () => {
    const runSiteAudit = await loadRun();
    mocks.sendEmail.mockResolvedValue({ data: null, error: { message: "invalid recipient" } });
    await expect(runSiteAudit(AUDIT.id)).resolves.toBeUndefined();
    expect(mocks.completeSiteAudit).toHaveBeenCalled();
    expect(mocks.markSiteAuditEmailed).not.toHaveBeenCalled();
  });

  it("skips email when Resend isn't configured", async () => {
    const runSiteAudit = await loadRun({ resend: false });
    await runSiteAudit(AUDIT.id);
    expect(mocks.completeSiteAudit).toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.markSiteAuditEmailed).not.toHaveBeenCalled();
  });
});
