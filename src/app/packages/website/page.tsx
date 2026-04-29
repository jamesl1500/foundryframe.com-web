/**
 * Website Packages - Foundry Frame
 * ===============================
 * Four custom website tiers: The Spark, The Blueprint,
 * The Architect, The Monument.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Website Packages",
  description:
    "Custom website design packages from Foundry Frame — from a clean 5-page launch site to a full enterprise build. No templates. No shortcuts.",
};

/* ============================================================
   DATA: Website Packages
   ============================================================ */
const packages = [
  {
    tier: "01",
    name: "The Spark",
    price: "$1,500–$2,500",
    tagline: "Your business, online — done right the first time.",
    description:
      "You've built something worth showing the world. Now it's time to show it. The Spark is our entry-level website package — but there's nothing entry-level about what you get. This is a fully custom, professionally designed website built for performance and first impressions, not a template with your name dropped in.",
    bestFor:
      "New business owners, freelancers & consultants, local service providers, side hustles turning full-time",
    badge: null,
    features: [
      "Up to 5 fully custom-designed pages (Home, About, Services, Contact + 1 more)",
      "100% mobile-responsive across all devices and screen sizes",
      "Contact form with email notifications",
      "Google Maps integration (for local businesses)",
      "On-page SEO foundations (meta titles, descriptions, schema markup)",
      "Basic Google Analytics setup",
      "2 structured revision rounds",
      "30-day post-launch support window",
    ],
    cta: "Get The Spark — Starting at $1,500",
    variant: "dark" as const,
  },
  {
    tier: "02",
    name: "The Blueprint",
    price: "$3,500–$6,000",
    tagline: "A real business deserves a real website.",
    description:
      "Your business has outgrown a basic website. The Blueprint hits the sweet spot: custom design, advanced features, and a strategy-first approach that sets you apart from every competitor using the same $29/month template. We build it to be your most effective sales tool.",
    bestFor:
      "Established small businesses, growing brands building credibility, service companies with multiple offerings, businesses investing in SEO",
    badge: "Most Popular",
    features: [
      "Up to 10 fully custom-designed pages",
      "Custom design system (your own colors, typography, and component library)",
      "CMS integration — edit your own content, no developer required",
      "Blog or resources section with categories and search",
      "Advanced on-page SEO + page speed optimization",
      "Google Analytics 4 setup with conversion event tracking",
      "CMS training session (30 min recorded walkthrough)",
      "3 revision rounds + optional stakeholder review presentation",
    ],
    cta: "Start Your Blueprint — From $3,500",
    variant: "light" as const,
  },
  {
    tier: "03",
    name: "The Architect",
    price: "$7,000–$12,000",
    tagline: "Scale-ready. Strategy-first. Built to dominate search.",
    description:
      "Some websites are brochures. The Architect is a growth machine. Built for scaling companies with complex needs — multiple service lines, e-commerce, integrations, and serious traffic goals — it doesn't just look the part. It performs. Every engagement starts with a deep strategic session.",
    bestFor:
      "Growth-stage companies, e-commerce brands, businesses with dedicated marketing teams, organizations where the website drives revenue",
    badge: null,
    features: [
      "Up to 20 pages + custom section templates your team can reuse",
      "E-commerce functionality (Shopify storefront or WooCommerce)",
      "CRM integration (HubSpot, Salesforce, or equivalent)",
      "Email marketing platform connection (Mailchimp, Klaviyo, etc.)",
      "Custom micro-animations and scroll-triggered effects",
      "Core Web Vitals optimization targeting 90+ Lighthouse score",
      "Full technical SEO audit + content strategy brief",
      "4 revision rounds with dedicated project manager",
      "3-month post-launch performance check-in",
    ],
    cta: "Build Your Architect Site — From $7,000",
    variant: "dark" as const,
  },
  {
    tier: "04",
    name: "The Monument",
    price: "$15,000+",
    tagline: "When mediocrity isn't an option.",
    description:
      "The Monument is our enterprise-grade engagement — fully custom, fully bespoke, built for organizations where the digital presence is a flagship asset, not a cost center. Monument clients get a dedicated project team. This isn't a project. It's a partnership.",
    bestFor:
      "Enterprise organizations, regional or national brands, regulated industries (healthcare, finance, legal), businesses replacing a legacy digital platform",
    badge: "Enterprise",
    features: [
      "Fully custom scope — no page limits, no feature restrictions",
      "Multi-language and multi-location support",
      "Custom API integrations (ERP, CRM, POS, booking, any third-party system)",
      "WCAG 2.1 AA accessibility compliance",
      "Dedicated project manager and lead developer",
      "Unlimited revisions within the agreed project scope",
      "Comprehensive QA across all major browsers and devices",
      "Priority 6-month post-launch support retainer",
      "Full technical documentation and team training sessions",
    ],
    cta: "Request a Discovery Session",
    variant: "dark-accent" as const,
  },
];

/* ============================================================
   DATA: Add-ons
   ============================================================ */
const addons = [
  {
    name: "E-Commerce Setup",
    price: "$2,500+",
    description:
      "We build fully custom e-commerce experiences — no off-the-shelf templates. Every storefront is engineered from the ground up using modern technologies like Next.js and headless commerce platforms, giving you complete control over performance, UX, and scalability.",
    featured: true,
    highlights: [
      "Headless commerce architecture",
      "Custom product & checkout flows",
      "Payment gateway integration",
      "Inventory & order management",
      "Built for speed & conversion",
    ],
  },
  {
    name: "Social Media Management",
    price: "$250/mo",
    description:
      "We plug directly into your existing social channels — no disruption, no learning curve. Our team crafts and schedules platform-native content designed to resonate with your audience, drive engagement, and convert followers into customers.",
    featured: true,
    highlights: [
      "Seamless integration with existing accounts",
      "Content strategy tailored to your brand",
      "Revenue-focused post scheduling",
      "Platform-specific creative (Reels, Stories, Posts)",
      "Monthly performance reporting",
    ],
  },
  {
    name: "Additional Web Pages",
    price: "$500/page",
    description:
      "Extend your website with additional pages designed to match your existing brand system.",
    featured: false,
    highlights: [] as string[],
  },
  {
    name: "SEO Audit & Optimization",
    price: "$800",
    description:
      "A comprehensive technical and on-page SEO audit with actionable fixes to improve search visibility.",
    featured: false,
    highlights: [] as string[],
  },
];

/* ============================================================
   COMPONENT: Website Packages Page
   ============================================================ */
export default function WebsitePackagesPage() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/packages"
            className="text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:text-gray-400 transition-colors mb-6 inline-block"
          >
            &larr; All Packages
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            Website Packages
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Built for results
          </h1>
          <p className="text-gray-500 text-sm mt-6 max-w-lg">
            Every website we build is fully custom. No templates, no shortcuts —
            just clean, fast, conversion-optimized design engineered around your
            goals.
          </p>
        </div>
      </section>

      {/* =============================================
          TIER OVERVIEW STRIP
          ============================================= */}
      <section className="bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {packages.map((pkg) => (
              <div key={`strip-${pkg.tier}`} className="py-6 px-4 lg:px-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 block mb-1">
                  {pkg.tier}
                </span>
                <span className="text-white font-heading font-bold text-base sm:text-lg block">
                  {pkg.name}
                </span>
                <span className="text-gray-500 text-xs mt-0.5 block">{pkg.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          PRICING TIERS — 2x2 grid
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">

            {/* ---- The Spark (dark) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Tier 01</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[0].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{packages[0].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[0].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{packages[0].description}</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
                Best for: {packages[0].bestFor}
              </p>
              <div className="border-t border-white/10 flex-1">
                {packages[0].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-white/10">
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {packages[0].cta}
              </Link>
            </div>

            {/* ---- The Blueprint (light / highlighted) ---- */}
            <div className="bg-white p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Tier 02</span>
                <span className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1 font-bold">
                  Most Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[1].name}</p>
              <div className="text-4xl font-heading font-bold text-black mb-2">{packages[1].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[1].tagline}&rdquo;</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{packages[1].description}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">
                Best for: {packages[1].bestFor}
              </p>
              <div className="border-t border-black/10 flex-1">
                {packages[1].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-black/10">
                    <span className="text-gray-400 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-700 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors"
              >
                {packages[1].cta}
              </Link>
            </div>

            {/* ---- The Architect (dark) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Tier 03</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[2].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{packages[2].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[2].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{packages[2].description}</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
                Best for: {packages[2].bestFor}
              </p>
              <div className="border-t border-white/10 flex-1">
                {packages[2].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-white/10">
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {packages[2].cta}
              </Link>
            </div>

            {/* ---- The Monument (dark + white accent top border) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col border-t-2 border-white">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Tier 04</span>
                <span className="text-[10px] uppercase tracking-widest border border-white/30 text-gray-400 px-3 py-1">
                  Enterprise
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[3].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{packages[3].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[3].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{packages[3].description}</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
                Best for: {packages[3].bestFor}
              </p>
              <div className="border-t border-white/10 flex-1">
                {packages[3].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-white/10">
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {packages[3].cta}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =============================================
          ADD-ONS
          ============================================= */}
      <section className="py-24 lg:py-32 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
            &Agrave; La Carte
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-16">
            Add-on services
          </h2>

          {/* Featured add-ons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 mb-px">
            {addons
              .filter((a) => a.featured)
              .map((addon) => (
                <div key={addon.name} className="bg-gray-900 p-8 lg:p-10 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <p className="text-white font-heading font-bold text-2xl">{addon.name}</p>
                    <span className="text-white font-heading font-bold text-xl shrink-0">{addon.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{addon.description}</p>
                  {addon.highlights.length > 0 && (
                    <div className="border-t border-white/10 pt-6">
                      {addon.highlights.map((point) => (
                        <div key={point} className="flex items-start gap-3 py-2.5 border-b border-white/10">
                          <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                          <span className="text-gray-400 text-sm">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Standard add-ons */}
          <div className="border-t border-white/10">
            {addons
              .filter((a) => !a.featured)
              .map((addon) => (
                <div
                  key={addon.name}
                  className="flex items-start justify-between gap-6 py-5 border-b border-white/10"
                >
                  <div>
                    <span className="text-gray-300 text-sm block">{addon.name}</span>
                    <span className="text-gray-600 text-xs mt-1 block">{addon.description}</span>
                  </div>
                  <span className="text-white font-heading font-semibold text-sm shrink-0">
                    {addon.price}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[0.95] mb-6">
              Need something custom?
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-lg">
              Every project is different. Tell us about your goals and we&apos;ll
              scope a website engagement built exactly around your needs.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
