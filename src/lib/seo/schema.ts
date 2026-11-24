/**
 * Structured data helpers - Foundry Frame
 * =========================================
 * Small builders for the schema.org JSON-LD that several pages share.
 * Every page points back to the one Organization declared in the root
 * layout (by @id) instead of declaring its own business.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { citiesOf, locations } from "@/lib/seo/locations";

export const SITE_URL = "https://www.foundryframe.com";

/* The deployment's public origin for sitemap/robots/canonical URLs:
   NEXT_PUBLIC_SITE_URL when set (no trailing slash), otherwise SITE_URL. */
export const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/+$/, "");
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

/* Every city with a /locations page, so service schema matches the pages.
   containedInPlace pins names like Columbus or Avon to Ohio, not another state. */
const OHIO = { "@type": "State", name: "Ohio" };
export const AREA_SERVED = [
  ...locations.flatMap((location) =>
    citiesOf(location).map((name) => ({ "@type": "City", name, containedInPlace: OHIO }))
  ),
  OHIO,
  { "@type": "Country", name: "United States" },
];

/** FAQPage from the question/answer pairs shown on the page. */
export function faqPage(faqs: readonly { q: string; a: string }[], path?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(path ? { "@id": `${absoluteUrl(path)}#faq`, url: absoluteUrl(path) } : {}),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/** BreadcrumbList from Home down to the current page. Home is added for you. */
export function breadcrumbList(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** A WebPage subtype (AboutPage, ContactPage, CollectionPage, ...) tied to the site and organization. */
export function webPage(
  type: string,
  { path, name, description, extra = {} }: { path: string; name: string; description: string; extra?: object }
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    ...extra,
  };
}
