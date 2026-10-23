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

const FOUNDING_OFFER = `Founding Client offer: ${FOUNDING_SPOTS_OPEN} spots this quarter at ${FOUNDING_DISCOUNT_PERCENT}% off any launch bundle. Ignite drops from ${formatUsd(IGNITE_PRICE)} to ${formatUsd(Math.round(IGNITE_PRICE * (1 - FOUNDING_DISCOUNT_PERCENT / 100)))}.`;

/* --- City ad pages ---
   One per service-area city, for local Google Search and Meta ads. The
   audience, headline and problems are written for each city; the package,
   price and process are the same everywhere, so they're shared here. */
type CityFunnelInput = {
  slug: string;
  city: string;
  /** Who the page is for, e.g. "For Lakewood restaurants, bars and shops". */
  eyebrow: string;
  headline: string;
  subhead: string;
  problems: Funnel["problems"];
  /** How we meet with businesses in this city, answered in the FAQ. */
  meeting: string;
  linkPlaceholder?: string;
};

function cityFunnel(input: CityFunnelInput): Funnel {
  const { slug, city } = input;
  return {
    slug,
    title: `Web Design for ${city} Small Businesses`,
    description: `Custom websites for ${city}, Ohio small businesses from $1,500, designed and coded by Foundry Frame's founder. Send your link and get a plan and a price.`,
    eyebrow: input.eyebrow,
    headline: input.headline,
    subhead: input.subhead,
    problems: input.problems,
    includes: [
      "Up to 5 custom-designed pages, not a template",
      "Built for phones first, where most of your visitors are",
      `Local search setup so ${city} customers can find you on Google and Maps`,
      "Contact or quote form, click-to-call and links to your social pages",
      "Designed and coded by James, the founder, start to finish",
    ],
    price: {
      label: "Custom websites start at",
      amount: "$1,500",
      note: "The Spark package. Need a logo and social profiles set up too? The Ignite launch bundle covers all of it.",
    },
    offer: FOUNDING_OFFER,
    steps: [
      { title: "Send your link", body: "Your current website, Facebook or Instagram page. It takes about 30 seconds." },
      { title: "Get a plan", body: "James looks at what you have now and emails you a short plan and a firm price." },
      { title: "Launch", body: "If it's a fit, we design, build and launch your site, usually in about 6 weeks." },
    ],
    faqs: [
      { question: `Do you work with ${city} businesses in person?`, answer: input.meeting },
      {
        question: "How much does it cost?",
        answer: "Custom websites start at $1,500, and the Ignite bundle with a logo and social setup starts at $2,500. You get a firm price before any work starts.",
      },
      {
        question: "I already have a website. Can you help?",
        answer: "Yes. Send the link and James will tell you whether it needs a rebuild or a few targeted fixes. If fixes are enough, he'll say so.",
      },
      {
        question: "Can I update the site myself?",
        answer: "Yes. Sites come with a simple editor and a recorded walkthrough, so changing hours, prices or photos takes a few minutes.",
      },
    ],
    form: {
      heading: `Get your ${city} website plan`,
      body: "No call needed to start. Send your link and James will email you a plan and a price.",
      linkLabel: "Your current website or social page *",
      linkPlaceholder: input.linkPlaceholder ?? "yourbusiness.com or facebook.com/yourbusiness",
      submitLabel: "Send me a plan",
    },
  };
}

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
    offer: FOUNDING_OFFER,
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
  cityFunnel({
    slug: "cleveland",
    city: "Cleveland",
    eyebrow: "For Cleveland small businesses and growing brands",
    headline: "An agency-quality website without the agency bill.",
    subhead:
      "Foundry Frame is a founder-led studio 30 minutes west in Lorain. You work directly with the person designing and coding your site, at small-business pricing.",
    problems: [
      {
        title: "Agency quotes that don't fit",
        body: "Big Cleveland agencies price for big clients. A small business ends up paying for account managers and an office lease, not the website.",
      },
      {
        title: "A template that looks like everyone else",
        body: "DIY builders get you online, but your site looks like the competitor's next door and is slow on the phones your customers use.",
      },
      {
        title: "A crowded search page",
        body: "Whatever you sell in Cleveland, customers see several options in one search. A dated or confusing site makes the choice for them.",
      },
    ],
    meeting:
      "Yes. We're based in Lorain, about 30 minutes from downtown Cleveland, and meet Cleveland-area clients in person or by video, whichever you prefer.",
  }),
  cityFunnel({
    slug: "westlake",
    city: "Westlake",
    eyebrow: "For Westlake practices, firms and shops",
    headline: "A website that looks as established as your practice.",
    subhead:
      "Westlake customers compare a few options on their phone before they call. We build custom sites that earn trust, explain your services and make booking the obvious next step.",
    problems: [
      {
        title: "Dated next to the competition",
        body: "Prospective patients and clients judge you by your website first, and they notice when yours looks older than the office down Detroit Road.",
      },
      {
        title: "Booking only by phone",
        body: "If the only way to reach you is calling during office hours, people who search in the evening book with someone else.",
      },
      {
        title: "Missing from nearby searches",
        body: "Your customers also search Rocky River, Bay Village and North Olmsted. If your site only mentions your street address, you miss them.",
      },
    ],
    meeting:
      "Yes. We're based in Lorain, about 20 minutes away, so in-person kickoffs and design reviews in Westlake are easy to set up.",
  }),
  cityFunnel({
    slug: "lakewood",
    city: "Lakewood",
    eyebrow: "For Lakewood restaurants, bars, salons and shops",
    headline: "Your menu changed. Did your website?",
    subhead:
      "We build fast, simple websites for Lakewood independents on Detroit and Madison: current menus and hours, bookings or reservations, and a site you can update from your phone.",
    problems: [
      {
        title: "Instagram isn't enough on Google",
        body: "When someone searches \"brunch in Lakewood\" or checks Maps, they're sent to a website. Without one, they land on a third-party page you don't control.",
      },
      {
        title: "Hours and menus out of date",
        body: "When your site, Google and your posts disagree about whether you're open, customers pick the place that's clear.",
      },
      {
        title: "Dozens of competitors within a few blocks",
        body: "On a busy strip, a distinct look and a fast mobile site are what get you picked from the search results.",
      },
    ],
    meeting:
      "Yes. We're based in Lorain, about half an hour from Lakewood, and can meet at your shop or by video.",
    linkPlaceholder: "instagram.com/yourbusiness",
  }),
  cityFunnel({
    slug: "north-ridgeville",
    city: "North Ridgeville",
    eyebrow: "For North Ridgeville contractors and home services",
    headline: "New neighbors are searching for help. Be the one they call.",
    subhead:
      "North Ridgeville keeps growing, and new residents don't have neighbors to ask yet, so they search. We build sites with clear services, the areas you cover, reviews, and a call button on every screen.",
    problems: [
      {
        title: "Word of mouth doesn't reach new subdivisions",
        body: "Referrals carry you with people who already know you. Families who just moved in find contractors and services on Google.",
      },
      {
        title: "No way to request a quote",
        body: "If a homeowner can't see what you do and ask for a quote in a minute, they move on to the next result.",
      },
      {
        title: "Your work isn't shown off",
        body: "Photos of finished jobs sell better than any description. Most trades websites hide them or don't have them at all.",
      },
    ],
    meeting:
      "Yes. We're about 20 minutes away in Lorain, so we can meet on site and photograph your work for the website.",
  }),
  cityFunnel({
    slug: "sheffield",
    city: "Sheffield",
    eyebrow: "For Sheffield Village and Sheffield Lake businesses",
    headline: "Your customers search in Avon and Lorain too. Show up there.",
    subhead:
      "Sheffield businesses serve the whole area, not just the village or city line. We build straightforward, affordable websites that put your services, hours, reviews and phone number in front of nearby searchers.",
    problems: [
      {
        title: "Losing searches to the next town",
        body: "A new customer searches, and the competitor in Avon Lake or Elyria shows up first because their website says where they work.",
      },
      {
        title: "Running on a Facebook page",
        body: "Facebook is fine for regulars, but it doesn't rank well on Google and buries your hours and services under old posts.",
      },
      {
        title: "No time to deal with it",
        body: "You're running the shop or the job site. You need someone local to handle the website and tell you plainly what it costs.",
      },
    ],
    meeting:
      "Yes. We're in Lorain, about 10 minutes away, so meeting at your shop, job site or kitchen table is easy.",
  }),
  cityFunnel({
    slug: "oberlin",
    city: "Oberlin",
    eyebrow: "For Oberlin shops, restaurants, nonprofits and arts groups",
    headline: "One website for students, residents and supporters.",
    subhead:
      "Oberlin's audience is wide: students and visiting families, longtime residents, and members or donors who live far away. We build accessible, fast websites that make it clear how to visit, buy, donate or get involved.",
    problems: [
      {
        title: "Visitors can't tell what to do next",
        body: "Hours, directions, tickets, donations and events scattered across pages and posts make people give up before they act.",
      },
      {
        title: "Hard for some visitors to use",
        body: "Small text, low contrast and missing labels shut out part of the audience you're trying to reach.",
      },
      {
        title: "Only one person can update it",
        body: "When the volunteer or staffer who built the site moves on, it freezes. Your site should be easy for anyone on the team to edit.",
      },
    ],
    meeting:
      "Yes. We're about 25 minutes away in Lorain and can meet downtown for kickoffs and design reviews.",
  }),
  cityFunnel({
    slug: "vermilion",
    city: "Vermilion",
    eyebrow: "For Vermilion shops, restaurants, marinas and seasonal businesses",
    headline: "Ready for the visitors searching from the harbor.",
    subhead:
      "Summer visitors decide where to eat, shop and dock from their phones. We build quick, mobile-first websites with seasonal hours, events, menus and booking you can update as the season changes.",
    problems: [
      {
        title: "Day-trippers don't know you yet",
        body: "Visitors haven't heard of you. They search \"Vermilion restaurants\" or \"things to do in Vermilion\" and go where the search sends them.",
      },
      {
        title: "Seasonal hours cause confusion",
        body: "When winter hours are still posted in July, or summer hours in January, customers show up to a locked door or don't come at all.",
      },
      {
        title: "Slow on a phone signal at the lake",
        body: "Heavy sites crawl on a weak signal. A fast, light site loads where your visitors actually are.",
      },
    ],
    meeting:
      "Yes. We're based in Lorain, about 15 minutes east of downtown Vermilion, so in-person meetings are easy.",
  }),
  cityFunnel({
    slug: "akron",
    city: "Akron",
    eyebrow: "For Akron manufacturers, B2B suppliers and local businesses",
    headline: "Your capabilities have grown. Has your website?",
    subhead:
      "Many Akron shops and suppliers run on websites built a decade ago that undersell what they can do. We build custom sites that explain technical capabilities clearly for buyers, or bring in local customers for neighborhood businesses.",
    problems: [
      {
        title: "Buyers can't find your capabilities",
        body: "Engineers and purchasing managers want equipment lists, tolerances, materials and certifications fast. If they can't find them, they request a quote elsewhere.",
      },
      {
        title: "A site that looks older than your shop",
        body: "An outdated website makes a modern operation look behind the times to a new buyer who has never seen your floor.",
      },
      {
        title: "Quote requests go nowhere",
        body: "A generic contact form with no way to attach drawings or specs slows down the exact leads you want most.",
      },
    ],
    meeting:
      "Yes. We're a little under an hour away in Lorain. We can meet in person for a kickoff or work remotely, whichever is easier for you.",
  }),
  cityFunnel({
    slug: "columbus",
    city: "Columbus",
    eyebrow: "For Columbus startups, brands and small businesses",
    headline: "Stand out in Ohio's most crowded market.",
    subhead:
      "Whatever you sell in Columbus, customers see several competitors in one search. We're a founder-led Ohio studio: you work directly with the person designing and coding your site, at small-business pricing.",
    problems: [
      {
        title: "Lost in a crowded search",
        body: "Columbus keeps growing, and so does the competition. A site that looks like everyone else's gives customers no reason to pick you.",
      },
      {
        title: "Agency pricing for a small team",
        body: "Columbus agencies are built for big budgets. You need a strong site and a clear price, not a retainer.",
      },
      {
        title: "A brand that's outgrown its site",
        body: "Your product and audience moved on, but the launch-day template didn't. Visitors notice the gap.",
      },
    ],
    meeting:
      "We work with Columbus clients remotely, with video calls and clickable previews at every stage. Our studio is in Lorain, about two hours north. An in-person kickoff can be arranged for larger projects.",
  }),
];

export function getFunnel(slug: string) {
  return funnels.find((funnel) => funnel.slug === slug);
}
