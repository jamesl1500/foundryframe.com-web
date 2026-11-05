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
import { launchBundles as bundles } from "@/lib/packages/launch";
import { parsePriceSpecification } from "@/lib/schema-price";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Website + Branding Launch Bundles",
  description:
    "Launch bundles from $2,500: a custom website, logo and brand identity, SEO setup, and months of maintenance in one package for Ohio small businesses.",
  alternates: {
    canonical: "/packages/launch",
  },
  openGraph: {
    title: "Website + Branding Launch Bundles",
    description:
      "A custom website, brand identity, and months of maintenance in one package. Ignite, Velocity, Ascend, and Apex from $2,500.",
    url: "/packages/launch",
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
    title: "Website + Branding Launch Bundles",
    description:
      "A custom website, brand identity, and months of maintenance in one package. Ignite, Velocity, Ascend, and Apex from $2,500.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const offersStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Launch Bundles",
  serviceType: "Website design and branding package",
  description:
    "Bundled packages combining a custom website, brand identity, SEO setup, and ongoing maintenance in one engagement.",
  url: `${siteUrl}/packages/launch`,
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: [
    { "@type": "State", name: "Ohio" },
    { "@type": "Country", name: "United States" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Launch Bundles",
    itemListElement: bundles.map((bundle) => ({
      "@type": "Offer",
      name: `${bundle.name} Launch Bundle`,
      description: bundle.tagline,
      url: `${siteUrl}/packages/launch/${bundle.slug}`,
      priceSpecification: parsePriceSpecification(
        bundle.pricePrefix ? `${bundle.pricePrefix} ${bundle.price}` : bundle.price
      ),
    })),
  },
};

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "What is a launch bundle?",
    a: "A launch bundle packages a custom website, brand identity, and ongoing maintenance into one engagement with one team and one timeline. The larger bundles add SEO, paid ads, and social media management.",
  },
  {
    q: "How much does a launch bundle cost?",
    a: "Ignite starts at $2,500, Velocity at $6,500, Ascend at $14,000, and Apex at $28,000. Every price is a starting point; we confirm the exact number on a free, no-obligation call.",
  },
  {
    q: "How is a launch bundle different from a website package?",
    a: "A website package is the site itself. A launch bundle adds a logo or full brand identity and months of website maintenance, and on Velocity and up, SEO setup, analytics, ads, or social media, so everything launches together.",
  },
  {
    q: "What happens when the included maintenance ends?",
    a: "You can continue on any of our Maintenance Plans: Steady from $99/mo, Active from $249/mo, or Elite from $499/mo.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Packages", item: `${siteUrl}/packages` },
    { "@type": "ListItem", position: 3, name: "Launch Bundles", item: `${siteUrl}/packages/launch` },
  ],
};

/* ============================================================
   COMPONENT: Launch Bundles Page
   ============================================================ */
export default function LaunchBundlesPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
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
            Launch Bundles &middot; From $2,500
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight max-w-4xl">
            Website + brand, in one move
          </h1>
          <p className="text-muted text-sm mt-6 max-w-lg">
            Our launch bundles combine a custom website, brand identity, and
            ongoing support into a single cohesive engagement. One team. One
            timeline. One point of contact.
          </p>
        </div>
      </section>

      {/* =============================================
          BUNDLE OVERVIEW STRIP
          ============================================= */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {bundles.map((b) => (
              <Link
                key={`strip-${b.number}`}
                href={`/packages/launch/${b.slug}`}
                className="glass-card rounded-bubble py-5 px-5 lg:px-6"
              >
                <span className="text-xs uppercase tracking-[0.3em] text-muted block mb-1">
                  {b.number}
                </span>
                <span className="text-ink font-heading font-bold text-base sm:text-lg block">
                  {b.name}
                </span>
                <span className="text-muted text-xs mt-0.5 block">
                  {b.pricePrefix ? `${b.pricePrefix} ` : ""}
                  {b.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          BUNDLE CARDS — 2x2 grid
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ---- Ignite (dark) ---- */}
            <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Bundle 01</span>
              </div>
              <p className="text-lg uppercase tracking-widest text-muted mb-2">{bundles[0].name}</p>
              {bundles[0].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-muted block">{bundles[0].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{bundles[0].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{bundles[0].tagline}&rdquo;</p>
              <p className="text-sm text-body leading-relaxed mb-8">{bundles[0].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {bundles[0].items.map(({ label: f }) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-ink/10">
                    <span className="text-accent-ink font-bold shrink-0" aria-hidden="true">&#10003;</span>
                    <span className="text-body text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/packages/launch/${bundles[0].slug}`}
                className="btn btn-glass min-h-10 px-5 text-sm self-start mt-8"
              >
                Full details: {bundles[0].name} &rarr;
              </Link>
              <Link
                href="/contact"
                className="btn btn-primary flex text-center mt-4"
              >
                {bundles[0].cta}
              </Link>
            </div>

            {/* ---- Velocity (light / highlighted) ---- */}
            <div className="glass rounded-card ring-2 ring-accent/40 p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-body">Bundle 02</span>
                <span className="text-xs uppercase tracking-widest bg-ink text-white px-3 py-1 font-bold rounded-full">
                  Most Popular
                </span>
              </div>
              <p className="text-lg uppercase tracking-widest text-muted mb-2">{bundles[1].name}</p>
              {bundles[1].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-body block">{bundles[1].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{bundles[1].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{bundles[1].tagline}&rdquo;</p>
              <p className="text-sm text-muted leading-relaxed mb-8">{bundles[1].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {bundles[1].items.map(({ label: f }) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-ink/10">
                    <span className="text-accent-ink font-bold shrink-0" aria-hidden="true">&#10003;</span>
                    <span className="text-ink-soft text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/packages/launch/${bundles[1].slug}`}
                className="btn btn-glass min-h-10 px-5 text-sm self-start mt-8"
              >
                Full details: {bundles[1].name} &rarr;
              </Link>
              <Link
                href="/contact"
                className="btn btn-primary flex text-center mt-4"
              >
                {bundles[1].cta}
              </Link>
            </div>

            {/* ---- Ascend (dark) ---- */}
            <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Bundle 03</span>
              </div>
              <p className="text-lg uppercase tracking-widest text-muted mb-2">{bundles[2].name}</p>
              {bundles[2].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-muted block">{bundles[2].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{bundles[2].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{bundles[2].tagline}&rdquo;</p>
              <p className="text-sm text-body leading-relaxed mb-8">{bundles[2].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {bundles[2].items.map(({ label: f }) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-ink/10">
                    <span className="text-accent-ink font-bold shrink-0" aria-hidden="true">&#10003;</span>
                    <span className="text-body text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/packages/launch/${bundles[2].slug}`}
                className="btn btn-glass min-h-10 px-5 text-sm self-start mt-8"
              >
                Full details: {bundles[2].name} &rarr;
              </Link>
              <Link
                href="/contact"
                className="btn btn-primary flex text-center mt-4"
              >
                {bundles[2].cta}
              </Link>
            </div>

            {/* ---- Apex (dark + white accent top border) ---- */}
            <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col border-t-2 border-ink/20">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Bundle 04</span>
                <span className="text-xs uppercase tracking-widest border border-ink/20 text-body px-3 py-1 rounded-full">
                  Full Service
                </span>
              </div>
              <p className="text-lg uppercase tracking-widest text-muted mb-2">{bundles[3].name}</p>
              {bundles[3].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-muted block">{bundles[3].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{bundles[3].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{bundles[3].tagline}&rdquo;</p>
              <p className="text-sm text-body leading-relaxed mb-8">{bundles[3].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {bundles[3].items.map(({ label: f }) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-ink/10">
                    <span className="text-accent-ink font-bold shrink-0" aria-hidden="true">&#10003;</span>
                    <span className="text-body text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/packages/launch/${bundles[3].slug}`}
                className="btn btn-glass min-h-10 px-5 text-sm self-start mt-8"
              >
                Full details: {bundles[3].name} &rarr;
              </Link>
              <Link
                href="/contact"
                className="btn btn-primary flex text-center mt-4"
              >
                {bundles[3].cta}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =============================================
          FAQ
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">
            Questions
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-12">
            Launch bundle FAQ
          </h2>
          <div className="border-t border-ink/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-ink/10">
                <summary className="flex items-center justify-between cursor-pointer py-5 text-ink text-sm font-medium hover:text-ink-soft transition-colors list-none">
                  <span className="pr-6">{faq.q}</span>
                  <span className="text-muted text-lg flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-5 text-body text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <p className="text-muted text-sm mt-10">
            Already have a website?{" "}
            <Link
              href="/packages/maintenance"
              className="text-ink border-b border-ink/20 pb-0.5 hover:border-ink transition-colors"
            >
              Website Maintenance Plans
            </Link>{" "}
            start at $99/mo.
          </p>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-6">
              Not sure which bundle fits?
            </h2>
            <p className="text-muted text-sm mb-8 max-w-lg">
              Every Foundry Frame engagement starts with a conversation. Tell us
              where you are and where you want to go — we&apos;ll recommend the
              right bundle or build a custom scope.
            </p>
            <Link
              href="/contact"
              className="btn btn-primary"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
