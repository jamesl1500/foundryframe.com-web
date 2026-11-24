import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SafeResponse } from "@/lib/audit/safe-fetch";

vi.mock("@/lib/audit/safe-fetch", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/audit/safe-fetch")>();
  return { ...actual, safeFetch: vi.fn() };
});

const { safeFetch, UnsafeUrlError } = await import("@/lib/audit/safe-fetch");
const { scanSite, scoreChecks, ScanError } = await import("@/lib/audit/scanner");
const mockedFetch = vi.mocked(safeFetch);

const YEAR = new Date().getFullYear();

const GOOD_HTML = `<!doctype html>
<html lang="en">
<head>
  <title>Acme Plumbing | Emergency Plumber in Austin, TX</title>
  <meta name="description" content="Acme Plumbing fixes leaks, clogs and water heaters across Austin. Licensed, insured and on call 24/7 with upfront pricing and fast response.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content="Acme Plumbing">
  <meta property="og:image" content="https://acme.example/og.png">
  <link rel="canonical" href="https://acme.example/">
  <link rel="stylesheet" href="/styles.css">
  <script src="/app.js" defer></script>
  <script type="application/ld+json">{"@type":"Plumber"}</script>
</head>
<body>
  <main>
    <h1>Austin's trusted plumbers</h1>
    <h2>Services</h2>
    <p>${"We repair pipes and drains quickly. ".repeat(60)}</p>
    <h2>Why us</h2>
    <img src="/a.jpg" alt="Our van" srcset="/a-2x.jpg 2x">
    <a href="/contact">Get a free quote</a>
    <button>Book now</button>
    <a href="tel:+15125550100">(512) 555-0100</a>
    <a href="mailto:hi@acme.example">Email us</a>
    <a href="https://facebook.com/acme">Facebook</a>
    <a href="/"><svg><title>Logo</title></svg><span>Home</span></a>
    <form><input name="email"></form>
  </main>
  <footer>© ${YEAR} Acme Plumbing</footer>
</body>
</html>`;

const SECURE_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "content-encoding": "br",
  "strict-transport-security": "max-age=63072000",
  "content-security-policy": "default-src 'self'; frame-ancestors 'self'",
  "x-content-type-options": "nosniff",
  server: "nginx",
};

function response(overrides: Partial<SafeResponse> = {}): SafeResponse {
  const url = overrides.url ?? "https://acme.example/";
  return {
    url,
    status: 200,
    headers: {},
    body: "",
    truncated: false,
    redirectChain: [url],
    elapsedMs: 300,
    ...overrides,
  };
}

type Routes = {
  page?: SafeResponse | Error;
  robots?: SafeResponse | Error;
  sitemap?: SafeResponse | Error;
  httpPage?: SafeResponse | Error;
};

function route(routes: Routes) {
  mockedFetch.mockImplementation(async (input: string) => {
    let hit: SafeResponse | Error | undefined;
    if (input.endsWith("/robots.txt")) hit = routes.robots;
    else if (input.endsWith("/sitemap.xml")) hit = routes.sitemap;
    else if (input.startsWith("http://") && "httpPage" in routes) hit = routes.httpPage;
    else hit = routes.page;
    if (!hit) throw Object.assign(new Error("not found"), { code: "ECONNREFUSED" });
    if (hit instanceof Error) throw hit;
    return hit;
  });
}

function goodSite(overrides: Partial<SafeResponse> = {}) {
  route({
    page: response({ body: GOOD_HTML, headers: SECURE_HEADERS, ...overrides }),
    robots: response({ url: "https://acme.example/robots.txt", body: "User-agent: *\nAllow: /\nSitemap: https://acme.example/sitemap.xml" }),
    sitemap: response({ url: "https://acme.example/sitemap.xml", body: "<urlset></urlset>" }),
  });
}

function pageWith(html: string, headers: Record<string, string> = { "content-type": "text/html" }) {
  route({ page: response({ body: html, headers }) });
}

async function check(id: string) {
  const { checks } = await scanSite("https://acme.example/");
  return checks.find((item) => item.id === id);
}

beforeEach(() => {
  mockedFetch.mockReset();
});

describe("scanSite on a well-built page", () => {
  it("passes every check", async () => {
    goodSite();
    const { checks } = await scanSite("https://acme.example/");
    const failing = checks.filter((item) => item.result !== "pass").map((item) => `${item.id}:${item.result}`);
    expect(failing).toEqual([]);
  });

  it("extracts the page facts", async () => {
    goodSite();
    const { facts } = await scanSite("https://acme.example/");
    expect(facts.title).toBe("Acme Plumbing | Emergency Plumber in Austin, TX");
    expect(facts.h1).toEqual(["Austin's trusted plumbers"]);
    expect(facts.headings).toEqual(["Austin's trusted plumbers", "Services", "Why us"]);
    expect(facts.imageCount).toBe(1);
    expect(facts.imagesMissingAlt).toBe(0);
    expect(facts.wordCount).toBeGreaterThan(300);
    expect(facts.status).toBe(200);
    expect(facts.redirects).toBe(0);
    expect(facts.textExcerpt.length).toBeLessThanOrEqual(2000);
  });

  it("ignores an SVG <title> when reading the page title", async () => {
    pageWith(`<html><body><svg><title>Icon</title></svg></body></html>`);
    const { facts } = await scanSite("https://acme.example/");
    expect(facts.title).toBe("");
  });

  it("keeps script, style and noscript text out of the word count", async () => {
    pageWith(`<html><body><script>var a = "one two three"</script><style>.x{}</style><noscript>enable js</noscript><p>hello world</p></body></html>`);
    const { facts } = await scanSite("https://acme.example/");
    expect(facts.wordCount).toBe(2);
  });

  it("decodes HTML entities in text", async () => {
    pageWith(`<html><head><title>Tom &amp; Jerry&#39;s</title></head></html>`);
    const { facts } = await scanSite("https://acme.example/");
    expect(facts.title).toBe("Tom & Jerry's");
  });

  it("copes with truncated HTML (unclosed tags still count)", async () => {
    pageWith(`<html><head><title>Cut off</title></head><body><h1>Unfinished heading`);
    const { facts } = await scanSite("https://acme.example/");
    expect(facts.h1).toEqual(["Unfinished heading"]);
  });
});

describe("SEO checks", () => {
  it("fails a missing title and skips the length check", async () => {
    pageWith(`<html><body></body></html>`);
    const { checks } = await scanSite("https://acme.example/");
    expect(checks.find((c) => c.id === "title")?.result).toBe("fail");
    expect(checks.find((c) => c.id === "title-length")).toBeUndefined();
  });

  it.each([
    ["Short", "partial"],
    ["A".repeat(80), "partial"],
    ["Acme Plumbing in Austin", "pass"],
  ])("title %j is %s on length", async (title, expected) => {
    pageWith(`<html><head><title>${title}</title></head></html>`);
    expect((await check("title-length"))?.result).toBe(expected);
  });

  it("grades meta description length", async () => {
    pageWith(`<html><head><meta name="description" content="Too short"></head></html>`);
    const item = await check("meta-description-length");
    expect(item?.result).toBe("partial");
    expect(item?.issue).toMatch(/short \(9 characters\)/);
  });

  it("matches meta names case-insensitively", async () => {
    pageWith(`<html><head><META NAME="Description" CONTENT="${"x".repeat(100)}"></head></html>`);
    expect((await check("meta-description"))?.result).toBe("pass");
  });

  it.each([
    [0, "fail"],
    [1, "pass"],
    [2, "partial"],
  ])("with %i H1s the H1 check is %s", async (count, expected) => {
    pageWith(`<html><body>${"<h1>Heading</h1>".repeat(count)}</body></html>`);
    expect((await check("h1"))?.result).toBe(expected);
  });

  it("fails indexability on a noindex meta tag or X-Robots-Tag header", async () => {
    pageWith(`<html><head><meta name="robots" content="noindex,follow"></head></html>`);
    expect((await check("indexable"))?.result).toBe("fail");

    pageWith(`<html></html>`, { "content-type": "text/html", "x-robots-tag": "noindex" });
    expect((await check("indexable"))?.result).toBe("fail");
  });

  it("flags a robots.txt that blocks everything as a weight-3 failure", async () => {
    route({
      page: response({ body: "<html></html>" }),
      robots: response({ body: "User-agent: *\nDisallow: /" }),
    });
    const item = await check("robots-txt");
    expect(item).toMatchObject({ result: "fail", weight: 3, issue: "robots.txt blocks all search engines" });
  });

  it("doesn't flag a Disallow: / aimed at one bot only", async () => {
    route({
      page: response({ body: "<html></html>" }),
      robots: response({ body: "User-agent: BadBot\nDisallow: /\n\nUser-agent: *\nDisallow: /admin" }),
    });
    expect((await check("robots-txt"))?.result).toBe("pass");
  });

  it("accepts a root Allow that overrides Disallow: /", async () => {
    route({
      page: response({ body: "<html></html>" }),
      robots: response({ body: "User-agent: *\nDisallow: /\nAllow: /$" }),
    });
    expect((await check("robots-txt"))?.result).toBe("pass");
  });

  it("handles agents grouped on consecutive lines", async () => {
    route({
      page: response({ body: "<html></html>" }),
      robots: response({ body: "User-agent: Googlebot\nUser-agent: *\nDisallow: / # everything" }),
    });
    expect((await check("robots-txt"))?.result).toBe("fail");
  });

  it("treats an HTML 'robots.txt' (soft 404) as missing", async () => {
    route({
      page: response({ body: "<html></html>" }),
      robots: response({ body: "<html><body>Not found</body></html>" }),
    });
    const item = await check("robots-txt");
    expect(item).toMatchObject({ result: "partial", issue: "No robots.txt file" });
  });

  it("finds the sitemap from robots.txt or /sitemap.xml", async () => {
    route({ page: response({ body: "<html></html>" }), robots: response({ body: "Sitemap: https://acme.example/s.xml" }) });
    expect((await check("sitemap"))?.result).toBe("pass");

    route({ page: response({ body: "<html></html>" }), sitemap: response({ body: "<?xml?><sitemapindex>" }) });
    expect((await check("sitemap"))?.result).toBe("pass");

    route({ page: response({ body: "<html></html>" }), sitemap: response({ body: "<html>soft 404</html>" }) });
    expect((await check("sitemap"))?.result).toBe("fail");
  });

  it("gives partial credit for og:title without og:image", async () => {
    pageWith(`<html><head><meta property="og:title" content="Acme"></head></html>`);
    expect((await check("open-graph"))?.result).toBe("partial");
  });
});

describe("content checks", () => {
  it.each([
    [20, "fail"],
    [150, "partial"],
    [320, "pass"],
  ])("%i words is %s", async (words, expected) => {
    pageWith(`<html><body><p>${"word ".repeat(words)}</p></body></html>`);
    expect((await check("word-count"))?.result).toBe(expected);
  });

  it("explains JavaScript-only content when almost no text is in the HTML", async () => {
    pageWith(`<html><body><div id="root"></div></body></html>`);
    expect((await check("word-count"))?.fix).toMatch(/JavaScript/);
  });

  it("flags an old copyright year, using the latest year in a range", async () => {
    pageWith(`<html><body><footer>Copyright 2015-2019 Acme</footer></body></html>`);
    const item = await check("freshness");
    expect(item?.result).toBe("partial");
    expect(item?.issue).toBe("Footer copyright says 2019");

    pageWith(`<html><body><footer>(c) 2012 - ${YEAR} Acme</footer></body></html>`);
    expect((await check("freshness"))?.result).toBe("pass");
  });

  it("skips the freshness check when there's no copyright line", async () => {
    pageWith(`<html><body></body></html>`);
    expect(await check("freshness")).toBeUndefined();
  });
});

describe("accessibility checks", () => {
  it("counts images without any alt attribute, but not decorative alt=\"\"", async () => {
    pageWith(`<html><body>${'<img src="a">'.repeat(2)}<img src="b" alt=""><img src="c" alt="Logo"></body></html>`);
    const { facts, checks } = await scanSite("https://acme.example/");
    expect(facts.imagesMissingAlt).toBe(2);
    expect(checks.find((c) => c.id === "img-alt")).toMatchObject({ result: "fail", issue: "2 of 4 images have no alt text" });
  });

  it("counts icon-only links and buttons as unlabelled", async () => {
    pageWith(`<html><body>
      <a href="/x"><svg></svg></a>
      <a href="/y" aria-label="Menu"><svg></svg></a>
      <a href="/z"><img src="logo.png" alt="Acme home"></a>
      <a name="anchor-without-href"></a>
      <button><i class="icon"></i></button>
    </body></html>`);
    expect((await check("control-names"))).toMatchObject({
      result: "partial",
      issue: "2 links or buttons have no readable label",
    });
  });

  it("accepts role=main as a main landmark", async () => {
    pageWith(`<html><body><div role="main">x</div></body></html>`);
    expect((await check("landmarks"))?.result).toBe("pass");
  });
});

describe("mobile checks", () => {
  it("fails without a responsive viewport", async () => {
    pageWith(`<html><head><meta name="viewport" content="width=1024"></head></html>`);
    expect((await check("viewport"))?.result).toBe("fail");
  });

  it.each(["width=device-width, user-scalable=no", "width=device-width, maximum-scale=1.0", "width=device-width,user-scalable=0"])(
    "fails zoom for %j",
    async (content) => {
      pageWith(`<html><head><meta name="viewport" content="${content}"></head></html>`);
      expect((await check("zoom"))?.result).toBe("fail");
    }
  );

  it("allows maximum-scale above 1", async () => {
    pageWith(`<html><head><meta name="viewport" content="width=device-width, maximum-scale=5"></head></html>`);
    expect((await check("zoom"))?.result).toBe("pass");
  });

  it("only grades responsive images with 4+ images", async () => {
    pageWith(`<html><body>${'<img src="a" alt="">'.repeat(3)}</body></html>`);
    expect(await check("responsive-images")).toBeUndefined();

    pageWith(`<html><body>${'<img src="a" alt="">'.repeat(4)}</body></html>`);
    expect((await check("responsive-images"))?.result).toBe("fail");

    pageWith(`<html><body><picture></picture>${'<img src="a" alt="">'.repeat(3)}<img src="b" alt="" srcset="b 2x"></body></html>`);
    expect((await check("responsive-images"))?.result).toBe("pass");
  });
});

describe("security checks", () => {
  it("skips HSTS and mixed content checks on plain HTTP", async () => {
    route({ page: response({ url: "http://acme.example/", body: "<html></html>" }) });
    const { checks } = await scanSite("http://acme.example/");
    expect(checks.find((c) => c.id === "https")?.result).toBe("fail");
    expect(checks.find((c) => c.id === "hsts")).toBeUndefined();
    expect(checks.find((c) => c.id === "mixed-content")).toBeUndefined();
  });

  it("counts insecure scripts, images and stylesheets on an HTTPS page", async () => {
    pageWith(`<html><head><link rel="stylesheet" href="http://cdn.example/a.css"></head>
      <body><img src="http://cdn.example/a.png" alt=""><script src="http://cdn.example/a.js"></script><img src="https://ok/a.png" alt=""></body></html>`);
    expect(await check("mixed-content")).toMatchObject({ result: "fail", issue: "3 resources load over insecure HTTP" });
  });

  it("accepts frame-ancestors in the CSP as clickjacking protection", async () => {
    pageWith("<html></html>", { "content-type": "text/html", "content-security-policy": "frame-ancestors 'none'" });
    expect((await check("clickjacking"))?.result).toBe("pass");
  });

  it("flags version numbers in Server or X-Powered-By", async () => {
    pageWith("<html></html>", { "content-type": "text/html", "x-powered-by": "PHP/7.4.3" });
    expect((await check("version-disclosure"))?.result).toBe("fail");
  });

  it("falls back to HTTP when HTTPS can't connect, and reports broken HTTPS", async () => {
    route({
      page: Object.assign(new Error("cert has expired"), { code: "CERT_HAS_EXPIRED" }),
      httpPage: response({ url: "http://acme.example/", body: "<html><title>Old site</title></html>" }),
    });
    const { facts, checks } = await scanSite("https://acme.example/");
    expect(facts.finalUrl).toBe("http://acme.example/");
    expect(checks.find((c) => c.id === "https")).toMatchObject({
      result: "fail",
      issue: "The secure (HTTPS) version of the site doesn't work",
    });
  });
});

describe("performance checks", () => {
  it.each([
    [500, "pass"],
    [1500, "partial"],
    [2500, "fail"],
  ])("a %ims response is %s", async (elapsedMs, expected) => {
    route({ page: response({ body: "<html></html>", elapsedMs }) });
    expect((await check("response-time"))?.result).toBe(expected);
  });

  it("counts redirects from the redirect chain", async () => {
    route({
      page: response({
        url: "https://www.acme.example/",
        body: "<html></html>",
        redirectChain: ["http://acme.example/", "https://acme.example/", "https://www.acme.example/"],
      }),
    });
    const { facts, checks } = await scanSite("http://acme.example/");
    expect(facts.redirects).toBe(2);
    expect(checks.find((c) => c.id === "redirects")?.result).toBe("partial");
  });

  it("counts only head scripts without async/defer/module as render-blocking", async () => {
    pageWith(`<html><head>
      ${'<script src="/a.js"></script>'.repeat(3)}
      <script src="/b.js" async></script>
      <script src="/c.js" defer></script>
      <script src="/d.js" type="module"></script>
      <script>inline()</script>
    </head><body><script src="/e.js"></script></body></html>`);
    expect(await check("render-blocking")).toMatchObject({ result: "partial", issue: "3 scripts block the page from rendering" });
  });

  it("grades lazy loading only when there are more than 5 images", async () => {
    pageWith(`<html><body>${'<img src="a" alt="">'.repeat(6)}</body></html>`);
    expect((await check("lazy-images"))?.result).toBe("partial");
  });

  it("grades HTML size", async () => {
    pageWith(`<html><body>${"x".repeat(200_000)}</body></html>`);
    expect((await check("html-size"))?.result).toBe("partial");
  });
});

describe("conversion checks", () => {
  it("detects phone numbers in text and tel: links", async () => {
    pageWith(`<html><body>Call 512-555-0100 today</body></html>`);
    const { checks } = await scanSite("https://acme.example/");
    expect(checks.find((c) => c.id === "contact-info")?.result).toBe("partial");
    expect(checks.find((c) => c.id === "click-to-call")?.result).toBe("fail");
  });

  it("fails contact info with no phone, email or form", async () => {
    pageWith(`<html><body>Hello</body></html>`);
    const { checks } = await scanSite("https://acme.example/");
    expect(checks.find((c) => c.id === "contact-info")).toMatchObject({
      result: "fail",
      issue: "No phone number, email or form on the homepage",
    });
    expect(checks.find((c) => c.id === "click-to-call")).toBeUndefined();
  });

  it("counts calls to action in links and buttons", async () => {
    pageWith(`<html><body><a href="/q">Get a free estimate</a></body></html>`);
    expect((await check("cta"))?.result).toBe("partial");
  });

  it("recognizes social profile links", async () => {
    pageWith(`<html><body><a href="https://www.yelp.com/biz/acme">Reviews</a></body></html>`);
    expect((await check("social-proof"))?.result).toBe("pass");
  });
});

describe("scan errors", () => {
  it.each([
    [401, /blocked our scanner/],
    [403, /blocked our scanner/],
    [429, /blocked our scanner/],
    [503, /blocked our scanner/],
    [404, /HTTP 404/],
    [500, /HTTP 500/],
  ])("HTTP %i becomes a visitor-safe ScanError", async (status, message) => {
    route({ page: response({ status, body: "" }) });
    const error = await scanSite("https://acme.example/").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ScanError);
    expect((error as Error).message).toMatch(message);
  });

  it("rejects non-HTML content", async () => {
    route({ page: response({ headers: { "content-type": "application/pdf" } }) });
    await expect(scanSite("https://acme.example/")).rejects.toThrow(/doesn't serve a web page/);
  });

  it("reports DNS failures without trying HTTP", async () => {
    route({ page: Object.assign(new Error("getaddrinfo ENOTFOUND"), { code: "ENOTFOUND" }) });
    await expect(scanSite("https://nope.example/")).rejects.toThrow(/couldn't find that website/);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("passes UnsafeUrlError messages through", async () => {
    route({ page: new UnsafeUrlError("That website resolves to a private address and can't be audited.") });
    await expect(scanSite("https://evil.example/")).rejects.toThrow(/private address/);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("reports the original HTTPS error when the HTTP fallback also fails", async () => {
    route({
      page: Object.assign(new Error("connect ECONNREFUSED"), { code: "ECONNREFUSED" }),
      httpPage: new Error("also down"),
    });
    await expect(scanSite("https://acme.example/")).rejects.toThrow(/couldn't connect/);
  });

  it("passes timeouts and redirect loops through", async () => {
    route({ page: new Error("The website took too long to respond.") , httpPage: new Error("down") });
    await expect(scanSite("https://acme.example/")).rejects.toThrow(/too long/);
  });

  it("still scans when robots.txt and sitemap requests fail", async () => {
    route({ page: response({ body: "<html><title>Fine</title></html>" }) });
    const { checks } = await scanSite("https://acme.example/");
    expect(checks.find((c) => c.id === "robots-txt")?.result).toBe("partial");
    expect(checks.find((c) => c.id === "sitemap")?.result).toBe("fail");
  });
});

describe("scoreChecks", () => {
  const item = (result: "pass" | "partial" | "fail", weight: 1 | 2 | 3) =>
    ({ id: "x", category: "seo", label: "", issue: "", fix: "", result, weight }) as const;

  it("returns null with no checks", () => {
    expect(scoreChecks([])).toBeNull();
  });

  it("weights results and rounds", () => {
    expect(scoreChecks([item("pass", 3), item("fail", 1)])).toBe(75);
    expect(scoreChecks([item("partial", 2), item("fail", 1)])).toBe(33);
    expect(scoreChecks([item("pass", 1), item("pass", 2)])).toBe(100);
    expect(scoreChecks([item("fail", 3)])).toBe(0);
  });
});
