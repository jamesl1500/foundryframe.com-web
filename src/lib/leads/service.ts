import {
  generateAuditWithClaude,
  generateLandingPageWithClaude,
  generateProposalWithClaude,
} from "@/lib/leads/claude";
import { crawlWebsiteWithPlaywright } from "@/lib/leads/playwright-analyzer";
import {
  buildLeadPageStoragePath,
  createGeneratedLeadPage,
  createLeadAudit,
  createLeadProposal,
  getLatestLeadAudit,
  listPublishedPackagesForLeads,
  mapLandingPayloadColumns,
  updateLead,
  uploadLeadAuditScreenshot,
} from "@/lib/leads/repository";
import type { LeadRecord, ProposalLineItem } from "@/lib/leads/types";
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

export async function generateLeadProposal(args: {
  lead: LeadRecord;
  projectBrief: string;
  items: ProposalLineItem[];
  timelineWeeks: number;
  depositPercent: number;
  discount: number;
  instructions: string;
}) {
  const subtotal = args.items.reduce((sum, item) => sum + item.price, 0);
  const discount = Math.min(args.discount, subtotal);
  const total = subtotal - discount;
  const aiOutput = await generateProposalWithClaude({
    lead: args.lead,
    projectBrief: args.projectBrief,
    items: args.items,
    timelineWeeks: args.timelineWeeks,
    instructions: args.instructions,
  });
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  const proposal = await createLeadProposal({
    lead_id: args.lead.id,
    status: "ready",
    title: aiOutput.content.projectTitle,
    prepared_for: args.lead.company_name || args.lead.name,
    contact_name: args.lead.name,
    project_brief: args.projectBrief,
    selected_items: args.items,
    proposal_content: aiOutput.content,
    subtotal,
    discount,
    total,
    deposit_percent: args.depositPercent,
    timeline_weeks: args.timelineWeeks,
    valid_until: validUntil.toISOString().slice(0, 10),
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    raw_model_output: aiOutput.rawModelOutput,
  });

  await updateLead(args.lead.id, {
    status: "proposal_generated",
    last_generated_at: new Date().toISOString(),
  });

  return proposal;
}
