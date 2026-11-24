/* SEO guardrails for the data-driven landing pages (locations, industries,
   industry x area pages, packages, ad funnels). Each list feeds hundreds of
   indexed URLs, so a long title or a duplicate slug here is a site-wide
   problem. Limits follow what Google shows: ~60 characters of title and
   ~155-160 of description. */
import { describe, expect, it } from "vitest";
import { funnels } from "@/lib/funnels";
import { launchBundles } from "@/lib/packages/launch";
import { websitePackages } from "@/lib/packages/website";
import { PRINT_SHOP } from "@/lib/packages/print-shop";
import { industries } from "@/lib/seo/industries";
import { industryAreas } from "@/lib/seo/industry-areas";
import { citiesOf, findLocationByName, locations, relatedLocations } from "@/lib/seo/locations";
import { seoTitle } from "@/lib/seo/meta";
import { AREA_SERVED, breadcrumbList, faqPage, webPage } from "@/lib/seo/schema";

const SUFFIX = " | Foundry Frame";
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** The title as it renders in the browser tab and search results. */
function rendered(title: string | { absolute: string }) {
  return typeof title === "string" ? `${title}${SUFFIX}` : title.absolute;
}

function expectUnique(values: string[], label: string) {
  const dupes = values.filter((value, i) => values.indexOf(value) !== i);
  expect(dupes, `duplicate ${label}`).toEqual([]);
}

function expectDescription(text: string, where: string) {
  expect(text.length, `${where} description length (${text.length}): ${text}`).toBeGreaterThanOrEqual(70);
  expect(text.length, `${where} description length (${text.length}): ${text}`).toBeLessThanOrEqual(160);
}

describe("locations", () => {
  it("have unique, well-formed slugs and cities", () => {
    expectUnique(locations.map((l) => l.slug), "location slug");
    expectUnique(locations.map((l) => l.city), "location city");
    for (const location of locations) expect(location.slug).toMatch(SLUG);
  });

  it("have titles and descriptions that fit in search results", () => {
    for (const location of locations) {
      expect(rendered(`Web Design in ${location.city}, OH`).length, location.city).toBeLessThanOrEqual(60);
      expectDescription(location.metaDescription, `/locations/${location.slug}`);
    }
  });

  it("each link to other location pages (no orphans)", () => {
    for (const location of locations) {
      expect(relatedLocations(location).length, location.slug).toBeGreaterThan(0);
    }
  });

  it("have FAQs to mark up", () => {
    for (const location of locations) expect(location.faqs.length, location.slug).toBeGreaterThan(0);
  });

  it("look up by name and relate to other locations", () => {
    const first = locations[0];
    expect(findLocationByName(first.city)?.slug).toBe(first.slug);
    expect(findLocationByName("Atlantis")).toBeUndefined();
    const combined = locations.find((l) => citiesOf(l).length > 1);
    if (combined) expect(findLocationByName(citiesOf(combined)[1])).toBe(combined);
    const related = relatedLocations(first, 4);
    expect(related.length).toBeLessThanOrEqual(4);
    expect(related.map((l) => l.slug)).not.toContain(first.slug);
    expect(citiesOf(first)).toContain(first.city);
  });
});

describe("industries", () => {
  it("have unique, well-formed slugs", () => {
    expectUnique(industries.map((i) => i.slug), "industry slug");
    for (const industry of industries) expect(industry.slug).toMatch(SLUG);
  });

  it("have descriptions that fit in search results", () => {
    for (const industry of industries) expectDescription(industry.metaDescription, `/industries/${industry.slug}`);
  });
});

describe("industry x area pages", () => {
  it("point at real industries and have unique URLs", () => {
    const known = new Set(industries.map((i) => i.slug));
    for (const page of industryAreas) {
      expect(known.has(page.industrySlug), `${page.industrySlug}/${page.areaSlug}`).toBe(true);
      expect(page.areaSlug).toMatch(SLUG);
    }
    expectUnique(industryAreas.map((p) => `${p.industrySlug}/${p.areaSlug}`), "industry area URL");
    expectUnique(industryAreas.map((p) => p.title), "industry area title");
  });

  it("have titles and descriptions that fit in search results", () => {
    for (const page of industryAreas) {
      const where = `/industries/${page.industrySlug}/${page.areaSlug}`;
      expect(rendered(seoTitle(page.title)).length, `${where}: ${page.title}`).toBeLessThanOrEqual(60);
      expectDescription(page.metaDescription, where);
    }
  });
});

describe("packages", () => {
  const all = [
    ...websitePackages.map((p) => ({ ...p, path: `/packages/website/${p.slug}` })),
    ...launchBundles.map((p) => ({ ...p, path: `/packages/launch/${p.slug}` })),
  ];

  it("have unique slugs and titles", () => {
    expectUnique(websitePackages.map((p) => p.slug), "website package slug");
    expectUnique(launchBundles.map((p) => p.slug), "launch bundle slug");
    expectUnique(all.map((p) => p.metaTitle), "package title");
  });

  it("have titles and descriptions that fit in search results", () => {
    for (const pkg of all) {
      expect(rendered(seoTitle(pkg.metaTitle)).length, `${pkg.path}: ${pkg.metaTitle}`).toBeLessThanOrEqual(60);
      expectDescription(pkg.metaDescription, pkg.path);
    }
    expect(rendered(seoTitle(PRINT_SHOP.metaTitle)).length).toBeLessThanOrEqual(60);
    expectDescription(PRINT_SHOP.metaDescription, PRINT_SHOP.href);
  });

  it("only suggest upgrades to packages that exist", () => {
    const websiteSlugs = new Set(websitePackages.map((p) => p.slug));
    const launchSlugs = new Set(launchBundles.map((p) => p.slug));
    for (const pkg of websitePackages) if (pkg.upgrade) expect(websiteSlugs.has(pkg.upgrade.slug), pkg.slug).toBe(true);
    for (const pkg of launchBundles) if (pkg.upgrade) expect(launchSlugs.has(pkg.upgrade.slug), pkg.slug).toBe(true);
  });
});

describe("ad funnels", () => {
  it("have unique, well-formed slugs", () => {
    expectUnique(funnels.map((f) => f.slug), "funnel slug");
    for (const funnel of funnels) expect(funnel.slug).toMatch(SLUG);
  });
});

describe("structured data helpers", () => {
  it("builds breadcrumbs from Home with absolute URLs", () => {
    const crumbs = breadcrumbList([{ name: "Packages", path: "/packages" }]);
    expect(crumbs.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.foundryframe.com" },
      { "@type": "ListItem", position: 2, name: "Packages", item: "https://www.foundryframe.com/packages" },
    ]);
  });

  it("builds FAQ and WebPage schema tied to the organization", () => {
    const faq = faqPage([{ q: "Q?", a: "A." }], "/faq");
    expect(faq["@id"]).toBe("https://www.foundryframe.com/faq#faq");
    expect(faq.mainEntity[0]).toEqual({ "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } });

    const page = webPage("AboutPage", { path: "/about", name: "About", description: "d" });
    expect(page.about).toEqual({ "@id": "https://www.foundryframe.com/#organization" });
  });

  it("lists each served city once, pinned to Ohio", () => {
    const cities = AREA_SERVED.filter((area) => area["@type"] === "City").map((area) => area.name);
    expectUnique(cities, "areaServed city");
    expect(cities.length).toBeGreaterThan(0);
  });
});
