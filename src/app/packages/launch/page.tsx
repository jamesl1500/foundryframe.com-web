/**
 * Launch Bundles - Foundry Frame
 * ===============================
 * Four complete digital launch bundles: Ignite, Velocity,
 * Ascend, Apex.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Launch Bundles",
  description:
    "Complete digital launch bundles from Foundry Frame — website, brand identity, SEO, and maintenance in one cohesive engagement.",
};

/* ============================================================
   DATA: Launch Bundles
   ============================================================ */
const bundles = [
  {
    number: "01",
    name: "Ignite",
    price: "$2,500",
    tagline: "From zero to online in one move.",
    description:
      "Starting a business is hard enough. Getting your digital presence right shouldn't be a months-long ordeal. Ignite packages everything a new business needs to launch online with confidence — a custom website, a professional logo, and a social media presence — all delivered in one seamless engagement.",
    features: [
      "The Spark — 5-page custom website",
      "Logo design (3 concept directions, 2 revision rounds, all file formats)",
      "Social media profile setup and optimization on up to 3 platforms",
      "1 month of Essential Maintenance included",
      "Domain registration and hosting configuration",
    ],
    cta: "Light the fuse — get started",
    badge: null,
    variant: "dark" as const,
  },
  {
    number: "02",
    name: "Velocity",
    price: "$6,500",
    tagline: "Everything a real business needs to compete online.",
    description:
      "Velocity is the complete digital launchpad for businesses that are serious about their online presence from day one. In a single engagement, you get a conversion-optimized website, a full brand identity system, a clear roadmap for search visibility, and three months of professional maintenance — all handled by one team, on one timeline.",
    features: [
      "The Blueprint — 10-page custom website with CMS",
      "Full brand identity kit (logo, color palette, typography system, brand guidelines PDF)",
      "SEO audit + 90-day keyword strategy and content roadmap",
      "Google Analytics 4 and Google Search Console setup and verification",
      "Competitor analysis report (top 5 competitors in your market)",
      "3 months of Professional Maintenance",
    ],
    cta: "Start with Velocity — From $6,500",
    badge: "Most Popular",
    variant: "light" as const,
  },
  {
    number: "03",
    name: "Ascend",
    price: "$14,000",
    tagline: "Build the machine. Turn it on. Watch it grow.",
    description:
      "Ascend is for growth-stage businesses that don't just want a great website — they want a full digital growth engine. Site, ads, social presence, and maintenance all aligned, all managed, and all pulling in the same direction while your competitors juggle three different vendors.",
    features: [
      "The Architect — 20-page growth website with e-commerce readiness",
      "Full brand identity and visual style guide",
      "Landing page + paid advertising funnel (Google Ads or Meta Ads)",
      "Social media management — 3 months (3 platforms, 12 posts/month)",
      "Paid ad campaign setup, targeting, and first-month optimization",
      "Monthly performance reporting across all channels",
      "6 months of Professional Maintenance",
    ],
    cta: "Build with Ascend — From $14,000",
    badge: null,
    variant: "dark" as const,
  },
  {
    number: "04",
    name: "Apex",
    price: "$28,000+",
    tagline: "Total digital dominance. Nothing left undone.",
    description:
      "Apex is our most comprehensive engagement — reserved for companies that want complete command of their digital presence. An enterprise-grade website, custom application feature, full brand strategy workshop, SEO, paid ads, and a full year of premium maintenance. Apex clients don't shop for services. They invest in outcomes.",
    features: [
      "The Monument — enterprise custom website",
      "Custom web application feature or client portal",
      "Full brand strategy workshop and competitive positioning session",
      "6 months of ongoing SEO (technical, content, and link building)",
      "3 months of paid ads management (Google + Meta)",
      "12 months of Premium Maintenance",
      "Quarterly strategy review sessions",
      "Dedicated account manager throughout",
    ],
    cta: "Reserve a strategy session",
    badge: "Full Service",
    variant: "dark-accent" as const,
  },
];

/* ============================================================
   COMPONENT: Launch Bundles Page
   ============================================================ */
export default function LaunchBundlesPage() {
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
            Launch Bundles
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Everything in one move
          </h1>
          <p className="text-gray-500 text-sm mt-6 max-w-lg">
            Our launch bundles combine a custom website, brand identity, and
            ongoing support into a single cohesive engagement. One team. One
            timeline. One point of contact.
          </p>
        </div>
      </section>

      {/* =============================================
          BUNDLE OVERVIEW STRIP
          ============================================= */}
      <section className="bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {bundles.map((b) => (
              <div key={`strip-${b.number}`} className="py-6 px-4 lg:px-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 block mb-1">
                  {b.number}
                </span>
                <span className="text-white font-heading font-bold text-base sm:text-lg block">
                  {b.name}
                </span>
                <span className="text-gray-500 text-xs mt-0.5 block">{b.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          BUNDLE CARDS — 2x2 grid
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">

            {/* ---- Ignite (dark) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Bundle 01</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{bundles[0].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{bundles[0].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{bundles[0].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{bundles[0].description}</p>
              <div className="border-t border-white/10 flex-1">
                {bundles[0].features.map((f) => (
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
                {bundles[0].cta}
              </Link>
            </div>

            {/* ---- Velocity (light / highlighted) ---- */}
            <div className="bg-white p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Bundle 02</span>
                <span className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1 font-bold">
                  Most Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{bundles[1].name}</p>
              <div className="text-4xl font-heading font-bold text-black mb-2">{bundles[1].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{bundles[1].tagline}&rdquo;</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">{bundles[1].description}</p>
              <div className="border-t border-black/10 flex-1">
                {bundles[1].features.map((f) => (
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
                {bundles[1].cta}
              </Link>
            </div>

            {/* ---- Ascend (dark) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Bundle 03</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{bundles[2].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{bundles[2].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{bundles[2].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{bundles[2].description}</p>
              <div className="border-t border-white/10 flex-1">
                {bundles[2].features.map((f) => (
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
                {bundles[2].cta}
              </Link>
            </div>

            {/* ---- Apex (dark + white accent top border) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col border-t-2 border-white">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Bundle 04</span>
                <span className="text-[10px] uppercase tracking-widest border border-white/30 text-gray-400 px-3 py-1">
                  Full Service
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{bundles[3].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{bundles[3].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{bundles[3].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{bundles[3].description}</p>
              <div className="border-t border-white/10 flex-1">
                {bundles[3].features.map((f) => (
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
                {bundles[3].cta}
              </Link>
            </div>

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
              Not sure which bundle fits?
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-lg">
              Every Foundry Frame engagement starts with a conversation. Tell us
              where you are and where you want to go — we&apos;ll recommend the
              right bundle or build a custom scope.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
