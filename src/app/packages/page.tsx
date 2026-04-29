/**
 * Packages Hub - Foundry Frame
 * ===============================
 * Category index linking to Website, Launch, Maintenance,
 * and Marketing package sub-pages.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Explore Foundry Frame's full range of packages: website design, launch bundles, maintenance plans, and marketing packages.",
};

/* ============================================================
   DATA: Categories
   ============================================================ */
const categories = [
  {
    number: "01",
    name: "Website Packages",
    href: "/packages/website",
    tagline: "Custom-built. Performance-first.",
    description:
      "From a clean 5-page launch site to a full enterprise build, every website we deliver is custom-designed and engineered for results — no templates, no shortcuts.",
    priceRange: "Starting at $1,500",
    tiers: ["The Spark", "The Blueprint", "The Architect", "The Monument"],
  },
  {
    number: "02",
    name: "Launch Bundles",
    href: "/packages/launch",
    tagline: "Everything you need. One engagement.",
    description:
      "Bundled packages that combine a custom website, brand identity, and ongoing support into a single cohesive engagement — delivered by one team, on one timeline.",
    priceRange: "Starting at $2,500",
    tiers: ["Ignite", "Velocity", "Ascend", "Apex"],
  },
  {
    number: "03",
    name: "Maintenance Plans",
    href: "/packages/maintenance",
    tagline: "Launch is day one, not the finish line.",
    description:
      "Keep your site fast, secure, and continuously improving. From essential protection to full white-glove retainer support — we handle it all.",
    priceRange: "From $99/mo",
    tiers: ["Steady", "Active", "Elite"],
  },
  {
    number: "04",
    name: "Marketing Packages",
    href: "/packages/marketing",
    tagline: "Traffic. Leads. Growth.",
    description:
      "A great website with no traffic is a billboard in a forest. Our marketing packages turn your digital presence into a consistent, measurable lead generation engine.",
    priceRange: "From $500/mo",
    tiers: ["Presence", "Momentum", "Dominate"],
  },
];

/* ============================================================
   COMPONENT: Packages Hub
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
            Four categories. Every scope. One team. Choose the package that fits
            where you are today — and where you&apos;re going.
          </p>
        </div>
      </section>

      {/* =============================================
          CATEGORY GRID
          ============================================= */}
      <section className="bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">
            {categories.map((cat) => (
              <a
                key={cat.number}
                href={cat.href}
                className="group bg-black p-10 lg:p-14 flex flex-col hover:bg-gray-950 transition-colors"
              >
                <div className="flex items-start justify-between mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
                    {cat.number}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 group-hover:text-white transition-colors">
                    View &rarr;
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2 leading-tight">
                  {cat.name}
                </h2>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">
                  {cat.tagline}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                  {cat.description}
                </p>
                <div className="mt-auto">
                  <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">
                    Tiers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.tiers.map((tier) => (
                      <span
                        key={tier}
                        className="text-[10px] uppercase tracking-widest border border-white/10 text-gray-500 px-2 py-1"
                      >
                        {tier}
                      </span>
                    ))}
                  </div>
                  <p className="text-white font-heading font-bold text-lg mt-6">
                    {cat.priceRange}
                  </p>
                </div>
              </a>
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
              Not sure where to start?
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-lg">
              Every engagement starts with a conversation. Tell us about your
              goals and we&apos;ll point you toward the right package — or build
              a custom scope that fits exactly.
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
