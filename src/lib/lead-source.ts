/**
 * Lead Source - Foundry Frame
 * =============================
 * Where a visitor came from (UTM tags, ad click IDs, referring site, landing
 * page), so every lead can say which ad, post, or outreach email produced it.
 *
 * LeadSourceCapture (in the root layout) writes it to a first-party cookie
 * when a visitor lands; the form API routes read the cookie from the request,
 * so no form has to send it. A visit with UTM tags, a click ID, or an outside
 * referrer replaces the stored source (last non-direct touch); a direct visit
 * never overwrites one.
 *
 * Shared by the browser and the server, so nothing here touches Node APIs.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export const LEAD_SOURCE_COOKIE = "ff_src";
export const LEAD_SOURCE_MAX_AGE_DAYS = 90;

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/* Ad platform click IDs, in the order we prefer them when several are present. */
export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid"] as const;

const CLICK_ID_PLATFORMS: Record<(typeof CLICK_ID_KEYS)[number], string> = {
  gclid: "Google Ads",
  gbraid: "Google Ads",
  wbraid: "Google Ads",
  fbclid: "Facebook / Instagram",
  msclkid: "Microsoft Ads",
};

export type LeadSource = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  click_id_type?: (typeof CLICK_ID_KEYS)[number];
  click_id?: string;
  /** Host of the outside site that sent the visitor, e.g. "www.facebook.com". */
  referrer?: string;
  /** Path the visitor first landed on, without the query string. */
  landing_page?: string;
  /** ISO timestamp of the visit this source was recorded on. */
  captured_at?: string;
};

const TEXT_KEYS = [...UTM_KEYS, "referrer", "landing_page", "captured_at"] as const;
const MAX_TEXT = 120;
const MAX_CLICK_ID = 256;

function clean(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  // Printable ASCII only: these end up in emails and the admin.
  const trimmed = value.replace(/[^\x20-\x7E]/g, "").trim().slice(0, maxLength);
  return trimmed || undefined;
}

/** Keeps only known fields, trimmed to safe lengths. Returns null when nothing is left. */
export function sanitizeLeadSource(input: unknown): LeadSource | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const source: LeadSource = {};

  for (const key of TEXT_KEYS) {
    const value = clean(raw[key], MAX_TEXT);
    if (value) source[key] = value;
  }

  const clickIdType = (CLICK_ID_KEYS as readonly string[]).includes(String(raw.click_id_type))
    ? (raw.click_id_type as LeadSource["click_id_type"])
    : undefined;
  const clickId = clean(raw.click_id, MAX_CLICK_ID);
  if (clickIdType && clickId) {
    source.click_id_type = clickIdType;
    source.click_id = clickId;
  }

  return Object.keys(source).length > 0 ? source : null;
}

/** Parses the cookie value (URI-encoded JSON). */
export function parseLeadSourceCookie(value: string | undefined | null): LeadSource | null {
  if (!value) return null;
  try {
    return sanitizeLeadSource(JSON.parse(decodeURIComponent(value)));
  } catch {
    return null;
  }
}

export function serializeLeadSource(source: LeadSource): string {
  return encodeURIComponent(JSON.stringify(source));
}

/** True when the visit carries campaign data worth replacing a stored source with. */
export function isTrackedVisit(source: LeadSource) {
  return Boolean(source.utm_source || source.utm_medium || source.utm_campaign || source.click_id || source.referrer);
}

/** One line for emails and the admin, e.g. "facebook / paid_social / no-website-oct (Facebook / Instagram ad click)". */
export function describeLeadSource(source: LeadSource | null | undefined): string {
  if (!source) return "Unknown (visited before tracking was added, or cookies were blocked)";

  const utm = [source.utm_source, source.utm_medium, source.utm_campaign].filter(Boolean).join(" / ");
  const parts: string[] = [];
  if (utm) parts.push(utm);
  if (source.click_id_type) parts.push(`(${CLICK_ID_PLATFORMS[source.click_id_type]} ad click)`);
  if (!utm && !source.click_id_type) {
    parts.push(source.referrer ? `Referral from ${source.referrer}` : "Direct or search (no campaign tags)");
  }
  if (source.landing_page) parts.push(`landed on ${source.landing_page}`);
  return parts.join(" ");
}

/** Label/value pairs for the detailed breakdown in emails and the admin. */
export function leadSourceRows(source: LeadSource | null | undefined): Array<[string, string]> {
  if (!source) return [];
  const rows: Array<[string, string | undefined]> = [
    ["Source", source.utm_source],
    ["Medium", source.utm_medium],
    ["Campaign", source.utm_campaign],
    ["Keyword", source.utm_term],
    ["Ad content", source.utm_content],
    ["Click ID", source.click_id_type && source.click_id ? `${source.click_id_type}: ${source.click_id}` : undefined],
    ["Referrer", source.referrer],
    ["Landing page", source.landing_page],
  ];
  return rows.filter((row): row is [string, string] => Boolean(row[1]));
}
