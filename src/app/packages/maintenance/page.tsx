/**
 * Maintenance Plans - Foundry Frame
 * ===============================
 * Three managed maintenance tiers: Steady, Active, Elite.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { parsePriceSpecification } from "@/lib/schema-price";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Website Maintenance Plans from $99/mo",
  description:
    "Website maintenance from $99/mo: WordPress plugin, theme & core updates, Next.js updates, security, backups, and uptime monitoring for Ohio businesses.",
  alternates: {
    canonical: "/packages/maintenance",
  },
  openGraph: {
    title: "Website Maintenance Plans from $99/mo",
    description:
      "Updates, security, backups, and content changes handled every month. Steady, Active, and Elite plans from $99/mo.",
    url: "/packages/maintenance",
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
    title: "Website Maintenance Plans from $99/mo",
    description:
      "Updates, security, backups, and content changes handled every month. Steady, Active, and Elite plans from $99/mo.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Maintenance Plans
   ============================================================ */
const plans = [
  {
    number: "01",
    name: "Steady",
    pricePrefix: "From",
    price: "$99/mo",
    tagline: "Stay protected without lifting a finger.",
    description:
      "Steady is the essential layer of protection every business website needs. We handle software updates, monitor for security threats, and watch your uptime around the clock — so your site stays live and secure while you stay focused on what you do best. Think of Steady as the lock on your digital front door.",
    features: [
      "Monthly WordPress core, plugin & theme updates, or Next.js & dependency updates",
      "Basic security monitoring and firewall protection",
      "24/7 uptime monitoring with instant alerts",
      "Monthly offsite backup",
      "Quarterly performance report",
      "Email support with 48-hour response guarantee",
    ],
    cta: "Start Steady",
    badge: null,
    variant: "dark" as const,
  },
  {
    number: "02",
    name: "Active",
    pricePrefix: "From",
    price: "$249/mo",
    tagline: "Your site, always improving. Never stagnant.",
    description:
      "Active clients don't just keep their site alive — they keep it growing. With bi-weekly updates, included developer time, and content change requests built right into the plan, Active is for businesses that treat their website as a living, working sales tool. New team member to add? Service description to update? Just send the changes.",
    features: [
      "Bi-weekly WordPress core, plugin & theme updates, or Next.js & dependency updates",
      "Advanced security monitoring and malware scanning",
      "Weekly offsite backups",
      "1 included developer hour per month",
      "Up to 2 content updates per month",
      "Monthly performance report with actionable recommendations",
      "Email and chat support with 24-hour response",
    ],
    cta: "Start Active",
    badge: "Most Popular",
    variant: "light" as const,
  },
  {
    number: "03",
    name: "Elite",
    pricePrefix: "From",
    price: "$499/mo",
    tagline: "Mission-critical support for businesses that can't afford downtime.",
    description:
      "Elite is white-glove digital site management for businesses where every minute of downtime is lost revenue. Daily backups, weekly updates, emergency recovery coverage, and priority phone support — plus 3 included development hours per month. Elite clients don't have a maintenance plan. They have a retained digital team.",
    features: [
      "Weekly WordPress or Next.js updates and security patches",
      "Enterprise-grade security monitoring and intrusion detection",
      "Daily offsite backups with one-click restore",
      "3 included developer hours per month",
      "Up to 6 content updates per month",
      "Monthly + weekly performance reports",
      "Emergency site recovery — included at no additional charge",
      "Priority phone and email support — 4-hour response SLA",
    ],
    cta: "Start Elite",
    badge: "White Glove",
    variant: "dark-accent" as const,
  },
];

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const offersStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Maintenance Plans",
  serviceType: "Website maintenance",
  description:
    "Managed website maintenance for WordPress and Next.js sites: plugin, theme and framework updates, security monitoring, backups, uptime monitoring, and content updates.",
  url: `${siteUrl}/packages/maintenance`,
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: [
    { "@type": "State", name: "Ohio" },
    { "@type": "Country", name: "United States" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Maintenance Plans",
    itemListElement: plans.map((plan) => ({
      "@type": "Offer",
      name: `${plan.name} Maintenance`,
      description: plan.tagline,
      url: `${siteUrl}/packages/maintenance`,
      priceSpecification: parsePriceSpecification(
        plan.pricePrefix ? `${plan.pricePrefix} ${plan.price}` : plan.price
      ),
    })),
  },
};

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "What does a website maintenance plan include?",
    a: "Every plan covers platform updates (WordPress core, plugin and theme updates on WordPress sites; Next.js and dependency updates on Next.js sites), security monitoring, 24/7 uptime monitoring, offsite backups, and performance reporting. Active adds bi-weekly updates, weekly backups, a developer hour, and up to 2 content updates a month. Elite adds weekly updates, daily backups, 3 developer hours, up to 6 content updates, emergency recovery, and priority phone support.",
  },
  {
    q: "Do you maintain WordPress sites?",
    a: "Yes. On WordPress sites we update WordPress core, plugins, and themes, test that nothing breaks, and roll back if an update causes a problem. On Next.js sites we keep Next.js, React, and the site's other dependencies current. Every plan covers both, including sites we didn't build.",
  },
  {
    q: "How much does website maintenance cost?",
    a: "Steady starts at $99/mo, Active at $249/mo, and Elite at $499/mo. Every price is a starting point; we confirm the exact number on a free, no-obligation call.",
  },
  {
    q: "Which maintenance plan is right for my business?",
    a: "Steady fits a site that rarely changes and just needs to stay secure and online. Active fits a business that updates its site regularly, such as new services, staff, or offers. Elite fits a business where downtime means lost revenue and you want a retained team on call.",
  },
  {
    q: "Do Launch Bundles include maintenance?",
    a: "Yes. Ignite includes 1 month of Steady Maintenance, Velocity includes 3 months of Active, Ascend includes 6 months of Active, and Apex includes 12 months of Elite. After that, you can continue on any plan.",
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
    { "@type": "ListItem", position: 3, name: "Maintenance Plans", item: `${siteUrl}/packages/maintenance` },
  ],
};

/* ============================================================
   COMPONENT: Maintenance Plans Page
   ============================================================ */
export default function MaintenancePlansPage() {
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
            Maintenance Plans &middot; From $99/mo
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight max-w-4xl">
            Website maintenance, handled
          </h1>
          <p className="text-muted text-sm mt-6 max-w-lg">
            Launch is day one, not the finish line. A site that goes unmaintained gets hacked, slows down, breaks on
            updates, and falls in search rankings. Whether you run WordPress or Next.js, we handle the plugin, theme,
            and framework updates for you. Our plans keep your digital
            presence fast, secure, and continuously improving — without you ever
            having to think about it.
          </p>
        </div>
      </section>

      {/* =============================================
          PLAN OVERVIEW STRIP
          ============================================= */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 gap-3">
            {plans.map((p) => (
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
          PLAN CARDS — 3 columns
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* ---- Steady (dark) ---- */}
            <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Plan 01</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">{plans[0].name}</p>
              {plans[0].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-muted block">{plans[0].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{plans[0].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{plans[0].tagline}&rdquo;</p>
              <p className="text-sm text-body leading-relaxed mb-8">{plans[0].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {plans[0].features.map((f) => (
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
                {plans[0].cta}
              </Link>
            </div>

            {/* ---- Active (light / highlighted) ---- */}
            <div className="glass rounded-card ring-2 ring-accent/40 p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-body">Plan 02</span>
                <span className="text-xs uppercase tracking-widest bg-ink text-white px-3 py-1 font-bold rounded-full">
                  Most Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">{plans[1].name}</p>
              {plans[1].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-body block">{plans[1].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{plans[1].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{plans[1].tagline}&rdquo;</p>
              <p className="text-sm text-muted leading-relaxed mb-8">{plans[1].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {plans[1].features.map((f) => (
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
                {plans[1].cta}
              </Link>
            </div>

            {/* ---- Elite (dark + white accent top border) ---- */}
            <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col border-t-2 border-ink/20">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Plan 03</span>
                <span className="text-xs uppercase tracking-widest border border-ink/20 text-body px-3 py-1 rounded-full">
                  White Glove
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">{plans[2].name}</p>
              {plans[2].pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-muted block">{plans[2].pricePrefix}</span>
              )}
              <div className="text-4xl font-heading font-bold text-ink mb-2">{plans[2].price}</div>
              <p className="text-xs italic text-muted mb-4">&ldquo;{plans[2].tagline}&rdquo;</p>
              <p className="text-sm text-body leading-relaxed mb-8">{plans[2].description}</p>
              <div className="border-t border-ink/10 flex-1">
                {plans[2].features.map((f) => (
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
                {plans[2].cta}
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
            Website maintenance FAQ
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
            Launching a new site?{" "}
            <Link
              href="/packages/launch"
              className="text-ink border-b border-ink/20 pb-0.5 hover:border-ink transition-colors"
            >
              Launch Bundles
            </Link>{" "}
            include months of maintenance from day one.
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
              Already a client?
            </h2>
            <p className="text-muted text-sm mb-8 max-w-lg">
              Maintenance plans can be added to any existing Foundry Frame
              website. Get in touch and we&apos;ll get you set up on the right
              plan.
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
