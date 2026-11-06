/**
 * Social Media Service - Foundry Frame
 * =======================================
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
  title: "Social Media Management Services",
  description:
    "Social media management from Foundry Frame: content strategy and creation, community management, and paid social campaigns that grow reach and engagement.",
  alternates: {
    canonical: "/services/social-media",
  },
  openGraph: {
    title: "Social Media Management Services",
    description:
      "Strategic social media management that builds community, grows reach, and turns followers into customers.",
    url: "/services/social-media",
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
    title: "Social Media Management Services",
    description:
      "Strategic social media management that builds community, grows reach, and turns followers into customers.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Capabilities
   ============================================================ */
const capabilities = [
  {
    title: "Content Strategy",
    description:
      "A content plan built around your goals and your audience — not just a random grid of posts hoping something lands.",
  },
  {
    title: "Content Creation",
    description:
      "Platform-native graphics and copy designed to stop the scroll, written in your brand's voice.",
  },
  {
    title: "Community Management",
    description:
      "Comments, DMs, and mentions handled promptly so your audience feels heard, not ignored.",
  },
  {
    title: "Paid Social Campaigns",
    description:
      "Targeted ad campaigns on the platforms where your customers actually spend time, built to drive measurable results.",
  },
  {
    title: "Analytics & Reporting",
    description:
      "Clear monthly reporting on what's working — not vanity metrics, but the numbers tied to real business outcomes.",
  },
  {
    title: "Influencer Partnerships",
    description:
      "Identifying and coordinating the right creator partnerships to extend your reach authentically.",
  },
] as const;

/* ============================================================
   DATA: Process
   ============================================================ */
const process = [
  {
    step: "Audit",
    description:
      "We review your existing channels, competitors, and audience to see what's working and what's not.",
  },
  {
    step: "Strategy",
    description:
      "We build a content calendar and platform plan aligned to your business goals.",
  },
  {
    step: "Content Production",
    description:
      "Graphics and copy are created and scheduled in batches, so your channels stay consistent.",
  },
  {
    step: "Engagement",
    description:
      "We manage the two-way conversation — comments, messages, and community interaction.",
  },
  {
    step: "Reporting & Iteration",
    description:
      "Monthly reporting shows what moved the needle, and we adjust the plan accordingly.",
  },
] as const;

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "Which platforms do you manage?",
    a: "Most commonly Instagram, Facebook, LinkedIn, and TikTok — we'll recommend which platforms are worth your time based on where your actual customers spend theirs, rather than managing every platform for its own sake.",
  },
  {
    q: "How many posts per month is typical?",
    a: "It depends on the plan — our Website Packages add-on covers platform-native content on a schedule that fits your goals; ask about volume during your discovery call.",
  },
  {
    q: "Do you handle paid social ads too?",
    a: "Yes. We can run paid social campaigns alongside organic content, or as a standalone engagement through our Advertising service.",
  },
  {
    q: "Will I need to approve content before it goes live?",
    a: "Yes — we send content for review on an agreed schedule so nothing goes out under your name without your sign-off.",
  },
] as const;

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Social Media Management",
  serviceType: "Social Media Management",
  category: "Social Media",
  description:
    "Strategic social media management — content strategy, creation, community management, and paid social.",
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: [
    { "@type": "City", name: "Lorain" },
    { "@type": "State", name: "Ohio" },
    { "@type": "Country", name: "United States" },
  ],
  url: `${siteUrl}/services/social-media`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Social Media Deliverables",
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
      name: "Social Media",
      item: `${siteUrl}/services/social-media`,
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
   COMPONENT: Social Media Page
   ============================================================ */
export default function SocialMediaServicePage() {
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
            src="/images/stock/service-social-media.jpg"
            alt="Social media management"
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
            Social Media
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight max-w-4xl">
            Build your community
          </h1>
          <p className="text-ink-soft text-lg mt-6 max-w-2xl leading-relaxed">
            Strategic social media management that builds community and
            drives reach. We handle the content, strategy, and engagement so
            you can focus on your business.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
              className="btn btn-primary text-center"
            >
              Book a Free Call
            </Link>
            <Link
              href="/packages/marketing"
              className="btn btn-glass text-center"
            >
              See Marketing Packages
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
            Growing an audience that actually buys
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
            Our social media process
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
            Social media FAQ
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
              href="/services/advertising"
              className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
            >
              Advertising &rarr;
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
              Ready to build an audience that actually buys?
            </h2>
            <p className="text-body text-sm leading-relaxed mb-10 max-w-lg">
              Tell us about your goals. We&apos;ll walk you through exactly
              how we&apos;d approach your social presence — and what it would
              cost. No obligation, no hard sell.
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
