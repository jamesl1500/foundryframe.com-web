/**
 * Marketing Packages - Foundry Frame
 * ===============================
 * Three marketing tiers: Presence, Momentum, Dominate.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketing Packages",
  description:
    "Digital marketing packages from Foundry Frame — SEO, social media, paid ads, and content that turn your website into a consistent lead generation engine.",
};

/* ============================================================
   DATA: Marketing Packages
   ============================================================ */
const packages = [
  {
    number: "01",
    name: "Presence",
    price: "$500/mo",
    tagline: "Get found. Get remembered.",
    description:
      "Presence is built for businesses just entering the digital marketing arena. We focus on building your local visibility, cleaning up and optimizing your online profiles, and creating a consistent organic footprint that makes your brand show up when people search for what you do. No paid ads, no complex funnels — just smart, foundational visibility work that compounds over time.",
    features: [
      "Local SEO optimization (Google Business Profile complete setup and management)",
      "Social media management — 2 platforms, 8 posts/month with branded graphics",
      "Branded template design for social media posts",
      "Citation building and local directory listings (20+ sources)",
      "Monthly analytics recap with plain-English insights",
    ],
    cta: "Start with Presence",
    badge: null,
    variant: "dark" as const,
  },
  {
    number: "02",
    name: "Momentum",
    price: "$1,200/mo",
    tagline: "More visibility. More leads. More growth.",
    description:
      "Momentum is the full marketing engine for businesses that are ready to grow — and mean it. Organic SEO that improves rankings month over month, consistent social content that builds your audience, regular email campaigns that keep customers coming back, and blog content that positions you as the expert in your field. All managed by one team. All pointing toward the same goals.",
    features: [
      "Ongoing SEO — keyword tracking, on-page optimization, monthly content, link building outreach",
      "Social media management — 3 platforms, 12 posts/month with custom graphics",
      "2 SEO-optimized blog posts per month (topic research, writing, publishing)",
      "Monthly email campaign to your list (copywriting, design, deployment)",
      "Google Analytics 4 performance dashboard",
      "Monthly strategy call with your dedicated marketing manager",
      "Competitor keyword ranking updates",
    ],
    cta: "Build Momentum — From $1,200/mo",
    badge: "Most Popular",
    variant: "light" as const,
  },
  {
    number: "03",
    name: "Dominate",
    price: "$2,500/mo",
    tagline: "Own the search results. Own the conversation.",
    description:
      "Dominate is for brands that want to be the undeniable leader in their market. Full-funnel marketing at scale: technical SEO, paid search, paid social, long-form content, weekly email, and a dedicated strategist who manages it all. While your competitors run marketing in pieces wondering why it's not working, yours is coordinated, optimized, and growing — every single week.",
    features: [
      "Full SEO strategy and execution — technical audits, content sprints, authority link building",
      "Google Ads management (ad spend billed separately)",
      "Meta Ads management — Facebook and Instagram (ad spend billed separately)",
      "Social media management — 4 platforms, 20 posts/month with custom video content",
      "4 long-form SEO blog posts per month (1,200–2,000 words each)",
      "Weekly email campaigns + 3 automation sequences built and managed",
      "Landing page A/B testing with monthly optimization cycle",
      "Custom growth dashboard with real-time performance metrics",
      "Bi-weekly strategy calls with your dedicated growth strategist",
    ],
    cta: "Start Dominate — From $2,500/mo",
    badge: "Full Service",
    variant: "dark-accent" as const,
  },
];

/* ============================================================
   COMPONENT: Marketing Packages Page
   ============================================================ */
export default function MarketingPackagesPage() {
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
            Marketing Packages
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Stop waiting to be found
          </h1>
          <p className="text-gray-500 text-sm mt-6 max-w-lg">
            A great website with no traffic is a billboard in the middle of a
            forest. Our marketing packages transform your digital presence into a
            consistent, measurable lead generation engine.
          </p>
        </div>
      </section>

      {/* =============================================
          PACKAGE OVERVIEW STRIP
          ============================================= */}
      <section className="bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {packages.map((p) => (
              <div key={`strip-${p.number}`} className="py-6 px-4 lg:px-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 block mb-1">
                  {p.number}
                </span>
                <span className="text-white font-heading font-bold text-base sm:text-lg block">
                  {p.name}
                </span>
                <span className="text-gray-500 text-xs mt-0.5 block">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          PACKAGE CARDS — 3 columns
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10">

            {/* ---- Presence (dark) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Plan 01</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[0].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{packages[0].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[0].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{packages[0].description}</p>
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

            {/* ---- Momentum (light / highlighted) ---- */}
            <div className="bg-white p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Plan 02</span>
                <span className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1 font-bold">
                  Most Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[1].name}</p>
              <div className="text-4xl font-heading font-bold text-black mb-2">{packages[1].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[1].tagline}&rdquo;</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">{packages[1].description}</p>
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

            {/* ---- Dominate (dark + white accent top border) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col border-t-2 border-white">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Plan 03</span>
                <span className="text-[10px] uppercase tracking-widest border border-white/30 text-gray-400 px-3 py-1">
                  Full Service
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[2].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{packages[2].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[2].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{packages[2].description}</p>
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
              Ready to grow?
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-lg">
              Every marketing engagement starts with understanding your goals,
              your industry, and your definition of winning. Let&apos;s talk
              about what growth looks like for you.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Start the Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
