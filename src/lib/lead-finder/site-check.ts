/* Website URLs come from Google Places and web search results, which anyone
   can edit, so every fetch goes through the audit's safeFetch: it checks
   the address the socket actually connects to (no DNS rebinding), on every
   redirect hop, and blocks private, metadata and IPv4-mapped IPv6 ranges. */
import { safeFetch } from "@/lib/audit/safe-fetch";
import type { SiteCheck } from "@/lib/lead-finder/types";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;
const MAX_HTML_BYTES = 600_000;
/* A browser User-Agent: prospect sites are checked like a visitor sees them. */
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

/** Hosts where a "website" is really a social profile or directory listing, not a site the business owns. */
const PROFILE_HOSTS = [
  "facebook.com",
  "instagram.com",
  "linktr.ee",
  "linkin.bio",
  "yelp.com",
  "tiktok.com",
  "x.com",
  "twitter.com",
  "linkedin.com",
  "nextdoor.com",
  "google.com",
  "business.site",
  "g.page",
  "etsy.com",
];

/** Free builder subdomains: the business doesn't own a domain yet. */
const BUILDER_SUBDOMAINS: Array<[string, string]> = [
  ["wixsite.com", "Wix (free subdomain)"],
  ["weebly.com", "Weebly (free subdomain)"],
  ["godaddysites.com", "GoDaddy Website Builder (free subdomain)"],
  ["square.site", "Square Online (free subdomain)"],
  ["carrd.co", "Carrd (free subdomain)"],
  ["wordpress.com", "WordPress.com (free subdomain)"],
  ["blogspot.com", "Blogger (free subdomain)"],
  ["webflow.io", "Webflow (staging subdomain)"],
];

const BUILDER_FINGERPRINTS: Array<[RegExp, string]> = [
  [/static\.wixstatic\.com|wix-bolt|_wixCssImports/i, "Wix"],
  [/weebly\.com|editmysite\.com/i, "Weebly"],
  [/img1\.wsimg\.com|godaddy website builder/i, "GoDaddy Website Builder"],
  [/squarespace\.com|static1\.squarespace/i, "Squarespace"],
  [/<meta[^>]+generator[^>]+wordpress/i, "WordPress"],
  [/<meta[^>]+generator[^>]+joomla/i, "Joomla"],
  [/<meta[^>]+generator[^>]+frontpage|microsoft frontpage/i, "FrontPage"],
];

/** Bot protection (Cloudflare etc.) answers these to scripted requests; they say nothing about the site. */
const BOT_BLOCK_STATUSES = new Set([401, 403, 429]);

const PARKED_PATTERNS =
  /(domain (is )?for sale|buy this domain|this domain (may be|is) for sale|parked (free|domain)|coming soon|under construction|website (is )?launching soon|site is being built|future home of)/i;

export function isSocialOrDirectoryUrl(url: string | null): boolean {
  const host = hostnameOf(url);
  return Boolean(host && PROFILE_HOSTS.some((entry) => host === entry || host.endsWith(`.${entry}`)));
}

export async function checkSite(url: string | null): Promise<SiteCheck> {
  const base: SiteCheck = {
    checkedUrl: url,
    reachable: false,
    blocked: false,
    statusCode: null,
    finalUrl: null,
    https: false,
    responseTimeMs: null,
    hasViewportMeta: false,
    hasMetaDescription: false,
    hasTitle: false,
    hasH1: false,
    copyrightYear: null,
    builder: null,
    looksParkedOrUnderConstruction: false,
    isSocialOrDirectoryProfile: isSocialOrDirectoryUrl(url),
    error: null,
  };

  // No site, or only a social/directory profile: nothing of theirs to fetch.
  if (!url || base.isSocialOrDirectoryProfile) return base;

  const started = Date.now();
  try {
    const response = await safeFetch(url, {
      timeoutMs: FETCH_TIMEOUT_MS,
      maxBytes: MAX_HTML_BYTES,
      maxRedirects: MAX_REDIRECTS,
      userAgent: USER_AGENT,
    });
    const finalUrl = response.url;

    return {
      ...base,
      ...analyzeHtml(response.body, finalUrl),
      reachable: response.status >= 200 && response.status < 300,
      blocked: BOT_BLOCK_STATUSES.has(response.status),
      statusCode: response.status,
      finalUrl,
      https: finalUrl.startsWith("https://"),
      responseTimeMs: Date.now() - started,
      isSocialOrDirectoryProfile: isSocialOrDirectoryUrl(finalUrl),
    };
  } catch (error) {
    return {
      ...base,
      responseTimeMs: Date.now() - started,
      error: error instanceof Error ? error.message : "Unable to load website.",
    };
  }
}

/** Pure HTML signals, split out so they can be tested without the network. */
export function analyzeHtml(
  html: string,
  finalUrl: string
): Pick<
  SiteCheck,
  | "hasViewportMeta"
  | "hasMetaDescription"
  | "hasTitle"
  | "hasH1"
  | "copyrightYear"
  | "builder"
  | "looksParkedOrUnderConstruction"
> {
  const host = hostnameOf(finalUrl) ?? "";
  return {
    hasViewportMeta: /<meta[^>]+name=["']?viewport/i.test(html),
    hasMetaDescription: /<meta[^>]+name=["']?description[^>]+content=["'][^"']{10,}/i.test(html),
    hasTitle: /<title[^>]*>\s*[^<\s][^<]*<\/title>/i.test(html),
    hasH1: /<h1[\s>]/i.test(html),
    copyrightYear: extractCopyrightYear(html),
    builder:
      BUILDER_SUBDOMAINS.find(([suffix]) => host.endsWith(suffix))?.[1] ??
      BUILDER_FINGERPRINTS.find(([pattern]) => pattern.test(html))?.[1] ??
      null,
    looksParkedOrUnderConstruction: PARKED_PATTERNS.test(stripTags(html).slice(0, 5000)),
  };
}

function extractCopyrightYear(html: string): number | null {
  const text = stripTags(html);
  const matches = [...text.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?((?:19|20)\d{2})/gi)];
  const years = matches
    .map((match) => Number(match[1]))
    .filter((year) => year >= 1995 && year <= new Date().getFullYear());
  return years.length > 0 ? Math.max(...years) : null;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

export function hostnameOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}
