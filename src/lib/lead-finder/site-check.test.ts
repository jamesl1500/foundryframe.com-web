import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SafeResponse } from "@/lib/audit/safe-fetch";

vi.mock("@/lib/audit/safe-fetch", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/audit/safe-fetch")>()),
  safeFetch: vi.fn(),
}));

const { safeFetch, UnsafeUrlError } = await import("@/lib/audit/safe-fetch");
const { analyzeHtml, checkSite, hostnameOf, isSocialOrDirectoryUrl } = await import("@/lib/lead-finder/site-check");
const mockedFetch = vi.mocked(safeFetch);
const YEAR = new Date().getFullYear();

function response(overrides: Partial<SafeResponse> = {}): SafeResponse {
  return {
    url: "https://acme.example/",
    status: 200,
    headers: {},
    body: "<html></html>",
    truncated: false,
    redirectChain: ["https://acme.example/"],
    elapsedMs: 100,
    ...overrides,
  };
}

beforeEach(() => {
  mockedFetch.mockReset();
});

describe("hostnameOf / isSocialOrDirectoryUrl", () => {
  it("normalizes hosts", () => {
    expect(hostnameOf("https://WWW.Acme.Example/path")).toBe("acme.example");
    expect(hostnameOf("not a url")).toBeNull();
    expect(hostnameOf(null)).toBeNull();
  });

  it("recognizes profiles and directories, including subdomains, but not lookalikes", () => {
    expect(isSocialOrDirectoryUrl("https://www.facebook.com/acme")).toBe(true);
    expect(isSocialOrDirectoryUrl("https://m.facebook.com/acme")).toBe(true);
    expect(isSocialOrDirectoryUrl("https://acme.business.site/")).toBe(true);
    expect(isSocialOrDirectoryUrl("https://notfacebook.com/")).toBe(false);
    expect(isSocialOrDirectoryUrl("https://acme.example/")).toBe(false);
  });
});

describe("analyzeHtml", () => {
  it("finds the basics on a modern page", () => {
    const html = `<html><head><title>Acme</title><meta name="viewport" content="width=device-width">
      <meta name="description" content="Plumbing across Lorain County."></head><body><h1 class="x">Acme</h1>
      <footer>© 2019 - ${YEAR} Acme</footer></body></html>`;
    expect(analyzeHtml(html, "https://acme.example/")).toEqual({
      hasViewportMeta: true,
      hasMetaDescription: true,
      hasTitle: true,
      hasH1: true,
      copyrightYear: YEAR,
      builder: null,
      looksParkedOrUnderConstruction: false,
    });
  });

  it("flags empty titles and too-short descriptions", () => {
    const result = analyzeHtml(`<title>   </title><meta name="description" content="Hi">`, "https://a.example/");
    expect(result.hasTitle).toBe(false);
    expect(result.hasMetaDescription).toBe(false);
  });

  it("ignores future copyright years and script text", () => {
    expect(analyzeHtml(`<p>© ${YEAR + 3}</p>`, "https://a.example/").copyrightYear).toBeNull();
    expect(analyzeHtml(`<script>var c = "© 2001"</script><p>&copy; 2012</p>`, "https://a.example/").copyrightYear).toBe(2012);
  });

  it("detects builders from the host and from fingerprints", () => {
    expect(analyzeHtml("", "https://acme.wixsite.com/site").builder).toBe("Wix (free subdomain)");
    expect(analyzeHtml(`<link href="https://static1.squarespace.com/x.css">`, "https://acme.example/").builder).toBe("Squarespace");
    expect(analyzeHtml(`<meta name="generator" content="WordPress 6.5">`, "https://acme.example/").builder).toBe("WordPress");
  });

  it("detects parked and coming-soon pages", () => {
    expect(analyzeHtml("<h1>This domain is for sale!</h1>", "https://a.example/").looksParkedOrUnderConstruction).toBe(true);
    expect(analyzeHtml("<p>Coming soon</p>", "https://a.example/").looksParkedOrUnderConstruction).toBe(true);
    expect(analyzeHtml("<p>Welcome</p>", "https://a.example/").looksParkedOrUnderConstruction).toBe(false);
  });
});

describe("checkSite", () => {
  it("skips the fetch with no site or only a social profile", async () => {
    expect((await checkSite(null)).reachable).toBe(false);
    expect((await checkSite("https://instagram.com/acme")).isSocialOrDirectoryProfile).toBe(true);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("fetches through the SSRF-safe client with a browser User-Agent and caps", async () => {
    mockedFetch.mockResolvedValue(response({ body: "<title>Acme</title>" }));
    const result = await checkSite("https://acme.example/");
    const [url, options] = mockedFetch.mock.calls[0];
    expect(url).toBe("https://acme.example/");
    expect(options).toMatchObject({ timeoutMs: 10_000, maxBytes: 600_000, maxRedirects: 5 });
    expect(options?.userAgent).toMatch(/Chrome\//);
    expect(result).toMatchObject({ reachable: true, https: true, statusCode: 200, hasTitle: true });
  });

  it("reports the final URL after redirects, and re-checks it for profiles", async () => {
    mockedFetch.mockResolvedValue(response({ url: "https://www.facebook.com/acme" }));
    const result = await checkSite("http://acme.example/");
    expect(result.finalUrl).toBe("https://www.facebook.com/acme");
    expect(result.isSocialOrDirectoryProfile).toBe(true);
  });

  it("marks bot-protection responses as blocked rather than broken", async () => {
    mockedFetch.mockResolvedValue(response({ status: 403 }));
    expect(await checkSite("https://acme.example/")).toMatchObject({ reachable: false, blocked: true, statusCode: 403 });
    mockedFetch.mockResolvedValue(response({ status: 500 }));
    expect(await checkSite("https://acme.example/")).toMatchObject({ reachable: false, blocked: false });
  });

  it("records fetch failures, including private-address refusals", async () => {
    mockedFetch.mockRejectedValue(new UnsafeUrlError("That website resolves to a private address and can't be audited."));
    const result = await checkSite("http://[::ffff:a9fe:a9fe]/");
    expect(result.reachable).toBe(false);
    expect(result.error).toMatch(/private address/);
  });
});
