/**
 * Site Facts - Foundry Frame
 * ============================
 * Small facts that show up on several pages (and in the chat assistant's
 * knowledge), kept in one place so they can't drift apart.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

/* --- Name, address, phone ---
   Keep these identical everywhere (site, schema, Google Business Profile,
   directory listings): Google matches citations on exact NAP details. */
export const BUSINESS_PHONE = "+1-216-889-7822";
export const BUSINESS_EMAIL = "jlatten@foundryframe.com";
export const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Lorain",
  addressRegion: "OH",
  postalCode: "44053",
  addressCountry: "US",
};
export const GEO_COORDINATES = {
  "@type": "GeoCoordinates",
  latitude: 41.468,
  longitude: -82.1884,
};
// Google Business Profile share link.
export const GOOGLE_MAPS_URL = "https://share.google/MfrKTPNLPCBWTl4O0";

/* --- Availability ---
   James answers calls and email on weekday evenings and Saturdays. The site
   pushes everyone to the booking link rather than promising daytime hours. */
export const BUSINESS_HOURS_PHRASE = "on weekdays and Saturdays";
export const BUSINESS_HOURS_LINES = [
  "Mon – Fri: 9:00 AM – 5:00 PM ET",
  "Sat: 10:00 AM – 4:00 PM ET",
] as const;

/* schema.org openingHoursSpecification for the LocalBusiness JSON-LD. */
export const OPENING_HOURS_SPECIFICATION = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Saturday"],
    opens: "10:00",
    closes: "16:00",
  },
];

/* --- Founding Client offer --- */
export const FOUNDING_SPOTS_OPEN = 3;
export const FOUNDING_DISCOUNT_PERCENT = 20;

/* --- In-house products ---
   Case studies for products Foundry Frame built and runs itself (not client
   work). Matched against a case study's slug, title, or client name. */
const IN_HOUSE_PRODUCTS = ["syllaplan", "prereqpilot"];

export function isInHouseProduct(study: {
  slug?: string | null;
  title?: string | null;
  client_name?: string | null;
}) {
  const haystack = [study.slug, study.title, study.client_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return IN_HOUSE_PRODUCTS.some((name) => haystack.includes(name));
}
