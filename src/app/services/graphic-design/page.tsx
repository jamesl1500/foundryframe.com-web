/**
 * Graphic Design Service - Foundry Frame
 * =========================================
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Graphic Design Services",
  description:
    "Graphic design from Foundry Frame — marketing collateral, packaging, print design, presentations, signage, and digital assets that strengthen your brand everywhere it shows up.",
  alternates: {
    canonical: "/services/graphic-design",
  },
  openGraph: {
    title: "Graphic Design Services",
    description:
      "Compelling visual assets that strengthen your brand across every touchpoint — print, digital, and environmental.",
    url: "/services/graphic-design",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame | Creative Design Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Graphic Design Services",
    description:
      "Compelling visual assets that strengthen your brand across every touchpoint — print, digital, and environmental.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Capabilities
   ============================================================ */
const capabilities = [
  {
    title: "Marketing Collateral",
    description:
      "Brochures, flyers, and sales materials designed to support your team in the field or at the counter.",
  },
  {
    title: "Packaging Design",
    description:
      "Product packaging that stands out on a shelf and reinforces the brand experience in someone's hands.",
  },
  {
    title: "Print Design",
    description:
      "Everything from postcards to large-format prints, designed and prepped correctly for the printer the first time.",
  },
  {
    title: "Presentation Design",
    description:
      "Pitch decks and internal presentations that look like they came from a design team, not a template gallery.",
  },
  {
    title: "Signage & Environmental",
    description:
      "Storefront, trade show, and interior signage that extends your brand into physical spaces.",
  },
  {
    title: "Digital Assets",
    description:
      "Social graphics, email headers, banner ads, and the everyday visuals your marketing runs on.",
  },
] as const;

/* ============================================================
   DATA: Process
   ============================================================ */
const process = [
  {
    step: "Brief",
    description:
      "We clarify what the piece needs to accomplish, where it will appear, and any brand constraints to work within.",
  },
  {
    step: "Concept",
    description:
      "Initial design directions are presented for feedback before we commit to full production.",
  },
  {
    step: "Design",
    description:
      "The approved direction is refined into final, print- or web-ready artwork.",
  },
  {
    step: "Review",
    description:
      "Structured revision rounds ensure the final piece is exactly right before it ships.",
  },
  {
    step: "Delivery",
    description:
      "Final files are delivered in every format you need — print-ready, web-optimized, and editable source files.",
  },
] as const;

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "Do you handle print production too?",
    a: "We design print-ready files to your printer's specifications. We can also recommend and coordinate with local print vendors if you need one.",
  },
  {
    q: "Can you work within our existing brand guidelines?",
    a: "Yes — if you already have an established identity, we design within it. If it needs refreshing first, we can fold that into the project.",
  },
  {
    q: "What file formats will I receive?",
    a: "You'll get production-ready files (typically PDF/print-ready formats) plus editable source files, so future updates don't require starting from scratch.",
  },
  {
    q: "Can graphic design be a one-off project?",
    a: "Yes — many clients come to us for a single piece, like a trade show banner or a pitch deck, without a larger ongoing engagement.",
  },
] as const;

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Graphic Design",
  serviceType: "Graphic Design",
  category: "Graphic Design",
  description:
    "Print, digital, and environmental graphic design — collateral, packaging, presentations, and signage.",
  provider: {
    "@type": ["Organization", "LocalBusiness"],
    name: "Foundry Frame",
    url: siteUrl,
    telephone: "+1-216-889-7822",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lorain",
      addressRegion: "OH",
      postalCode: "44053",
      addressCountry: "US",
    },
  },
  areaServed: [
    { "@type": "City", name: "Lorain" },
    { "@type": "State", name: "Ohio" },
    { "@type": "AdministrativeArea", name: "United States" },
  ],
  url: `${siteUrl}/services/graphic-design`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Graphic Design Deliverables",
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
      name: "Graphic Design",
      item: `${siteUrl}/services/graphic-design`,
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
   COMPONENT: Graphic Design Page
   ============================================================ */
export default function GraphicDesignServicePage() {
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
            src="/images/stock/service-graphic-design.jpg"
            alt="Graphic design"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/services"
            className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors mb-6 inline-block"
          >
            &larr; All Services
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">
            Graphic Design
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Visual impact
          </h1>
          <p className="text-gray-300 text-lg mt-6 max-w-2xl leading-relaxed">
            Compelling visual assets that strengthen your brand across every
            touchpoint. Print, digital, environmental — we design it all.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="https://calendly.com/jlatten-foundryframe/30min"
              className="px-6 py-3 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors text-center"
            >
              Book a Free Call
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-white/30 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors text-center"
            >
              Get a Custom Quote
            </Link>
          </div>
        </div>
      </section>

      {/* =============================================
          CAPABILITIES
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
            What&apos;s Included
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-16">
            Visuals that stop the scroll
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {capabilities.map((cap, i) => (
              <div key={cap.title} className="bg-black p-8">
                <p className="text-xs font-mono text-gray-600 mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-white font-heading font-bold text-lg mb-3">
                  {cap.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
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
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
            How We Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-black mb-16">
            Our graphic design process
          </h2>
          <div className="border-t border-black/10">
            {process.map((item, i) => (
              <div
                key={item.step}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-black/10"
              >
                <div className="md:col-span-1 text-gray-400 text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-3 text-black font-heading font-semibold text-lg">
                  {item.step}
                </h3>
                <p className="md:col-span-8 text-gray-500 text-sm leading-relaxed">
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
      <section className="py-24 lg:py-32 bg-gray-900 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
            Questions
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-12">
            Graphic design FAQ
          </h2>
          <div className="border-t border-white/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-white/10">
                <summary className="flex items-center justify-between cursor-pointer py-5 text-white text-sm font-medium hover:text-gray-300 transition-colors list-none">
                  <span className="pr-6">{faq.q}</span>
                  <span className="text-gray-500 text-lg flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-5 text-gray-500 text-sm leading-relaxed">
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
      <section className="py-16 bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            Pairs Well With
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/services/branding"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Branding & Identity &rarr;
            </Link>
            <Link
              href="/services/advertising"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Advertising &rarr;
            </Link>
            <Link
              href="/services/web-design"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Web Design & Development &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
              Next Step
            </p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[0.95] mb-4">
              Need visuals that stop the scroll?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg">
              Tell us about your goals. We&apos;ll walk you through exactly
              how we&apos;d approach it — and what it would cost. No
              obligation, no hard sell.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://calendly.com/jlatten-foundryframe/30min"
                className="px-8 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors"
              >
                Book a Free Call
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
