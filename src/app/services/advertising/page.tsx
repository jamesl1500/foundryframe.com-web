/**
 * Advertising Service - Foundry Frame
 * ======================================
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Advertising Services",
  description:
    "Advertising services from Foundry Frame — campaign strategy, ad creative, PPC and search ads, display advertising, and social advertising built on data-driven targeting.",
  alternates: {
    canonical: "/services/advertising",
  },
  openGraph: {
    title: "Advertising Services",
    description:
      "Strategic advertising that puts your brand in front of the right audience, combining creative excellence with data-driven targeting.",
    url: "/services/advertising",
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
    title: "Advertising Services",
    description:
      "Strategic advertising that puts your brand in front of the right audience, combining creative excellence with data-driven targeting.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Capabilities
   ============================================================ */
const capabilities = [
  {
    title: "Campaign Strategy",
    description:
      "We define the audience, the offer, and the channels before a single dollar of ad spend goes out the door.",
  },
  {
    title: "Ad Creative & Copywriting",
    description:
      "Scroll-stopping creative and copy written to convert, tailored to each platform's format and audience expectations.",
  },
  {
    title: "PPC & Search Ads",
    description:
      "Google Ads campaigns targeting the searches your customers are already making.",
  },
  {
    title: "Display & Programmatic",
    description:
      "Visual ad placements across the web, targeted to reach the right audience at the right moment.",
  },
  {
    title: "Social Advertising",
    description:
      "Paid campaigns on Meta, Instagram, and LinkedIn built around clear conversion goals, not just impressions.",
  },
  {
    title: "Performance Analytics",
    description:
      "Transparent reporting tied to cost-per-lead and ROI, not vanity metrics that don't move your business forward.",
  },
] as const;

/* ============================================================
   DATA: Process
   ============================================================ */
const process = [
  {
    step: "Audience & Offer",
    description:
      "We define who we're targeting and what we're asking them to do — the two things every good campaign gets right.",
  },
  {
    step: "Creative Development",
    description:
      "Ad creative and copy are built and tested across formats before scaling spend.",
  },
  {
    step: "Launch",
    description:
      "Campaigns go live with tracking in place from day one, so every dollar is measurable.",
  },
  {
    step: "Optimization",
    description:
      "We monitor performance and adjust targeting, creative, and budget allocation based on real data.",
  },
  {
    step: "Reporting",
    description:
      "Regular reporting shows exactly what your ad spend is producing, in plain language.",
  },
] as const;

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "Is ad spend included in your fees?",
    a: "No — our fee covers strategy, creative, and management. Ad spend is billed separately and paid directly to the ad platform, so you always know exactly where your budget is going.",
  },
  {
    q: "What's a reasonable ad budget to start with?",
    a: "It depends on your goals and industry, but we'll recommend a realistic starting budget during your discovery call rather than a one-size-fits-all number.",
  },
  {
    q: "Which platforms do you advertise on?",
    a: "Most commonly Google Search, Meta (Facebook/Instagram), and LinkedIn — we'll recommend the platforms where your specific audience is most reachable.",
  },
  {
    q: "How soon will I see results?",
    a: "Search and social ads can start driving traffic within days, but meaningful optimization typically takes 4–8 weeks of data before a campaign hits its stride.",
  },
] as const;

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Advertising",
  serviceType: "Advertising",
  category: "Advertising",
  description:
    "Strategic advertising — campaign strategy, ad creative, PPC, display, and social advertising.",
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
  url: `${siteUrl}/services/advertising`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Advertising Deliverables",
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
      name: "Advertising",
      item: `${siteUrl}/services/advertising`,
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
   COMPONENT: Advertising Page
   ============================================================ */
export default function AdvertisingServicePage() {
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
            src="/images/stock/service-advertising.jpg"
            alt="Advertising campaigns"
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
            Advertising
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Reach the right people
          </h1>
          <p className="text-gray-300 text-lg mt-6 max-w-2xl leading-relaxed">
            Strategic advertising that puts your brand in front of the right
            audience. We combine creative excellence with data-driven
            targeting.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="https://calendly.com/jlatten-foundryframe/30min"
              className="px-6 py-3 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors text-center"
            >
              Book a Free Call
            </Link>
            <Link
              href="/packages/marketing"
              className="px-6 py-3 border border-white/30 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors text-center"
            >
              See Marketing Packages
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
            Ads built around real targeting
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
            Our advertising process
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
            Advertising FAQ
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
              href="/services/social-media"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Social Media &rarr;
            </Link>
            <Link
              href="/services/strategy"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Digital Strategy &rarr;
            </Link>
            <Link
              href="/services/graphic-design"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Graphic Design &rarr;
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
              Ready to put your brand in front of the right people?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg">
              Tell us about your goals. We&apos;ll walk you through exactly
              how we&apos;d approach your advertising — and what it would
              cost. No obligation, no hard sell.
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
