/**
 * Website Package Details - Foundry Frame
 * =========================================
 * One page per website tier (/packages/website/spark, /blueprint,
 * /architect, /monument): what's included, how the project runs, and
 * a CTA. Content lives in src/lib/packages/website.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoogleReviews from "@/components/GoogleReviews";
import { BOOKING_URL } from "@/lib/analytics";
import { getWebsitePackage, websitePackages } from "@/lib/packages/website";
import { parsePriceSpecification } from "@/lib/schema-price";
import { citiesOf, locations } from "@/lib/seo/locations";

const siteUrl = "https://www.foundryframe.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return websitePackages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getWebsitePackage(slug);
  if (!pkg) return {};

  const url = `/packages/website/${pkg.slug}`;

  /* Share images come from opengraph-image.tsx / twitter-image.tsx in this
     folder. This object replaces the root openGraph rather than merging with
     it, so siteName and locale are repeated here. */
  return {
    title: pkg.metaTitle,
    description: pkg.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: pkg.metaTitle,
      description: pkg.metaDescription,
      url,
      type: "website",
      siteName: "Foundry Frame",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pkg.metaTitle,
      description: pkg.metaDescription,
    },
  };
}

export default async function WebsitePackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getWebsitePackage(slug);
  if (!pkg) notFound();

  const pageUrl = `${siteUrl}/packages/website/${pkg.slug}`;
  const priceLabel = pkg.pricePrefix ? `${pkg.pricePrefix} ${pkg.price}` : pkg.price;
  const isCustom = pkg.price === "Custom";
  const upgrade = pkg.upgrade ? getWebsitePackage(pkg.upgrade.slug) : undefined;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${pkg.name} Website Package`,
      serviceType: "Web Design & Development",
      url: pageUrl,
      description: pkg.metaDescription,
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: [
        ...locations.flatMap((location) =>
          citiesOf(location).map((name) => ({ "@type": "City", name }))
        ),
        { "@type": "State", name: "Ohio" },
        { "@type": "AdministrativeArea", name: "United States" },
      ],
      offers: {
        "@type": "Offer",
        name: pkg.name,
        url: pageUrl,
        priceSpecification: parsePriceSpecification(priceLabel),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Packages", item: `${siteUrl}/packages` },
        { "@type": "ListItem", position: 3, name: "Website Packages", item: `${siteUrl}/packages/website` },
        { "@type": "ListItem", position: 4, name: pkg.name, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pkg.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

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
            href="/packages/website"
            className="btn btn-glass min-h-10 px-4 text-sm mr-2 mb-6"
          >
            &larr; Website Packages
          </Link>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <p className="eyebrow">
              Website Package &middot; Tier {pkg.tier}
            </p>
            {pkg.badge && (
              <span className="glass-accent text-xs font-semibold uppercase tracking-widest text-accent-deep px-3 py-1.5 rounded-full">
                {pkg.badge}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight">
                {pkg.name}
                <span className="sr-only">: </span>
                <span className="block mt-5 text-2xl sm:text-3xl text-body tracking-normal leading-tight">
                  {pkg.headline}
                </span>
              </h1>
              <p className="mt-6 text-lg text-ink-soft italic max-w-3xl">
                &ldquo;{pkg.tagline}&rdquo;
              </p>
              <div className="mt-8 max-w-3xl space-y-4 text-body text-base leading-relaxed">
                <p>{pkg.description}</p>
                <p>{pkg.intro}</p>
                <p>
                  Designed and built in Lorain, Ohio, for businesses across Northeast Ohio and
                  nationwide.
                </p>
              </div>
            </div>
            <div className="glass-card rounded-card lg:col-span-4 p-8">
              {pkg.pricePrefix && (
                <span className="text-xs uppercase tracking-widest text-muted block">
                  {pkg.pricePrefix}
                </span>
              )}
              <p className="text-5xl font-heading font-bold text-ink mb-6">{pkg.price}</p>
              <Link
                href="/contact"
                data-track={`Package details hero: ${pkg.name}`}
                className="btn btn-primary flex text-center"
              >
                {pkg.cta}
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass flex text-center mt-3"
              >
                Book a Free Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          AT A GLANCE
          ============================================= */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...pkg.glance, { label: "Timeline", value: pkg.timeline }].map((item) => (
              <div key={item.label} className="glass rounded-bubble py-5 px-5 lg:px-6">
                <dt className="text-xs uppercase tracking-[0.3em] text-muted mb-1">
                  {item.label}
                </dt>
                <dd className="text-ink font-heading font-bold text-base sm:text-lg">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* =============================================
          WHO IT'S FOR
          ============================================= */}
      <section className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">Best For</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
              Who {pkg.name} is built for
            </h2>
          </div>
          <ul className="lg:col-span-8 flex flex-wrap gap-3 content-start">
            {pkg.bestFor.map((audience) => (
              <li
                key={audience}
                className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm"
              >
                {audience}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =============================================
          WHAT'S INCLUDED
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">What&apos;s Included</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-16 max-w-4xl">
            Everything in {pkg.name}, explained
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pkg.features.map((feature, i) => (
              <div key={feature.title} className="glass-card rounded-card p-8">
                <p className="text-xs font-mono text-muted mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-ink font-heading font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-body text-sm leading-relaxed">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          HOW IT WORKS
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">How It Works</p>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-6">
              From first call to launch day
            </h2>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              {isCustom ? (
                "Timelines are set during discovery, around your launch date and internal approvals."
              ) : (
                <>
                  Most {pkg.name} projects launch in{" "}
                  <span className="text-ink font-semibold">{pkg.timeline}</span>. You&apos;ll get a
                  specific schedule after the discovery call.
                </>
              )}
            </p>
          </div>
          <ol className="lg:col-span-8 border-t border-ink/10">
            {pkg.process.map((item, i) => (
              <li key={item.step} className="grid grid-cols-[3rem_1fr] gap-4 py-6 border-b border-ink/10">
                <span className="text-xs font-mono text-body pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-ink font-heading font-bold text-lg mb-2">{item.step}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =============================================
          WHAT WE NEED + GOOD TO KNOW
          ============================================= */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="eyebrow mb-4">Your Part</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-10">
              What we&apos;ll need from you
            </h2>
            <ul className="border-t border-ink/10">
              {pkg.fromYou.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 py-4 border-b border-ink/10 text-ink-soft text-sm"
                >
                  <span className="text-accent-ink font-bold" aria-hidden="true">
                    &#10003;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Good To Know</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-10">
              Before you get started
            </h2>
            <div className="border-t border-ink/10">
              {pkg.goodToKnow.map((item) => (
                <div key={item.title} className="py-4 border-b border-ink/10">
                  <h3 className="text-ink text-sm font-semibold mb-1">{item.title}</h3>
                  <p className="text-body text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          UPGRADE + BUNDLE
          ============================================= */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-6">
                <p className="eyebrow">
                  {pkg.bundle.name} Launch Bundle
                </p>
                <p className="text-ink font-heading font-bold text-lg whitespace-nowrap">
                  {pkg.bundle.price}
                </p>
              </div>
              <p className="text-ink-soft text-sm leading-relaxed mb-8">{pkg.bundle.pitch}</p>
              <Link
                href={`/packages/launch/${pkg.bundle.name.toLowerCase()}`}
                className="btn btn-glass min-h-10 px-5 text-sm mt-auto self-start"
              >
                See the {pkg.bundle.name} bundle &rarr;
              </Link>
            </div>
            {upgrade && pkg.upgrade ? (
              <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <p className="eyebrow">
                    Next Tier &middot; {upgrade.name}
                  </p>
                  <p className="text-ink font-heading font-bold text-lg whitespace-nowrap">
                    {upgrade.pricePrefix ? `From ${upgrade.price}` : upgrade.price}
                  </p>
                </div>
                <p className="text-ink font-heading font-bold text-2xl mb-3">{pkg.upgrade.reason}</p>
                <p className="text-body text-sm leading-relaxed mb-8">{upgrade.tagline}</p>
                <Link
                  href={`/packages/website/${upgrade.slug}`}
                  className="btn btn-glass min-h-10 px-5 text-sm mt-auto self-start"
                >
                  See {upgrade.name} &rarr;
                </Link>
              </div>
            ) : (
              <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
                <p className="eyebrow mb-6">Not Sure Yet?</p>
                <p className="text-ink font-heading font-bold text-2xl mb-3">
                  Build a package around what you need
                </p>
                <p className="text-body text-sm leading-relaxed mb-8">
                  Mix a website tier with branding, marketing, and maintenance and see an estimate in
                  a couple of minutes.
                </p>
                <Link
                  href="/packages/builder"
                  className="btn btn-glass min-h-10 px-5 text-sm mt-auto self-start"
                >
                  Open the Package Builder &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =============================================
          COMPARE TIERS
          ============================================= */}
      <section className="py-16">
        <nav aria-label="Website packages" className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-6">All Website Packages</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {websitePackages.map((other) => {
              const current = other.slug === pkg.slug;
              return (
                <Link
                  key={other.slug}
                  href={`/packages/website/${other.slug}`}
                  aria-current={current ? "page" : undefined}
                  className={`glass-card p-6 rounded-card ${current ? "ring-2 ring-accent/50" : ""}`}
                >
                  <span
                    className={`text-xs uppercase tracking-[0.3em] block mb-1 ${
                      current ? "text-body" : "text-muted"
                    }`}
                  >
                    {other.tier}
                  </span>
                  <span
                    className={`font-heading font-bold text-base sm:text-lg block ${
                      current ? "text-ink" : "text-ink"
                    }`}
                  >
                    {other.name}
                  </span>
                  <span className={`text-xs mt-0.5 block ${current ? "text-muted" : "text-muted"}`}>
                    {other.pricePrefix ? `${other.pricePrefix} ` : ""}
                    {other.price}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
        <nav aria-label="Areas we serve" className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-12">
          <p className="eyebrow mb-6">Areas We Serve</p>
          <div className="flex flex-wrap gap-3">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="glass rounded-full inline-flex items-center min-h-10 px-4 text-body text-xs hover:bg-white/80 hover:text-ink transition-colors"
              >
                {location.city} web design
              </Link>
            ))}
          </div>
        </nav>
      </section>

      {/* =============================================
          FAQ
          ============================================= */}
      <section className="py-24 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">Questions</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-12">
            {pkg.name} FAQ
          </h2>
          <div className="border-t border-ink/10">
            {pkg.faqs.map((faq) => (
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

      <GoogleReviews />

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6">Next Step</p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-6">
              {isCustom
                ?`Let's scope your ${pkg.name.replace("The ", "")} project.`
                : `Ready to start ${pkg.name}?`}
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-10 max-w-lg">
              Tell us about your business and what you need the site to do. You&apos;ll talk with
              James, the founder, and get an honest recommendation and an exact quote, even if you
              don&apos;t hire us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                data-track={`Package details CTA: ${pkg.name}`}
                className="btn btn-primary text-center"
              >
                {pkg.cta}
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
            <p className="mt-6 text-muted text-xs">
              Prefer to talk now?{" "}
              <a href="tel:+12168897822" className="underline hover:text-ink">
                Call (216) 889-7822
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
