import { isGooglePlacesConfigured, searchGooglePlaces } from "@/lib/lead-finder/google-places";
import {
  getProspectById,
  insertProspects,
  listProspectSearches,
  updateProspect,
  updateProspectSearch,
} from "@/lib/lead-finder/repository";
import { scoreProspect } from "@/lib/lead-finder/scoring";
import { checkSite, hostnameOf, isSocialOrDirectoryUrl } from "@/lib/lead-finder/site-check";
import type {
  LeadProspectRecord,
  LeadProspectSearchRecord,
  ProspectCandidate,
  ProspectSearchRunResult,
  ProspectSource,
} from "@/lib/lead-finder/types";
import { searchWebForProspects } from "@/lib/lead-finder/web-search";
import { createLead } from "@/lib/leads/repository";
import { slugify } from "@/lib/leads/utils";

const SITE_CHECK_CONCURRENCY = 6;
/** Saved searches re-run at most this often by the scheduled job. */
const SEARCH_RERUN_INTERVAL_MS = 20 * 60 * 60 * 1000;
/** Keep each scheduled invocation inside the serverless time limit. */
const MAX_SEARCHES_PER_SCHEDULED_RUN = 3;

export function availableSources(): Record<ProspectSource, boolean> {
  return {
    google_places: isGooglePlacesConfigured(),
    web_search: Boolean(process.env.ANTHROPIC_API_KEY),
  };
}

export async function runProspectSearch(args: {
  query: string;
  location: string;
  sources: ProspectSource[];
  searchId?: string | null;
}): Promise<ProspectSearchRunResult> {
  const errors: string[] = [];
  const available = availableSources();
  const sources = args.sources.filter((source) => {
    if (available[source]) return true;
    errors.push(
      source === "google_places"
        ? "Google Places skipped: GOOGLE_PLACES_API_KEY is not set."
        : "Web search skipped: ANTHROPIC_API_KEY is not set."
    );
    return false;
  });

  const settled = await Promise.allSettled(
    sources.map((source) =>
      source === "google_places"
        ? searchGooglePlaces({ query: args.query, location: args.location })
        : searchWebForProspects({ query: args.query, location: args.location })
    )
  );

  const candidates: ProspectCandidate[] = [];
  settled.forEach((result, index) => {
    if (result.status === "fulfilled") candidates.push(...result.value);
    else errors.push(`${sources[index]}: ${result.reason instanceof Error ? result.reason.message : "failed"}`);
  });

  // Collapse duplicates found by both sources before spending time on site checks.
  const unique = new Map<string, ProspectCandidate>();
  for (const candidate of candidates) {
    const key = dedupeKeyFor(candidate, args.location);
    const existing = unique.get(key);
    unique.set(key, existing ? mergeCandidates(existing, candidate) : candidate);
  }

  const entries = [...unique.entries()];
  const rows = await mapWithConcurrency(entries, SITE_CHECK_CONCURRENCY, async ([dedupeKey, candidate]) => {
    const site = await checkSite(candidate.websiteUrl);
    const { score, reasons } = scoreProspect(candidate, site);

    return {
      search_id: args.searchId ?? null,
      source: candidate.source,
      dedupe_key: dedupeKey,
      business_name: candidate.businessName,
      website_url: candidate.websiteUrl,
      domain: isSocialOrDirectoryUrl(candidate.websiteUrl) ? null : hostnameOf(candidate.websiteUrl),
      category: candidate.category,
      location: candidate.location,
      address: candidate.address,
      phone: candidate.phone,
      email: candidate.email,
      source_url: candidate.sourceUrl,
      google_place_id: candidate.googlePlaceId,
      rating: candidate.rating,
      review_count: candidate.reviewCount,
      intent_signal: candidate.intentSignal,
      score,
      score_reasons: reasons,
      site_check: site,
    };
  });

  const inserted = await insertProspects(rows);
  return {
    candidates: rows.length,
    inserted,
    duplicates: rows.length - inserted,
    errors,
  };
}

/** Runs a saved search and records the outcome on it. */
export async function runSavedSearch(search: LeadProspectSearchRecord): Promise<ProspectSearchRunResult> {
  try {
    const result = await runProspectSearch({
      query: search.query,
      location: search.location,
      sources: search.sources,
      searchId: search.id,
    });
    await updateProspectSearch(search.id, {
      last_run_at: new Date().toISOString(),
      last_run_found: result.inserted,
      last_run_error: result.errors.length > 0 ? result.errors.join(" ") : null,
    });
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed.";
    await updateProspectSearch(search.id, {
      last_run_at: new Date().toISOString(),
      last_run_found: 0,
      last_run_error: message,
    });
    throw error;
  }
}

/** Runs the active saved searches that are due, oldest first. Called by the scheduled job. */
export async function runDueSavedSearches(now = Date.now()) {
  const searches = await listProspectSearches();
  const due = searches
    .filter(
      (search) =>
        search.is_active &&
        (!search.last_run_at || now - new Date(search.last_run_at).getTime() >= SEARCH_RERUN_INTERVAL_MS)
    )
    .sort((a, b) => (a.last_run_at ?? "").localeCompare(b.last_run_at ?? ""))
    .slice(0, MAX_SEARCHES_PER_SCHEDULED_RUN);

  const results = [];
  for (const search of due) {
    try {
      results.push({ searchId: search.id, ...(await runSavedSearch(search)) });
    } catch (error) {
      results.push({ searchId: search.id, error: error instanceof Error ? error.message : "Search failed." });
    }
  }
  return results;
}

/** Turns a prospect into a lead in the existing workbench and links the two. */
export async function promoteProspect(id: string) {
  const prospect = await getProspectById(id);
  if (!prospect) throw new Error("Prospect not found.");
  if (prospect.lead_id) return { prospect, leadId: prospect.lead_id };

  const websiteUrl = prospect.website_url ?? prospect.source_url;
  if (!websiteUrl) {
    throw new Error("This prospect has no website or source link to attach to a lead.");
  }

  const lead = await createLead({
    name: prospect.business_name,
    company_name: prospect.business_name,
    website_url: websiteUrl,
    industry: prospect.category,
    contact_email: prospect.email,
    contact_phone: prospect.phone,
    location: prospect.address ?? prospect.location,
    notes: buildLeadNotes(prospect),
    status: "new",
  });

  const updated = await updateProspect(id, { status: "promoted", lead_id: lead.id });
  return { prospect: updated, leadId: lead.id };
}

function buildLeadNotes(prospect: LeadProspectRecord): string {
  const sourceLabel = prospect.source === "google_places" ? "Google Places" : "web search";
  const lines = [
    `Found by Lead Finder via ${sourceLabel}. Score ${prospect.score}/100.`,
    ...(prospect.website_url ? [] : ["No website found; the website field links to where the business was found."]),
    "Why it scored:",
    ...prospect.score_reasons.map((reason) => `- ${reason.signal}`),
  ];
  if (prospect.source_url) lines.push(`Source: ${prospect.source_url}`);
  return lines.join("\n");
}

function dedupeKeyFor(candidate: ProspectCandidate, searchLocation: string): string {
  if (candidate.websiteUrl && !isSocialOrDirectoryUrl(candidate.websiteUrl)) {
    const domain = hostnameOf(candidate.websiteUrl);
    if (domain) return `domain:${domain}`;
  }
  return `name:${slugify(candidate.businessName)}|${slugify(searchLocation)}`;
}

function mergeCandidates(a: ProspectCandidate, b: ProspectCandidate): ProspectCandidate {
  return {
    ...a,
    websiteUrl: a.websiteUrl ?? b.websiteUrl,
    address: a.address ?? b.address,
    phone: a.phone ?? b.phone,
    email: a.email ?? b.email,
    googlePlaceId: a.googlePlaceId ?? b.googlePlaceId,
    rating: a.rating ?? b.rating,
    reviewCount: a.reviewCount ?? b.reviewCount,
    intentSignal: a.intentSignal ?? b.intentSignal,
    intentStrength: a.intentStrength ?? b.intentStrength,
    sourceUrl: a.sourceUrl ?? b.sourceUrl,
  };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function run() {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}
