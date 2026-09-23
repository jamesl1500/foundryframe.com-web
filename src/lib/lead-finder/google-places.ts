import type { ProspectCandidate } from "@/lib/lead-finder/types";

const PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.primaryTypeDisplayName",
  "places.businessStatus",
  "nextPageToken",
].join(",");

type PlacesResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    websiteUri?: string;
    nationalPhoneNumber?: string;
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    primaryTypeDisplayName?: { text?: string };
    businessStatus?: string;
  }>;
  nextPageToken?: string;
  error?: { message?: string };
};

export function isGooglePlacesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

/**
 * Finds local businesses for "<query> in <location>" with the Places API (New) Text Search.
 * Returns up to `maxResults` operational businesses, including ones that list no website.
 */
export async function searchGooglePlaces(args: {
  query: string;
  location: string;
  maxResults?: number;
}): Promise<ProspectCandidate[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is missing. Add it to search Google Places.");
  }

  const maxResults = args.maxResults ?? 40;
  const candidates: ProspectCandidate[] = [];
  let pageToken: string | undefined;

  do {
    const response = await fetch(PLACES_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: `${args.query} in ${args.location}`,
        pageSize: 20,
        ...(pageToken ? { pageToken } : {}),
      }),
      cache: "no-store",
    });

    const body = (await response.json()) as PlacesResponse;
    if (!response.ok) {
      throw new Error(`Google Places search failed: ${body.error?.message ?? response.statusText}`);
    }

    for (const place of body.places ?? []) {
      const name = place.displayName?.text?.trim();
      if (!name || (place.businessStatus && place.businessStatus !== "OPERATIONAL")) continue;

      candidates.push({
        source: "google_places",
        businessName: name,
        websiteUrl: place.websiteUri ?? null,
        category: place.primaryTypeDisplayName?.text ?? args.query,
        location: args.location,
        address: place.formattedAddress ?? null,
        phone: place.nationalPhoneNumber ?? null,
        email: null,
        sourceUrl: place.googleMapsUri ?? null,
        googlePlaceId: place.id ?? null,
        rating: typeof place.rating === "number" ? place.rating : null,
        reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
        intentSignal: null,
        intentStrength: null,
      });
    }

    pageToken = body.nextPageToken;
  } while (pageToken && candidates.length < maxResults);

  return dropChains(candidates).slice(0, maxResults);
}

/** Chains and franchises share one corporate domain across locations; they aren't small-business leads. */
function dropChains(candidates: ProspectCandidate[]): ProspectCandidate[] {
  const domainCounts = new Map<string, number>();
  for (const candidate of candidates) {
    const domain = hostnameOf(candidate.websiteUrl);
    if (domain) domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
  }

  return candidates.filter((candidate) => {
    const domain = hostnameOf(candidate.websiteUrl);
    return !domain || (domainCounts.get(domain) ?? 0) < 2;
  });
}

function hostnameOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
