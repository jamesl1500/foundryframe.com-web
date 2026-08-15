/**
 * Digital Strategy Service - Foundry Frame
 * ===========================================
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Digital Strategy Services",
  description:
    "Digital strategy from Foundry Frame — market research, digital marketing strategy, competitive audits, content strategy, and conversion optimization to maximize ROI.",
  alternates: {
    canonical: "/services/strategy",
  },
  openGraph: {
    title: "Digital Strategy Services",
    description:
      "Data-driven marketing strategies that amplify your brand and maximize ROI.",
    url: "/services/strategy",
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
    title: "Digital Strategy Services",
    description:
      "Data-driven marketing strategies that amplify your brand and maximize ROI.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Capabilities
   ============================================================ */
const capabilities = [
  {
    title: "Market Research & Analysis",
    description:
      "Understanding your customers, your competitors, and where the real opportunity in your market actually is.",
  },
  {
    title: "Digital Marketing Strategy",
    description:
      "A roadmap that ties every channel — website, social, ads, email — back to a single set of business goals.",
  },
  {
    title: "Competitive Audit",
    description:
      "A clear-eyed look at what your competitors are doing well, doing poorly, and leaving on the table.",
  },
  {
    title: "Content Strategy",
    description:
      "A plan for what to publish, where, and why — so content creation supports growth instead of filling a calendar.",
  },
  {
    title: "Conversion Optimization",
    description:
      "Identifying where visitors drop off and fixing the friction points that are quietly costing you leads.",
  },
  {
    title: "Quarterly Reviews",
    description:
      "Regular check-ins to review performance against goals and adjust the plan as your business evolves.",
  },
] as const;

/* ============================================================
   DATA: Process
   ============================================================ */
const process = [
  {
    step: "Research",
    description:
      "We study your market, your customers, and your competitors to find where the real leverage is.",
  },
  {
    step: "Goal-Setting",
    description:
      "We define what success actually looks like in measurable terms — not vague ambitions.",
  },
  {
    step: "Roadmap",
    description:
      "A prioritized plan connects every channel and tactic back to your specific goals.",
  },
  {
    step: "Execution Support",
    description:
      "We help implement the plan directly or coordinate with your existing team and vendors.",
  },
  {
    step: "Review & Adjust",
    description:
      "Quarterly reviews keep the strategy honest against real performance data.",
  },
] as const;

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "Do I need strategy work if I already have a website and social media?",
    a: "Often, yes — having the channels isn't the same as having a plan that ties them together toward a goal. Strategy work makes sure your existing assets are actually working toward the same outcome.",
  },
  {
    q: "Is digital strategy a one-time project or ongoing?",
    a: "It can be either. Some clients want a one-time roadmap; others prefer ongoing quarterly strategy reviews as their business and market shift.",
  },
  {
    q: "Can you execute the strategy, not just write it?",
    a: "Yes — strategy work typically leads directly into our web design, branding, social media, or advertising services, so the plan doesn't just sit in a document.",
  },
  {
    q: "How is this different from a marketing package?",
    a: "Strategy is the thinking layer — research, positioning, and roadmap. Our Marketing Packages are the ongoing execution layer that carries the strategy out month to month.",
  },
] as const;

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Digital Strategy",
  serviceType: "Digital Strategy",
  category: "Strategy",
  description:
    "Data-driven digital marketing strategy — research, positioning, roadmap, and conversion optimization.",
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
  url: `${siteUrl}/services/strategy`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digital Strategy Deliverables",
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
      name: "Digital Strategy",
      item: `${siteUrl}/services/strategy`,
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
   COMPONENT: Digital Strategy Page
   ============================================================ */
export default function StrategyServicePage() {
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
            src="/images/stock/service-strategy.jpg"
            alt="Digital strategy"
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
            Digital Strategy
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Think bigger
          </h1>
          <p className="text-gray-300 text-lg mt-6 max-w-2xl leading-relaxed">
            Data-driven marketing strategies that amplify your brand and
            maximize ROI. We help you understand your market, define your
            goals, and chart the path forward.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
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
            A plan that ties everything together
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
            Our strategy process
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
            Digital strategy FAQ
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
              href="/services/web-design"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Web Design & Development &rarr;
            </Link>
            <Link
              href="/services/advertising"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Advertising &rarr;
            </Link>
            <Link
              href="/services/social-media"
              className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Social Media &rarr;
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
              Ready to build a plan that drives real growth?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg">
              Tell us about your goals. We&apos;ll walk you through exactly
              how we&apos;d approach your strategy — and what it would cost.
              No obligation, no hard sell.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
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
