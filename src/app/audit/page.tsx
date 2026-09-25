/**
 * Free Website Audit - Foundry Frame
 * =====================================
 * Lead-gen flow: visitors submit a URL, unlock a live audit powered by
 * our Python audit platform (AWS), and get tailored service recommendations.
 *
 * SEO: keyword-targeted metadata, Service + FAQPage + BreadcrumbList
 * structured data, and enough on-page content (what we check, what you get,
 * FAQ) for the page to rank for "free website audit" style searches.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import AuditForm from "@/components/AuditForm";

const siteUrl = "https://www.foundryframe.com";
const pageTitle = "Free Website Audit — SEO, Speed & Design Check";
const pageDescription =
  "Get a free website audit in about a minute. Score your site's SEO, speed, mobile design, and accessibility, with a prioritized fix list. No credit card needed.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "free website audit",
    "website audit tool",
    "free SEO audit",
    "website speed test",
    "website review",
    "Ohio web design audit",
  ],
  alternates: {
    canonical: "/audit",
  },
  openGraph: {
    title: `${pageTitle} | Foundry Frame`,
    description:
      "Score your website's SEO, speed, design, and accessibility in about a minute — free, with a prioritized fix list.",
    url: "/audit",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame free website audit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Foundry Frame`,
    description:
      "Score your website's SEO, speed, design, and accessibility in about a minute — free, with a prioritized fix list.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: What we check
   ============================================================ */
const checks = [
  {
    title: "SEO fundamentals",
    description:
      "Titles, meta descriptions, headings, structured data, and crawlability — the basics that decide whether Google can find and understand your pages.",
  },
  {
    title: "Speed & performance",
    description:
      "Google Lighthouse metrics like load time and Core Web Vitals, plus the specific opportunities that would make your site faster.",
  },
  {
    title: "Design & user experience",
    description:
      "Layout, navigation, and clarity of your calls to action — whether visitors can quickly see what you do and how to contact you.",
  },
  {
    title: "Mobile friendliness",
    description:
      "How your site behaves on phones, where most of your visitors are arriving from.",
  },
  {
    title: "Accessibility",
    description:
      "Common barriers for keyboard and screen-reader users, which also protect you from compliance headaches.",
  },
  {
    title: "Best practices & security",
    description:
      "Browser-level best practices that affect trust, safety, and how your site is treated by search engines.",
  },
] as const;

/* ============================================================
   DATA: How It Works
   ============================================================ */
const steps = [
  {
    number: "01",
    title: "Enter Your URL",
    description: "Tell us the website you want scanned. That's it to get started.",
  },
  {
    number: "02",
    title: "We Scan Your Site",
    description:
      "Our audit engine crawls your site and analyzes SEO, performance, design, and accessibility in real time.",
  },
  {
    number: "03",
    title: "Get Your Results",
    description:
      "See your score, the exact issues we found, and what to fix first — no fluff.",
  },
  {
    number: "04",
    title: "We Recommend A Fix",
    description:
      "Based on your results, we point you to the specific services or packages that solve your biggest problems.",
  },
] as const;

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "Is the website audit really free?",
    a: "Yes. The audit is completely free — no credit card, no trial, and no obligation to hire us. You get your score and a prioritized list of what to fix.",
  },
  {
    q: "How long does the audit take?",
    a: "Most audits finish in about a minute. When the scan is done you're taken straight to your results page, and we email you a link so you can come back to it any time.",
  },
  {
    q: "What does the audit check?",
    a: "We analyze your site's SEO fundamentals, speed and performance (using Google Lighthouse), design and user experience, mobile friendliness, accessibility, and best practices — then summarize what matters most in plain English.",
  },
  {
    q: "Why do you need my email address?",
    a: "We email you a permanent link to your report so you can share it with your team or developer. We never spam you, and you can reply to that email to talk with James directly.",
  },
  {
    q: "Will I be pressured to buy something?",
    a: "No. The audit is genuinely useful on its own — you can take the fix list to any developer. If you'd like help, we'll point you to the services that address your biggest issues, and a free strategy call is always optional.",
  },
  {
    q: "Can you audit any website?",
    a: "You can scan any publicly accessible website. Sites that are behind a login or block automated visitors may not scan completely.",
  },
] as const;

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteUrl}/audit#service`,
  name: "Free Website Audit",
  serviceType: "Website audit",
  description: pageDescription,
  url: `${siteUrl}/audit`,
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: [
    { "@type": "State", name: "Ohio" },
    { "@type": "AdministrativeArea", name: "United States" },
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    url: `${siteUrl}/audit`,
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Free Website Audit", item: `${siteUrl}/audit` },
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
   COMPONENT
   ============================================================ */
export default function AuditPage() {
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
          HERO + FORM
          ============================================= */}
      <section className="glow-field pt-32 pb-16 lg:pt-40 lg:pb-20 bg-black border-b border-white/10">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">
            Free Website Audit
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6">
            Free website audit: what&apos;s holding your site back?
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Drop your URL in below. In about a minute, you&apos;ll see your site&apos;s
            SEO, speed, design, and accessibility score — plus a prioritized list
            of what to fix first. Free, no credit card, no obligation.
          </p>

          <div className="glass max-w-2xl mx-auto text-left p-5 sm:p-6">
            <AuditForm />
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-gray-500">
            <li>100% free</li>
            <li>Results in ~1 minute</li>
            <li>No pushy sales calls</li>
          </ul>
        </div>
      </section>

      {/* =============================================
          WHAT WE CHECK
          ============================================= */}
      <section className="py-20 lg:py-28 bg-black border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 text-center">
            What&apos;s Inside
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white text-center mb-12">
            What our website audit checks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checks.map((check) => (
              <div key={check.title} className="glass-card p-6">
                <h3 className="text-white font-heading font-bold text-lg mb-2">
                  {check.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {check.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          HOW IT WORKS
          ============================================= */}
      <section className="py-20 lg:py-28 bg-black border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-10 text-center">
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {steps.map((step) => (
              <div key={step.number} className="bg-black p-6">
                <p className="text-3xl font-heading font-bold text-accent mb-3">
                  {step.number}
                </p>
                <h3 className="text-white font-heading font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          FAQ
          ============================================= */}
      <section className="py-20 lg:py-28 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            Questions
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-10">
            Website audit FAQ
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
          NEXT STEP
          ============================================= */}
      <section className="py-20 lg:py-28 bg-black">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
            Want a human to walk you through the results?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Run your audit first, then book a free call and we&apos;ll go over the
            findings together — no pitch, no pressure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
              className="px-8 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors"
            >
              Book a Free Call
            </Link>
            <Link
              href="/services/web-design"
              className="glass-light px-8 py-4 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/15 transition-colors"
            >
              Explore Web Design
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
