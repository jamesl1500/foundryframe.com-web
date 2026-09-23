import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { SiteCheck } from "@/lib/lead-finder/types";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;
const MAX_HTML_BYTES = 600_000;
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
    const { response, finalUrl } = await safeFetch(url);
    const html = await readCapped(response);

    return {
      ...base,
      ...analyzeHtml(html, finalUrl),
      reachable: response.ok,
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

/** Fetches a public http(s) URL, refusing private/internal addresses on every redirect hop. */
async function safeFetch(url: string): Promise<{ response: Response; finalUrl: string }> {
  let current = url;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicHttpUrl(current);

    const response = await fetch(current, {
      redirect: "manual",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      current = new URL(location, current).toString();
      continue;
    }

    return { response, finalUrl: current };
  }

  throw new Error("Too many redirects.");
}

async function assertPublicHttpUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https websites can be checked.");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(hostname)
    ? [hostname]
    : (await lookup(hostname, { all: true })).map((entry) => entry.address);

  if (addresses.length === 0 || addresses.some(isPrivateAddress)) {
    throw new Error("Website resolves to a private address.");
  }
}

function isPrivateAddress(address: string): boolean {
  if (isIP(address) === 6) {
    const lower = address.toLowerCase();
    if (lower.startsWith("::ffff:")) return isPrivateAddress(lower.slice(7));
    return lower === "::1" || lower === "::" || /^(fc|fd|fe8|fe9|fea|feb)/.test(lower);
  }

  const [a, b] = address.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

async function readCapped(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let html = "";
  while (html.length < MAX_HTML_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  await reader.cancel().catch(() => undefined);
  return html;
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
