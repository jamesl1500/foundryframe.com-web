/**
 * Launch Bundles - Foundry Frame
 * ================================
 * The four launch bundles (Ignite, Velocity, Ascend, Apex): a website
 * package plus branding, growth work, and months of maintenance in one
 * engagement. Feeds the /packages/launch overview and each bundle's
 * /packages/launch/[slug] details page.
 *
 * Names, prices, and timelines also appear in the chat knowledge, the
 * package builder catalog, the Founding Client page, and funnels; update
 * those together.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

type Item = {
  /** Shown as a bullet on the /packages/launch overview card. */
  label: string;
  /** Short heading on the details page. */
  title: string;
  /** Plain-English explanation on the details page. */
  detail: string;
  /** What part of the launch this covers. */
  group: "Website" | "Brand" | "Growth" | "Support";
  /** A page with more detail on this item. */
  href?: string;
};

type Faq = { q: string; a: string };

export type LaunchBundle = {
  slug: string;
  number: string;
  name: string;
  pricePrefix: string;
  price: string;
  /** Starting price in dollars, for the Founding Client discount. */
  priceValue: number;
  tagline: string;
  description: string;
  badge: string | null;
  cta: string;
  /** The website package this bundle is built on. */
  websiteSlug: string;
  /** Search-friendly line shown under the name in the page's h1. */
  headline: string;
  /** Descriptive anchor text for links to this page from elsewhere on the site. */
  linkLabel: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  bestFor: string[];
  items: Item[];
  glance: { label: string; value: string }[];
  timeline: string;
  process: { step: string; description: string }[];
  fromYou: string[];
  goodToKnow: { title: string; description: string }[];
  /** The next bundle up, and why someone would move to it. */
  upgrade: { slug: string; reason: string } | null;
  faqs: Faq[];
};

const ownership = {
  title: "You own everything",
  description:
    "After final payment, the website code, design files, logo and brand files, and content are yours. No vendor lock-in.",
};

const oneTeam = {
  title: "One team, one timeline",
  description:
    "Brand, website, and launch work are planned together and handled by the same people, so nothing gets lost between vendors.",
};

export const launchBundles: LaunchBundle[] = [
  /* ---------------------------------------------------------- */
  {
    slug: "ignite",
    number: "01",
    name: "Ignite",
    pricePrefix: "Starting at",
    price: "$2,500",
    priceValue: 2500,
    tagline: "From zero to online in one move.",
    description:
      "Starting a business is hard enough. Getting your digital presence right shouldn't be a months-long ordeal. Ignite packages everything a new business needs to launch online with confidence — a custom website, a professional logo, and a social media presence — all delivered in one seamless engagement.",
    badge: null,
    cta: "Light the fuse — get started",
    websiteSlug: "spark",
    headline: "A custom website, logo, and social setup for new businesses",
    linkLabel: "Website + logo bundle from $2,500",
    metaTitle: "Ignite: Website + Logo Bundle from $2,500",
    metaDescription:
      "Ignite pairs a custom 5-page website with logo design, social profile setup, domain and hosting setup, and a month of maintenance, from $2,500.",
    intro:
      "We design your logo first, then build your website and social profiles around it, so everything a customer sees on day one looks like it came from the same business.",
    bestFor: [
      "New businesses launching",
      "Side hustles going official",
      "Local service providers",
      "Businesses without a logo yet",
    ],
    items: [
      {
        label: "The Spark — 5-page custom website",
        title: "The Spark website",
        detail:
          "Up to 5 custom-designed pages, built mobile-first with a contact form, Google Maps, on-page SEO, and Google Analytics. Hand-coded, not a template.",
        group: "Website",
        href: "/packages/website/spark",
      },
      {
        label: "Logo design (3 concept directions, 2 revision rounds, all file formats)",
        title: "Logo design",
        detail:
          "Three distinct logo directions to choose from, two rounds of refinement on the one you pick, and final files in every format you'll need for print, web, and social.",
        group: "Brand",
      },
      {
        label: "Social media profile setup and optimization on up to 3 platforms",
        title: "Social profile setup",
        detail:
          "Up to 3 platforms set up or cleaned up with your new logo, cover images, bio, contact details, and a link back to your website, so every profile matches.",
        group: "Growth",
      },
      {
        label: "Domain registration and hosting configuration",
        title: "Domain & hosting setup",
        detail:
          "We register or connect your domain and configure hosting and SSL, so your site is live at your own address with the padlock in the browser bar.",
        group: "Support",
      },
      {
        label: "1 month of Steady Maintenance included",
        title: "1 month of Steady maintenance",
        detail:
          "For your first month after launch, we handle updates, security monitoring, uptime checks, and backups. After that, you can continue on any plan.",
        group: "Support",
        href: "/packages/maintenance",
      },
    ],
    glance: [
      { label: "Website", value: "The Spark" },
      { label: "Brand", value: "Logo design" },
      { label: "Maintenance", value: "1 month" },
    ],
    timeline: "6–8 weeks",
    process: [
      {
        step: "Discovery call",
        description:
          "A free call about your business, your customers, and what you need for launch. We follow up with a proposal and timeline.",
      },
      {
        step: "Brand kickoff",
        description:
          "A short questionnaire about your business, your style, and logos you like. We use it to design three distinct logo directions.",
      },
      {
        step: "Logo refinement",
        description:
          "You pick a direction and we refine it over two rounds, then deliver your final logo files.",
      },
      {
        step: "Website design & build",
        description:
          "We design and hand-code your 5-page Spark website around your new logo, with your contact form, map, SEO, and analytics set up.",
      },
      {
        step: "Profiles, domain & launch",
        description:
          "We set up your social profiles, connect your domain and hosting, and take the site live.",
      },
      {
        step: "Your first month of care",
        description:
          "Steady maintenance covers your first month after launch while you settle in.",
      },
    ],
    fromYou: [
      "Your business name and any tagline ideas",
      "A few logos or brands you like (and ones you don't)",
      "Text for each page. Rough notes are a fine place to start.",
      "Photos of your work, team, or location",
      "Access to your social accounts and domain, if you already have them",
      "One decision-maker for logo and design reviews",
    ],
    goodToKnow: [
      {
        title: "Logo first, then the website",
        description:
          "The website is designed around your finished logo, so the brand and the site match from day one instead of being stitched together later.",
      },
      oneTeam,
      ownership,
      {
        title: "After your first month",
        description:
          "Continue on Steady from $99/mo, or any other Maintenance Plan, to keep your site updated, monitored, and backed up.",
      },
    ],
    upgrade: {
      slug: "velocity",
      reason: "Need a full brand identity, a CMS, and an SEO plan?",
    },
    faqs: [
      {
        q: "What's the difference between Ignite and The Spark?",
        a: "The Spark is the 5-page website on its own, from $1,500. Ignite builds on The Spark and adds logo design, social profile setup, domain and hosting setup, and a month of maintenance, so a new business can launch everything at once.",
      },
      {
        q: "I already have a logo. Do I need Ignite?",
        a: "Probably not. If you're happy with your logo, The Spark website package may be all you need. If your logo needs a refresh, Ignite is the simpler way to do both together.",
      },
      {
        q: "How long does Ignite take?",
        a: "Most Ignite projects launch in 6–8 weeks: the logo comes first, then the website. You'll get a specific timeline after the discovery call.",
      },
      {
        q: "Which social platforms do you set up?",
        a: "Up to 3 platforms of your choice, such as Facebook, Instagram, and LinkedIn. We'll recommend the ones your customers actually use.",
      },
      {
        q: "What happens after the included month of maintenance?",
        a: "You can continue on Steady from $99/mo, upgrade to Active or Elite, or bring us in as needed.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "velocity",
    number: "02",
    name: "Velocity",
    pricePrefix: "Starting at",
    price: "$6,500",
    priceValue: 6500,
    tagline: "Everything a real business needs to compete online.",
    description:
      "Velocity is the complete digital launchpad for businesses that are serious about their online presence from day one. In a single engagement, you get a conversion-optimized website, a full brand identity system, a clear roadmap for search visibility, and three months of Active Maintenance — all handled by one team, on one timeline.",
    badge: "Most Popular",
    cta: "Start with Velocity",
    websiteSlug: "blueprint",
    headline: "A 10-page website, full brand identity, and SEO strategy",
    linkLabel: "Website + brand identity bundle from $6,500",
    metaTitle: "Velocity: Website + Brand Kit from $6,500",
    metaDescription:
      "Velocity combines a 10-page website with CMS, a full brand identity kit, an SEO audit and 90-day plan, competitor analysis, and 3 months of maintenance.",
    intro:
      "We start with research, looking at your competitors and your search landscape, then build a brand and a website designed to win in that market, and give you a 90-day plan for what to publish next.",
    bestFor: [
      "Established small businesses",
      "Growing brands building credibility",
      "Service companies with multiple offerings",
      "Businesses investing in SEO",
    ],
    items: [
      {
        label: "The Blueprint — 10-page custom website with CMS",
        title: "The Blueprint website",
        detail:
          "Up to 10 custom pages on your own design system, with a CMS so you can edit content, a blog, advanced SEO, and GA4 conversion tracking.",
        group: "Website",
        href: "/packages/website/blueprint",
      },
      {
        label: "Full brand identity kit (logo, color palette, typography system, brand guidelines PDF)",
        title: "Full brand identity kit",
        detail:
          "Your logo, color palette, and typography system, plus a brand guidelines PDF so your team and any future vendors use the brand consistently.",
        group: "Brand",
        href: "/services/branding",
      },
      {
        label: "SEO audit + 90-day keyword strategy and content roadmap",
        title: "SEO audit + 90-day strategy",
        detail:
          "An audit of where you stand in search today, the keywords worth targeting, and a 90-day content roadmap that says what to publish and when.",
        group: "Growth",
      },
      {
        label: "Google Analytics 4 and Google Search Console setup and verification",
        title: "GA4 + Search Console",
        detail:
          "Analytics and Search Console set up and verified, so you can see who visits, how they found you, and which searches you show up for.",
        group: "Growth",
      },
      {
        label: "Competitor analysis report (top 5 competitors in your market)",
        title: "Competitor analysis",
        detail:
          "A report on your top 5 competitors: how they position themselves, what their sites do well, and the gaps your brand and website can fill.",
        group: "Growth",
      },
      {
        label: "3 months of Active Maintenance",
        title: "3 months of Active maintenance",
        detail:
          "Bi-weekly updates, weekly backups, security monitoring, a developer hour each month, and up to 2 content updates a month for your first 3 months.",
        group: "Support",
        href: "/packages/maintenance",
      },
    ],
    glance: [
      { label: "Website", value: "The Blueprint" },
      { label: "Brand", value: "Full identity kit" },
      { label: "Maintenance", value: "3 months" },
    ],
    timeline: "8–12 weeks",
    process: [
      {
        step: "Discovery call",
        description:
          "A free call about your business, your market, and your goals. We follow up with a proposal and timeline.",
      },
      {
        step: "Research",
        description:
          "Competitor analysis and an SEO audit, so the brand and site are designed around your real market, not guesses.",
      },
      {
        step: "Brand identity",
        description:
          "Logo, color palette, and typography system, refined with your feedback, then documented in your brand guidelines.",
      },
      {
        step: "Website design",
        description:
          "Sitemap and a design system built on your new brand, then the homepage and key pages, with three revision rounds.",
      },
      {
        step: "Build, CMS & tracking",
        description:
          "We hand-code the site, connect the CMS, load your content, and set up GA4 and Search Console.",
      },
      {
        step: "Launch & the first 90 days",
        description:
          "Launch, a recorded CMS walkthrough, your 90-day keyword and content roadmap, and three months of Active maintenance.",
      },
    ],
    fromYou: [
      "Any existing logo or brand materials, even if they're being replaced",
      "The competitors you watch most closely",
      "Content or notes for each page",
      "Photos of your work, team, products, or location",
      "Access to your domain and any existing analytics",
      "Stakeholders available for brand and design reviews",
    ],
    goodToKnow: [
      {
        title: "Research first",
        description:
          "The competitor analysis and SEO audit come before design, so your positioning, brand, and pages are shaped by what will actually win in your market.",
      },
      oneTeam,
      ownership,
      {
        title: "After three months",
        description:
          "Continue on Active from $249/mo, or switch to Steady or Elite, to keep the site updated and moving forward.",
      },
    ],
    upgrade: {
      slug: "ascend",
      reason: "Want paid ads and social media running from launch day?",
    },
    faqs: [
      {
        q: "Why is Velocity the most popular bundle?",
        a: "It covers what most established small businesses need in one go: a brand that looks the part, a website you can edit yourself, and a clear plan for showing up in search.",
      },
      {
        q: "What's the difference between Velocity and The Blueprint?",
        a: "The Blueprint is the 10-page website on its own, from $3,500. Velocity adds a full brand identity kit, an SEO audit and 90-day strategy, competitor analysis, GA4 and Search Console setup, and 3 months of Active maintenance.",
      },
      {
        q: "How long does Velocity take?",
        a: "Most Velocity projects launch in 8–12 weeks, with research and branding first and the website after. You'll get a specific timeline after the discovery call.",
      },
      {
        q: "Do you write the content in the 90-day roadmap?",
        a: "The roadmap says what to publish and when. If you'd like us to write it, our Marketing Packages include SEO blog posts every month.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "ascend",
    number: "03",
    name: "Ascend",
    pricePrefix: "Starting at",
    price: "$14,000",
    priceValue: 14000,
    tagline: "Build the machine. Turn it on. Watch it grow.",
    description:
      "Ascend is for growth-stage businesses that don't just want a great website — they want a full digital growth engine. Site, ads, social presence, and maintenance all aligned, all managed, and all pulling in the same direction while your competitors juggle three different vendors.",
    badge: null,
    cta: "Build with Ascend",
    websiteSlug: "architect",
    headline: "A growth website, brand, paid ads, and social media in one launch",
    linkLabel: "Website, brand & ads bundle from $14,000",
    metaTitle: "Ascend: Website, Brand & Ads from $14,000",
    metaDescription:
      "Ascend launches a 20-page growth website with your brand, a paid ad funnel, 3 months of social media, monthly reporting, and 6 months of maintenance.",
    intro:
      "Your website, landing page, ads, and social media launch together and report into one place, so you can see which channel brings in customers from the first month.",
    bestFor: [
      "Growth-stage companies",
      "E-commerce brands",
      "Businesses launching with paid ads",
      "Teams tired of juggling several vendors",
    ],
    items: [
      {
        label: "The Architect — 20-page growth website with e-commerce readiness",
        title: "The Architect website",
        detail:
          "Up to 20 pages with reusable section templates, e-commerce, CRM and email integrations, and a 90+ Lighthouse performance target.",
        group: "Website",
        href: "/packages/website/architect",
      },
      {
        label: "Full brand identity and visual style guide",
        title: "Brand identity & style guide",
        detail:
          "Logo, colors, typography, and a visual style guide covering imagery and layout, so your ads, social posts, and site all look like one brand.",
        group: "Brand",
        href: "/services/branding",
      },
      {
        label: "Landing page + paid advertising funnel (Google Ads or Meta Ads)",
        title: "Landing page + ad funnel",
        detail:
          "A dedicated landing page and the ad funnel that feeds it, on Google Ads or Meta Ads, built around one clear offer.",
        group: "Growth",
        href: "/services/advertising",
      },
      {
        label: "Paid ad campaign setup, targeting, and first-month optimization",
        title: "Ad campaign setup & optimization",
        detail:
          "Campaign structure, audiences, conversion tracking, and a first month of adjustments based on real results.",
        group: "Growth",
      },
      {
        label: "Social media management — 3 months (3 platforms, 12 posts/month)",
        title: "3 months of social media",
        detail:
          "We create and schedule 12 posts a month across 3 platforms for your first 3 months, in your new brand.",
        group: "Growth",
        href: "/services/social-media",
      },
      {
        label: "Monthly performance reporting across all channels",
        title: "Monthly reporting",
        detail:
          "One plain-English report each month covering your website, ads, and social, with what's working and what we'll change.",
        group: "Growth",
      },
      {
        label: "6 months of Active Maintenance",
        title: "6 months of Active maintenance",
        detail:
          "Bi-weekly updates, weekly backups, security monitoring, a developer hour each month, and up to 2 content updates a month for 6 months.",
        group: "Support",
        href: "/packages/maintenance",
      },
    ],
    glance: [
      { label: "Website", value: "The Architect" },
      { label: "Growth", value: "Ads + social" },
      { label: "Maintenance", value: "6 months" },
    ],
    timeline: "10–14 weeks",
    process: [
      {
        step: "Discovery call",
        description:
          "A free call about your business, your growth goals, and your current channels. We follow up with a proposal and timeline.",
      },
      {
        step: "Strategy session",
        description:
          "A working session on your customers, competitors, offer, and budget, so the brand, site, and campaigns share one plan.",
      },
      {
        step: "Brand & style guide",
        description:
          "Your brand identity and visual style guide, ready before design starts on the site and ads.",
      },
      {
        step: "Website & landing page",
        description:
          "We design and build The Architect site and your campaign landing page, with integrations and tracking in place.",
      },
      {
        step: "Campaign & social setup",
        description:
          "Ad accounts, audiences, and creative, plus your first month of social content, prepared and approved before launch.",
      },
      {
        step: "Launch & grow",
        description:
          "Site, ads, and social go live together. Then monthly reporting, ad optimization, and maintenance keep it improving.",
      },
    ],
    fromYou: [
      "Brand materials, if any, and examples of brands you admire",
      "Your offer, pricing, and the customers you want more of",
      "Product data if you're selling online",
      "Admin access to ad, social, CRM, and email accounts",
      "A monthly ad budget",
      "A point person who can approve ads and posts quickly",
    ],
    goodToKnow: [
      {
        title: "Ad spend is separate",
        description:
          "The bundle covers setting up and managing your campaigns. The ad budget itself is paid directly to Google or Meta.",
      },
      oneTeam,
      ownership,
      {
        title: "After the included months",
        description:
          "Continue social media or ads management through our Marketing Packages, and maintenance on any plan.",
      },
    ],
    upgrade: {
      slug: "apex",
      reason: "Need a client portal, ongoing SEO, and a dedicated account manager?",
    },
    faqs: [
      {
        q: "Is the ad budget included?",
        a: "No. Ascend covers strategy, setup, creative, and the first month of optimization. Your ad spend is paid directly to Google or Meta, and we'll help you set a budget on the strategy call.",
      },
      {
        q: "Google Ads or Meta Ads?",
        a: "The funnel is built on one of them, whichever fits your customers best. Search-driven businesses usually start with Google; visual products and local audiences often do better on Meta.",
      },
      {
        q: "How long does Ascend take?",
        a: "Most Ascend projects launch in 10–14 weeks. Social media and ads start with the launch, and your included months run from there.",
      },
      {
        q: "What happens after the 3 months of social media?",
        a: "You can keep going with one of our Marketing Packages, which cover social media, SEO, and ads management, or take it in-house with the content and brand guide we've built.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "apex",
    number: "04",
    name: "Apex",
    pricePrefix: "Starting at",
    price: "$28,000",
    priceValue: 28000,
    tagline: "Total digital command. Nothing left undone.",
    description:
      "Apex is our most comprehensive engagement — for companies that want complete command of their digital presence. An enterprise-grade website, custom application feature, full brand strategy workshop, SEO, paid ads, and a full year of Elite Maintenance. Apex clients don't shop for services. They invest in outcomes.",
    badge: "Full Service",
    cta: "Reserve a strategy session",
    websiteSlug: "monument",
    headline: "An enterprise website, custom portal, and a year of growth",
    linkLabel: "Full-service launch bundle from $28,000",
    metaTitle: "Apex: Full-Service Digital Launch Bundle",
    metaDescription:
      "Apex: an enterprise website, a custom web app or client portal, brand strategy, 6 months of SEO, 3 months of ads, and 12 months of Elite maintenance.",
    intro:
      "Apex is a year-long partnership: a brand strategy and enterprise website to start, then SEO, paid ads, quarterly strategy reviews, and a dedicated account manager to keep it growing.",
    bestFor: [
      "Enterprise and multi-location organizations",
      "Regional or national brands",
      "Regulated industries",
      "Businesses replacing a legacy platform",
    ],
    items: [
      {
        label: "The Monument — enterprise custom website",
        title: "The Monument website",
        detail:
          "No page limits, custom API integrations, multi-language and multi-location support, and WCAG 2.1 AA accessibility.",
        group: "Website",
        href: "/packages/website/monument",
      },
      {
        label: "Custom web application feature or client portal",
        title: "Custom app feature or client portal",
        detail:
          "A logged-in portal, booking system, or custom tool built into your site, scoped around how your customers or team actually work.",
        group: "Website",
      },
      {
        label: "Full brand strategy workshop and competitive positioning session",
        title: "Brand strategy workshop",
        detail:
          "Working sessions with your leadership on positioning, messaging, and how you stand apart from competitors, before any design begins.",
        group: "Brand",
        href: "/services/strategy",
      },
      {
        label: "6 months of ongoing SEO (technical, content, and link building)",
        title: "6 months of SEO",
        detail:
          "Technical fixes, content, and link building every month for 6 months, so the new site keeps climbing after launch.",
        group: "Growth",
      },
      {
        label: "3 months of paid ads management (Google + Meta)",
        title: "3 months of ads management",
        detail:
          "Google and Meta campaigns set up, managed, and optimized for 3 months, with conversion tracking tied to your site.",
        group: "Growth",
        href: "/services/advertising",
      },
      {
        label: "12 months of Elite Maintenance",
        title: "12 months of Elite maintenance",
        detail:
          "Weekly updates, daily backups, 3 developer hours and up to 6 content updates a month, emergency recovery, and priority support for a full year.",
        group: "Support",
        href: "/packages/maintenance",
      },
      {
        label: "Quarterly strategy review sessions",
        title: "Quarterly strategy reviews",
        detail:
          "Every quarter we review results across the site, SEO, and ads with you and agree on the next quarter's priorities.",
        group: "Support",
      },
      {
        label: "Dedicated account manager throughout",
        title: "Dedicated account manager",
        detail:
          "One named person who knows your business, runs the schedule, and is your first call for anything during the year.",
        group: "Support",
      },
    ],
    glance: [
      { label: "Website", value: "The Monument" },
      { label: "Growth", value: "SEO + ads" },
      { label: "Maintenance", value: "12 months" },
    ],
    timeline: "12–16 weeks",
    process: [
      {
        step: "Discovery & strategy workshop",
        description:
          "Working sessions with your stakeholders on goals, systems, positioning, and compliance needs.",
      },
      {
        step: "Scope & proposal",
        description:
          "A detailed scope, team, timeline, and price, including the portal or app feature, shaped around what we learned.",
      },
      {
        step: "Brand positioning & architecture",
        description:
          "Positioning and messaging, information architecture, integration plans, and the portal's requirements, approved before design.",
      },
      {
        step: "Design & build in phases",
        description:
          "The website and app feature designed and built in planned phases, with accessibility and cross-browser testing at each stage.",
      },
      {
        step: "Launch",
        description:
          "A coordinated launch with documentation and training for your team. SEO and ads start from launch.",
      },
      {
        step: "The growth year",
        description:
          "SEO, ads, Elite maintenance, and quarterly strategy reviews, led by your account manager.",
      },
    ],
    fromYou: [
      "An executive sponsor and a day-to-day point of contact",
      "Brand guidelines and an inventory of existing content",
      "Documentation and access for systems we'll integrate",
      "Any compliance, legal, or accessibility requirements",
      "Admin access to ad and analytics accounts, and a monthly ad budget",
      "Stakeholders available for workshops and reviews",
    ],
    goodToKnow: [
      {
        title: "Scoped after discovery",
        description:
          "$28,000 is the starting point. The portal or app feature and your integrations shape the final number, which you'll get after the discovery workshop. Milestone payments are available.",
      },
      {
        title: "Ad spend is separate",
        description:
          "Ads management is included; the ad budget itself is paid directly to Google and Meta.",
      },
      ownership,
      oneTeam,
    ],
    upgrade: null,
    faqs: [
      {
        q: "How is Apex priced?",
        a: "Apex starts at $28,000. The final price depends on the scope of the custom app feature or portal and your integrations, and comes in a detailed proposal after the discovery workshop.",
      },
      {
        q: "What kind of app feature or portal can you build?",
        a: "Common examples are client portals with logins and documents, booking and scheduling tools, quote calculators, and dashboards. We scope it around how your customers or team work.",
      },
      {
        q: "How long does Apex take?",
        a: "The launch typically takes 12–16 weeks. SEO, ads, maintenance, and quarterly reviews then continue through the year.",
      },
      {
        q: "What happens after the first year?",
        a: "You can continue with Elite maintenance and a Marketing Package, move to a custom monthly retainer, or take the site in-house using the documentation and training we provide.",
      },
    ],
  },
];

export function getLaunchBundle(slug: string) {
  return launchBundles.find((bundle) => bundle.slug === slug);
}
