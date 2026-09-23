import Anthropic from "@anthropic-ai/sdk";
import type { ProspectCandidate } from "@/lib/lead-finder/types";

export const LEAD_FINDER_MODEL = process.env.LEAD_FINDER_MODEL || "claude-opus-5";
const MAX_CONTINUATIONS = 5;

type RawWebProspect = {
  businessName?: unknown;
  websiteUrl?: unknown;
  category?: unknown;
  location?: unknown;
  phone?: unknown;
  email?: unknown;
  sourceUrl?: unknown;
  intentSignal?: unknown;
  intentStrength?: unknown;
};

const SYSTEM_PROMPT = `You research sales prospects for Foundry Frame, a small web design and branding agency.
You use web search to find real small businesses and independent brands that show public evidence they need a new or better website.
Only report businesses you actually found in search results, with the URL where you found them. Never invent businesses, contacts, or URLs.
Only include business contact details that the business itself publishes (a business phone or a general inbox), never personal details of private individuals.
Skip national chains, franchises, and large companies.`;

/**
 * Uses Claude with the web search server tool to find businesses with buying signals, such as a new
 * opening, a "looking for a web designer" post, a request for proposals, or a visibly outdated site.
 */
export async function searchWebForProspects(args: {
  query: string;
  location: string;
  maxResults?: number;
}): Promise<ProspectCandidate[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is missing. Add it to run web search prospecting.");
  }

  const anthropic = new Anthropic({ apiKey });
  const maxResults = args.maxResults ?? 15;
  const prompt = `Find up to ${maxResults} small businesses or independent brands in the "${args.query}" space in or around ${args.location} that are likely to need a new website soon.

Strong signals, best first:
- They publicly asked for a web designer, website redesign, or posted a request for proposals.
- They recently opened, rebranded, expanded, or launched and have no real website yet (only a social profile or directory listing).
- Their website is visibly outdated, broken, not mobile friendly, or "coming soon".

Return only JSON in this exact shape, with no prose before or after it:
{
  "prospects": [
    {
      "businessName": string,
      "websiteUrl": string | null,
      "category": string | null,
      "location": string | null,
      "phone": string | null,
      "email": string | null,
      "sourceUrl": string,
      "intentSignal": string,
      "intentStrength": "high" | "medium" | "low"
    }
  ]
}

"sourceUrl" is the page where you found the signal. "intentSignal" is one sentence describing the evidence.
"websiteUrl" is the business's own site, or null if it has none.`;

  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: prompt }];
  let response: Anthropic.Beta.BetaMessage | null = null;

  for (let attempt = 0; attempt <= MAX_CONTINUATIONS; attempt++) {
    response = await anthropic.beta.messages.create({
      model: LEAD_FINDER_MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 12 }],
      messages,
    });

    if (response.stop_reason !== "pause_turn") break;
    // The server-side search loop paused; send the partial turn back so it resumes.
    messages.splice(1, messages.length - 1, { role: "assistant", content: response.content });
  }

  if (!response) return [];
  if (response.stop_reason === "refusal") {
    throw new Error("Web search prospecting was declined by the model.");
  }

  const text = response.content
    .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return parseProspects(text, args).slice(0, maxResults);
}

function parseProspects(
  text: string,
  args: { query: string; location: string }
): ProspectCandidate[] {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new Error("Web search prospecting did not return JSON.");
  }

  const parsed = JSON.parse(text.slice(start, end + 1)) as { prospects?: RawWebProspect[] };
  const prospects = Array.isArray(parsed.prospects) ? parsed.prospects : [];

  return prospects.flatMap((raw): ProspectCandidate[] => {
    const businessName = stringOrNull(raw.businessName);
    if (!businessName) return [];

    const intentStrength =
      raw.intentStrength === "high" || raw.intentStrength === "medium" || raw.intentStrength === "low"
        ? raw.intentStrength
        : null;

    return [
      {
        source: "web_search",
        businessName,
        websiteUrl: httpUrlOrNull(raw.websiteUrl),
        category: stringOrNull(raw.category) ?? args.query,
        location: stringOrNull(raw.location) ?? args.location,
        address: null,
        phone: stringOrNull(raw.phone),
        email: stringOrNull(raw.email),
        sourceUrl: httpUrlOrNull(raw.sourceUrl),
        googlePlaceId: null,
        rating: null,
        reviewCount: null,
        intentSignal: stringOrNull(raw.intentSignal),
        intentStrength,
      },
    ];
  });
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function httpUrlOrNull(value: unknown): string | null {
  const text = stringOrNull(value);
  if (!text) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
