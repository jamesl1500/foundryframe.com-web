/**
 * Ad Landing Pages - Foundry Frame
 * ==================================
 * Content for the no-distraction pages at /go/<slug>: one audience, one
 * offer, one short form, no site menu. Ads, social posts and outreach emails
 * link here (with UTM tags) instead of the homepage. They're kept out of
 * search results, since each one only makes sense next to its ad.
 *
 * Add a page by adding an entry. Keep every claim true: prices and offers
 * come from the same constants the rest of the site uses.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { FOUNDING_DISCOUNT_PERCENT, FOUNDING_SPOTS_OPEN } from "@/lib/site-facts";

/** Every ad landing page lives under this path. */
export const AD_PAGE_PREFIX = "/go/";

export type Funnel = {
  slug: string;
  /** Browser tab and link-preview title. */
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  /** Why this audience needs it, in their terms. */
  problems: ReadonlyArray<{ title: string; body: string }>;
  /** What they get, as short lines. */
  includes: readonly string[];
  price: { label: string; amount: string; note: string };
  /** Optional time-limited offer shown under the price. */
  offer?: string;
  steps: ReadonlyArray<{ title: string; body: string }>;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
  form: {
    heading: string;
    body: string;
    /** Label for the "where are you online now" field. */
    linkLabel: string;
    linkPlaceholder: string;
    submitLabel: string;
  };
};

const IGNITE_PRICE = 2500;
const formatUsd = (value: number) => `$${value.toLocaleString("en-US")}`;

export const funnels: readonly Funnel[] = [
  {
    slug: "no-website",
    title: "Get a Real Website for Your Business",
    description:
      "Running your business off Instagram or Facebook? Foundry Frame builds custom small business websites from $1,500, designed and coded by the founder.",
    eyebrow: "For businesses running on Instagram or Facebook",
    headline: "Your customers are searching for you. Give them a website to find.",
    subhead:
      "A social page is a good start, but it isn't a home base. A website puts your hours, services, prices and a way to reach you in one place you own, where people searching Google can find it.",
    problems: [
      {
        title: "Searchers land somewhere else",
        body: "When someone searches your business name or what you sell, they find directories, look-alike names, or a competitor's site instead of you.",
      },
      {
        title: "Your info is buried in posts",
        body: "Hours, menus, prices and booking details scroll away under new posts, so customers message you the same questions over and over.",
      },
      {
        title: "You don't control the platform",
        body: "The algorithm decides who sees your posts, and an account lockout can cut you off from customers overnight.",
      },
    ],
    includes: [
      "Up to 5 custom-designed pages, not a template",
      "Built for phones first, where most of your visitors are",
      "Contact form, Google Maps and links to your social pages",
      "Search basics set up: titles, descriptions and Google Analytics",
      "Designed and coded by James, the founder, start to finish",
    ],
    price: {
      label: "Custom websites start at",
      amount: "$1,500",
      note: "The Spark package. Need a logo and social profiles set up too? The Ignite launch bundle covers all of it.",
    },
    offer: `Founding Client offer: ${FOUNDING_SPOTS_OPEN} spots this quarter at ${FOUNDING_DISCOUNT_PERCENT}% off any launch bundle. Ignite drops from ${formatUsd(IGNITE_PRICE)} to ${formatUsd(Math.round(IGNITE_PRICE * (1 - FOUNDING_DISCOUNT_PERCENT / 100)))}.`,
    steps: [
      { title: "Send your link", body: "Tell us where your business lives online now. It takes about 30 seconds." },
      { title: "Get a plan", body: "James looks at your page and emails you a short plan and a price for your site." },
      { title: "Launch", body: "If it's a fit, we design, build and launch your site, and link it everywhere customers find you." },
    ],
    faqs: [
      {
        question: "Do I have to give up my Instagram or Facebook?",
        answer: "No. Your website links to them and shows them off. Social keeps people engaged; the website is where they go to act.",
      },
      {
        question: "How much does it cost?",
        answer: "Custom websites start at $1,500, and the Ignite bundle with a logo and social setup starts at $2,500. You get a firm price before any work starts.",
      },
      {
        question: "How long does it take?",
        answer: "A 5-page website takes about 6 weeks from kickoff, depending on how quickly we get your photos and content.",
      },
    ],
    form: {
      heading: "Get your website plan",
      body: "No call needed to start. Send your link and James will email you a plan and a price.",
      linkLabel: "Where are you online now? *",
      linkPlaceholder: "instagram.com/yourbusiness",
      submitLabel: "Send me a plan",
    },
  },
];

export function getFunnel(slug: string) {
  return funnels.find((funnel) => funnel.slug === slug);
}
