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
const packages: {
  name: string;
  price: string;
  description: string;
  highlighted?: boolean;
  features: string[];
}[] = [
  {
    name: "Starter",
    price: "$2,500",
    description: "For new brands launching their identity.",
    features: [
      "Logo Design",
      "Brand Color Palette",
      "Typography Selection",
      "Business Card Design",
      "Basic Brand Guidelines",
      "2 Revision Rounds",
    ],
  },
  {
    name: "Professional",
    price: "$7,500",
    description: "Comprehensive branding and digital presence.",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Full Visual Identity System",
      "Custom Website (5 pages)",
      "Social Media Templates",
      "Product Photography (half day)",
      "Extended Brand Guidelines",
      "4 Revision Rounds",
      "30-Day Post-Launch Support",
    ],
  },
  {
    name: "Enterprise",
    price: "$15,000+",
    description: "End-to-end creative partnership.",
    features: [
      "Everything in Professional",
      "Custom Website (unlimited pages)",
      "Brand Video Production",
      "Full Photography Package",
      "Social Media Strategy & Setup",
      "Advertising Campaign Setup",
      "Print Collateral Design",
      "Unlimited Revisions",
      "Dedicated Account Manager",
      "Quarterly Strategy Reviews",
    ],
  },
];

/* ============================================================
   DATA: Add-ons
   ============================================================ */
const addons = [
  { name: "Additional Web Pages", price: "$300/page" },
  { name: "E-Commerce Setup", price: "$2,000+" },
  { name: "Social Media Management", price: "$1,500/mo" },
  { name: "SEO Audit & Optimization", price: "$800" },
  { name: "Product Photography (full day)", price: "$1,200" },
  { name: "Brand Video (30 sec)", price: "$2,500" },
  { name: "Brand Video (60 sec)", price: "$4,000" },
  { name: "Drone Footage", price: "$500" },
  { name: "Print Design (per piece)", price: "$250+" },
  { name: "Packaging Design", price: "$1,000+" },
] as const;

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
            Clear, honest packages with no hidden fees. Choose a tier that
            fits your needs, or contact us for a custom quote.
          </p>
        </div>
      </section>

      {/* =============================================
          PRICING TIERS
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`p-8 lg:p-10 ${
                  pkg.highlighted ? "bg-white text-black" : "bg-black"
                }`}
              >
                {/* Header */}
                <p
                  className={`text-xs uppercase tracking-widest mb-6 ${
                    pkg.highlighted ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {pkg.name}
                </p>
                <div
                  className={`text-5xl font-heading font-bold mb-3 ${
                    pkg.highlighted ? "text-black" : "text-white"
                  }`}
                >
                  {pkg.price}
                </div>
                <p
                  className={`text-sm mb-8 ${
                    pkg.highlighted ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {pkg.description}
                </p>

                {/* Features */}
                <div
                  className={`border-t ${
                    pkg.highlighted ? "border-black/10" : "border-white/10"
                  }`}
                >
                  {pkg.features.map((feature) => (
                    <div
                      key={feature}
                      className={`py-3 border-b text-sm ${
                        pkg.highlighted
                          ? "border-black/10 text-gray-700"
                          : "border-white/10 text-gray-400"
                      }`}
                    >
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/contact"
                  className={`block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    pkg.highlighted
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          ADD-ONS
          ============================================= */}
      <section className="py-24 lg:py-32 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
            À La Carte
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-16">
            Add-on services
          </h2>

          <div className="border-t border-white/10">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center justify-between py-5 border-b border-white/10"
              >
                <span className="text-gray-300 text-sm">{addon.name}</span>
                <span className="text-white font-heading font-semibold text-sm">
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
              Every brand is unique. Let&apos;s discuss your specific needs
              and build a package that fits perfectly.
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
