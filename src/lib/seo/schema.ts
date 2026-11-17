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

export const SITE_URL = "https://www.foundryframe.com";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

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
