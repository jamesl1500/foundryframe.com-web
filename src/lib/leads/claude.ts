import Anthropic from "@anthropic-ai/sdk";
import type {
  LandingPagePayload,
  LeadRecord,
  ProposalContent,
  ProposalLineItem,
  PublishedPackageReference,
  SiteAuditResult,
  SiteCrawlSnapshot,
} from "@/lib/leads/types";

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is missing. Add it to your environment to run analysis and generation.");
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
    .filter((item): item is Anthropic.Messages.TextBlock => item.type === "text")
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
      parseError: parseError instanceof Error ? parseError.message : "Unknown JSON parse error.",
      context: args.context,
    });

    return JSON.parse(repaired) as T;
  }
}

export async function generateAuditWithClaude(snapshot: SiteCrawlSnapshot): Promise<SiteAuditResult> {
  const anthropic = getAnthropicClient();

  const prompt = `Analyze this website crawl snapshot and produce a detailed SEO/UX/conversion audit in strict JSON.\n\nSnapshot JSON:\n${JSON.stringify(
    snapshot,
    null,
    2
  )}\n\nReturn JSON with exact shape:\n{\n  "score": number (0-100),\n  "executiveSummary": string,\n  "strengths": string[],\n  "issues": [{"title": string, "severity": "high"|"medium"|"low", "whyItMatters": string, "recommendation": string}],\n  "recommendations": [{"category": "seo"|"performance"|"ux"|"conversion"|"content", "action": string, "expectedImpact": string}],\n  "markdownReport": string\n}\n\nRules:\n- At least 8 issues and 10 recommendations.\n- Mention technical SEO, on-page SEO, UX hierarchy, conversion friction, trust signals, and content structure.\n- Make recommendations specific and implementation-ready.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 3000,
    system:
      "You are a senior SEO strategist and CRO specialist for agency pre-sales audits. Return only valid JSON with no markdown fences.",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = extractTextFromResponse(message);
  const parsed = await parseJsonObjectWithRepair<Omit<SiteAuditResult, "rawModelOutput">>({
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
}): Promise<{ payload: LandingPagePayload; markdown: string; rawModelOutput: string }> {
  const anthropic = getAnthropicClient();

  const prompt = `Create a high-conviction sales landing page blueprint for a lead, based on their site audit and offered packages.\n\nLead:\n${JSON.stringify(
    args.lead,
    null,
    2
  )}\n\nAudit:\n${JSON.stringify(args.audit, null, 2)}\n\nPackage catalog:\n${JSON.stringify(
    args.packageCatalog,
    null,
    2
  )}\n\nReturn strict JSON in this exact shape:\n{\n  "pageTitle": string,\n  "heroHeadline": string,\n  "heroSubheadline": string,\n  "analysisHighlights": string[],\n  "seoWins": string[],\n  "packageRecommendations": [{\n    "packageName": string,\n    "rationale": string,\n    "estimatedInvestment": string,\n    "deliverables": string[],\n    "timeline": string\n  }],\n  "sections": [{"title": string, "body": string, "bullets": string[]}],\n  "closingHeadline": string,\n  "closingCopy": string,\n  "primaryCtaText": string,\n  "visualDirection": {\n    "palette": string[],\n    "typographyNotes": string,\n    "layoutNotes": string\n  },\n  "modelNotes": string\n}\n\nRules:\n- Recommend 2-3 package options matched to lead maturity.\n- Sections should map to problems found in audit and explain before/after outcomes.\n- Keep tone premium, clear, and specific, not generic AI phrasing.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
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
      (pkg) => `### ${pkg.packageName}\n- Why: ${pkg.rationale}\n- Investment: ${pkg.estimatedInvestment}\n- Timeline: ${pkg.timeline}\n- Deliverables:\n${pkg.deliverables.map((entry) => `  - ${entry}`).join("\n")}`
    )
    .join("\n\n")}\n\n${markdownSections}\n\n## Closing CTA\n\n${payload.closingHeadline}\n\n${payload.closingCopy}`;

  return {
    payload,
    markdown,
    rawModelOutput: raw,
  };
}
