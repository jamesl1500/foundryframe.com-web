import { PROSPECT_SOURCES, type ProspectSource } from "@/lib/lead-finder/types";

export function parseSearchInput(body: Record<string, unknown>):
  | { query: string; location: string; sources: ProspectSource[] }
  | { error: string } {
  const query = String(body.query ?? "").trim().slice(0, 120);
  const location = String(body.location ?? "").trim().slice(0, 120);
  const sources = Array.isArray(body.sources)
    ? PROSPECT_SOURCES.filter((source) => (body.sources as unknown[]).includes(source))
    : PROSPECT_SOURCES;

  if (!query) return { error: "Enter the kind of business to look for." };
  if (!location) return { error: "Enter a city or region." };
  if (sources.length === 0) return { error: "Pick at least one source." };

  return { query, location, sources };
}
