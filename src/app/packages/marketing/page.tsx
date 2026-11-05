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
import { parsePriceSpecification } from "@/lib/schema-price";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Digital Marketing Packages from $500/mo",
  description:
    "Digital marketing packages from Foundry Frame — SEO, social media, paid ads, and content that turn your website into a consistent lead generation engine.",
  alternates: {
    canonical: "/packages/marketing",
  },
  openGraph: {
    title: "Digital Marketing Packages from $500/mo",
    description:
      "SEO, content, social, and paid ads packages that turn traffic into qualified leads.",
    url: "/packages/marketing",
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
    title: "Digital Marketing Packages from $500/mo",
    description:
      "SEO, content, social, and paid ads packages that turn traffic into qualified leads.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Marketing Packages
   ============================================================ */
const packages = [
  {
    number: "01",
    name: "Presence",
    pricePrefix: "From",
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
    pricePrefix: "From",
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
    cta: "Build Momentum",
    badge: "Most Popular",
    variant: "light" as const,
  },
  {
    number: "03",
    name: "Dominate",
    pricePrefix: "From",
    price: "$2,500/mo",
    tagline: "Lead the search results. Lead the conversation.",
    description:
      "Dominate is for brands that want to be the clear leader in their market. Full-funnel marketing at scale: technical SEO, paid search, paid social, long-form content, weekly email, and a dedicated strategist who manages it all. Instead of marketing that runs in disconnected pieces, yours is coordinated, optimized, and growing — every single week.",
    features: [
      "Full SEO strategy and execution — technical audits, content sprints, authority link building",
      "Google Ads management (ad spend billed separately)",
      "Meta Ads management — Facebook and Instagram (ad spend billed separately)",
      "Social media management — 4 platforms, 20 posts/month with custom graphics",
      "4 long-form SEO blog posts per month (1,200–2,000 words each)",
      "Weekly email campaigns + 3 automation sequences built and managed",
      "Landing page A/B testing with monthly optimization cycle",
      "Custom growth dashboard with real-time performance metrics",
      "Bi-weekly strategy calls with your dedicated growth strategist",
    ],
    cta: "Start Dominate",
    badge: "Full Service",
    variant: "dark-accent" as const,
  },
];

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const offersStructuredData = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Marketing Packages",
  url: `${siteUrl}/packages/marketing`,
  itemListElement: packages.map((pkg) => ({
    "@type": "Offer",
    name: pkg.name,
    description: pkg.tagline,
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
    { "@type": "ListItem", position: 3, name: "Marketing Packages", item: `${siteUrl}/packages/marketing` },
  ],
};

/* ============================================================
   COMPONENT: Marketing Packages Page
   ============================================================ */
export default function MarketingPackagesPage() {
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
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/packages"
            className="btn btn-glass min-h-10 px-4 text-sm mr-2 mb-6"
          >
            &larr; All Packages
          </Link>
          <p className="eyebrow mb-6">
            Marketing Packages
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight max-w-4xl">
            Get found by the people looking for you
          </h1>
          <p className="text-muted text-sm mt-6 max-w-lg">
            A great website only works when people can find it. Our marketing
            packages turn your digital presence into a consistent, measurable
            lead generation engine.
          </p>
        </div>
      </section>

      {/* =============================================
          PACKAGE OVERVIEW STRIP
          ============================================= */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 gap-3">
            {packages.map((p) => (
              <div key={`strip-${p.number}`} className="glass rounded-bubble py-5 px-5 lg:px-6">
                <span className="text-xs uppercase tracking-[0.3em] text-muted block mb-1">
                  {p.number}
                </span>
                <span className="text-ink font-heading font-bold text-base sm:text-lg block">
                  {p.name}
                </span>
                <span className="text-muted text-xs mt-0.5 block">
                  {p.pricePrefix ? `${p.pricePrefix} ` : ""}
                  {p.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          PACKAGE CARDS — 3 columns
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* ---- Presence (dark) ---- */}
            <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Plan 01</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">{packages[0].name}</p>
              {packages[0].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-muted block">{packages[0].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{packages[0].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{packages[0].tagline}&rdquo;</p>
              <p className="text-sm text-body leading-relaxed mb-8">{packages[0].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {packages[0].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-ink/10">
                    <span className="text-accent-ink font-bold shrink-0" aria-hidden="true">&#10003;</span>
                    <span className="text-body text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="btn btn-primary flex text-center mt-8"
              >
                {packages[0].cta}
              </Link>
            </div>

            {/* ---- Momentum (light / highlighted) ---- */}
            <div className="glass rounded-card ring-2 ring-accent/40 p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-body">Plan 02</span>
                <span className="text-xs uppercase tracking-widest bg-ink text-white px-3 py-1 font-bold rounded-full">
                  Most Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">{packages[1].name}</p>
              {packages[1].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-body block">{packages[1].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{packages[1].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{packages[1].tagline}&rdquo;</p>
              <p className="text-sm text-muted leading-relaxed mb-8">{packages[1].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {packages[1].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-ink/10">
                    <span className="text-accent-ink font-bold shrink-0" aria-hidden="true">&#10003;</span>
                    <span className="text-ink-soft text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="btn btn-primary flex text-center mt-8"
              >
                {packages[1].cta}
              </Link>
            </div>

            {/* ---- Dominate (dark + white accent top border) ---- */}
            <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col border-t-2 border-ink/20">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Plan 03</span>
                <span className="text-xs uppercase tracking-widest border border-ink/20 text-body px-3 py-1 rounded-full">
                  Full Service
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">{packages[2].name}</p>
              {packages[2].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-muted block">{packages[2].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{packages[2].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{packages[2].tagline}&rdquo;</p>
              <p className="text-sm text-body leading-relaxed mb-8">{packages[2].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {packages[2].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-ink/10">
                    <span className="text-accent-ink font-bold shrink-0" aria-hidden="true">&#10003;</span>
                    <span className="text-body text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="btn btn-primary flex text-center mt-8"
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
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-6">
              Ready to grow?
            </h2>
            <p className="text-muted text-sm mb-8 max-w-lg">
              Every marketing engagement starts with understanding your goals,
              your industry, and your definition of winning. Let&apos;s talk
              about what growth looks like for you.
            </p>
            <Link
              href="/contact"
              className="btn btn-primary"
            >
              Start the Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
