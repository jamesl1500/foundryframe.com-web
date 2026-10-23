import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById, getLatestLeadAudit } from "@/lib/leads/repository";
import type { PageSpeedResult, PageSpeedSummary } from "@/lib/leads/types";

function severityClasses(severity: "high" | "medium" | "low") {
  if (severity === "high") {
    return "border-red-400/40 text-red-200";
  }

  if (severity === "medium") {
    return "border-amber-300/40 text-amber-200";
  }

  return "border-emerald-300/40 text-emerald-200";
}

function normalizeRecommendations(input: unknown) {
  if (!input) {
    return [] as Array<{ category: string; action: string; expectedImpact: string }>;
  }

  const collection = Array.isArray(input)
    ? input
    : typeof input === "object" && input !== null && Array.isArray((input as { items?: unknown }).items)
      ? (input as { items: unknown[] }).items
      : [];

  return collection
    .map((entry) => {
      if (typeof entry === "string") {
        return {
          category: "seo",
          action: entry,
          expectedImpact: "",
        };
      }

      if (!entry || typeof entry !== "object") {
        return null;
      }

      const record = entry as Record<string, unknown>;
      const action =
        typeof record.action === "string"
          ? record.action
          : typeof record.title === "string"
            ? record.title
            : typeof record.recommendation === "string"
              ? record.recommendation
              : "";

      if (!action) {
        return null;
      }

      const category =
        typeof record.category === "string"
          ? record.category
          : typeof record.type === "string"
            ? record.type
            : "seo";

      const expectedImpact =
        typeof record.expectedImpact === "string"
          ? record.expectedImpact
          : typeof record.expected_impact === "string"
            ? record.expected_impact
            : typeof record.impact === "string"
              ? record.impact
              : "";

      return {
        category,
        action,
        expectedImpact,
      };
    })
    .filter((item): item is { category: string; action: string; expectedImpact: string } => item !== null);
}

/* Lighthouse's own colour bands: 90+ good, 50-89 needs improvement. */
function scoreClasses(score: number | null) {
  if (score === null) return "border-white/20 text-gray-400";
  if (score >= 90) return "border-emerald-300/40 text-emerald-200";
  if (score >= 50) return "border-amber-300/40 text-amber-200";
  return "border-red-400/40 text-red-200";
}

function formatSeconds(ms: number | null) {
  return ms === null ? "-" : `${(ms / 1000).toFixed(1)}s`;
}

function formatMs(ms: number | null) {
  return ms === null ? "-" : `${Math.round(ms)}ms`;
}

function formatCls(value: number | null) {
  return value === null ? "-" : value.toFixed(2);
}

function PageSpeedPanel({ result }: { result: PageSpeedResult }) {
  const scores: Array<[string, number | null]> = [
    ["Performance", result.performanceScore],
    ["Accessibility", result.accessibilityScore],
    ["Best Practices", result.bestPracticesScore],
    ["SEO", result.seoScore],
  ];
  const labMetrics: Array<[string, string]> = [
    ["First Contentful Paint", formatSeconds(result.lab.firstContentfulPaintMs)],
    ["Largest Contentful Paint", formatSeconds(result.lab.largestContentfulPaintMs)],
    ["Total Blocking Time", formatMs(result.lab.totalBlockingTimeMs)],
    ["Speed Index", formatSeconds(result.lab.speedIndexMs)],
    ["Cumulative Layout Shift", formatCls(result.lab.cumulativeLayoutShift)],
  ];

  return (
    <div className="border border-white/10 p-4 space-y-4">
      <p className="text-sm font-semibold text-white capitalize">{result.strategy}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {scores.map(([label, score]) => (
          <div key={label} className={`border p-3 ${scoreClasses(score)}`}>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">{label}</p>
            <p className="text-2xl font-heading font-bold">{score ?? "-"}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Lab Metrics</p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {labMetrics.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 border-b border-white/5 py-1">
              <dt className="text-gray-400">{label}</dt>
              <dd className="text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {result.field ? (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Real Visitors (Chrome UX Report){result.field.overallCategory ? `: ${result.field.overallCategory.toLowerCase()}` : ""}
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm">
            <div className="flex justify-between gap-3 border-b border-white/5 py-1">
              <dt className="text-gray-400">LCP</dt>
              <dd className="text-white">{formatSeconds(result.field.largestContentfulPaintMs)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-white/5 py-1">
              <dt className="text-gray-400">INP</dt>
              <dd className="text-white">{formatMs(result.field.interactionToNextPaintMs)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-white/5 py-1">
              <dt className="text-gray-400">CLS</dt>
              <dd className="text-white">{formatCls(result.field.cumulativeLayoutShift)}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="text-xs text-gray-500">No real-visitor data. The site doesn&apos;t get enough Chrome traffic for Google to report it.</p>
      )}
      {result.opportunities.length > 0 ? (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Biggest Opportunities</p>
          <ul className="space-y-1 text-sm text-gray-300">
            {result.opportunities.map((opportunity) => (
              <li key={opportunity.title} className="flex justify-between gap-3">
                <span>{opportunity.title}</span>
                <span className="text-gray-500 shrink-0">~{formatSeconds(opportunity.savingsMs)} saved</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function PageSpeedSection({ pageSpeed }: { pageSpeed: PageSpeedSummary | undefined }) {
  if (!pageSpeed) {
    return (
      <article className="border border-white/10 p-6 bg-black space-y-2">
        <p className="text-xs uppercase tracking-widest text-gray-500">Google PageSpeed</p>
        <p className="text-sm text-gray-400">This analysis ran before PageSpeed was added. Run Analyze Website again to include it.</p>
      </article>
    );
  }

  const results = [pageSpeed.mobile, pageSpeed.desktop].filter(
    (result): result is PageSpeedResult => result !== null,
  );

  return (
    <article className="border border-white/10 p-6 bg-black space-y-4">
      <p className="text-xs uppercase tracking-widest text-gray-500">Google PageSpeed</p>
      {pageSpeed.error ? <p className="text-sm text-amber-200">PageSpeed issue: {pageSpeed.error}</p> : null}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {results.map((result) => (
            <PageSpeedPanel key={result.strategy} result={result} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default async function LeadAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead, latestAudit] = await Promise.all([
    getLeadById(id),
    getLatestLeadAudit(id),
  ]);

  if (!lead) {
    notFound();
  }

  const normalizedRecommendations = normalizeRecommendations(latestAudit?.recommendations);

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-8">
        <div className="border border-white/10 p-6 bg-black">
          <Link href={`/admin/leads/${lead.id}`} className="text-xs uppercase tracking-widest text-gray-400 hover:text-white">
            ← Back to Lead Workbench
          </Link>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mt-5 mb-2">Detailed Analysis</p>
          <h1 className="text-4xl font-heading font-bold text-white">{lead.company_name || lead.name}</h1>
          <p className="text-sm text-gray-400 mt-2">{lead.website_url}</p>
        </div>

        {!latestAudit ? (
          <div className="border border-white/10 p-6 bg-black text-sm text-gray-400">
            No analysis found yet. Return to the workbench and run Analyze Website.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <article className="border border-white/10 p-4 bg-black">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Score</p>
                <p className="text-3xl font-heading font-bold text-white">{latestAudit.score ?? "-"}/100</p>
              </article>
              <article className="border border-white/10 p-4 bg-black">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Issues</p>
                <p className="text-3xl font-heading font-bold text-white">{latestAudit.seo_issues?.length ?? 0}</p>
              </article>
              <article className="border border-white/10 p-4 bg-black">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Recommendations</p>
                <p className="text-3xl font-heading font-bold text-white">{normalizedRecommendations.length}</p>
              </article>
              <article className="border border-white/10 p-4 bg-black">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Captured</p>
                <p className="text-sm text-gray-300">{new Date(latestAudit.created_at).toLocaleString()}</p>
              </article>
            </div>

            <article className="border border-white/10 p-6 bg-black space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-500">Executive Summary</p>
              <p className="text-sm text-gray-300 leading-relaxed">{latestAudit.executive_summary || "No summary provided."}</p>
            </article>

            <PageSpeedSection pageSpeed={latestAudit.crawl_snapshot?.pageSpeed} />

            {Array.isArray(latestAudit.strengths) && latestAudit.strengths.length > 0 ? (
              <article className="border border-white/10 p-6 bg-black space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-500">Strengths</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  {latestAudit.strengths.map((strength, index) => (
                    <li key={`${strength}-${index}`}>• {strength}</li>
                  ))}
                </ul>
              </article>
            ) : null}

            {Array.isArray(latestAudit.seo_issues) && latestAudit.seo_issues.length > 0 ? (
              <article className="border border-white/10 p-6 bg-black space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-500">Issues Found</p>
                <div className="space-y-3">
                  {latestAudit.seo_issues.map((issue, index) => (
                    <div key={`${issue.title}-${index}`} className="border border-white/10 p-4 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-white">{issue.title}</h3>
                        <span className={`px-2 py-1 text-[10px] uppercase tracking-widest border ${severityClasses(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-gray-500">Why It Matters</p>
                      <p className="text-sm text-gray-300">{issue.whyItMatters}</p>
                      <p className="text-xs uppercase tracking-widest text-gray-500">Recommendation</p>
                      <p className="text-sm text-gray-300">{issue.recommendation}</p>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            {normalizedRecommendations.length > 0 ? (
              <article className="border border-white/10 p-6 bg-black space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-500">Recommendations</p>
                <div className="space-y-3">
                  {normalizedRecommendations.map((recommendation, index) => (
                    <div key={`${recommendation.action}-${index}`} className="border border-white/10 p-4 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-white">{recommendation.action}</h3>
                        <span className="px-2 py-1 text-[10px] uppercase tracking-widest border border-cyan-300/40 text-cyan-200">
                          {recommendation.category}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-gray-500">Expected Impact</p>
                      <p className="text-sm text-gray-300">{recommendation.expectedImpact || "Impact details were not provided."}</p>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            {latestAudit.full_report_markdown ? (
              <article className="border border-white/10 p-6 bg-black space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-500">Full Report</p>
                <pre className="text-xs leading-relaxed text-gray-300 whitespace-pre-wrap">
                  {latestAudit.full_report_markdown}
                </pre>
              </article>
            ) : null}

            <div className="flex flex-wrap gap-3 mt-6">
              {latestAudit.screenshot_url ? (
                <Link href={latestAudit.screenshot_url} target="_blank" className="px-4 py-3 border border-white/20 text-xs uppercase tracking-widest text-white hover:bg-white/5">
                  Open Captured Screenshot
                </Link>
              ) : null}
              <Link href={`/admin/leads/${lead.id}`} className="px-4 py-3 border border-white/20 text-xs uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5">
                Back to Workbench
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
