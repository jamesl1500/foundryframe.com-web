/**
 * Industry SEO landing pages - Foundry Frame
 * ============================================
 * Content for /industries/[slug]. Targets "website design for <industry>"
 * searches from the small businesses most likely to need a new site.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export type IndustryPage = {
  slug: string;
  name: string;
  /** Plural noun used in headings, e.g. "restaurants". */
  audience: string;
  summary: string;
  metaDescription: string;
  headline: string;
  intro: string;
  problems: { title: string; description: string }[];
  mustHaves: string[];
  faqs: { q: string; a: string }[];
};

export const industries: IndustryPage[] = [
  {
    slug: "restaurants",
    name: "Restaurants & Cafés",
    audience: "restaurants",
    summary: "Menus, reservations, and online ordering that work on a phone.",
    metaDescription:
      "Restaurant website design for independent restaurants, cafés, and bars. Mobile menus, reservations, and online ordering. Custom sites from $1,500.",
    headline: "Restaurant websites that fill tables",
    intro:
      "Hungry people decide where to eat in about thirty seconds, on a phone, usually from a Google search. If your menu is a blurry PDF or your hours are wrong, they pick somewhere else. We build restaurant websites that answer every question fast and make ordering or booking one tap away.",
    problems: [
      {
        title: "PDF menus nobody can read",
        description:
          "We build real, searchable HTML menus that load instantly, look good on a phone, and are easy for you to update when prices change.",
      },
      {
        title: "Paying commission on every order",
        description:
          "Link or integrate your own ordering and reservation tools so regulars order directly from you instead of through third-party apps.",
      },
      {
        title: "Missing from local search",
        description:
          "Restaurant schema, accurate hours, and Google Business Profile alignment help you show up when people search for food nearby.",
      },
    ],
    mustHaves: [
      "Mobile-first menu pages",
      "Reservation and online ordering links",
      "Hours, location, and one-tap directions",
      "Photo gallery that loads fast",
      "Events, specials, and private dining inquiries",
      "Restaurant structured data for Google",
    ],
    faqs: [
      {
        q: "Can I update the menu myself?",
        a: "Yes. Menus are managed through a simple content editor, so you can change items and prices without calling us.",
      },
      {
        q: "Do you integrate with Toast, Square, or OpenTable?",
        a: "Yes. We connect the ordering and reservation platforms you already use, so the website sends customers straight into your existing system.",
      },
      {
        q: "How much does a restaurant website cost?",
        a: "Custom restaurant sites start at $1,500. Online ordering integrations, multiple locations, or catering pages can add to scope, and we'll quote that on a free call.",
      },
    ],
  },
  {
    slug: "contractors",
    name: "Contractors & Home Services",
    audience: "contractors",
    summary: "Websites that turn searches into quote requests for trades and home services.",
    metaDescription:
      "Website design for contractors, roofers, HVAC, plumbers, landscapers, and home service businesses. Built to generate calls and quote requests. From $1,500.",
    headline: "Contractor websites that make the phone ring",
    intro:
      "When a pipe bursts or a roof leaks, homeowners search, compare two or three sites, and call the one that looks trustworthy and easy to reach. We build contractor websites designed for that exact moment: clear services, proof of work, and a quote form or call button on every screen.",
    problems: [
      {
        title: "Jobs going to competitors with better sites",
        description:
          "A professional site with project photos, reviews, and licensing details makes you the obvious choice when someone is comparing contractors.",
      },
      {
        title: "No way to request a quote after hours",
        description:
          "Quote request forms that capture the job details and photos so you can follow up first thing in the morning.",
      },
      {
        title: "Only ranking for your company name",
        description:
          "Dedicated pages for each service and area you cover, so you show up for “roof repair in Elyria,” not just your business name.",
      },
    ],
    mustHaves: [
      "Click-to-call on every page",
      "Quote request form with photo upload",
      "Service and service-area pages",
      "Before-and-after project gallery",
      "Reviews, licensing, and insurance details",
      "Emergency and after-hours messaging",
    ],
    faqs: [
      {
        q: "Do you build websites for small contractors and one-person crews?",
        a: "Yes. Our starting package is designed for owner-operators who need a professional site that brings in calls without a big budget.",
      },
      {
        q: "Can the website help me rank in the towns I serve?",
        a: "Yes. We create service-area pages and local SEO structure so Google understands every town you work in.",
      },
      {
        q: "Can I show photos of my past jobs?",
        a: "Yes. Project galleries are easy to update from your phone, so you can add finished work as you go.",
      },
    ],
  },
  {
    slug: "salons-and-spas",
    name: "Salons, Spas & Beauty",
    audience: "salons and spas",
    summary: "Beautiful sites with online booking for salons, barbers, spas, and studios.",
    metaDescription:
      "Website design for hair salons, barbershops, spas, nail and lash studios. Online booking, service menus, and portfolio galleries. Custom sites from $1,500.",
    headline: "Salon and spa websites that fill your book",
    intro:
      "Your clients discover you on Instagram and book on their phone, often late at night. Your website should look as good as your work and let them book in seconds. We design beauty and wellness websites around your portfolio and your booking system.",
    problems: [
      {
        title: "Booking buried in a link-in-bio",
        description:
          "Put booking front and center on a site you own, connected directly to Vagaro, Square, Booksy, GlossGenius, or whatever you already use.",
      },
      {
        title: "Your work isn't showcased",
        description:
          "Portfolio galleries that show off your best work at full quality without slowing the site down.",
      },
      {
        title: "Service menus that confuse people",
        description:
          "Clear services, pricing, and stylist bios, so new clients know exactly what to book and who to book with.",
      },
    ],
    mustHaves: [
      "Book Now on every page",
      "Service menu with pricing",
      "Stylist or therapist profiles",
      "Portfolio and Instagram integration",
      "Gift cards and memberships",
      "New client policies and FAQs",
    ],
    faqs: [
      {
        q: "Can you connect my existing booking software?",
        a: "Yes. We integrate the booking platform you already use so nothing about your scheduling workflow changes.",
      },
      {
        q: "Do I need a website if I already have Instagram?",
        a: "Yes. Instagram doesn't show up in most Google searches for salons nearby, and you don't control it. A website captures those searches and sends them to your booking page.",
      },
      {
        q: "Can the site sell gift cards?",
        a: "Yes. We can link or embed gift card sales through your booking or payment provider.",
      },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate Agents & Teams",
    audience: "real estate agents",
    summary: "Personal-brand sites for agents and teams that capture buyer and seller leads.",
    metaDescription:
      "Real estate website design for agents, teams, and brokerages. Personal-brand sites with listing integrations, neighborhood pages, and lead capture. From $1,500.",
    headline: "Real estate websites that build your personal brand",
    intro:
      "Your brokerage profile page looks like every other agent's. A personal website lets you own your brand, rank for the neighborhoods you know best, and capture leads that stay yours if you ever change brokerages.",
    problems: [
      {
        title: "Identical to every other agent",
        description:
          "A custom design built around your personal brand, your market, and your story so clients remember you.",
      },
      {
        title: "Leads that belong to the portal",
        description:
          "Home valuation and buyer consultation forms that send leads straight to you and your CRM.",
      },
      {
        title: "No local search presence",
        description:
          "Neighborhood and community pages that show your expertise and rank for the areas you sell in.",
      },
    ],
    mustHaves: [
      "Personal bio and testimonials",
      "Listing and IDX links",
      "Neighborhood and community guides",
      "Home valuation lead form",
      "CRM and email integration",
      "Market update blog",
    ],
    faqs: [
      {
        q: "Can you show my listings on the website?",
        a: "Yes. We can integrate an IDX provider or link to your listings, depending on your MLS and brokerage rules.",
      },
      {
        q: "Will leads go to my CRM?",
        a: "Yes. Forms can send leads to Follow Up Boss, kvCORE, HubSpot, or your email, whichever you use.",
      },
      {
        q: "Do you build sites for real estate teams?",
        a: "Yes. Team sites include agent profiles, lead routing, and room to grow as you add agents.",
      },
    ],
  },
  {
    slug: "fitness-studios",
    name: "Gyms & Fitness Studios",
    audience: "gyms and fitness studios",
    summary: "Class schedules, trial offers, and memberships for gyms and boutique studios.",
    metaDescription:
      "Website design for gyms, CrossFit boxes, yoga studios, and personal trainers. Class schedules, free trial sign-ups, and membership sales. From $1,500.",
    headline: "Fitness websites that turn visitors into members",
    intro:
      "People searching for a gym want to know three things: what classes you run, what it costs, and how to try it. We build fitness websites that answer all three on the first screen and make the free trial impossible to miss.",
    problems: [
      {
        title: "No clear first step",
        description:
          "A prominent free trial or intro offer with a short sign-up form, so interested visitors actually walk through the door.",
      },
      {
        title: "Schedules that are always out of date",
        description:
          "Class schedules pulled from Mindbody, Wodify, PushPress, or your scheduling tool, so they're always accurate.",
      },
      {
        title: "Pricing hidden or confusing",
        description:
          "Clear membership options that answer the price question up front and filter out tire-kickers.",
      },
    ],
    mustHaves: [
      "Free trial or intro offer sign-up",
      "Live class schedule",
      "Membership and pricing page",
      "Coach and trainer bios",
      "Member results and testimonials",
      "Location, parking, and first-visit info",
    ],
    faqs: [
      {
        q: "Can you connect my gym management software?",
        a: "Yes. We integrate schedules and sign-ups from the platform you already use.",
      },
      {
        q: "Do you build sites for personal trainers?",
        a: "Yes. Our starting package works well for independent trainers who need a professional site with booking and testimonials.",
      },
      {
        q: "Can you help us run a new-member promotion?",
        a: "Yes. We can build a focused landing page for a promotion or ad campaign and track how many sign-ups it produces.",
      },
    ],
  },
  {
    slug: "retail-and-ecommerce",
    name: "Retail Shops & E-Commerce",
    audience: "retail shops and online brands",
    summary: "Storefront sites and online stores for local shops and product brands.",
    metaDescription:
      "Website design for local retail shops and product brands. Custom storefronts, e-commerce, and local SEO that drives both foot traffic and online sales.",
    headline: "Retail websites that sell in-store and online",
    intro:
      "Local shops compete with Amazon on convenience and with each other on personality. A great website does both: it gets nearby shoppers through your door and lets customers anywhere buy your products online.",
    problems: [
      {
        title: "Shoppers can't see what you carry",
        description:
          "Product and collection pages that show off your inventory and bring in searches for the brands and items you sell.",
      },
      {
        title: "No online sales channel",
        description:
          "Custom e-commerce, or a Shopify or Square store styled to match your brand, so you can sell after hours and beyond your zip code.",
      },
      {
        title: "Brand that doesn't carry online",
        description:
          "Design that captures what makes your shop special, so the website feels like walking in the door.",
      },
    ],
    mustHaves: [
      "Product and collection pages",
      "Online store and checkout",
      "Buy online, pick up in store",
      "Store hours, location, and events",
      "Email list sign-up",
      "Product structured data for Google",
    ],
    faqs: [
      {
        q: "Do you build online stores?",
        a: "Yes. Our E-Commerce Setup add-on builds a custom storefront, or we can design around Shopify or Square if you already use them.",
      },
      {
        q: "Can the site sync with my point-of-sale inventory?",
        a: "Often, yes. Square and Shopify POS both support syncing inventory with an online store. We'll confirm on a discovery call.",
      },
      {
        q: "How much does an e-commerce website cost?",
        a: "Websites start at $1,500 and our E-Commerce Setup add-on starts at $2,500. Final pricing depends on product count and integrations.",
      },
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
