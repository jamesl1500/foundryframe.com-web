/**
 * Website Packages - Foundry Frame
 * ==================================
 * The four website tiers (The Spark, The Blueprint, The Architect,
 * The Monument). Feeds the /packages/website overview and each tier's
 * /packages/website/[slug] details page.
 *
 * Tier names and prices also appear in the chat knowledge, FAQ, launch
 * bundles, and package builder; update those together.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

type Feature = {
  /** Shown as a bullet on the /packages/website overview card. */
  label: string;
  /** Short heading on the details page. */
  title: string;
  /** Plain-English explanation on the details page. */
  detail: string;
};

type Faq = { q: string; a: string };

export type WebsitePackage = {
  slug: string;
  tier: string;
  name: string;
  pricePrefix: string | null;
  price: string;
  tagline: string;
  description: string;
  bestFor: string;
  badge: string | null;
  features: Feature[];
  cta: string;
  variant: "dark" | "light" | "dark-accent";
  metaTitle: string;
  metaDescription: string;
  intro: string;
  glance: { label: string; value: string }[];
  /** Kickoff to launch. Shown in the at-a-glance strip and How It Works. */
  timeline: string;
  process: { step: string; description: string }[];
  fromYou: string[];
  goodToKnow: { title: string; description: string }[];
  /** The launch bundle built on this tier. */
  bundle: { name: string; price: string; pitch: string };
  /** The next tier up, and why someone would move to it. */
  upgrade: { slug: string; reason: string } | null;
  faqs: Faq[];
};

const ownership = {
  title: "You own everything",
  description:
    "After final payment, the code, design files, and content are yours. No vendor lock-in and no proprietary platform holding your site hostage.",
};

export const websitePackages: WebsitePackage[] = [
  /* ---------------------------------------------------------- */
  {
    slug: "spark",
    tier: "01",
    name: "The Spark",
    pricePrefix: "Starting at",
    price: "$1,500",
    tagline: "Your business, online — done right the first time.",
    description:
      "You've built something worth showing the world. Now it's time to show it. The Spark is our entry-level website package — but there's nothing entry-level about what you get. This is a fully custom, professionally designed website built for performance and first impressions, not a template with your name dropped in.",
    bestFor:
      "New business owners, freelancers & consultants, local service providers, side hustles turning full-time",
    badge: null,
    features: [
      {
        label: "Up to 5 fully custom-designed pages (Home, About, Services, Contact + 1 more)",
        title: "Up to 5 custom-designed pages",
        detail:
          "Usually Home, About, Services, Contact, and one more page of your choosing, such as a gallery, pricing, FAQ, or a second service page. Each one is designed from scratch around your content, not poured into a theme.",
      },
      {
        label: "100% mobile-responsive across all devices and screen sizes",
        title: "Mobile-responsive on every screen",
        detail:
          "We design for phones first, then scale up to tablets and desktops, and test across all of them before launch. Most of your visitors will find you on a phone, so that's where the site has to work hardest.",
      },
      {
        label: "Contact form with email notifications",
        title: "Contact form with email notifications",
        detail:
          "Every inquiry goes straight to your inbox the moment it's sent, so leads never sit in a dashboard you forgot to check.",
      },
      {
        label: "Google Maps integration (for local businesses)",
        title: "Google Maps integration",
        detail:
          "For businesses with a storefront or service area, we embed a map and your location details so local customers can find you and get directions in one tap.",
      },
      {
        label: "On-page SEO foundations (meta titles, descriptions, schema markup)",
        title: "On-page SEO foundations",
        detail:
          "Every page gets a written meta title and description, a clean heading structure, and schema markup that tells Google what your business is, where it is, and what you offer. It's the groundwork you need to rank, built in from day one.",
      },
      {
        label: "Basic Google Analytics setup",
        title: "Google Analytics setup",
        detail:
          "We connect Google Analytics so you can see how many people visit, where they come from, and which pages they read. You'll know whether the site is working instead of guessing.",
      },
      {
        label: "2 structured revision rounds",
        title: "2 structured revision rounds",
        detail:
          "You review the design at set checkpoints and send consolidated feedback, and we revise. Two full rounds keeps the project moving and makes sure you're happy with what ships. Extra rounds can be added for a fee.",
      },
      {
        label: "30-day post-launch support window",
        title: "30 days of post-launch support",
        detail:
          "For the first 30 days after launch, we fix bugs, answer questions, and make small adjustments at no extra cost.",
      },
    ],
    cta: "Get Started with The Spark",
    variant: "dark",
    metaTitle: "The Spark: Custom 5-Page Website from $1,500",
    metaDescription:
      "The Spark is a fully custom, hand-coded 5-page website from $1,500. Mobile-first, SEO-ready, with a contact form, analytics, 2 revision rounds, and 30 days of support.",
    intro:
      "Every Spark site is hand-coded with Next.js and React, the same stack we use on our largest builds. You get the speed, security, and clean code of a custom build at a price that makes sense for a business that's just getting started.",
    glance: [
      { label: "Pages", value: "Up to 5" },
      { label: "Revisions", value: "2 rounds" },
      { label: "Support", value: "30 days" },
    ],
    timeline: "4–6 weeks",
    process: [
      {
        step: "Discovery call",
        description:
          "A free call to learn your business, your customers, and what the site needs to do. We'll tell you honestly whether The Spark is the right fit, then send a proposal and timeline.",
      },
      {
        step: "Kickoff & content",
        description:
          "Once the deposit is in, you'll get a short questionnaire about your brand, services, and goals. We map your five pages and outline what goes on each one.",
      },
      {
        step: "Design",
        description:
          "We design the homepage first so you can see the direction, then the remaining pages. You review at each checkpoint and use your two revision rounds.",
      },
      {
        step: "Build & test",
        description:
          "We hand-code the approved design, set up your contact form, map, SEO, and analytics, and test every page on phones, tablets, and desktops.",
      },
      {
        step: "Launch & support",
        description:
          "We connect your domain, go live, and walk you through the finished site. Your 30-day support window starts on launch day.",
      },
    ],
    fromYou: [
      "Your logo and any brand colors or fonts you already use",
      "Text for each page. Rough notes are a fine place to start.",
      "Photos of your work, team, or location",
      "Access to your domain, or a domain name you'd like to register",
      "One decision-maker who can give consolidated feedback at each review",
    ],
    goodToKnow: [
      {
        title: "Content edits go through us",
        description:
          "The Spark doesn't include a CMS. It's built for businesses whose pages don't change every week. If you want to edit pages and publish blog posts yourself, The Blueprint includes a CMS.",
      },
      {
        title: "Simple payments",
        description:
          "Typically 50% to start and 50% at launch. We accept bank transfer, credit card, and check.",
      },
      ownership,
      {
        title: "After the first 30 days",
        description:
          "A Maintenance Plan from $99/mo keeps your site updated, monitored, and backed up, or you can bring us in as needed.",
      },
    ],
    bundle: {
      name: "Ignite",
      price: "From $2,500",
      pitch:
        "Need a logo too? The Ignite launch bundle pairs The Spark with logo design, social profile setup, domain and hosting setup, and a month of maintenance.",
    },
    upgrade: {
      slug: "blueprint",
      reason: "Want to edit content yourself, run a blog, or go past 5 pages?",
    },
    faqs: [
      {
        q: "Is The Spark a template?",
        a: "No. Every page is designed from a blank canvas and hand-coded with Next.js and React. The price is lower because the scope is smaller (up to 5 pages and the essentials), not because we cut corners on design or code.",
      },
      {
        q: "How long does a Spark site take?",
        a: "Most Spark projects launch in about 4–6 weeks from kickoff. The biggest variable is content: the sooner we have your text and photos, the sooner you go live. You'll get a specific timeline after the discovery call.",
      },
      {
        q: "Can I update the site myself?",
        a: "The Spark doesn't include a CMS, so content changes go through us, either as quick as-needed work or through a Maintenance Plan. If you expect to update content often, The Blueprint includes a CMS and a recorded training session.",
      },
      {
        q: "What if I need more than 5 pages?",
        a: "Additional pages are $500 each and are designed to match the rest of your site. If you need several more, The Blueprint (up to 10 pages) is usually the better value.",
      },
      {
        q: "Is $1,500 the final price?",
        a: "$1,500 is the starting price for the scope on this page. You'll get an exact number after a free, no-obligation discovery call.",
      },
      {
        q: "What happens after the 30-day support window?",
        a: "You can keep the site as is, bring us in for work as needed, or move to a Maintenance Plan (from $99/mo) for updates, security monitoring, uptime monitoring, and backups.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "blueprint",
    tier: "02",
    name: "The Blueprint",
    pricePrefix: "Starting at",
    price: "$3,500",
    tagline: "A real business deserves a real website.",
    description:
      "Your business has outgrown a basic website. The Blueprint hits the sweet spot: custom design, advanced features, and a strategy-first approach that sets you apart from competitors relying on the same off-the-shelf template. We build it to be your most effective sales tool.",
    bestFor:
      "Established small businesses, growing brands building credibility, service companies with multiple offerings, businesses investing in SEO",
    badge: "Most Popular",
    features: [
      {
        label: "Up to 10 fully custom-designed pages",
        title: "Up to 10 custom-designed pages",
        detail:
          "Room for your full service lineup, an About page with real depth, a portfolio or case studies, FAQs, and more. Every page is designed for its own job, not stamped from one layout.",
      },
      {
        label: "Custom design system (your own colors, typography, and component library)",
        title: "Your own design system",
        detail:
          "We define your colors, typography, spacing, and a library of reusable components such as buttons, cards, sections, and forms. It keeps every page consistent, and pages you add later look like they've always been there.",
      },
      {
        label: "CMS integration — edit your own content, no developer required",
        title: "CMS integration",
        detail:
          "Edit text, swap images, and add new content from a simple dashboard, with no code and no developer. We set it up around the content you actually change, so it stays simple to use.",
      },
      {
        label: "Blog or resources section with categories and search",
        title: "Blog or resources section",
        detail:
          "A publishing section with categories and search for articles, guides, or news. Regular, useful content is one of the most reliable ways to grow search traffic over time.",
      },
      {
        label: "Advanced on-page SEO + page speed optimization",
        title: "Advanced SEO + speed optimization",
        detail:
          "Everything in The Spark's SEO foundations, plus keyword-informed page structure, internal linking, image optimization, and performance tuning so pages load fast on any connection. Speed affects both rankings and conversions.",
      },
      {
        label: "Google Analytics 4 setup with conversion event tracking",
        title: "GA4 with conversion tracking",
        detail:
          "We set up Google Analytics 4 and track the actions that matter, like form submissions, calls, and key button clicks. You'll see not just how many people visit, but how many turn into leads.",
      },
      {
        label: "CMS training session (30 min recorded walkthrough)",
        title: "Recorded CMS training",
        detail:
          "A 30-minute walkthrough of your CMS, recorded so you and your team can rewatch it anytime. Nobody gets locked out of their own website.",
      },
      {
        label: "3 revision rounds + optional stakeholder review presentation",
        title: "3 revision rounds + stakeholder review",
        detail:
          "Three full rounds of design feedback, plus an optional presentation for partners, managers, or a board, so everyone with a say sees the work and the reasoning behind it.",
      },
    ],
    cta: "Start Your Blueprint",
    variant: "light",
    metaTitle: "The Blueprint: Custom 10-Page Website with CMS from $3,500",
    metaDescription:
      "The Blueprint is our most popular website package: up to 10 custom pages, your own design system, a CMS, a blog, advanced SEO, and GA4 conversion tracking, from $3,500.",
    intro:
      "The Blueprint is where a website starts doing real business work. You get a design system built for your brand, a CMS so your team can update pages and publish articles without calling a developer, and the SEO and tracking work that turns the site into a measurable source of leads.",
    glance: [
      { label: "Pages", value: "Up to 10" },
      { label: "Revisions", value: "3 rounds" },
      { label: "Content editing", value: "CMS included" },
    ],
    timeline: "6–8 weeks",
    process: [
      {
        step: "Discovery call",
        description:
          "A free call about your business, your customers, and where your current site falls short. We follow up with a proposal and timeline.",
      },
      {
        step: "Strategy & sitemap",
        description:
          "We look at your customers, competitors, and goals, then map every page and how they connect. This is where we decide what the site needs to say, and to whom.",
      },
      {
        step: "Design system & page design",
        description:
          "We build your design system first, then design the homepage and key pages on top of it. Three revision rounds, plus an optional stakeholder presentation.",
      },
      {
        step: "Build, CMS & content",
        description:
          "We hand-code the site, connect the CMS, and load your content. The blog, SEO, speed work, and conversion tracking are configured and tested.",
      },
      {
        step: "QA, training & launch",
        description:
          "Testing across devices and browsers, your recorded CMS training, and launch day. From then on, you're editing your own site.",
      },
    ],
    fromYou: [
      "Your logo, brand colors, and fonts, or brand guidelines if you have them",
      "Content or notes for each page",
      "Photos of your work, team, products, or location",
      "The actions that count as a lead for you (calls, forms, bookings)",
      "Access to your domain and any existing analytics",
      "Stakeholders available for scheduled design reviews",
    ],
    goodToKnow: [
      {
        title: "Built to grow",
        description:
          "Because the site runs on its own design system, new pages slot in cleanly. Additional pages are $500 each, and blog posts are yours to publish in the CMS.",
      },
      {
        title: "Simple payments",
        description:
          "Typically 50% to start and 50% at launch. We accept bank transfer, credit card, and check.",
      },
      ownership,
      {
        title: "Starting price",
        description:
          "$3,500 is the starting point for this scope. You'll get an exact number after a free discovery call.",
      },
    ],
    bundle: {
      name: "Velocity",
      price: "From $6,500",
      pitch:
        "Need a brand to match? The Velocity launch bundle pairs The Blueprint with a full brand identity kit, an SEO audit and 90-day keyword strategy, competitor analysis, and 3 months of maintenance.",
    },
    upgrade: {
      slug: "architect",
      reason: "Selling online, connecting a CRM, or need more than 10 pages?",
    },
    faqs: [
      {
        q: "Why is The Blueprint the most popular package?",
        a: "It's the point where a website starts doing real business work: enough pages for every service, a CMS so you're not waiting on a developer, a blog for search growth, and tracking that shows which pages produce leads.",
      },
      {
        q: "What CMS do you use?",
        a: "We use a headless CMS chosen around how your team works and what content you'll edit. It's set up so you only see the fields you need, and it doesn't slow the site down the way plugin-heavy platforms do.",
      },
      {
        q: "How long does a Blueprint site take?",
        a: "Most Blueprint projects launch in 6–8 weeks from kickoff, depending on how many pages you need and how quickly content and feedback come in. You'll get a specific timeline after the discovery call.",
      },
      {
        q: "Do you write the blog posts?",
        a: "The Blueprint includes the blog section itself, not ongoing articles. If you'd like us to write for you, our Marketing Packages include SEO blog posts every month.",
      },
      {
        q: "Can I add more pages later?",
        a: "Yes. New pages are built on your existing design system, so they match the rest of the site. Additional pages are $500 each.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "architect",
    tier: "03",
    name: "The Architect",
    pricePrefix: "Starting at",
    price: "$7,000",
    tagline: "Scale-ready. Strategy-first. Built to lead your market in search.",
    description:
      "Some websites are brochures. The Architect is a growth machine. Built for scaling companies with complex needs — multiple service lines, e-commerce, integrations, and serious traffic goals — it doesn't just look the part. It performs. Every engagement starts with a deep strategic session.",
    bestFor:
      "Growth-stage companies, e-commerce brands, businesses with dedicated marketing teams, organizations where the website drives revenue",
    badge: null,
    features: [
      {
        label: "Up to 20 pages + custom section templates your team can reuse",
        title: "Up to 20 pages + reusable section templates",
        detail:
          "Enough room for every product line, service, location, and campaign. We also build section templates your team can assemble into new pages, so marketing can launch a page without starting a new project.",
      },
      {
        label: "E-commerce functionality (Shopify storefront or WooCommerce)",
        title: "E-commerce functionality",
        detail:
          "A Shopify storefront or WooCommerce store designed to match the rest of your site, with product pages, cart, and checkout built for buying, not just listing.",
      },
      {
        label: "CRM integration (HubSpot, Salesforce, or equivalent)",
        title: "CRM integration",
        detail:
          "Form submissions land in HubSpot, Salesforce, or your CRM of choice, so your sales team sees new leads without copying anything over.",
      },
      {
        label: "Email marketing platform connection (Mailchimp, Klaviyo, etc.)",
        title: "Email marketing connection",
        detail:
          "Sign-up forms and customer data flow into Mailchimp, Klaviyo, or your platform, so you can grow your list and trigger campaigns from site activity.",
      },
      {
        label: "Custom micro-animations and scroll-triggered effects",
        title: "Custom micro-animations",
        detail:
          "Considered motion, such as scroll-triggered reveals, hover states, and transitions, that makes the site feel polished and guides attention without slowing it down.",
      },
      {
        label: "Core Web Vitals optimization targeting 90+ Lighthouse score",
        title: "90+ Lighthouse performance target",
        detail:
          "We optimize Core Web Vitals (load speed, responsiveness, and visual stability) and target a 90+ Lighthouse score. Fast sites rank better and convert better, especially on mobile.",
      },
      {
        label: "Full technical SEO audit + content strategy brief",
        title: "Technical SEO audit + content strategy",
        detail:
          "A full audit of your site's search health and a content strategy brief covering which topics and keywords to target, which pages to build, and in what order.",
      },
      {
        label: "4 revision rounds with dedicated project manager",
        title: "4 revision rounds + project manager",
        detail:
          "Four rounds of feedback, with a dedicated project manager running the schedule, collecting feedback, and keeping you updated so nothing slips.",
      },
      {
        label: "3-month post-launch performance check-in",
        title: "3-month performance check-in",
        detail:
          "Three months after launch, we review traffic, rankings, speed, and conversions with you and recommend what to improve next.",
      },
    ],
    cta: "Build Your Architect Site",
    variant: "dark",
    metaTitle: "The Architect: 20-Page Growth Website with E-Commerce from $7,000",
    metaDescription:
      "The Architect is a 20-page growth website with e-commerce, CRM and email integrations, a 90+ Lighthouse performance target, and a technical SEO strategy, from $7,000.",
    intro:
      "Every Architect engagement starts with a deep strategy session. At this level the website is tied into how you sell: your store, your CRM, your email list, and the search traffic you're trying to win. We plan all of it before we design any of it.",
    glance: [
      { label: "Pages", value: "Up to 20 + templates" },
      { label: "Revisions", value: "4 rounds" },
      { label: "After launch", value: "3-month check-in" },
    ],
    timeline: "8–12 weeks",
    process: [
      {
        step: "Discovery call",
        description:
          "A free call to understand your business, your sales process, and what the website needs to deliver. We follow up with a proposal and timeline.",
      },
      {
        step: "Strategy session",
        description:
          "A deep working session on your goals, customers, and competitors. We review your current site, analytics, and search data and agree on what success looks like.",
      },
      {
        step: "Architecture & integration plan",
        description:
          "Sitemap, technical SEO audit findings, content strategy brief, and a map of every integration (store, CRM, email) and how data moves between them.",
      },
      {
        step: "Design",
        description:
          "Design system, key page designs, reusable section templates, and motion. Four revision rounds, coordinated by your project manager.",
      },
      {
        step: "Build & integrate",
        description:
          "Hand-coded build, store setup, CRM and email connections, analytics, and performance tuning toward a 90+ Lighthouse score.",
      },
      {
        step: "QA, launch & check-in",
        description:
          "End-to-end testing of every form, purchase flow, and integration before launch. Three months later, a performance review and next-step recommendations.",
      },
    ],
    fromYou: [
      "Brand assets and guidelines",
      "Product data (images, descriptions, pricing, inventory) if you're selling online",
      "Admin access to your CRM, email platform, and any existing store",
      "Access to your current analytics and Google Search Console",
      "A point person on your team who can make decisions",
    ],
    goodToKnow: [
      {
        title: "Strategy comes first",
        description:
          "The strategy session and content brief shape everything that follows, so the pages we build are the ones that move revenue and rankings.",
      },
      {
        title: "Flexible payments",
        description:
          "Larger projects like this can be paid in milestones instead of a 50/50 split. We accept bank transfer, credit card, and check.",
      },
      ownership,
      {
        title: "Starting price",
        description:
          "$7,000 is the starting point. Catalog size and how custom your integrations need to be shape the final number, which you'll get after the discovery call.",
      },
    ],
    bundle: {
      name: "Ascend",
      price: "From $14,000",
      pitch:
        "Ready to launch with demand behind it? The Ascend launch bundle adds full brand identity, a landing page and paid ad funnel, 3 months of social media management, and 6 months of maintenance.",
    },
    upgrade: {
      slug: "monument",
      reason: "Need multi-language support, custom system integrations, or accessibility compliance?",
    },
    faqs: [
      {
        q: "Is e-commerce included in the starting price?",
        a: "Yes. The Architect includes e-commerce functionality on Shopify or WooCommerce. Your exact quote depends on things like catalog size and how custom the checkout needs to be, which we'll cover in the strategy session.",
      },
      {
        q: "Which CRMs and email platforms do you work with?",
        a: "HubSpot, Salesforce, Mailchimp, and Klaviyo are the most common, and we can connect most platforms that offer an API. If you haven't chosen one yet, we'll help you pick in the strategy session.",
      },
      {
        q: "What does a 90+ Lighthouse score mean for me?",
        a: "Lighthouse is Google's tool for measuring page speed and quality. A 90+ score means pages load fast and stay stable while they load, which helps rankings and keeps visitors from leaving, especially on phones.",
      },
      {
        q: "How long does an Architect site take?",
        a: "Most Architect projects launch in 8–12 weeks from kickoff. E-commerce catalogs and integrations are the biggest variables. You'll get a specific timeline after the strategy session.",
      },
      {
        q: "How is The Architect different from The Monument?",
        a: "The Architect has a defined scope: up to 20 pages and standard integrations. The Monument has no page or feature limits and covers custom API integrations, multi-language sites, WCAG 2.1 AA accessibility, and a dedicated team.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "monument",
    tier: "04",
    name: "The Monument",
    pricePrefix: null,
    price: "Custom",
    tagline: "For organizations where the website is a flagship asset.",
    description:
      "The Monument is our enterprise-grade engagement — fully custom, fully bespoke, built for organizations where the digital presence is a flagship asset, not a cost center. Monument clients get a dedicated project team, and scope and pricing are shaped around your goals in a discovery session. This isn't a project. It's a partnership.",
    bestFor:
      "Enterprise organizations, regional or national brands, regulated industries (healthcare, finance, legal), businesses replacing a legacy digital platform",
    badge: "Enterprise",
    features: [
      {
        label: "Fully custom scope — no page limits, no feature restrictions",
        title: "Fully custom scope",
        detail:
          "No page limits and no feature restrictions. Portals, resource libraries, member areas, location finders: if the project needs it, it goes in the scope.",
      },
      {
        label: "Multi-language and multi-location support",
        title: "Multi-language & multi-location",
        detail:
          "Translated content with proper language targeting for search engines, and location pages that scale across every office, branch, or region you operate in.",
      },
      {
        label: "Custom API integrations (ERP, CRM, POS, booking, any third-party system)",
        title: "Custom API integrations",
        detail:
          "We connect the website to the systems you already run on, including ERP, CRM, POS, booking, or any third-party platform with an API, so data stays in sync without manual work.",
      },
      {
        label: "WCAG 2.1 AA accessibility compliance",
        title: "WCAG 2.1 AA accessibility",
        detail:
          "Built and tested to WCAG 2.1 AA, the accessibility standard most organizations are measured against. Essential for regulated industries, and for reaching every customer.",
      },
      {
        label: "Dedicated project manager and lead developer",
        title: "Dedicated PM and lead developer",
        detail:
          "A named project manager and lead developer for the whole engagement. You always know who's building your site and who to call.",
      },
      {
        label: "Unlimited revisions within the agreed project scope",
        title: "Unlimited revisions within scope",
        detail:
          "We revise until it's right. The only boundary is the agreed scope: new pages, features, or integrations are handled as change requests.",
      },
      {
        label: "Comprehensive QA across all major browsers and devices",
        title: "Comprehensive QA",
        detail:
          "Testing across all major browsers and devices, plus functional testing of every integration, form, and workflow before anything goes live.",
      },
      {
        label: "Priority 6-month post-launch support retainer",
        title: "6-month priority support retainer",
        detail:
          "Six months of priority support after launch, with fixes, adjustments, and help from the team that built the site.",
      },
      {
        label: "Full technical documentation and team training sessions",
        title: "Documentation & team training",
        detail:
          "Full technical documentation, plus training sessions for your content editors, marketers, and developers, so your organization can run the site with confidence.",
      },
    ],
    cta: "Request a Discovery Session",
    variant: "dark-accent",
    metaTitle: "The Monument: Enterprise Website Design & Development",
    metaDescription:
      "The Monument is Foundry Frame's enterprise website engagement: no page limits, custom API integrations, multi-language support, WCAG 2.1 AA accessibility, and a dedicated team.",
    intro:
      "Monument engagements start with a discovery session, not a price sheet. We learn your organization, your systems, your compliance requirements, and your goals, then shape the scope, team, timeline, and price around them.",
    glance: [
      { label: "Scope", value: "No page limits" },
      { label: "Revisions", value: "Unlimited within scope" },
      { label: "Support", value: "6-month retainer" },
    ],
    timeline: "Set in discovery",
    process: [
      {
        step: "Discovery session",
        description:
          "Working sessions with your stakeholders to understand goals, systems, content, compliance needs, and constraints.",
      },
      {
        step: "Scope & proposal",
        description:
          "A detailed scope, team, timeline, and price, shaped around what we learned in discovery.",
      },
      {
        step: "Architecture & strategy",
        description:
          "Information architecture, integration and data-flow plans, content and SEO strategy, and accessibility requirements, documented and approved before design begins.",
      },
      {
        step: "Design",
        description:
          "A full design system and page designs, reviewed with each stakeholder group and revised until they're right.",
      },
      {
        step: "Build, integrate & QA",
        description:
          "A hand-coded build delivered in planned phases, with custom API integrations and accessibility and cross-browser testing at each stage.",
      },
      {
        step: "Launch, training & retainer",
        description:
          "A coordinated launch, full documentation, team training sessions, and six months of priority support.",
      },
    ],
    fromYou: [
      "An executive sponsor and a day-to-day point of contact",
      "Brand guidelines and an inventory of your existing content",
      "Documentation and access for the systems we'll integrate, plus vendor contacts",
      "Any compliance, legal, or accessibility requirements",
      "Stakeholders available for scheduled reviews",
    ],
    goodToKnow: [
      {
        title: "Priced after discovery",
        description:
          "No two Monument engagements are alike, so pricing follows the discovery session. Milestone payments are available.",
      },
      {
        title: "Built for regulated industries",
        description:
          "Healthcare, finance, and legal organizations get accessibility compliance, documentation, and comprehensive QA as part of the engagement, not as add-ons.",
      },
      ownership,
      {
        title: "Replacing a legacy platform",
        description:
          "We plan content migration, redirects, and integrations up front so your search visibility and your data make the move with you.",
      },
    ],
    bundle: {
      name: "Apex",
      price: "From $28,000",
      pitch:
        "Want one team for everything? The Apex launch bundle adds a custom web application feature or client portal, a brand strategy workshop, SEO and paid ads management, 12 months of maintenance, and a dedicated account manager.",
    },
    upgrade: null,
    faqs: [
      {
        q: "How is The Monument priced?",
        a: "After a discovery session. We scope the engagement around your pages, integrations, compliance needs, and timeline, then send a detailed proposal. For reference, our Apex launch bundle, which includes a Monument website plus brand, marketing, and maintenance, starts at $28,000.",
      },
      {
        q: "Can you replace our legacy website platform?",
        a: "Yes. It's one of the most common reasons organizations choose The Monument. We plan content migration, redirects, and integrations in advance so you protect your search rankings and keep your data.",
      },
      {
        q: "What does unlimited revisions mean?",
        a: "We keep revising designs and builds until they're right, within the agreed scope. New pages, features, or integrations that weren't in the scope are handled as change requests.",
      },
      {
        q: "What happens after the 6-month retainer?",
        a: "You can continue with an Elite Maintenance Plan (from $499/mo), move to a custom monthly retainer, or take the site in-house using the documentation and training we provide.",
      },
    ],
  },
];

export function getWebsitePackage(slug: string) {
  return websitePackages.find((pkg) => pkg.slug === slug);
}
