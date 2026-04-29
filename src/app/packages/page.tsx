/**
 * Packages Page - Foundry Frame
 * ===============================
 * Flat, minimal pricing layout. Clean tier cards
 * with rule dividers. No rounded corners.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Explore Foundry Frame's service packages: Starter, Professional, and Enterprise tiers with transparent pricing.",
};

/* ============================================================
   DATA: Packages
   ============================================================ */
const packages = [
  {
    tier: "01",
    name: "Starter",
    price: "$2,500",
    description: "For new brands launching their identity.",
    bestFor: "Small businesses & solo entrepreneurs",
    badge: null,
    features: [
      "Custom Website (3 pages)",
      "Logo Design",
      "Brand Color Palette",
      "Typography Selection",
      "Business Card Design",
      "Basic Brand Guidelines",
      "2 Revision Rounds",
    ],
  },
  {
    tier: "02",
    name: "Professional",
    price: "$7,500",
    description: "Comprehensive branding and digital presence.",
    bestFor: "Growing companies ready to scale",
    badge: "Most Popular",
    features: [
      "Everything in Starter",
      "Full Visual Identity System",
      "Custom Website (5 pages)",
      "Social Media Templates",
      "Extended Brand Guidelines",
      "4 Revision Rounds",
      "30-Day Post-Launch Support",
    ],
  },
  {
    tier: "03",
    name: "Enterprise",
    price: "$15,000+",
    description: "End-to-end creative partnership.",
    bestFor: "Established brands & large organizations",
    badge: "Full Service",
    features: [
      "Everything in Professional",
      "Custom Website (unlimited pages)",
      "Brand Video Production",
      "Social Media Strategy & Setup",
      "Advertising Campaign Setup",
      "Print Collateral Design",
      "Unlimited Revisions",
      "Dedicated Account Manager",
      "Quarterly Strategy Reviews",
    ],
  },
] as const;

/* ============================================================
   DATA: Add-ons
   ============================================================ */
const addons = [
  {
    name: "Additional Web Pages",
    price: "$500/page",
    description: "Extend your website with additional pages designed to match your existing brand system.",
    featured: false,
    highlights: [] as string[],
  },
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
    name: "SEO Audit & Optimization",
    price: "$800",
    description: "A comprehensive technical and on-page SEO audit with actionable fixes to improve search visibility.",
    featured: false,
    highlights: [] as string[],
  },
];

/* ============================================================
   COMPONENT: Packages Page
   ============================================================ */
export default function PackagesPage() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            Packages
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Transparent pricing
          </h1>
          <p className="text-gray-500 text-sm mt-6 max-w-lg">
            Clear, honest packages with no hidden fees. Choose a tier that fits
            your needs, or contact us for a custom quote.
          </p>
        </div>
      </section>

      {/* =============================================
          TIER OVERVIEW STRIP -- all three packages at a glance
          ============================================= */}
      <section className="bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {packages.map((pkg) => (
              <div key={`strip-${pkg.tier}`} className="py-6 px-4 lg:px-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 block mb-1">
                  {pkg.tier}
                </span>
                <span className="text-white font-heading font-bold text-lg sm:text-xl block">
                  {pkg.name}
                </span>
                <span className="text-gray-500 text-xs mt-0.5 block">
                  Starting at {pkg.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          PRICING TIERS -- full detail cards
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10">

            {/* ---- Starter (dark) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
                  Tier 01
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                {packages[0].name}
              </p>
              <div className="text-5xl font-heading font-bold text-white mb-3">
                {packages[0].price}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {packages[0].description}
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
                Best for: {packages[0].bestFor}
              </p>
              <div className="border-t border-white/10 flex-1">
                {packages[0].features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 py-3 border-b border-white/10"
                  >
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* ---- Professional (light / highlighted) ---- */}
            <div className="bg-white p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
                  Tier 02
                </span>
                <span className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1 font-bold">
                  Most Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                {packages[1].name}
              </p>
              <div className="text-5xl font-heading font-bold text-black mb-3">
                {packages[1].price}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {packages[1].description}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">
                Best for: {packages[1].bestFor}
              </p>
              <div className="border-t border-black/10 flex-1">
                {packages[1].features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 py-3 border-b border-black/10"
                  >
                    <span className="text-gray-400 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* ---- Enterprise (dark + white accent top border) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col border-t-2 border-white">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
                  Tier 03
                </span>
                <span className="text-[10px] uppercase tracking-widest border border-white/30 text-gray-400 px-3 py-1">
                  Full Service
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                {packages[2].name}
              </p>
              <div className="text-5xl font-heading font-bold text-white mb-3">
                {packages[2].price}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {packages[2].description}
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
                Best for: {packages[2].bestFor}
              </p>
              <div className="border-t border-white/10 flex-1">
                {packages[2].features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 py-3 border-b border-white/10"
                  >
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-colors"
              >
                Get Started
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

          {/* Featured add-ons — expanded cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 mb-px">
            {addons
              .filter((a) => a.featured)
              .map((addon) => (
                <div key={addon.name} className="bg-gray-900 p-8 lg:p-10 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <p className="text-white font-heading font-bold text-2xl">
                      {addon.name}
                    </p>
                    <span className="text-white font-heading font-bold text-xl shrink-0">
                      {addon.price}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {addon.description}
                  </p>
                  {addon.highlights.length > 0 && (
                    <div className="border-t border-white/10 pt-6">
                      {addon.highlights.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-3 py-2.5 border-b border-white/10"
                        >
                          <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                          <span className="text-gray-400 text-sm">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Standard add-ons — simple rows */}
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
                    {addon.description && (
                      <span className="text-gray-600 text-xs mt-1 block">{addon.description}</span>
                    )}
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
          CUSTOM CTA
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[0.95] mb-6">
              Need something custom?
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-lg">
              Every brand is unique. Let&apos;s discuss your specific needs and
              build a package that fits perfectly.
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
