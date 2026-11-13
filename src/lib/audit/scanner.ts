/**
 * Site Scanner - Foundry Frame
 * ==============================
 * Server-only checks for the free website audit. Fetches the homepage (plus
 * robots.txt and the sitemap) through safeFetch and runs fast, explainable
 * checks across SEO, content, accessibility, mobile, security, performance
 * and conversion. Each check is pass / partial / fail with a weight, so the
 * category scores trace straight back to what was found.
 *
 * The HTML is read in one streaming pass with htmlparser2 (linear time, so a
 * hostile page can't stall the function with pathological markup) and no
 * browser: it sees what search engines see on first load and keeps the
 * public endpoint cheap. Lighthouse (via PageSpeed) covers rendered-page
 * metrics on Google's side.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { Parser } from "htmlparser2";
import { safeFetch, UnsafeUrlError, type SafeResponse } from "@/lib/audit/safe-fetch";

export type AuditCategory =
  | "seo"
  | "content"
  | "accessibility"
  | "mobile"
  | "security"
  | "performance"
  | "conversion";

export type CheckResult = "pass" | "partial" | "fail";

export type AuditCheck = {
  id: string;
  category: AuditCategory;
  /** What was checked, phrased as the goal ("Has a meta description"). */
  label: string;
  result: CheckResult;
  /** 1 (nice to have) to 3 (fundamental). */
  weight: 1 | 2 | 3;
  /** Short issue title shown when the check isn't a pass. */
  issue: string;
  /** Why it matters / how to fix it, shown when the check isn't a pass. */
  fix: string;
};

export type ScanFacts = {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  responseTimeMs: number;
  redirects: number;
  htmlBytes: number;
  title: string;
  metaDescription: string;
  h1: string[];
  headings: string[];
  wordCount: number;
  imageCount: number;
  imagesMissingAlt: number;
  textExcerpt: string;
};

export type ScanResult = {
  facts: ScanFacts;
  checks: AuditCheck[];
};

/** Thrown when the site can't be scanned at all; the message is safe to show visitors. */
export class ScanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScanError";
  }
}

const CTA_PATTERN =
  /\b(contact|get (a |your )?(free )?(quote|estimate|started)|book|schedule|request|call (us|now|today)|free consultation|sign up|buy|shop|order|donate|apply|enroll|get in touch)\b/i;
const SOCIAL_HOSTS = /\b(facebook|instagram|linkedin|twitter|x|youtube|tiktok|pinterest|yelp)\.com\//i;
const PHONE_PATTERN = /(\+?1[ .-]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/;
const COPYRIGHT_PATTERN = /(?:©|\(c\)|copyright) ?(?:\d{4} ?[-–] ?)?((?:19|20)\d{2})/gi;

/* ---------- page model (one streaming parse) ---------- */

type Attrs = Record<string, string>;

type Captured = {
  attrs: Attrs;
  text: string;
  /** Contains an <img> with non-empty alt text, which names a link or button. */
  hasNamedImage: boolean;
};

type PageModel = {
  htmlAttrs: Attrs;
  title: string;
  metas: Attrs[];
  links: Attrs[];
  headScripts: Attrs[];
  hasJsonLd: boolean;
  bodyText: string;
  h1: string[];
  h2Count: number;
  headings: string[];
  images: Attrs[];
  pictureCount: number;
  anchors: Captured[];
  buttons: Captured[];
  hasMain: boolean;
  hasForm: boolean;
  insecureAssetCount: number;
};

const CAPTURED_TAGS = new Set(["a", "button", "h1", "h2", "h3", "title"]);
const SKIPPED_TEXT_TAGS = new Set(["script", "style", "noscript", "template"]);
const ASSET_TAGS = new Set(["img", "script", "iframe", "source", "video", "audio", "embed"]);

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function parsePage(html: string): PageModel {
  const model: PageModel = {
    htmlAttrs: {},
    title: "",
    metas: [],
    links: [],
    headScripts: [],
    hasJsonLd: false,
    bodyText: "",
    h1: [],
    h2Count: 0,
    headings: [],
    images: [],
    pictureCount: 0,
    anchors: [],
    buttons: [],
    hasMain: false,
    hasForm: false,
    insecureAssetCount: 0,
  };

  const open: { name: string; captured: Captured }[] = [];
  const bodyParts: string[] = [];
  let inHead = false;
  let skipDepth = 0;
  let svgDepth = 0;

  const appendText = (text: string) => {
    for (const entry of open) entry.captured.text += text;
    if (!inHead && skipDepth === 0 && svgDepth === 0) bodyParts.push(text);
  };

  const finish = (name: string, captured: Captured) => {
    const text = collapse(captured.text);
    if (name === "a") model.anchors.push(captured);
    else if (name === "button") model.buttons.push(captured);
    else if (name === "title") {
      if (!model.title && svgDepth === 0) model.title = text;
    } else {
      if (name === "h1" && text) model.h1.push(text);
      if (name === "h2") model.h2Count += 1;
      if (text && model.headings.length < 20) model.headings.push(text);
    }
  };

  const parser = new Parser(
    {
      onopentag(name, attrs) {
        appendText(" ");

        switch (name) {
          case "html":
            model.htmlAttrs = attrs;
            break;
          case "head":
            inHead = true;
            break;
          case "body":
            inHead = false;
            break;
          case "meta":
            model.metas.push(attrs);
            break;
          case "link":
            model.links.push(attrs);
            break;
          case "img":
            model.images.push(attrs);
            if (attrs.alt?.trim()) for (const entry of open) entry.captured.hasNamedImage = true;
            break;
          case "picture":
            model.pictureCount += 1;
            break;
          case "main":
            model.hasMain = true;
            break;
          case "form":
            model.hasForm = true;
            break;
          case "svg":
            svgDepth += 1;
            break;
        }

        if (attrs.role === "main") model.hasMain = true;
        if (ASSET_TAGS.has(name) && /^http:\/\//i.test(attrs.src ?? "")) model.insecureAssetCount += 1;
        if (name === "script") {
          if (/application\/ld\+json/i.test(attrs.type ?? "")) model.hasJsonLd = true;
          if (inHead) model.headScripts.push(attrs);
        }
        if (SKIPPED_TEXT_TAGS.has(name)) skipDepth += 1;
        if (CAPTURED_TAGS.has(name)) open.push({ name, captured: { attrs, text: "", hasNamedImage: false } });
      },
      ontext(text) {
        if (skipDepth > 0) return;
        appendText(text);
      },
      onclosetag(name) {
        appendText(" ");
        if (name === "head") inHead = false;
        if (name === "svg" && svgDepth > 0) svgDepth -= 1;
        if (SKIPPED_TEXT_TAGS.has(name) && skipDepth > 0) skipDepth -= 1;

        if (CAPTURED_TAGS.has(name)) {
          for (let i = open.length - 1; i >= 0; i--) {
            if (open[i].name === name) {
              const [entry] = open.splice(i, 1);
              finish(entry.name, entry.captured);
              break;
            }
          }
        }
      },
    },
    { decodeEntities: true, lowerCaseTags: true, lowerCaseAttributeNames: true, recognizeSelfClosing: true }
  );

  parser.write(html);
  parser.end();
  // Anything never closed (truncated HTML) still counts.
  for (const entry of open.splice(0)) finish(entry.name, entry.captured);

  model.bodyText = collapse(bodyParts.join(""));
  return model;
}

function metaContent(metas: Attrs[], key: string): string {
  const lower = key.toLowerCase();
  const tag = metas.find(
    (meta) => meta.name?.toLowerCase() === lower || meta.property?.toLowerCase() === lower
  );
  return tag?.content?.trim() ?? "";
}

function header(res: SafeResponse, name: string): string {
  const value = res.headers[name.toLowerCase()];
  return Array.isArray(value) ? value.join(", ") : (value ?? "");
}

function hasAccessibleName({ attrs, text, hasNamedImage }: Captured): boolean {
  return Boolean(
    attrs["aria-label"]?.trim() ||
      attrs["aria-labelledby"]?.trim() ||
      attrs.title?.trim() ||
      collapse(text) ||
      hasNamedImage
  );
}

/** True when the "User-agent: *" group disallows the whole site without re-allowing the root. */
function robotsBlocksEverything(robots: string): boolean {
  let agents: string[] = [];
  let inRules = false;
  let wildcardDisallowsRoot = false;
  let wildcardAllowsRoot = false;

  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (field === "user-agent") {
      if (inRules) {
        agents = [];
        inRules = false;
      }
      agents.push(value);
    } else if (field === "allow" || field === "disallow") {
      inRules = true;
      if (!agents.includes("*")) continue;
      if (field === "disallow" && value === "/") wildcardDisallowsRoot = true;
      if (field === "allow" && (value === "/" || value === "/$")) wildcardAllowsRoot = true;
    }
  }

  return wildcardDisallowsRoot && !wildcardAllowsRoot;
}

/* ---------- check helpers ---------- */

/** pass when `passes`, otherwise partial when `partly`, otherwise fail. */
function tier(passes: boolean, partly: boolean): CheckResult {
  if (passes) return "pass";
  return partly ? "partial" : "fail";
}

type CheckInput = Omit<AuditCheck, "result"> & { result: CheckResult | boolean };

function toCheck(input: CheckInput): AuditCheck {
  const result = typeof input.result === "boolean" ? tier(input.result, false) : input.result;
  return { ...input, result };
}

/* ---------- the scan ---------- */

async function fetchOptional(url: string): Promise<SafeResponse | null> {
  try {
    return await safeFetch(url, { timeoutMs: 8_000, maxBytes: 512 * 1024, maxRedirects: 3 });
  } catch {
    return null;
  }
}

function toScanError(error: unknown): ScanError {
  if (error instanceof UnsafeUrlError) return new ScanError(error.message);
  const code = (error as NodeJS.ErrnoException)?.code;
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return new ScanError("We couldn't find that website. Please check the address and try again.");
  }
  if (error instanceof Error && /too long|redirected/.test(error.message)) return new ScanError(error.message);
  return new ScanError("We couldn't connect to that website. Please check the address and try again.");
}

/** Errors where trying plain HTTP could still reach the site (TLS/cert problems, refused 443). */
function isRetryableOverHttp(error: unknown): boolean {
  if (error instanceof UnsafeUrlError) return false;
  const code = (error as NodeJS.ErrnoException)?.code ?? "";
  return code !== "ENOTFOUND" && code !== "EAI_AGAIN";
}

/**
 * Fetches the homepage. Bare domains are tried over https:// first; if that
 * can't connect (no certificate, expired or mismatched certificate, nothing
 * on port 443) we fall back to http://, since plenty of small-business
 * sites still work only there, and report the broken HTTPS as a finding.
 */
async function fetchHomepage(url: string): Promise<{ page: SafeResponse; httpsBroken: boolean }> {
  let page: SafeResponse;
  let httpsBroken = false;
  try {
    page = await safeFetch(url, { timeoutMs: 20_000 });
  } catch (error) {
    if (!url.startsWith("https://") || !isRetryableOverHttp(error)) throw toScanError(error);
    try {
      page = await safeFetch(`http://${url.slice("https://".length)}`, { timeoutMs: 15_000 });
      httpsBroken = true;
    } catch {
      throw toScanError(error);
    }
  }

  if ([401, 403, 429, 503].includes(page.status)) {
    throw new ScanError(
      "That website blocked our scanner (it may use bot protection). Contact us and we'll run the audit by hand."
    );
  }
  if (page.status >= 400) {
    throw new ScanError(`That website returned an error (HTTP ${page.status}), so we couldn't scan it.`);
  }

  const contentType = header(page, "content-type");
  if (contentType && !/html|xml/i.test(contentType)) {
    throw new ScanError("That address doesn't serve a web page, so we couldn't scan it.");
  }

  return { page, httpsBroken };
}

export async function scanSite(url: string): Promise<ScanResult> {
  const { page, httpsBroken } = await fetchHomepage(url);
  const finalUrl = new URL(page.url);
  const [robotsRes, sitemapGuess] = await Promise.all([
    fetchOptional(`${finalUrl.origin}/robots.txt`),
    fetchOptional(`${finalUrl.origin}/sitemap.xml`),
  ]);

  const html = page.body;
  const doc = parsePage(html);
  const text = doc.bodyText;
  const words = text ? text.split(" ").filter((word) => /[a-z0-9]/i.test(word)) : [];
  const hrefs = doc.anchors.map((a) => a.attrs.href ?? "");
  const csp = header(page, "content-security-policy");
  const isHttps = finalUrl.protocol === "https:";
  const viewport = metaContent(doc.metas, "viewport");
  const metaDescription = metaContent(doc.metas, "description");
  const robotsMeta = [
    metaContent(doc.metas, "robots"),
    metaContent(doc.metas, "googlebot"),
    header(page, "x-robots-tag"),
  ].join(" ");
  const imagesMissingAlt = doc.images.filter((img) => !("alt" in img)).length;

  const checks: AuditCheck[] = [];
  const add = (input: CheckInput) => checks.push(toCheck(input));

  /* --- SEO --- */
  const title = doc.title;
  add({
    category: "seo", id: "title", weight: 3, label: "Has a page title", result: Boolean(title),
    issue: "Missing page title",
    fix: "The <title> is the headline Google shows in search results. Add a unique title with your main service and location.",
  });
  if (title) {
    const length = title.length;
    add({
      category: "seo", id: "title-length", weight: 1, label: "Title is a good length",
      result: tier(length >= 15 && length <= 65, true),
      issue: length < 15 ? `Title is very short (${length} characters)` : `Title is long (${length} characters) and will be cut off`,
      fix: "Aim for 30-60 characters that name what you do and where, so the full title shows in search results.",
    });
  }
  add({
    category: "seo", id: "meta-description", weight: 3, label: "Has a meta description", result: Boolean(metaDescription),
    issue: "Missing meta description",
    fix: "Without one, Google picks random text from the page for your search snippet. Write a 120-160 character summary with a reason to click.",
  });
  if (metaDescription) {
    const length = metaDescription.length;
    add({
      category: "seo", id: "meta-description-length", weight: 1, label: "Meta description is a good length",
      result: tier(length >= 70 && length <= 165, true),
      issue: length < 70 ? `Meta description is short (${length} characters)` : `Meta description is long (${length} characters)`,
      fix: "Aim for 120-160 characters so the snippet is complete and persuasive.",
    });
  }
  add({
    category: "seo", id: "h1", weight: 2, label: "Has exactly one main heading (H1)",
    result: tier(doc.h1.length === 1, doc.h1.length > 1),
    issue: doc.h1.length === 0 ? "No main heading (H1) on the page" : `${doc.h1.length} H1 headings on one page`,
    fix: "Use a single H1 that states what the page is about; it's one of the strongest on-page signals for search engines.",
  });
  add({
    category: "seo", id: "indexable", weight: 3, label: "Search engines are allowed to index the page",
    result: !/noindex/i.test(robotsMeta),
    issue: "The homepage tells search engines not to index it",
    fix: "A 'noindex' robots tag or header keeps the page out of Google entirely. Remove it unless that's intentional.",
  });
  add({
    category: "seo", id: "canonical", weight: 1, label: "Declares a canonical URL",
    result: doc.links.some((link) => /\bcanonical\b/i.test(link.rel ?? "") && Boolean(link.href)),
    issue: "No canonical URL",
    fix: "A canonical tag tells search engines which version of the page to rank, avoiding duplicate-content issues.",
  });

  const robotsText =
    robotsRes?.status === 200 && !/<html/i.test(robotsRes.body.slice(0, 2000)) ? robotsRes.body : null;
  const blocksAll = robotsText ? robotsBlocksEverything(robotsText) : false;
  add({
    category: "seo", id: "robots-txt", weight: blocksAll ? 3 : 1, label: "Has a robots.txt that allows crawling",
    result: tier(!blocksAll && Boolean(robotsText), !blocksAll),
    issue: blocksAll ? "robots.txt blocks all search engines" : "No robots.txt file",
    fix: blocksAll
      ? "Your robots.txt disallows the whole site, so search engines can't crawl it. Remove the 'Disallow: /' rule."
      : "A robots.txt file guides crawlers and points them to your sitemap.",
  });
  const sitemapFound =
    (robotsText ? /^[ \t]*sitemap:[ \t]*\S/im.test(robotsText) : false) ||
    (sitemapGuess?.status === 200 && /<(urlset|sitemapindex)\b/i.test(sitemapGuess.body.slice(0, 5000)));
  add({
    category: "seo", id: "sitemap", weight: 2, label: "Has an XML sitemap", result: sitemapFound,
    issue: "No XML sitemap found",
    fix: "A sitemap helps Google discover and index every page. Generate one and submit it in Google Search Console.",
  });
  const ogTitle = Boolean(metaContent(doc.metas, "og:title"));
  add({
    category: "seo", id: "open-graph", weight: 1, label: "Has social sharing tags (Open Graph)",
    result: tier(ogTitle && Boolean(metaContent(doc.metas, "og:image")), ogTitle),
    issue: "Missing social sharing tags",
    fix: "Open Graph tags control the title and image shown when your site is shared on Facebook, LinkedIn or in texts.",
  });
  add({
    category: "seo", id: "structured-data", weight: 1, label: "Has structured data (schema.org)", result: doc.hasJsonLd,
    issue: "No structured data",
    fix: "Schema markup (LocalBusiness, Organization, etc.) helps Google show rich results like hours, ratings and location.",
  });

  /* --- Content --- */
  const wordCount = words.length;
  add({
    category: "content", id: "word-count", weight: 3, label: "Homepage has substantial content",
    result: tier(wordCount >= 300, wordCount >= 120),
    issue: `Thin homepage content (about ${wordCount} words)`,
    fix:
      wordCount < 40
        ? "Almost no text is in the page's HTML. If content loads with JavaScript, search engines may not see it; otherwise add clear copy about your services."
        : "Search engines and visitors need enough copy to understand what you offer. Aim for 300+ words covering services, location and proof.",
  });
  add({
    category: "content", id: "subheadings", weight: 2, label: "Content is organized with subheadings",
    result: tier(doc.h2Count >= 2, doc.h2Count === 1),
    issue: "Few or no subheadings (H2)",
    fix: "Subheadings make the page scannable for visitors and help search engines understand each section.",
  });
  const copyrightYears = Array.from(text.matchAll(COPYRIGHT_PATTERN), (match) => Number(match[1]));
  if (copyrightYears.length > 0) {
    const latest = Math.max(...copyrightYears);
    add({
      category: "content", id: "freshness", weight: 1, label: "Footer looks up to date",
      result: tier(latest >= new Date().getFullYear() - 1, true),
      issue: `Footer copyright says ${latest}`,
      fix: "An old copyright year makes the site look unmaintained. Update it (or make it automatic).",
    });
  }

  /* --- Accessibility --- */
  add({
    category: "accessibility", id: "lang", weight: 2, label: "Declares the page language",
    result: Boolean(doc.htmlAttrs.lang?.trim()),
    issue: "Page language isn't declared",
    fix: "Add lang=\"en\" (or your language) to the <html> tag so screen readers pronounce content correctly.",
  });
  if (doc.images.length > 0) {
    add({
      category: "accessibility", id: "img-alt", weight: 3, label: "Images have alt text",
      result: tier(imagesMissingAlt === 0, imagesMissingAlt / doc.images.length <= 0.2),
      issue: `${imagesMissingAlt} of ${doc.images.length} images have no alt text`,
      fix: "Alt text describes images for screen-reader users and search engines. Add it to every meaningful image (alt=\"\" for decorative ones).",
    });
  }
  const unnamed =
    doc.anchors.filter((a) => a.attrs.href !== undefined && !hasAccessibleName(a)).length +
    doc.buttons.filter((b) => !hasAccessibleName(b)).length;
  add({
    category: "accessibility", id: "control-names", weight: 2, label: "Links and buttons have readable labels",
    result: tier(unnamed === 0, unnamed <= 3),
    issue: `${unnamed} links or buttons have no readable label`,
    fix: "Icon-only links and buttons need an aria-label, otherwise screen readers announce them as just \"link\" or \"button\".",
  });
  add({
    category: "accessibility", id: "landmarks", weight: 1, label: "Marks up the main content area", result: doc.hasMain,
    issue: "No <main> landmark",
    fix: "Wrapping the main content in <main> lets keyboard and screen-reader users skip straight to it.",
  });

  /* --- Mobile --- */
  add({
    category: "mobile", id: "viewport", weight: 3, label: "Set up for mobile screens",
    result: /width\s*=\s*device-width/i.test(viewport),
    issue: "Not set up for mobile screens",
    fix: "There's no responsive viewport tag, so phones show a zoomed-out desktop page. Most visitors are on mobile; this needs fixing first.",
  });
  add({
    category: "mobile", id: "zoom", weight: 2, label: "Lets visitors zoom on mobile",
    result: !/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport),
    issue: "Pinch-to-zoom is disabled",
    fix: "Blocking zoom makes text hard to read for many visitors and fails accessibility guidelines. Remove user-scalable=no / maximum-scale=1.",
  });
  if (doc.images.length >= 4) {
    const responsive = doc.images.filter((img) => img.srcset || img.sizes).length + doc.pictureCount;
    add({
      category: "mobile", id: "responsive-images", weight: 1, label: "Serves right-sized images to phones",
      result: tier(responsive >= doc.images.length / 2, responsive > 0),
      issue: "Images aren't sized for mobile",
      fix: "Without srcset/<picture>, phones download desktop-sized images, which slows the page on cellular connections.",
    });
  }

  /* --- Security --- */
  add({
    category: "security", id: "https", weight: 3, label: "Served securely over HTTPS", result: isHttps,
    issue: httpsBroken ? "The secure (HTTPS) version of the site doesn't work" : "Site isn't served over HTTPS",
    fix: httpsBroken
      ? "Visitors who go to https:// get a browser security error, usually from a missing or expired SSL certificate. Renew or install the certificate and redirect all traffic to HTTPS."
      : "Browsers label HTTP sites \"Not secure\", which scares off visitors and hurts rankings. Install an SSL certificate and redirect to HTTPS.",
  });
  if (isHttps) {
    add({
      category: "security", id: "hsts", weight: 2, label: "Enforces HTTPS (HSTS)",
      result: Boolean(header(page, "strict-transport-security")),
      issue: "HTTPS isn't enforced (no HSTS header)",
      fix: "The Strict-Transport-Security header stops browsers from ever loading the insecure version of your site.",
    });
    const insecure =
      doc.insecureAssetCount +
      doc.links.filter((link) => /stylesheet/i.test(link.rel ?? "") && /^http:\/\//i.test(link.href ?? "")).length;
    add({
      category: "security", id: "mixed-content", weight: 2, label: "No insecure (mixed) content", result: insecure === 0,
      issue: `${insecure} resources load over insecure HTTP`,
      fix: "Loading images or scripts over http:// on an HTTPS page triggers browser warnings and blocked content. Switch them to https://.",
    });
  }
  add({
    category: "security", id: "csp", weight: 1, label: "Has a Content Security Policy", result: Boolean(csp),
    issue: "No Content Security Policy",
    fix: "A CSP limits which scripts can run, protecting visitors if a plugin or third-party script is ever compromised.",
  });
  add({
    category: "security", id: "nosniff", weight: 1, label: "Sends X-Content-Type-Options",
    result: /nosniff/i.test(header(page, "x-content-type-options")),
    issue: "Missing X-Content-Type-Options header",
    fix: "This one-line header stops browsers from misinterpreting files, closing off a class of attacks.",
  });
  add({
    category: "security", id: "clickjacking", weight: 1, label: "Protected against clickjacking",
    result: Boolean(header(page, "x-frame-options")) || /frame-ancestors/i.test(csp),
    issue: "No clickjacking protection",
    fix: "Without X-Frame-Options or a frame-ancestors policy, other sites can embed yours in a hidden frame to trick visitors.",
  });
  add({
    category: "security", id: "version-disclosure", weight: 1, label: "Doesn't advertise server software versions",
    result: !/\d+\.\d+/.test(`${header(page, "server")} ${header(page, "x-powered-by")}`),
    issue: "Server software version is publicly visible",
    fix: "Headers like Server or X-Powered-By reveal exact versions, making it easy for attackers to look up known vulnerabilities.",
  });

  /* --- Performance (Lighthouse adds the rendered-page metrics) --- */
  const responseTimeMs = page.elapsedMs;
  add({
    category: "performance", id: "response-time", weight: 2, label: "Server responds quickly",
    result: tier(responseTimeMs <= 800, responseTimeMs <= 1800),
    issue: `Slow server response (${(responseTimeMs / 1000).toFixed(1)} s)`,
    fix: "The server takes a long time to send the first page. Better hosting, caching or a CDN usually fixes this.",
  });
  add({
    category: "performance", id: "compression", weight: 2, label: "Compresses pages (gzip/brotli)",
    result: Boolean(header(page, "content-encoding")),
    issue: "Pages aren't compressed",
    fix: "Turning on gzip or Brotli compression typically shrinks HTML, CSS and JavaScript by 70%, with no visible change.",
  });
  const htmlBytes = Buffer.byteLength(html, "utf8");
  add({
    category: "performance", id: "html-size", weight: 1, label: "Page HTML is lean",
    result: tier(htmlBytes <= 150_000, htmlBytes <= 500_000),
    issue: `Large page HTML (${Math.round(htmlBytes / 1024)} KB)`,
    fix: "Very large HTML usually means inlined data or page-builder bloat, which delays the first render.",
  });
  const redirects = page.redirectChain.length - 1;
  add({
    category: "performance", id: "redirects", weight: 1, label: "Loads without redirect chains",
    result: tier(redirects <= 1, true),
    issue: `${redirects} redirects before the page loads`,
    fix: "Each redirect adds a round trip. Link straight to the final address (e.g. https://www.) everywhere.",
  });
  const blockingScripts = doc.headScripts.filter(
    (script) => script.src && !("async" in script) && !("defer" in script) && script.type !== "module"
  ).length;
  add({
    category: "performance", id: "render-blocking", weight: 1, label: "Few render-blocking scripts",
    result: tier(blockingScripts <= 2, blockingScripts <= 5),
    issue: `${blockingScripts} scripts block the page from rendering`,
    fix: "Scripts in the <head> without async/defer must download before anything shows. Defer the ones that aren't critical.",
  });
  if (doc.images.length > 5) {
    add({
      category: "performance", id: "lazy-images", weight: 1, label: "Lazy-loads offscreen images",
      result: tier(doc.images.some((img) => img.loading === "lazy"), true),
      issue: "Images aren't lazy-loaded",
      fix: "Adding loading=\"lazy\" to below-the-fold images means visitors only download what they scroll to.",
    });
  }

  /* --- Conversion --- */
  const hasTelLink = hrefs.some((href) => /^tel:/i.test(href));
  const hasPhone = hasTelLink || PHONE_PATTERN.test(text);
  const hasEmailOrForm = hrefs.some((href) => /^mailto:/i.test(href)) || doc.hasForm;
  add({
    category: "conversion", id: "contact-info", weight: 3, label: "Easy to contact from the homepage",
    result: tier(hasPhone && hasEmailOrForm, hasPhone || hasEmailOrForm),
    issue: hasPhone || hasEmailOrForm ? "Only one way to get in touch on the homepage" : "No phone number, email or form on the homepage",
    fix: "Visitors who are ready to buy shouldn't have to hunt. Show a clickable phone number and a short contact form or email.",
  });
  if (hasPhone) {
    add({
      category: "conversion", id: "click-to-call", weight: 1, label: "Phone number is tap-to-call", result: hasTelLink,
      issue: "Phone number isn't clickable",
      fix: "Wrap your number in a tel: link so mobile visitors can call with one tap.",
    });
  }
  const ctaCount = [...doc.anchors, ...doc.buttons].filter((el) => CTA_PATTERN.test(collapse(el.text))).length;
  add({
    category: "conversion", id: "cta", weight: 2, label: "Has clear calls to action",
    result: tier(ctaCount >= 2, ctaCount === 1),
    issue: ctaCount === 1 ? "Only one call to action" : "No clear call to action",
    fix: "Tell visitors exactly what to do next (\"Get a free quote\", \"Book a call\") near the top of the page and again further down.",
  });
  add({
    category: "conversion", id: "social-proof", weight: 1, label: "Links to social profiles or reviews",
    result: hrefs.some((href) => SOCIAL_HOSTS.test(href)),
    issue: "No links to social profiles or reviews",
    fix: "Linking to active social profiles and review pages builds trust with first-time visitors.",
  });

  return {
    facts: {
      requestedUrl: url,
      finalUrl: page.url,
      status: page.status,
      responseTimeMs,
      redirects,
      htmlBytes,
      title,
      metaDescription,
      h1: doc.h1.slice(0, 5),
      headings: doc.headings,
      wordCount,
      imageCount: doc.images.length,
      imagesMissingAlt,
      textExcerpt: text.slice(0, 2000),
    },
    checks,
  };
}

/* ---------- scoring ---------- */

const RESULT_VALUE: Record<CheckResult, number> = { pass: 1, partial: 0.5, fail: 0 };

/** 0-100 score for one category's checks, or null when it has none. */
export function scoreChecks(checks: AuditCheck[]): number | null {
  const total = checks.reduce((sum, item) => sum + item.weight, 0);
  if (total === 0) return null;
  const earned = checks.reduce((sum, item) => sum + item.weight * RESULT_VALUE[item.result], 0);
  return Math.round((earned / total) * 100);
}
