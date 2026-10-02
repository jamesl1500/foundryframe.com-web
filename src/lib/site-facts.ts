/**
 * Site Facts - Foundry Frame
 * ============================
 * Small facts that show up on several pages (and in the chat assistant's
 * knowledge), kept in one place so they can't drift apart.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

/* --- Availability ---
   James answers calls and email on weekday evenings and Saturdays. The site
   pushes everyone to the booking link rather than promising daytime hours. */
export const BUSINESS_HOURS_PHRASE = "on weekday evenings and Saturdays";
export const BUSINESS_HOURS_LINES = [
  "Mon – Fri: 6:00 PM – 9:00 PM ET",
  "Sat: 10:00 AM – 4:00 PM ET",
] as const;

/* schema.org openingHoursSpecification for the LocalBusiness JSON-LD. */
export const OPENING_HOURS_SPECIFICATION = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "18:00",
    closes: "21:00",
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
