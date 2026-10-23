import Anthropic from "@anthropic-ai/sdk";
import type {
  LandingPagePayload,
  LeadAuditRecord,
  LeadGeneratedPageRecord,
  LeadRecord,
  OutreachEmailDraft,
  ProposalContent,
  ProposalLineItem,
  PublishedPackageReference,
  SiteAuditResult,
  SiteCrawlSnapshot,
} from "@/lib/leads/types";

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is missing. Add it to your environment to run analysis and generation.",
    );
  }

  return new Anthropic({ apiKey });
}

export async function generateProposalWithClaude(args: {
  lead: LeadRecord;
  projectBrief: string;
  items: ProposalLineItem[];
  timelineWeeks: number;
  instructions: string;
}): Promise<{ content: ProposalContent; rawModelOutput: string }> {
  const anthropic = getAnthropicClient();
  const prompt = `Create the strategic copy for a Foundry Frame client proposal using the supplied facts.

Lead:
${JSON.stringify(args.lead, null, 2)}

Project brief:
${args.projectBrief}

Selected scope:
${JSON.stringify(args.items, null, 2)}

Timeline: ${args.timelineWeeks} weeks
Additional direction: ${args.instructions || "None"}

Return strict JSON with this exact shape:
{
  "projectTitle": string,
  "opportunity": string,
  "recommendation": string,
  "objectives": string[],
  "scopeSummary": string,
  "timeline": [{"name": string, "weeks": string, "description": string}],
  "nextSteps": string
}

Rules:
- Use only the supplied client, scope, deliverable, and timeline facts.
- Do not invent metrics, guarantees, prices, services, legal terms, or client claims.
- Make the plan specific, concise, and ready to show a client.
- Timeline phases must fit within the supplied total timeline.
- Do not write contract clauses; the agreement is assembled separately from approved boilerplate.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 2500,
    cache_control: { type: "ephemeral" },
    system:
      "You are Foundry Frame's senior agency strategist. Return only valid JSON with no markdown fences or prose outside JSON.",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = extractTextFromResponse(message);
  const content = await parseJsonObjectWithRepair<ProposalContent>({
    anthropic,
    raw,
    context: "client proposal plan",
  });

  return { content, rawModelOutput: raw };
}

function extractTextFromResponse(response: Anthropic.Messages.Message): string {
  return response.content
    .filter(
      (item): item is Anthropic.Messages.TextBlock => item.type === "text",
    )
    .map((item) => item.text)
    .join("\n")
    .trim();
}

function extractJsonCandidate(raw: string): string {
  const withoutCodeFence = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const firstBrace = withoutCodeFence.indexOf("{");
  const lastBrace = withoutCodeFence.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Model response did not contain valid JSON.");
  }

  return withoutCodeFence.slice(firstBrace, lastBrace + 1);
}

async function repairMalformedJsonWithClaude(args: {
  anthropic: Anthropic;
  malformed: string;
  parseError: string;
  context: string;
}): Promise<string> {
  const repairMessage = await args.anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 3500,
    system:
      "You fix malformed JSON. Return only valid JSON with no markdown fences, comments, or prose.",
    messages: [
      {
        role: "user",
        content: `Repair the malformed JSON for ${args.context}. Keep the same structure and fields.\n\nParse error:\n${args.parseError}\n\nMalformed JSON:\n${args.malformed}`,
      },
    ],
  });

  const repairedRaw = extractTextFromResponse(repairMessage);
  return extractJsonCandidate(repairedRaw);
}

function parseJsonObject<T>(raw: string): T {
  const candidate = extractJsonCandidate(raw);
  return JSON.parse(candidate) as T;
}

async function parseJsonObjectWithRepair<T>(args: {
  anthropic: Anthropic;
  raw: string;
  context: string;
}): Promise<T> {
  try {
    return parseJsonObject<T>(args.raw);
  } catch (parseError) {
    const repaired = await repairMalformedJsonWithClaude({
      anthropic: args.anthropic,
      malformed: args.raw,
      parseError:
        parseError instanceof Error
          ? parseError.message
          : "Unknown JSON parse error.",
      context: args.context,
    });

    return JSON.parse(repaired) as T;
  }
}

export async function generateAuditWithClaude(
  snapshot: SiteCrawlSnapshot,
): Promise<SiteAuditResult> {
  const anthropic = getAnthropicClient();

  const prompt = `Analyze this website crawl snapshot and produce a detailed SEO/UX/conversion audit in strict JSON.\n\nSnapshot JSON:\n${JSON.stringify(
    snapshot,
    null,
    2,
  )}\n\nReturn JSON with exact shape:\n{\n  "score": number (0-100),\n  "executiveSummary": string,\n  "strengths": string[],\n  "issues": [{"title": string, "severity": "high"|"medium"|"low", "whyItMatters": string, "recommendation": string}],\n  "recommendations": [{"category": "seo"|"performance"|"ux"|"conversion"|"content", "action": string, "expectedImpact": string}],\n  "markdownReport": string\n}\n\nRules:\n- At least 8 issues and 10 recommendations.\n- Mention technical SEO, on-page SEO, UX hierarchy, conversion friction, trust signals, and content structure.\n- Make recommendations specific and implementation-ready.\n- If snapshot.pageSpeed has mobile/desktop results, base performance findings on those Google PageSpeed (Lighthouse) scores, Core Web Vitals, and opportunities, quoting the real numbers (mobile first). Prefer field data (real visitors) over lab data when present. Treat loadTimeMs as a rough secondary signal.\n- If snapshot.pageSpeed is missing or has an error, don't invent PageSpeed numbers.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 3000,
    cache_control: { type: "ephemeral" },
    system:
      "You are a senior SEO strategist and CRO specialist for agency pre-sales audits. Return only valid JSON with no markdown fences.",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = extractTextFromResponse(message);
  const parsed = await parseJsonObjectWithRepair<
    Omit<SiteAuditResult, "rawModelOutput">
  >({
    anthropic,
    raw,
    context: "SEO and CRO audit output",
  });

  return {
    ...parsed,
    rawModelOutput: raw,
  };
}

export async function generateLandingPageWithClaude(args: {
  lead: LeadRecord;
  audit: SiteAuditResult;
  packageCatalog: PublishedPackageReference[];
}): Promise<{
  payload: LandingPagePayload;
  markdown: string;
  rawModelOutput: string;
}> {
  const anthropic = getAnthropicClient();

  const prompt = `Create a high-conviction sales landing page blueprint for a lead, based on their site audit and offered packages.\n\nLead:\n${JSON.stringify(
    args.lead,
    null,
    2,
  )}\n\nAudit:\n${JSON.stringify(args.audit, null, 2)}\n\nPackage catalog:\n${JSON.stringify(
    args.packageCatalog,
    null,
    2,
  )}\n\nReturn strict JSON in this exact shape:\n{\n  "pageTitle": string,\n  "heroHeadline": string,\n  "heroSubheadline": string,\n  "analysisHighlights": string[],\n  "seoWins": string[],\n  "packageRecommendations": [{\n    "packageName": string,\n    "rationale": string,\n    "estimatedInvestment": string,\n    "deliverables": string[],\n    "timeline": string\n  }],\n  "sections": [{"title": string, "body": string, "bullets": string[]}],\n  "closingHeadline": string,\n  "closingCopy": string,\n  "primaryCtaText": string,\n  "visualDirection": {\n    "palette": string[],\n    "typographyNotes": string,\n    "layoutNotes": string\n  },\n  "modelNotes": string\n}\n\nRules:\n- Recommend 2-3 package options matched to lead maturity.\n- Sections should map to problems found in audit and explain before/after outcomes.\n- Keep tone premium, clear, and specific, not generic AI phrasing.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    cache_control: { type: "ephemeral" },
    max_tokens: 3500,
    system:
      "You are an elite web strategy consultant and conversion copywriter. Return only valid JSON and no prose outside JSON.",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = extractTextFromResponse(message);
  const payload = await parseJsonObjectWithRepair<LandingPagePayload>({
    anthropic,
    raw,
    context: "lead landing page generation output",
  });

  const markdownSections = payload.sections
    .map((section) => {
      const bullets = section.bullets.map((item) => `- ${item}`).join("\n");
      return `## ${section.title}\n\n${section.body}\n\n${bullets}`;
    })
    .join("\n\n");

  const markdown = `# ${payload.pageTitle}\n\n## Hero\n\n${payload.heroHeadline}\n\n${payload.heroSubheadline}\n\n## Recommended Packages\n\n${payload.packageRecommendations
    .map(
      (pkg) =>
        `### ${pkg.packageName}\n- Why: ${pkg.rationale}\n- Investment: ${pkg.estimatedInvestment}\n- Timeline: ${pkg.timeline}\n- Deliverables:\n${pkg.deliverables.map((entry) => `  - ${entry}`).join("\n")}`,
    )
    .join(
      "\n\n",
    )}\n\n${markdownSections}\n\n## Closing CTA\n\n${payload.closingHeadline}\n\n${payload.closingCopy}`;

  return {
    payload,
    markdown,
    rawModelOutput: raw,
  };
}

export async function generateOutreachEmailWithClaude(args: {
  lead: LeadRecord;
  audit: LeadAuditRecord;
  page: LeadGeneratedPageRecord | null;
  previewUrl: string | null;
}): Promise<OutreachEmailDraft> {
  const anthropic = getAnthropicClient();
  const topIssues = (args.audit.seo_issues ?? [])
    .slice()
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
    .slice(0, 5);

  const prompt = `Write a first-touch cold email from James Latten at Foundry Frame (a web design agency) to this business, based on the website audit we ran on their site${
    args.page ? " and the custom landing page concept we built for them" : ""
  }.

Lead:
${JSON.stringify(
  {
    contactName: args.lead.name,
    company: args.lead.company_name,
    website: args.lead.website_url,
    industry: args.lead.industry,
    location: args.lead.location,
  },
  null,
  2,
)}

Audit:
${JSON.stringify(
  {
    score: args.audit.score,
    executiveSummary: args.audit.executive_summary,
    strengths: (args.audit.strengths ?? []).slice(0, 3),
    topIssues,
  },
  null,
  2,
)}
${
  args.page
    ? `
Landing page concept:
${JSON.stringify(
  {
    title: args.page.page_title,
    headline: args.page.hero_headline,
    subheadline: args.page.hero_subheadline,
    packages: (args.page.package_recommendations ?? []).map((pkg) => pkg.packageName),
  },
  null,
  2,
)}
Preview link: ${args.previewUrl}
`
    : ""
}
Return strict JSON with this exact shape:
{
  "subject": string,
  "body": string
}

Rules:
- Plain text body, 120-180 words, short paragraphs separated by blank lines. No markdown, no bullet symbols other than "-".
- Greet the contact by first name if one is given, otherwise the company.
- Open with one genuine strength of their current site, then name 2-3 specific issues from the audit in plain language a business owner understands, and why each costs them customers.
${
  args.page
    ? "- Mention we put together a free concept page showing how their site could look and perform, and include the preview link on its own line exactly as given.\n"
    : ""
}- End with a low-pressure ask for a 15-minute call this week.
- Sign off as:
James Latten
Foundry Frame
(216) 889-7822 | jlatten@foundryframe.com
- Subject under 60 characters, specific to their business, no clickbait or all caps.
- Do not invent metrics, prices, guarantees, or facts not in the supplied data. Do not mention the numeric audit score.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1200,
    system:
      "You are a friendly, direct small-agency founder writing personal outreach emails. Return only valid JSON with no markdown fences or prose outside JSON.",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = extractTextFromResponse(message);
  return parseJsonObjectWithRepair<OutreachEmailDraft>({
    anthropic,
    raw,
    context: "client outreach email",
  });
}

function severityRank(severity: string): number {
  return severity === "high" ? 0 : severity === "medium" ? 1 : 2;
}
