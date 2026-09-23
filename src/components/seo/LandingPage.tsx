/**
 * LandingPage - Foundry Frame
 * =============================
 * Shared layout for the location and industry SEO landing pages. Every
 * page leads with the free audit (the lowest-friction conversion on the
 * site), then local/industry proof, FAQ, and a booking CTA.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";
import AuditForm from "@/components/AuditForm";
import { BOOKING_URL } from "@/lib/analytics";

type Feature = { title: string; description: string };
type Faq = { q: string; a: string };
type RelatedLink = { label: string; href: string };

interface LandingPageProps {
  structuredData: object[];
  backLink: RelatedLink;
  eyebrow: string;
  heading: string;
  intro: string[];
  featuresEyebrow: string;
  featuresHeading: string;
  features: Feature[];
  checklistHeading: string;
  checklist: string[];
  faqHeading: string;
  faqs: Faq[];
  relatedHeading: string;
  related: RelatedLink[];
  auditHeading: string;
}

export default function LandingPage({
  structuredData,
  backLink,
  eyebrow,
  heading,
  intro,
  featuresEyebrow,
  featuresHeading,
  features,
  checklistHeading,
  checklist,
  faqHeading,
  faqs,
  relatedHeading,
  related,
  auditHeading,
}: LandingPageProps) {
  return (
    <>
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href={backLink.href}
            className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors mb-6 inline-block"
          >
            &larr; {backLink.label}
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-accent-glow mb-6">{eyebrow}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            {heading}
          </h1>
          <div className="mt-8 max-w-3xl space-y-4 text-gray-300 text-base leading-relaxed">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="#audit"
              data-track="Landing hero: free audit"
              className="px-6 py-3 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors text-center"
            >
              Get a Free Website Audit
            </Link>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-light px-6 py-3 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/15 transition-colors text-center"
            >
              Book a Free Call
            </a>
          </div>
          <p className="mt-4 text-gray-500 text-xs">
            Custom websites from $1,500 &middot; Launch in 6&ndash;12 weeks &middot;{" "}
            <Link href="/packages/website" className="underline hover:text-white">
              See pricing
            </Link>
          </p>
        </div>
      </section>

      {/* =============================================
          FEATURES
          ============================================= */}
      <section className="py-24 lg:py-28 bg-gray-900 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">{featuresEyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-16 max-w-4xl">
            {featuresHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {features.map((feature, i) => (
              <div key={feature.title} className="bg-gray-900 p-8">
                <p className="text-xs font-mono text-gray-600 mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-white font-heading font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          CHECKLIST
          ============================================= */}
      <section className="py-24 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <h2 className="lg:col-span-5 text-3xl sm:text-4xl font-heading font-bold text-black">
            {checklistHeading}
          </h2>
          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/10">
            {checklist.map((item) => (
              <li key={item} className="bg-white p-5 text-gray-700 text-sm flex gap-3">
                <span className="text-accent font-bold" aria-hidden="true">
                  &#10003;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =============================================
          AUDIT LEAD CAPTURE
          ============================================= */}
      <section id="audit" className="py-24 lg:py-28 bg-black border-b border-white/10 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Free Website Audit</p>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">{auditHeading}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enter your URL and get your SEO, speed, design, and accessibility scores in about a
              minute, plus a prioritized fix list. Free, no obligation.
            </p>
          </div>
          <AuditForm />
        </div>
      </section>

      {/* =============================================
          FAQ
          ============================================= */}
      <section className="py-24 lg:py-28 bg-gray-900 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Questions</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-12">{faqHeading}</h2>
          <div className="border-t border-white/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-white/10">
                <summary className="flex items-center justify-between cursor-pointer py-5 text-white text-sm font-medium hover:text-gray-300 transition-colors list-none">
                  <span className="pr-6">{faq.q}</span>
                  <span className="text-gray-500 text-lg flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          RELATED
          ============================================= */}
      <section className="py-16 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">{relatedHeading}</p>
          <div className="flex flex-wrap gap-4">
            {related.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-5 py-3 border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Next Step</p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-black leading-[0.95] mb-6">
              Talk to the person who&apos;ll build your site.
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-10 max-w-lg">
              Book a free discovery call with James, the founder. You&apos;ll get honest advice on
              what your website needs, even if you don&apos;t hire us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors text-center"
              >
                Book a Free Call
              </a>
              <a
                href="tel:+12168897822"
                className="px-8 py-4 border border-black/20 text-black font-bold text-sm uppercase tracking-wider hover:bg-black/5 transition-colors text-center"
              >
                Call (216) 889-7822
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
