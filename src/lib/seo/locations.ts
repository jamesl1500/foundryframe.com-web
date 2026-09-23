/**
 * Local SEO landing pages - Foundry Frame
 * =========================================
 * Content for /locations/[slug]. Each city gets its own copy (intro, local
 * angle, FAQ) rather than a find-and-replace of the same page, so the pages
 * earn rankings for "web design <city>" searches instead of reading as
 * doorway pages.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export type LocationPage = {
  slug: string;
  city: string;
  county: string;
  /** Short line used on the /locations hub card. */
  summary: string;
  metaDescription: string;
  intro: string[];
  localAngle: { title: string; description: string }[];
  nearby: string[];
  faqs: { q: string; a: string }[];
};

export const locations: LocationPage[] = [
  {
    slug: "lorain-oh",
    city: "Lorain",
    county: "Lorain County",
    summary: "Our home base. Custom websites for Lorain shops, trades, and service businesses.",
    metaDescription:
      "Lorain, Ohio web design from a local, founder-led studio. Custom, mobile-first websites for Lorain small businesses, starting at $1,500. Free website audit.",
    intro: [
      "Foundry Frame is based in Lorain, so when a Lorain business hires us they get a designer who can meet in person, knows the neighborhoods, and answers the phone. No offshore hand-offs, no account managers in between.",
      "Most local businesses we talk to have one of three problems: no website at all, a template site that hasn't been touched in years, or a site that looks fine but never makes the phone ring. We build custom websites that fix the last one, because that's the one that costs you money.",
    ],
    localAngle: [
      {
        title: "Built for “near me” searches",
        description:
          "People in Lorain search on their phones for “plumber near me” or “restaurants on the lake.” We set up your pages, Google Business Profile links, and local schema so you show up in those results.",
      },
      {
        title: "Meet in person",
        description:
          "Kickoffs and design reviews can happen over coffee in Lorain instead of a video call, which makes it much easier to get the details right.",
      },
      {
        title: "Priced for small business",
        description:
          "Custom sites start at $1,500. You get a real, hand-coded website at a price that makes sense for a local business, not an enterprise budget.",
      },
    ],
    nearby: ["Sheffield", "Sheffield Lake", "Amherst", "Elyria", "Vermilion", "Avon Lake"],
    faqs: [
      {
        q: "Do you work with businesses in Lorain in person?",
        a: "Yes. We're based in Lorain (44053), so in-person kickoff meetings and design reviews are easy to arrange anywhere in town.",
      },
      {
        q: "How much does a website cost for a Lorain small business?",
        a: "Our custom websites start at $1,500 for a focused 5-page site. Larger sites with booking, e-commerce, or more pages are quoted after a free discovery call.",
      },
      {
        q: "Can you help my Lorain business show up on Google Maps?",
        a: "Yes. Every site we build includes local SEO basics: location schema, consistent name/address/phone details, and guidance on setting up or cleaning up your Google Business Profile.",
      },
    ],
  },
  {
    slug: "elyria-oh",
    city: "Elyria",
    county: "Lorain County",
    summary: "Websites for Elyria service businesses, professional offices, and retailers.",
    metaDescription:
      "Elyria, Ohio web design for small businesses. Custom, fast, mobile-first websites built by a Lorain County studio. Starting at $1,500 with a free website audit.",
    intro: [
      "Elyria is the Lorain County seat, home to law offices, medical practices, contractors, and family-owned shops that compete with bigger Cleveland-area firms for the same customers. A modern website is how a local business wins that comparison.",
      "We're a 15-minute drive away in Lorain, so you get a local designer who can visit your office, photograph your space, and build a site around how your business actually works.",
    ],
    localAngle: [
      {
        title: "Look as credible as the big firms",
        description:
          "A fast, professional site puts your Elyria business on equal footing with Cleveland competitors when someone is comparing options on their phone.",
      },
      {
        title: "Clear paths to call or book",
        description:
          "Every page is designed around the action you want: a call, a booked appointment, or a quote request. We track those actions so you can see what the site brings in.",
      },
      {
        title: "Local SEO for Lorain County",
        description:
          "We structure your pages and business details so Google understands you serve Elyria and the surrounding county, not just your street address.",
      },
    ],
    nearby: ["North Ridgeville", "Grafton", "LaGrange", "Amherst", "Lorain", "Oberlin"],
    faqs: [
      {
        q: "Are you an Elyria web design company?",
        a: "We're based in neighboring Lorain and work with Elyria businesses regularly. In-person meetings in Elyria are easy to arrange.",
      },
      {
        q: "How long does it take to build a website for an Elyria business?",
        a: "Most projects launch in 6 to 12 weeks, depending on the number of pages and features. Smaller 5-page sites are on the faster end.",
      },
      {
        q: "Can you redesign my existing website instead of starting over?",
        a: "Yes. We start with a free audit of your current site, keep what's working (content, rankings, URLs), and rebuild the parts that are holding you back.",
      },
    ],
  },
  {
    slug: "avon-lake-oh",
    city: "Avon & Avon Lake",
    county: "Lorain County",
    summary: "Polished websites for Avon and Avon Lake boutiques, studios, and professional services.",
    metaDescription:
      "Web design for Avon and Avon Lake, Ohio businesses. Custom, conversion-focused websites from a Lorain County studio. Starting at $1,500. Free website audit.",
    intro: [
      "Avon and Avon Lake customers expect a polished experience, and they usually judge a business by its website before they ever walk in. If your site feels dated next to the shops and studios around you, you're losing people you never hear from.",
      "We design custom websites that match the quality of what you actually deliver, with booking, galleries, and contact paths built for people browsing on their phones.",
    ],
    localAngle: [
      {
        title: "Design that matches your brand",
        description:
          "Custom layouts, typography, and photography direction so your site feels like your storefront, not a template shared with a thousand other businesses.",
      },
      {
        title: "Online booking and inquiries",
        description:
          "We connect the scheduling and inquiry tools you already use so customers can book or request a quote without calling during business hours.",
      },
      {
        title: "Fast on every phone",
        description:
          "Hand-coded sites load quickly on mobile, which keeps visitors from bouncing and helps your Google rankings.",
      },
    ],
    nearby: ["Westlake", "Bay Village", "Sheffield", "North Ridgeville", "Lorain", "Elyria"],
    faqs: [
      {
        q: "Do you work with businesses in Avon and Avon Lake?",
        a: "Yes. We're based in nearby Lorain and can meet in person for kickoffs and reviews.",
      },
      {
        q: "Can you add online booking to my website?",
        a: "Yes. We integrate booking tools like Square, Acuity, Vagaro, Mindbody, or Google Calendar appointment schedules so customers can book directly from your site.",
      },
      {
        q: "Will I be able to update my own website?",
        a: "Yes. Most projects include a content system for editing text, photos, and posts, plus a recorded walkthrough so you're never stuck waiting on us.",
      },
    ],
  },
  {
    slug: "amherst-oh",
    city: "Amherst",
    county: "Lorain County",
    summary: "Straightforward, affordable websites for Amherst family businesses and trades.",
    metaDescription:
      "Amherst, Ohio web design for family businesses, trades, and shops. Custom mobile-first websites from a nearby Lorain studio, starting at $1,500.",
    intro: [
      "Amherst runs on family-owned businesses and word of mouth. A good website doesn't replace that; it's where those referrals go to check you out before they call. If they can't find you, or your site looks abandoned, the referral goes nowhere.",
      "We build clean, fast websites that make it obvious what you do, where you are, and how to reach you, with none of the upkeep headaches of a plugin-heavy template.",
    ],
    localAngle: [
      {
        title: "Make referrals convert",
        description:
          "Clear service pages, reviews, and a one-tap call button so people who heard about you from a neighbor can reach you in seconds.",
      },
      {
        title: "Low-maintenance by design",
        description:
          "No WordPress plugins to update or break. Your site stays fast and secure without a monthly babysitting bill.",
      },
      {
        title: "A local contact",
        description:
          "We're one town over in Lorain. When you need a change, you call the person who built your site.",
      },
    ],
    nearby: ["Oberlin", "South Amherst", "Lorain", "Elyria", "Vermilion", "Sheffield"],
    faqs: [
      {
        q: "What does a basic website for an Amherst business include?",
        a: "Our starting package is a custom 5-page site: home, services, about, reviews or gallery, and contact, with mobile design, local SEO basics, and a contact form.",
      },
      {
        q: "Do I need a website if most of my business is word of mouth?",
        a: "Yes. Most people look you up before they call, even when a friend recommended you. A clear website turns that search into a phone call.",
      },
      {
        q: "Do you offer ongoing website maintenance?",
        a: "Yes. Our maintenance plans cover updates, backups, and monitoring, and the higher tiers include monthly content changes.",
      },
    ],
  },
  {
    slug: "sandusky-oh",
    city: "Sandusky",
    county: "Erie County",
    summary: "Websites for Sandusky restaurants, rentals, and tourism businesses built to win the season.",
    metaDescription:
      "Sandusky, Ohio web design for restaurants, vacation rentals, and tourism businesses. Custom, fast, mobile-first websites built to capture seasonal traffic.",
    intro: [
      "Sandusky businesses live and die by the summer season. Visitors heading to Cedar Point and the Lake Erie islands are searching on their phones for places to eat, stay, and book, often the same day. A slow or confusing website hands those customers to the business next door.",
      "We build fast, mobile-first websites for restaurants, rentals, charters, and shops that make it easy to see the menu, check availability, and book in a couple of taps.",
    ],
    localAngle: [
      {
        title: "Built for visitors on phones",
        description:
          "Menus, hours, directions, and booking front and center, loading quickly on spotty vacation-town cell service.",
      },
      {
        title: "Ready before the season",
        description:
          "We plan launches around your calendar so the new site is live and indexed before peak traffic starts.",
      },
      {
        title: "Direct bookings",
        description:
          "Booking and reservation integrations that help you take more reservations directly instead of paying third-party commissions on every one.",
      },
    ],
    nearby: ["Huron", "Vermilion", "Port Clinton", "Milan", "Norwalk", "Kelleys Island"],
    faqs: [
      {
        q: "Do you build websites for Sandusky restaurants and rentals?",
        a: "Yes. We build sites with menus, galleries, and reservation or booking integrations that work well for restaurants, vacation rentals, and tour operators.",
      },
      {
        q: "When should I start a website project to be ready for summer?",
        a: "Ideally in the winter. Most projects take 6 to 12 weeks, and a few extra weeks after launch helps Google index the new site before visitors start searching.",
      },
      {
        q: "Are you based in Sandusky?",
        a: "We're based in Lorain, about 40 minutes east, and work with Erie County businesses in person or remotely.",
      },
    ],
  },
  {
    slug: "cleveland-oh",
    city: "Cleveland",
    county: "Cuyahoga County",
    summary: "Custom websites for Cleveland small businesses and growth brands, without big-agency overhead.",
    metaDescription:
      "Cleveland web design for small businesses and growing brands. Custom, hand-coded websites from a founder-led Northeast Ohio studio. Starting at $1,500.",
    intro: [
      "Cleveland has no shortage of web design agencies, and plenty of them bill like it. Foundry Frame is a founder-led studio 30 minutes west in Lorain: you work directly with the person designing and building your site, at small-business pricing.",
      "We build custom, hand-coded websites for Cleveland restaurants, contractors, studios, and emerging brands that need to compete online without paying for an agency's office lease.",
    ],
    localAngle: [
      {
        title: "Founder-led, not account-managed",
        description:
          "No layers between you and the work. The person you meet on the discovery call is the one designing and building your site.",
      },
      {
        title: "Stand out in a crowded market",
        description:
          "Custom design and messaging that separates you from the dozens of competitors a Cleveland customer sees in a single search.",
      },
      {
        title: "Measurable results",
        description:
          "Analytics and conversion tracking are set up at launch, so you can see how many calls, bookings, and inquiries the site produces.",
      },
    ],
    nearby: ["Lakewood", "Westlake", "Parma", "Strongsville", "Ohio City", "Tremont"],
    faqs: [
      {
        q: "Do you work with Cleveland businesses?",
        a: "Yes. We're based in Lorain, about 30 minutes from downtown Cleveland, and work with Cleveland-area clients in person and remotely.",
      },
      {
        q: "How are you different from larger Cleveland web design agencies?",
        a: "You work directly with the founder, every site is custom-coded instead of built on a theme, and pricing starts at $1,500 instead of big-agency retainers.",
      },
      {
        q: "Can you help with branding as well as the website?",
        a: "Yes. We offer brand identity work (logo, color, typography, guidelines) on its own or bundled with a website build.",
      },
    ],
  },
];

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}
