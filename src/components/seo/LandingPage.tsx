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

import Image from "next/image";
import Link from "next/link";
import SparkSpotlight from "@/components/SparkSpotlight";
import AuditForm from "@/components/AuditForm";
import PackageHighlights from "@/components/PackageHighlights";
import { BOOKING_URL } from "@/lib/analytics";
import type { PublishedCaseStudy } from "@/lib/cms/public-data";
import {
  APPLE_MAPS_URL,
  BUSINESS_HOURS_LINES,
  GOOGLE_MAPS_URL,
  isInHouseProduct,
} from "@/lib/site-facts";

type Feature = { title: string; description: string };
type Faq = { q: string; a: string };
type RelatedLink = { label: string; href: string };
type RelatedGroup = { heading: string; links: RelatedLink[] };

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
  /** Plain items, or links when the item has its own page (e.g. a nearby town). */
  checklist: (string | RelatedLink)[];
  faqHeading: string;
  faqs: Faq[];
  related: RelatedGroup[];
  auditHeading: string;
  /** Published case studies to show as proof (the first three are used). */
  recentWork?: PublishedCaseStudy[];
  recentWorkHeading?: string;
  /** Case studies to badge as matching this page, e.g. tagged "contractors". */
  matchedWorkIds?: string[];
  matchedWorkLabel?: string;
  /** Where the business card says we work, e.g. "Elyria and Lorain County". */
  serviceArea?: string;
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
  related,
  auditHeading,
  recentWork = [],
  recentWorkHeading = "Websites we’ve designed and built",
  matchedWorkIds = [],
  matchedWorkLabel,
  serviceArea = "Lorain County, Greater Cleveland, and across Ohio",
}: LandingPageProps) {
  const work = recentWork.slice(0, 3);

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
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href={backLink.href}
            className="btn btn-glass min-h-10 px-4 text-sm mr-2 mb-6"
          >
            &larr; {backLink.label}
          </Link>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-ink leading-[0.95] tracking-tight max-w-5xl">
            {heading}
          </h1>
          <div className="mt-8 max-w-3xl space-y-4 text-ink-soft text-base leading-relaxed">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="#audit"
              data-track="Landing hero: free audit"
              className="btn btn-primary text-center"
            >
              Get a Free Website Audit
            </Link>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass text-center"
            >
              Book a Free Call
            </a>
          </div>
          <p className="mt-4 text-muted text-xs">
            Custom websites from $1,500 &middot; Launch in 6&ndash;12 weeks &middot;{" "}
            <Link href="/packages/website/spark" className="underline hover:text-ink">
              Start with The Spark
            </Link>
          </p>
        </div>
      </section>

      {/* =============================================
          FEATURES
          ============================================= */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">{featuresEyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-16 max-w-4xl">
            {featuresHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div key={feature.title} className="glass rounded-card p-8">
                <p className="text-xs font-mono text-muted mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-ink font-heading font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-body text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          CHECKLIST
          ============================================= */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <h2 className="lg:col-span-5 text-3xl sm:text-4xl font-heading font-bold text-ink">
            {checklistHeading}
          </h2>
          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checklist.map((item) => (
              <li
                key={typeof item === "string" ? item : item.href}
                className="glass rounded-bubble relative p-5 text-ink-soft text-sm flex gap-3"
              >
                <span className="text-accent-ink font-bold" aria-hidden="true">
                  &#10003;
                </span>
                {typeof item === "string" ? (
                  item
                ) : (
                  <Link
                    href={item.href}
                    className="underline underline-offset-4 hover:text-ink after:absolute after:inset-0 after:rounded-bubble"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =============================================
          RECENT WORK
          ============================================= */}
      {work.length > 0 ? (
        <section className="py-24 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div>
                <p className="eyebrow mb-4">Recent Work</p>
                <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink max-w-3xl">
                  {recentWorkHeading}
                </h2>
              </div>
              <Link href="/case-studies" className="btn btn-glass self-start sm:self-auto">
                All case studies &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {work.map((study) => (
                <Link
                  key={study.id}
                  href={`/case-studies/${study.slug}`}
                  className="glass rounded-card group flex flex-col overflow-hidden hover:bg-white/75 transition-colors"
                >
                  {study.cover_image_url ? (
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-ink/10">
                      <Image
                        src={study.cover_image_url}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    {matchedWorkLabel && matchedWorkIds.includes(study.id) ? (
                      <span className="inline-block mb-3 text-xs uppercase tracking-widest border border-accent/40 text-accent-ink px-2 py-1 rounded-full">
                        {matchedWorkLabel}
                      </span>
                    ) : null}
                    <h3 className="text-ink font-heading font-bold text-xl mb-2 group-hover:text-accent-ink transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-muted">
                      {isInHouseProduct(study) ? "In-house product" : study.client_name}
                      {study.industry ? ` · ${study.industry}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* =============================================

          THE SPARK

          ============================================= */}

      <SparkSpotlight />


      {/* =============================================
          PACKAGES
          ============================================= */}
      <PackageHighlights />

      {/* =============================================
          AUDIT LEAD CAPTURE
          ============================================= */}
      <section id="audit" className="py-24 lg:py-28 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow mb-4">Free Website Audit</p>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-4">{auditHeading}</h2>
            <p className="text-body text-sm leading-relaxed">
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
      <section className="py-24 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">Questions</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-12">{faqHeading}</h2>
          <div className="border-t border-ink/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-ink/10">
                <summary className="flex items-center justify-between cursor-pointer py-5 text-ink text-sm font-medium hover:text-ink-soft transition-colors list-none">
                  <span className="pr-6">{faq.q}</span>
                  <span className="text-muted text-lg flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-5 text-body text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          RELATED
          ============================================= */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-12">
          {related.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <p className="eyebrow mb-6">{group.heading}</p>
              <div className="flex flex-wrap gap-4">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
                  >
                    {link.label} &rarr;
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Next Step</p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-6">
              Talk to the person who&apos;ll build your site.
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-10 max-w-lg">
              Book a free discovery call with James, the founder. You&apos;ll get honest advice on
              what your website needs, even if you don&apos;t hire us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-center"
              >
                Book a Free Call
              </a>
              <a
                href="tel:+12168897822"
                className="btn btn-glass text-center"
              >
                Call (216) 889-7822
              </a>
            </div>
          </div>

          {/* Visible name, area, phone, and hours, matching the Google
              Business Profile word for word (see lib/site-facts.ts). */}
          <address className="lg:col-span-5 glass rounded-card p-8 not-italic text-sm text-body leading-relaxed">
            <p className="font-heading font-bold text-ink text-lg">Foundry Frame</p>
            <p>Lorain, OH 44053</p>
            <p className="mt-1 text-muted">Serving {serviceArea}</p>
            <p className="mt-4">
              <a href="tel:+12168897822" className="underline underline-offset-4 hover:text-ink">
                (216) 889-7822
              </a>
            </p>
            <ul className="mt-4 space-y-1">
              {BUSINESS_HOURS_LINES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-track="Landing: Google Maps"
                className="btn btn-glass min-h-10 px-4 text-sm"
              >
                Find us on Google Maps
              </a>
              {APPLE_MAPS_URL ? (
                <a
                  href={APPLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="Landing: Apple Maps"
                  className="btn btn-glass min-h-10 px-4 text-sm"
                >
                  Apple Maps
                </a>
              ) : null}
            </div>
          </address>
        </div>
      </section>
    </>
  );
}
