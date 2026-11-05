/**
 * Launch Bundle Details - Foundry Frame
 * =======================================
 * One page per launch bundle (/packages/launch/ignite, /velocity,
 * /ascend, /apex): what's in the bundle, how the project runs, the
 * Founding Client price, and a CTA. Content lives in
 * src/lib/packages/launch.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoogleReviews from "@/components/GoogleReviews";
import { BOOKING_URL } from "@/lib/analytics";
import { getLaunchBundle, launchBundles } from "@/lib/packages/launch";
import { getWebsitePackage } from "@/lib/packages/website";
import { parsePriceSpecification } from "@/lib/schema-price";
import { citiesOf, locations } from "@/lib/seo/locations";
import { FOUNDING_DISCOUNT_PERCENT, FOUNDING_SPOTS_OPEN } from "@/lib/site-facts";

const siteUrl = "https://www.foundryframe.com";

const groupOrder = ["Website", "Brand", "Growth", "Support"] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return launchBundles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getLaunchBundle(slug);
  if (!bundle) return {};

  const url = `/packages/launch/${bundle.slug}`;

  /* Share images come from opengraph-image.tsx / twitter-image.tsx in this
     folder. This object replaces the root openGraph rather than merging with
     it, so siteName and locale are repeated here. */
  return {
    title: bundle.metaTitle,
    description: bundle.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: bundle.metaTitle,
      description: bundle.metaDescription,
      url,
      type: "website",
      siteName: "Foundry Frame",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: bundle.metaTitle,
      description: bundle.metaDescription,
    },
  };
}

function formatUsd(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export default async function LaunchBundlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = getLaunchBundle(slug);
  if (!bundle) notFound();

  const pageUrl = `${siteUrl}/packages/launch/${bundle.slug}`;
  const website = getWebsitePackage(bundle.websiteSlug);
  const upgrade = bundle.upgrade ? getLaunchBundle(bundle.upgrade.slug) : undefined;
  const foundingPrice = Math.round(bundle.priceValue * (1 - FOUNDING_DISCOUNT_PERCENT / 100));
  const groups = groupOrder
    .map((group) => ({ group, items: bundle.items.filter((item) => item.group === group) }))
    .filter(({ items }) => items.length > 0);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${bundle.name} Launch Bundle`,
      serviceType: "Website design and branding package",
      url: pageUrl,
      description: bundle.metaDescription,
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
        name: `${bundle.name} Launch Bundle`,
        url: pageUrl,
        priceSpecification: parsePriceSpecification(`${bundle.pricePrefix} ${bundle.price}`),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Packages", item: `${siteUrl}/packages` },
        { "@type": "ListItem", position: 3, name: "Launch Bundles", item: `${siteUrl}/packages/launch` },
        { "@type": "ListItem", position: 4, name: bundle.name, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: bundle.faqs.map((faq) => ({
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
          <Link href="/packages/launch" className="btn btn-glass min-h-10 px-4 text-sm mr-2 mb-6">
            &larr; Launch Bundles
          </Link>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <p className="eyebrow">Launch Bundle &middot; {bundle.number}</p>
            {bundle.badge && (
              <span className="glass-accent text-xs font-semibold uppercase tracking-widest text-accent-deep px-3 py-1.5 rounded-full">
                {bundle.badge}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight">
                {bundle.name}
                <span className="sr-only">: </span>
                <span className="block mt-5 text-2xl sm:text-3xl text-body tracking-normal leading-tight">
                  {bundle.headline}
                </span>
              </h1>
              <p className="mt-6 text-lg text-ink-soft italic max-w-3xl">
                &ldquo;{bundle.tagline}&rdquo;
              </p>
              <div className="mt-8 max-w-3xl space-y-4 text-body text-base leading-relaxed">
                <p>{bundle.description}</p>
                <p>{bundle.intro}</p>
              </div>
            </div>
            <div className="glass-card rounded-card lg:col-span-4 p-8">
              <span className="text-xs uppercase tracking-widest text-muted block">
                {bundle.pricePrefix}
              </span>
              <p className="text-5xl font-heading font-bold text-ink mb-6">{bundle.price}</p>
              <Link
                href="/contact"
                data-track={`Bundle details hero: ${bundle.name}`}
                className="btn btn-primary flex text-center"
              >
                {bundle.cta}
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass flex text-center mt-3"
              >
                Book a Free Call
              </a>
              {FOUNDING_SPOTS_OPEN > 0 && (
                <Link
                  href="/founding"
                  className="glass-accent rounded-bubble block mt-5 p-4 text-sm text-ink-soft hover:bg-accent/20 transition-colors"
                >
                  <span className="block font-semibold text-accent-deep">
                    Founding Client price: {formatUsd(foundingPrice)}
                  </span>
                  {FOUNDING_DISCOUNT_PERCENT}% off for our first {FOUNDING_SPOTS_OPEN} clients this
                  quarter. See how it works &rarr;
                </Link>
              )}
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
            {[...bundle.glance, { label: "Timeline", value: bundle.timeline }].map((item) => (
              <div key={item.label} className="glass rounded-bubble py-5 px-5 lg:px-6">
                <dt className="text-xs uppercase tracking-[0.3em] text-muted mb-1">{item.label}</dt>
                <dd className="text-ink font-heading font-bold text-base sm:text-lg">{item.value}</dd>
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
              Who {bundle.name} is built for
            </h2>
          </div>
          <ul className="lg:col-span-8 flex flex-wrap gap-3 content-start">
            {bundle.bestFor.map((audience) => (
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
          WHAT'S IN THE BUNDLE
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">What&apos;s Included</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-6 max-w-4xl">
            Everything in {bundle.name}, explained
          </h2>
          <p className="text-body text-base leading-relaxed max-w-2xl mb-14">
            {bundle.items.length} pieces, planned together and delivered by one team on one
            timeline.
          </p>
          <div className="space-y-12">
            {groups.map(({ group, items }) => (
              <div key={group} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <h3 className="lg:col-span-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted pt-2">
                  {group}
                </h3>
                <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div key={item.title} className="glass-card rounded-card p-8 flex flex-col">
                      <h4 className="text-ink font-heading font-bold text-lg mb-3">{item.title}</h4>
                      <p className="text-body text-sm leading-relaxed">{item.detail}</p>
                      {item.href && (
                        <Link
                          href={item.href}
                          className="mt-3 -mb-3 self-start inline-flex items-center min-h-11 text-sm font-semibold text-accent-ink hover:text-accent-deep"
                        >
                          Learn more <span className="sr-only">about {item.title}</span> &rarr;
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
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
              Most {bundle.name} launches take{" "}
              <span className="text-ink font-semibold">{bundle.timeline}</span>. You&apos;ll get a
              specific schedule after the discovery call.
            </p>
          </div>
          <ol className="lg:col-span-8 border-t border-ink/10">
            {bundle.process.map((item, i) => (
              <li key={item.step} className="grid grid-cols-[3rem_1fr] gap-4 py-6 border-b border-ink/10">
                <span className="text-xs font-mono text-body pt-1">{String(i + 1).padStart(2, "0")}</span>
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
              {bundle.fromYou.map((item) => (
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
              {bundle.goodToKnow.map((item) => (
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
          WEBSITE ONLY + NEXT BUNDLE
          ============================================= */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {website && (
              <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <p className="eyebrow">Just the Website?</p>
                  <p className="text-ink font-heading font-bold text-lg whitespace-nowrap">
                    {website.pricePrefix ? `From ${website.price}` : website.price}
                  </p>
                </div>
                <p className="text-ink font-heading font-bold text-2xl mb-3">
                  {website.name}, on its own
                </p>
                <p className="text-body text-sm leading-relaxed mb-8">
                  {bundle.name} is built on {website.name}: {website.headline.toLowerCase()}. If you
                  already have your brand in place, you can start with the website package by itself.
                </p>
                <Link
                  href={`/packages/website/${website.slug}`}
                  className="btn btn-glass min-h-10 px-5 text-sm mt-auto self-start"
                >
                  See {website.name} &rarr;
                </Link>
              </div>
            )}
            {upgrade && bundle.upgrade ? (
              <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <p className="eyebrow">Next Bundle &middot; {upgrade.name}</p>
                  <p className="text-ink font-heading font-bold text-lg whitespace-nowrap">
                    From {upgrade.price}
                  </p>
                </div>
                <p className="text-ink font-heading font-bold text-2xl mb-3">{bundle.upgrade.reason}</p>
                <p className="text-body text-sm leading-relaxed mb-8">{upgrade.tagline}</p>
                <Link
                  href={`/packages/launch/${upgrade.slug}`}
                  className="btn btn-glass min-h-10 px-5 text-sm mt-auto self-start"
                >
                  See {upgrade.name} &rarr;
                </Link>
              </div>
            ) : (
              <div className="glass-card rounded-card p-8 lg:p-10 flex flex-col">
                <p className="eyebrow mb-6 self-start">Not Sure Yet?</p>
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
          COMPARE BUNDLES
          ============================================= */}
      <section className="py-16">
        <nav aria-label="Launch bundles" className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-6">All Launch Bundles</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {launchBundles.map((other) => {
              const current = other.slug === bundle.slug;
              return (
                <Link
                  key={other.slug}
                  href={`/packages/launch/${other.slug}`}
                  aria-current={current ? "page" : undefined}
                  className={`glass-card p-6 rounded-card ${current ? "ring-2 ring-accent/50" : ""}`}
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-muted block mb-1">
                    {other.number}
                  </span>
                  <span className="font-heading font-bold text-base sm:text-lg text-ink block">
                    {other.name}
                  </span>
                  <span className="text-xs mt-0.5 block text-muted">
                    {other.pricePrefix} {other.price}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </section>

      {/* =============================================
          FAQ
          ============================================= */}
      <section className="py-24 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">Questions</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-12">{bundle.name} FAQ</h2>
          <div className="border-t border-ink/10">
            {bundle.faqs.map((faq) => (
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
          <div className="glass-dark rounded-panel p-8 sm:p-12 lg:p-16">
            <p className="text-xs uppercase tracking-[0.14em] text-white/70">Next Step</p>
            <h2 className="mt-5 max-w-3xl text-4xl sm:text-6xl font-heading font-bold tracking-[-0.03em] leading-[0.95] text-white">
              Ready to launch with {bundle.name}?
            </h2>
            <p className="mt-6 text-white/80 text-base leading-relaxed max-w-lg">
              Tell us about your business and your launch date. You&apos;ll talk with James, the
              founder, and get an honest recommendation and an exact quote, even if you don&apos;t
              hire us.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="/contact"
                data-track={`Bundle details CTA: ${bundle.name}`}
                className="btn btn-accent"
              >
                {bundle.cta}
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-white/25 text-white hover:bg-white/10"
              >
                Book a Free Call
              </a>
            </div>
            <p className="mt-6 text-white/70 text-xs">
              Prefer to talk now?{" "}
              <a href="tel:+12168897822" className="underline hover:text-white">
                Call (216) 889-7822
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
