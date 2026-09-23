export type ProspectSource = "google_places" | "web_search";

export const PROSPECT_SOURCES: ProspectSource[] = ["google_places", "web_search"];

export type ProspectStatus = "new" | "saved" | "dismissed" | "promoted";

export const PROSPECT_STATUSES: ProspectStatus[] = ["new", "saved", "dismissed", "promoted"];

export type ScoreReason = {
  signal: string;
  points: number;
};

/** Result of the lightweight HTTP check run against a prospect's website. */
export type SiteCheck = {
  checkedUrl: string | null;
  reachable: boolean;
  /** The site refused an automated request (bot protection), so its quality is unknown. */
  blocked: boolean;
  statusCode: number | null;
  finalUrl: string | null;
  https: boolean;
  responseTimeMs: number | null;
  hasViewportMeta: boolean;
  hasMetaDescription: boolean;
  hasTitle: boolean;
  hasH1: boolean;
  copyrightYear: number | null;
  builder: string | null;
  looksParkedOrUnderConstruction: boolean;
  isSocialOrDirectoryProfile: boolean;
  error: string | null;
};

/** A business found by a source, before scoring and storage. */
export type ProspectCandidate = {
  source: ProspectSource;
  businessName: string;
  websiteUrl: string | null;
  category: string | null;
  location: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  sourceUrl: string | null;
  googlePlaceId: string | null;
  rating: number | null;
  reviewCount: number | null;
  intentSignal: string | null;
  intentStrength: "high" | "medium" | "low" | null;
};

export type LeadProspectRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  search_id: string | null;
  lead_id: string | null;
  source: ProspectSource;
  dedupe_key: string;
  business_name: string;
  website_url: string | null;
  domain: string | null;
  category: string | null;
  location: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  source_url: string | null;
  google_place_id: string | null;
  rating: number | null;
  review_count: number | null;
  intent_signal: string | null;
  score: number;
  score_reasons: ScoreReason[];
  site_check: SiteCheck | null;
  status: ProspectStatus;
};

export type LeadProspectSearchRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  query: string;
  location: string;
  sources: ProspectSource[];
  is_active: boolean;
  last_run_at: string | null;
  last_run_found: number | null;
  last_run_error: string | null;
};

export type ProspectSearchRunResult = {
  candidates: number;
  inserted: number;
  duplicates: number;
  errors: string[];
};
