/**
 * Branding & Identity Service - Foundry Frame
 * ==============================================
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import AuditCallout from "@/components/AuditCallout";
import Image from "next/image";
import Link from "next/link";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Branding & Identity Services",
  description:
    "Brand identity design from Foundry Frame — logo design, brand strategy, visual identity systems, and brand guidelines built to make your business memorable.",
  alternates: {
    canonical: "/services/branding",
  },
  openGraph: {
    title: "Branding & Identity Services",
    description:
      "Comprehensive brand identities — logo, positioning, visual system, and guidelines — built to create lasting connections with your audience.",
    url: "/services/branding",
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
    title: "Branding & Identity Services",
    description:
      "Comprehensive brand identities — logo, positioning, visual system, and guidelines — built to create lasting connections with your audience.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Capabilities
   ============================================================ */
const capabilities = [
  {
    title: "Logo Design & Brand Mark",
    description:
      "A distinctive mark designed to work everywhere — from a favicon to a storefront sign — not just a wordmark stretched across a homepage.",
  },
  {
    title: "Brand Strategy & Positioning",
    description:
      "We define what you stand for, who you're for, and why you're different before we design a single asset.",
  },
  {
    title: "Visual Identity System",
    description:
      "Typography, color, imagery style, and layout principles that stay consistent whether it's a website, a business card, or a social post.",
  },
  {
    title: "Brand Guidelines",
    description:
      "A reference document your team (or future vendors) can use to keep the brand consistent without asking us every time.",
  },
  {
    title: "Typography & Color Palette",
    description:
      "Font pairings and a color system chosen for legibility, personality, and how they'll actually render on screen and in print.",
  },
  {
    title: "Stationery & Collateral",
    description:
      "Business cards, letterhead, email signatures, and the everyday assets that carry your brand into the real world.",
  },
] as const;

/* ============================================================
   DATA: Process
   ============================================================ */
const process = [
  {
    step: "Discovery",
    description:
      "We learn your business, your competitors, and how you want to be perceived — the strategic groundwork every design decision traces back to.",
  },
  {
    step: "Positioning",
    description:
      "We define your brand's core message and differentiation before any visual work begins.",
  },
  {
    step: "Concept & Design",
    description:
      "Multiple logo directions and visual concepts, presented and refined until one clearly stands out.",
  },
  {
    step: "System Build-Out",
    description:
      "The approved concept is expanded into a full identity system — color, type, imagery, and application examples.",
  },
  {
    step: "Guidelines & Handoff",
    description:
      "You receive final files, a brand guideline document, and a walkthrough of how to use everything correctly.",
  },
] as const;

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "How long does a branding project take?",
    a: "A full brand identity typically takes 4–8 weeks depending on scope. Logo-only projects move faster; full identity systems with guidelines take longer to get right.",
  },
  {
    q: "How many logo concepts will I see?",
    a: "You'll typically review 2–3 distinct directions before we narrow in and refine the one that fits best — not a wall of forty options that all look the same.",
  },
  {
    q: "Do I need branding if I already have a logo?",
    a: "Often, yes — a logo alone isn't a brand. If your visual identity feels inconsistent across your website, social media, and print materials, a brand system fixes that without necessarily starting from zero.",
  },
  {
    q: "Can branding be bundled with a new website?",
    a: "Yes — our Launch Bundles combine a brand identity with a custom website in a single engagement, which is often faster and more cohesive than doing them separately.",
  },
] as const;

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Branding & Identity",
  serviceType: "Branding & Identity",
  category: "Branding",
  description:
    "Comprehensive brand identity design — logo, strategy, visual system, and guidelines.",
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: [
    { "@type": "City", name: "Lorain" },
    { "@type": "State", name: "Ohio" },
    { "@type": "Country", name: "United States" },
  ],
  url: `${siteUrl}/services/branding`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Branding & Identity Deliverables",
    itemListElement: capabilities.map((cap) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: cap.title,
        description: cap.description,
      },
    })),
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Branding & Identity",
      item: `${siteUrl}/services/branding`,
    },
  ],
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

/* ============================================================
   COMPONENT: Branding & Identity Page
   ============================================================ */
export default function BrandingServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
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
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/stock/service-branding.jpg"
            alt="Branding and identity design"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-canvas/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/services"
            className="btn btn-glass min-h-10 px-4 text-sm mr-2 mb-6"
          >
            &larr; All Services
          </Link>
          <p className="eyebrow mb-6">
            Branding & Identity
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight max-w-4xl">
            Define who you are
          </h1>
          <p className="text-ink-soft text-lg mt-6 max-w-2xl leading-relaxed">
            Your brand is more than a logo — it&apos;s the feeling people get
            when they interact with your business. We build identities that
            communicate your values and create lasting connections.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
              className="btn btn-primary text-center"
            >
              Book a Free Call
            </Link>
            <Link
              href="/packages/launch"
              className="btn btn-glass text-center"
            >
              Bundle With a Website
            </Link>
          </div>
        </div>
      </section>

      {/* =============================================
          CAPABILITIES
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">
            What&apos;s Included
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-16">
            Building a brand that sticks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => (
              <div key={cap.title} className="glass rounded-card p-8">
                <p className="text-xs font-mono text-muted mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-ink font-heading font-bold text-lg mb-3">
                  {cap.title}
                </h3>
                <p className="text-body text-sm leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          PROCESS
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">
            How We Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-16">
            Our branding process
          </h2>
          <div className="border-t border-ink/10">
            {process.map((item, i) => (
              <div
                key={item.step}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-ink/10"
              >
                <div className="md:col-span-1 text-body text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-3 text-ink font-heading font-semibold text-lg">
                  {item.step}
                </h3>
                <p className="md:col-span-8 text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
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
            Branding FAQ
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
                <div className="pb-5 text-muted text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          RELATED SERVICES
          ============================================= */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-6">
            Pairs Well With
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/services/web-design"
              className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
            >
              Web Design & Development &rarr;
            </Link>
            <Link
              href="/services/graphic-design"
              className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
            >
              Graphic Design &rarr;
            </Link>
            <Link
              href="/services/strategy"
              className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
            >
              Digital Strategy &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6">
              Next Step
            </p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-4">
              Ready for a brand that commands attention?
            </h2>
            <p className="text-body text-sm leading-relaxed mb-10 max-w-lg">
              Tell us about your business. We&apos;ll walk you through exactly
              how we&apos;d approach your brand — and what it would cost. No
              obligation, no hard sell.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
                className="btn btn-primary"
              >
                Book a Free Call
              </Link>
              <Link
                href="/contact"
                className="btn btn-glass"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      <AuditCallout />
    </>
  );
}
