import { generateAuditWithClaude, generateLandingPageWithClaude } from "@/lib/leads/claude";
import { crawlWebsiteWithPlaywright } from "@/lib/leads/playwright-analyzer";
import {
  buildLeadPageStoragePath,
  createGeneratedLeadPage,
  createLeadAudit,
  getLatestLeadAudit,
  listPublishedPackagesForLeads,
  mapLandingPayloadColumns,
  updateLead,
  uploadLeadAuditScreenshot,
} from "@/lib/leads/repository";
import type { LeadRecord } from "@/lib/leads/types";
import { slugify } from "@/lib/leads/utils";

export async function analyzeLeadWebsite(lead: LeadRecord) {
  const crawlResult = await crawlWebsiteWithPlaywright(lead.website_url);
  const audit = await generateAuditWithClaude(crawlResult.snapshot);

  const screenshotPath = buildLeadPageStoragePath(lead.id);
  const screenshotUrl = await uploadLeadAuditScreenshot(screenshotPath, crawlResult.screenshotBuffer);

  const auditRecord = await createLeadAudit({
    lead_id: lead.id,
    source_url: lead.website_url,
    analyzer: "playwright+claude",
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    status: "completed",
    screenshot_url: screenshotUrl,
    crawl_snapshot: crawlResult.snapshot,
    seo_issues: audit.issues,
    recommendations: audit.recommendations,
    strengths: audit.strengths,
    score: audit.score,
    executive_summary: audit.executiveSummary,
    full_report_markdown: audit.markdownReport,
    raw_model_output: audit.rawModelOutput,
    error_message: null,
  });

  await updateLead(lead.id, {
    status: "analysis_ready",
    last_analyzed_at: new Date().toISOString(),
  });

  return auditRecord;
}

export async function generateLeadLandingPage(lead: LeadRecord) {
  const latestAudit = await getLatestLeadAudit(lead.id);
  if (!latestAudit) {
    throw new Error("Analyze the lead website first before generating a landing page.");
  }

  const packageCatalog = await listPublishedPackagesForLeads();
  const aiOutput = await generateLandingPageWithClaude({
    lead,
    audit: {
      score: latestAudit.score ?? 0,
      executiveSummary: latestAudit.executive_summary ?? "",
      strengths: latestAudit.strengths ?? [],
      issues: latestAudit.seo_issues ?? [],
      recommendations: latestAudit.recommendations ?? [],
      markdownReport: latestAudit.full_report_markdown ?? "",
      rawModelOutput: latestAudit.raw_model_output ?? "",
    },
    packageCatalog,
  });

  const slug = `${slugify(lead.company_name || lead.name)}-${Date.now().toString(36)}`;

  const page = await createGeneratedLeadPage({
    lead_id: lead.id,
    status: "ready",
    generator: "claude",
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    slug,
    ...mapLandingPayloadColumns(aiOutput.payload),
    full_report_markdown: aiOutput.markdown,
    raw_model_output: aiOutput.rawModelOutput,
    error_message: null,
  });

  await updateLead(lead.id, {
    status: "proposal_generated",
    generated_page_slug: slug,
    last_generated_at: new Date().toISOString(),
  });

  return page;
}
