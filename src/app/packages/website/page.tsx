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
import { websitePackages as packages } from "@/lib/packages/website";
import { parsePriceSpecification } from "@/lib/schema-price";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Custom Website Packages from $1,500",
  description:
    "Custom website design packages from Foundry Frame — from a clean 5-page launch site to a full enterprise build. Starting at $1,500. No templates, no shortcuts.",
  alternates: {
    canonical: "/packages/website",
  },
  openGraph: {
    title: "Custom Website Packages from $1,500",
    description:
      "Custom websites starting at $1,500, up to enterprise builds. No templates. Built to convert.",
    url: "/packages/website",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame | Ohio Web Design & Branding Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Website Packages from $1,500",
    description:
      "Custom websites starting at $1,500, up to enterprise builds. No templates. Built to convert.",
    images: ["/twitter-image"],
  },
};

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
    price: "From $250/mo",
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
   STRUCTURED DATA
   ============================================================ */
const offersStructuredData = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Website Packages",
  url: `${siteUrl}/packages/website`,
  itemListElement: packages.map((pkg) => ({
    "@type": "Offer",
    name: pkg.name,
    description: pkg.tagline,
    url: `${siteUrl}/packages/website/${pkg.slug}`,
    priceSpecification: parsePriceSpecification(
      pkg.pricePrefix ? `${pkg.pricePrefix} ${pkg.price}` : pkg.price
    ),
  })),
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Packages", item: `${siteUrl}/packages` },
    { "@type": "ListItem", position: 3, name: "Website Packages", item: `${siteUrl}/packages/website` },
  ],
};

/* ============================================================
   COMPONENT: Website Packages Page
   ============================================================ */
export default function WebsitePackagesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

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
            Custom websites, built for results
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
              <Link
                key={`strip-${pkg.tier}`}
                href={`/packages/website/${pkg.slug}`}
                className="py-6 px-4 lg:px-8 hover:bg-white/5 transition-colors"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 block mb-1">
                  {pkg.tier}
                </span>
                <span className="text-white font-heading font-bold text-base sm:text-lg block">
                  {pkg.name}
                </span>
                <span className="text-gray-500 text-xs mt-0.5 block">
                  {pkg.pricePrefix ? `${pkg.pricePrefix} ` : ""}
                  {pkg.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          PRICING TIERS — 2x2 grid
          ============================================= */}
      <section className="glow-field py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">

            {/* ---- The Spark (dark) ---- */}
            <div className="glass-card p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Tier 01</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[0].name}</p>
              {packages[0].pricePrefix && (
                <span className="text-[10px] uppercase tracking-widest text-gray-500 block">{packages[0].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-white mb-2">{packages[0].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[0].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{packages[0].description}</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
                Best for: {packages[0].bestFor.join(", ")}
              </p>
              <div className="border-t border-white/10 flex-1">
                {packages[0].features.map(({ label: f }) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-white/10">
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/packages/website/${packages[0].slug}`}
                className="self-start mt-8 text-xs uppercase tracking-wider border-b pb-1 transition-colors text-gray-400 hover:text-white border-gray-500 hover:border-white"
              >
                Full details: {packages[0].name} &rarr;
              </Link>
              <Link
                href="/contact"
                className="block text-center mt-6 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-accent text-black hover:bg-accent-glow transition-colors"
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
              {packages[1].pricePrefix && (
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block">{packages[1].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-black mb-2">{packages[1].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[1].tagline}&rdquo;</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{packages[1].description}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">
                Best for: {packages[1].bestFor.join(", ")}
              </p>
              <div className="border-t border-black/10 flex-1">
                {packages[1].features.map(({ label: f }) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-black/10">
                    <span className="text-gray-400 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-700 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/packages/website/${packages[1].slug}`}
                className="self-start mt-8 text-xs uppercase tracking-wider border-b pb-1 transition-colors text-gray-500 hover:text-black border-gray-400 hover:border-black"
              >
                Full details: {packages[1].name} &rarr;
              </Link>
              <Link
                href="/contact"
                className="block text-center mt-6 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors"
              >
                {packages[1].cta}
              </Link>
            </div>

            {/* ---- The Architect (dark) ---- */}
            <div className="glass-card p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Tier 03</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[2].name}</p>
              {packages[2].pricePrefix && (
                <span className="text-[10px] uppercase tracking-widest text-gray-500 block">{packages[2].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-white mb-2">{packages[2].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[2].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{packages[2].description}</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
                Best for: {packages[2].bestFor.join(", ")}
              </p>
              <div className="border-t border-white/10 flex-1">
                {packages[2].features.map(({ label: f }) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-white/10">
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/packages/website/${packages[2].slug}`}
                className="self-start mt-8 text-xs uppercase tracking-wider border-b pb-1 transition-colors text-gray-400 hover:text-white border-gray-500 hover:border-white"
              >
                Full details: {packages[2].name} &rarr;
              </Link>
              <Link
                href="/contact"
                className="block text-center mt-6 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-accent text-black hover:bg-accent-glow transition-colors"
              >
                {packages[2].cta}
              </Link>
            </div>

            {/* ---- The Monument (dark + white accent top border) ---- */}
            <div className="glass-card p-8 lg:p-10 flex flex-col border-t-2 border-white">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Tier 04</span>
                <span className="text-[10px] uppercase tracking-widest border border-white/30 text-gray-400 px-3 py-1">
                  Enterprise
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{packages[3].name}</p>
              {packages[3].pricePrefix && (
                <span className="text-[10px] uppercase tracking-widest text-gray-500 block">{packages[3].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-white mb-2">{packages[3].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{packages[3].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{packages[3].description}</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
                Best for: {packages[3].bestFor.join(", ")}
              </p>
              <div className="border-t border-white/10 flex-1">
                {packages[3].features.map(({ label: f }) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-white/10">
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/packages/website/${packages[3].slug}`}
                className="self-start mt-8 text-xs uppercase tracking-wider border-b pb-1 transition-colors text-gray-400 hover:text-white border-gray-500 hover:border-white"
              >
                Full details: {packages[3].name} &rarr;
              </Link>
              <Link
                href="/contact"
                className="block text-center mt-6 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-accent text-black hover:bg-accent-glow transition-colors"
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
              className="inline-block px-8 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
