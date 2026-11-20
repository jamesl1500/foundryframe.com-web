/**
 * Print Shop Add-On - Foundry Frame
 * ===================================
 * The Print Shop add-on: for a flat $150 on top of any package, we design
 * and print business cards, postcards, custom envelopes (#10 and A6), and
 * tri-fold brochures that match the brand on your new website. Paired
 * with The Spark, it's the simplest way to launch online and in print at
 * the same time.
 *
 * Feeds the /packages/print-shop page, the PrintShopAddOn panel on every
 * package page, the package builder add-on, and the chat knowledge.
 * Update the price and included quantities there too
 * (lib/package-builder/catalog.ts, lib/chat/knowledge.ts) if they change.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export const PRINT_SHOP = {
  name: "Print Shop",
  slug: "print-shop",
  href: "/packages/print-shop",
  /** Flat add-on price in USD, on top of any package. */
  price: 150,
  priceLabel: "$150",
  badge: "New",
  tagline: "Your brand, in their hands.",
  /** Larger runs are custom-priced, starting at this amount (USD). */
  largerRunsFrom: 150,
  largerRunsLabel: "$150",
  summary:
    "Add Print Shop to any package for $150. We design and print 100 business cards, 50 custom #10 envelopes, and 50 tri-fold brochures, plus postcards and A6 envelopes, to match your new brand.",
  metaTitle: "Print Shop: Business Cards & Brochures, $150",
  metaDescription:
    "Add Print Shop to any Foundry Frame package for $150: 100 business cards, 50 custom #10 envelopes, and 50 tri-fold brochures, designed and printed.",
} as const;

/** Minimum quantities every $150 Print Shop order includes. */
export const PRINT_SHOP_INCLUDED = [
  { quantity: 100, item: "business cards" },
  { quantity: 50, item: "custom #10 envelopes" },
  { quantity: 50, item: "tri-fold brochures" },
] as const;

/** "100 business cards, 50 custom #10 envelopes, and 50 tri-fold brochures" */
export const PRINT_SHOP_INCLUDED_TEXT = PRINT_SHOP_INCLUDED.map(
  ({ quantity, item }, i) =>
    `${i === PRINT_SHOP_INCLUDED.length - 1 ? "and " : ""}${quantity} ${item}`,
).join(", ");

/** One line on going past the included quantities. */
export const PRINT_SHOP_LARGER_RUNS = `Need more? Larger runs are custom-priced, starting at ${PRINT_SHOP.largerRunsLabel}.`;

export type PrintItem = {
  name: string;
  /** Short spec shown on a chip. */
  spec: string;
  /** Quantity included in the $150, when there is a set minimum. */
  included?: string;
  description: string;
};

export const PRINT_ITEMS: PrintItem[] = [
  {
    name: "Business cards",
    spec: "Standard 3.5 × 2 in",
    included: "100 included",
    description:
      "Two-sided cards with your logo, contact details, and a QR code to your new site, so every handshake ends on your homepage.",
  },
  {
    name: "Postcards",
    spec: "Mailers & leave-behinds",
    description:
      "Direct-mail postcards and counter leave-behinds for announcing your launch, a grand opening, a seasonal offer, or a new service.",
  },
  {
    name: "Custom envelopes",
    spec: "#10 and A6",
    included: "50 #10 envelopes included",
    description:
      "Branded #10 business envelopes for invoices and letters, and A6 envelopes for thank-you notes, invitations, and cards.",
  },
  {
    name: "Tri-fold brochures",
    spec: "Letter-size, six panels",
    included: "50 included",
    description:
      "A six-panel brochure that walks customers through your services, pricing, and story, written and laid out to match your site.",
  },
];

/** Plain-language names for lists and schema ("business cards, postcards, ..."). */
export const PRINT_ITEM_NAMES = [
  "business cards",
  "postcards",
  "custom #10 and A6 envelopes",
  "tri-fold brochures",
] as const;

export const PRINT_SHOP_FAQS = [
  {
    q: "What does the $150 Print Shop add-on include?",
    a: "Design and printing of at least 100 business cards, 50 custom #10 envelopes, and 50 tri-fold brochures, plus postcards and A6 envelopes, all matched to the brand on your new website. It's a flat $150 on top of any Foundry Frame package.",
  },
  {
    q: "Can I add Print Shop to any package?",
    a: "Yes. Print Shop can be added to every website package, launch bundle, maintenance plan, and marketing package. It pairs best with The Spark: you launch a custom 5-page website and matching print pieces at the same time.",
  },
  {
    q: "Why pair Print Shop with The Spark?",
    a: "The Spark gives a new business a custom website from $1,500. Adding Print Shop for $150 puts the same logo, colors, and message on your business cards, postcards, envelopes, and brochures, so customers see one consistent brand online and in person from day one.",
  },
  {
    q: "Do you design the pieces, or just print them?",
    a: "Both. We design every piece around your brand and your website, send proofs for your approval, then handle printing. You also get the print-ready files to keep.",
  },
  {
    q: "How many pieces are printed, and on what paper?",
    a: "Every Print Shop order includes at least 100 business cards, 50 custom #10 envelopes, and 50 tri-fold brochures. Need more than that? Larger runs are custom-priced starting at $150, and we quote them before anything is printed. Postcard and A6 envelope quantities, paper stock, and finishes are confirmed with you at kickoff.",
  },
  {
    q: "Can I order Print Shop without a website?",
    a: "Print Shop is an add-on, so it's offered alongside a Foundry Frame package, including maintenance and marketing plans for businesses that already have a site. For a standalone print project, see our graphic design services.",
  },
];
