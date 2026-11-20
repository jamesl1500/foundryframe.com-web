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
 * Update the price there too (lib/package-builder/catalog.ts,
 * lib/chat/knowledge.ts) if it changes.
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
  summary:
    "Add Print Shop to any package for $150. We design and print business cards, postcards, custom #10 and A6 envelopes, and tri-fold brochures that match your new brand.",
  metaTitle: "Print Shop: Business Cards & Brochures, $150",
  metaDescription:
    "Add Print Shop to any Foundry Frame package for $150: business cards, postcards, custom #10 and A6 envelopes, and tri-fold brochures, designed and printed.",
} as const;

export type PrintItem = {
  name: string;
  /** Short spec shown on a chip. */
  spec: string;
  description: string;
};

export const PRINT_ITEMS: PrintItem[] = [
  {
    name: "Business cards",
    spec: "Standard 3.5 × 2 in",
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
    description:
      "Branded #10 business envelopes for invoices and letters, and A6 envelopes for thank-you notes, invitations, and cards.",
  },
  {
    name: "Tri-fold brochures",
    spec: "Letter-size, six panels",
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
    a: "Design and printing of business cards, postcards, custom envelopes in #10 and A6 sizes, and tri-fold brochures, all matched to the brand on your new website. It's a flat $150 on top of any Foundry Frame package.",
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
    a: "We confirm print quantities, paper stock, and finishes with you at kickoff, based on how you'll use each piece. If you need larger runs or specialty finishes, we'll quote those before anything is printed.",
  },
  {
    q: "Can I order Print Shop without a website?",
    a: "Print Shop is an add-on, so it's offered alongside a Foundry Frame package, including maintenance and marketing plans for businesses that already have a site. For a standalone print project, see our graphic design services.",
  },
];
