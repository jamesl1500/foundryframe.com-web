import { chromium } from "playwright";
import type { SiteCrawlSnapshot } from "@/lib/leads/types";
import { clipText } from "@/lib/leads/utils";

interface CrawlResult {
  snapshot: SiteCrawlSnapshot;
  screenshotBuffer: Buffer;
}

export async function crawlWebsiteWithPlaywright(url: string): Promise<CrawlResult> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 2200 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    });

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });

    await page.waitForTimeout(1200);

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: "jpeg",
      quality: 80,
    });

    const pageData = await page.evaluate(() => {
      const text = document.body?.innerText ?? "";
      const words = text
        .split(/\s+/g)
        .map((entry) => entry.trim())
        .filter(Boolean);

      const images = Array.from(document.querySelectorAll("img"));
      const links = Array.from(document.querySelectorAll("a[href]"));
      const origin = window.location.origin;

      const normalizedInternal = new Set<string>();
      const normalizedExternal = new Set<string>();

      for (const anchor of links) {
        const href = anchor.getAttribute("href");
        if (!href) continue;

        try {
          const resolved = new URL(href, window.location.href).toString();
          if (resolved.startsWith(origin)) {
            normalizedInternal.add(resolved);
          } else if (resolved.startsWith("http")) {
            normalizedExternal.add(resolved);
          }
        } catch {
          // Ignore non-URL href values.
        }
      }

      const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
        .map((node) => node.textContent?.trim() ?? "")
        .filter((entry) => entry.length > 0)
        .slice(0, 20);

      const hasOpenGraph = Boolean(document.querySelector('meta[property^="og:"]'));
      const hasTwitterCard = Boolean(document.querySelector('meta[name^="twitter:"]'));

      const mobileFriendlySignals: string[] = [];
      if (document.querySelector('meta[name="viewport"]')) {
        mobileFriendlySignals.push("viewport-meta-present");
      }
      if (window.innerWidth <= 768) {
        mobileFriendlySignals.push("mobile-width-layout");
      }

      const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

      return {
        title: document.title || "",
        metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
        canonicalUrl: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
        robotsMeta: document.querySelector('meta[name="robots"]')?.getAttribute("content") || "",
        viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute("content") || "",
        h1Count: document.querySelectorAll("h1").length,
        h2Count: document.querySelectorAll("h2").length,
        h3Count: document.querySelectorAll("h3").length,
        wordCount: words.length,
        imageCount: images.length,
        missingAltCount: images.filter((img) => !img.getAttribute("alt") || img.getAttribute("alt")?.trim() === "").length,
        internalLinks: Array.from(normalizedInternal).slice(0, 20),
        externalLinks: Array.from(normalizedExternal).slice(0, 20),
        hasOpenGraph,
        hasTwitterCard,
        mobileFriendlySignals,
        topHeadings: headings,
        aboveTheFoldText: text.slice(0, 2500),
        loadTimeMs: navigationTiming ? Math.round(navigationTiming.loadEventEnd) : null,
      };
    });

    const snapshot: SiteCrawlSnapshot = {
      finalUrl: page.url(),
      title: pageData.title,
      metaDescription: pageData.metaDescription,
      canonicalUrl: pageData.canonicalUrl,
      robotsMeta: pageData.robotsMeta,
      h1Count: pageData.h1Count,
      h2Count: pageData.h2Count,
      h3Count: pageData.h3Count,
      wordCount: pageData.wordCount,
      imageCount: pageData.imageCount,
      missingAltCount: pageData.missingAltCount,
      internalLinkCount: pageData.internalLinks.length,
      externalLinkCount: pageData.externalLinks.length,
      hasOpenGraph: pageData.hasOpenGraph,
      hasTwitterCard: pageData.hasTwitterCard,
      viewportMeta: pageData.viewportMeta,
      loadTimeMs: pageData.loadTimeMs,
      mobileFriendlySignals: pageData.mobileFriendlySignals,
      topHeadings: pageData.topHeadings,
      sampleInternalLinks: pageData.internalLinks,
      sampleExternalLinks: pageData.externalLinks,
      aboveTheFoldText: clipText(pageData.aboveTheFoldText, 2500),
    };

    if (!response) {
      throw new Error("Unable to load website.");
    }

    return {
      snapshot,
      screenshotBuffer,
    };
  } finally {
    await browser.close();
  }
}
