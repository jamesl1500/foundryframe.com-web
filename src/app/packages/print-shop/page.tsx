/**
 * Print Shop Add-On - Foundry Frame
 * ===================================
 * The new Print Shop add-on: $150 with any package for business cards,
 * postcards, custom #10 and A6 envelopes, and tri-fold brochures, designed
 * and printed to match the client's brand. Leads with the Spark + Print
 * Shop pairing. Content lives in src/lib/packages/print-shop.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import GoogleReviews from "@/components/GoogleReviews";
import PageHero from "@/components/PageHero";
import Photo from "@/components/media/Photo";
import JsonLd from "@/components/seo/JsonLd";
import { BOOKING_URL } from "@/lib/analytics";
import {
  PRINT_ITEMS,
  PRINT_ITEM_NAMES,
  PRINT_SHOP,
  PRINT_SHOP_FAQS,
} from "@/lib/packages/print-shop";
import { getWebsitePackage } from "@/lib/packages/website";
import {
  AREA_SERVED,
  ORGANIZATION_ID,
  absoluteUrl,
  breadcrumbList,
  faqPage,
  webPage,
} from "@/lib/seo/schema";

const path = PRINT_SHOP.href;

export const metadata: Metadata = {
  title: { absolute: PRINT_SHOP.metaTitle },
  description: PRINT_SHOP.metaDescription,
  alternates: { canonical: path },
  openGraph: {
    title: PRINT_SHOP.metaTitle,
    description: PRINT_SHOP.metaDescription,
    url: path,
    type: "website",
    siteName: "Foundry Frame",
    locale: "en_US",
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
    title: PRINT_SHOP.metaTitle,
    description: PRINT_SHOP.metaDescription,
    images: ["/twitter-image"],
  },
};

/* Where Print Shop can be added, with a link to each. */
const pairings = [
  {
    name: "Website Packages",
    href: "/packages/website",
    note: "The Spark, The Blueprint, The Architect, The Monument",
  },
  {
    name: "Launch Bundles",
    href: "/packages/launch",
    note: "Ignite, Velocity, Ascend, Apex",
  },
  {
    name: "Maintenance Plans",
    href: "/packages/maintenance",
    note: "Steady, Active, Elite",
  },
  {
    name: "Marketing Packages",
    href: "/packages/marketing",
    note: "Presence, Momentum, Dominate",
  },
];

const steps = [
  {
    step: "Add it to your package",
    description:
      "Tell us on your discovery call, or tick Print Shop in the Package Builder. It's a flat $150 on top of whatever package you choose.",
  },
  {
    step: "Design alongside your site",
    description:
      "We design your cards, postcards, envelopes, and brochure from the same brand system as your website, so everything matches from day one.",
  },
  {
    step: "Approve your proofs",
    description:
      "You review a proof of every piece and confirm quantities and paper stock before anything goes to press.",
  },
  {
    step: "Printed and delivered",
    description:
      "We handle printing and get the finished pieces to you, plus print-ready files you own for future reorders.",
  },
];

export default function PrintShopPage() {
  const spark = getWebsitePackage("spark");
  const sparkPrice = spark?.price ?? "$1,500";
  const pageUrl = absoluteUrl(path);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Print Shop Add-On",
      serviceType: "Print Design & Printing",
      category: "Graphic Design",
      url: pageUrl,
      description: PRINT_SHOP.summary,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: AREA_SERVED,
      offers: {
        "@type": "Offer",
        name: "Print Shop Add-On",
        url: pageUrl,
        price: String(PRINT_SHOP.price),
        priceCurrency: "USD",
        description: `Design and printing of ${PRINT_ITEM_NAMES.join(", ")}, added to any Foundry Frame package.`,
        availability: "https://schema.org/InStock",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Print Shop Pieces",
        itemListElement: PRINT_ITEMS.map((item) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${item.name} design & printing`,
            description: item.description,
          },
        })),
      },
      isRelatedTo: {
        "@type": "Service",
        name: "The Spark Website Package",
        url: absoluteUrl("/packages/website/spark"),
      },
    },
    webPage("WebPage", {
      path,
      name: PRINT_SHOP.metaTitle,
      description: PRINT_SHOP.metaDescription,
      extra: { mainEntity: { "@id": `${pageUrl}#service` } },
    }),
    breadcrumbList([
      { name: "Packages", path: "/packages" },
      { name: "Print Shop", path },
    ]),
    faqPage(PRINT_SHOP_FAQS, path),
  ];

  return (
    <>
      <JsonLd data={structuredData} />

      {/* =============================================
          HERO
          ============================================= */}
      <PageHero
        back={{ href: "/packages", label: "All Packages" }}
        kicker="Business Card, Postcard, Envelope & Brochure Printing"
        eyebrow={
          <>
            New &middot; Print Shop Add-On
          </>
        }
        title={
          <>
            Print Shop, <em className="serif-accent text-molten-deep">with every package.</em>
          </>
        }
        intro={
          <>
            <p>
              For an extra <span className="font-semibold text-ink">{PRINT_SHOP.priceLabel}</span>{" "}
              on any package, we design and print your business cards, postcards, custom #10 and
              A6 envelopes, and tri-fold brochures, all matched to the brand on your new website.
            </p>
            <p className="text-base">
              It&apos;s new, and it&apos;s made for{" "}
              <Link href="/packages/website/spark" className="font-semibold text-molten-deep underline underline-offset-4">
                The Spark
              </Link>
              : a custom 5-page website from {sparkPrice}, plus everything you hand to customers,
              for {PRINT_SHOP.priceLabel} more.
            </p>
          </>
        }
        photo="coffeeBrand"
        aside={
          <div className="relative pb-24 sm:pb-16">
            <div className="relative mr-3 sm:mr-4">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-panel bg-molten border-[1.5px] border-ink"
              />
              <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-panel border-[1.5px] border-ink bg-ink">
                <div className="absolute inset-0 animate-ken-burns">
                  <Photo name="coffeeBrand" sizes="(min-width: 1024px) 38vw, 100vw" preload />
                </div>
                <span className="sticker absolute left-4 top-4">{PRINT_SHOP.badge}</span>
              </div>
            </div>
            {/* Price card, overlapping the photo */}
            <div className="absolute bottom-0 left-4 right-10 sm:left-auto sm:right-10 sm:w-80 rounded-card border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_var(--color-ink)]">
              <span className="text-xs uppercase tracking-widest text-muted block">
                Add to any package
              </span>
              <p className="text-5xl font-heading font-bold tracking-[-0.04em] text-molten-deep">
                +{PRINT_SHOP.priceLabel}
              </p>
              <p className="mt-1 mb-5 text-xs text-muted">
                The Spark + Print Shop: {sparkPrice} + {PRINT_SHOP.priceLabel}
              </p>
              <Link
                href="/packages/builder"
                data-track="Print Shop hero: builder"
                className="btn btn-molten flex text-center"
              >
                Add Print Shop
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass flex text-center mt-2"
              >
                Book a Free Call
              </a>
            </div>
          </div>
        }
      />

      {/* =============================================
          WHAT'S INCLUDED
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">What&apos;s Included</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-6 max-w-4xl">
            Four print pieces, designed and printed for {PRINT_SHOP.priceLabel}
          </h2>
          <p className="text-body text-lg leading-relaxed mb-14 max-w-2xl">
            Every piece is designed from your brand and your website, not dropped into a stock
            template, so customers recognize you the moment they pick it up.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRINT_ITEMS.map((item, i) => (
              <div key={item.name} className="glass-card rounded-card p-8 flex flex-col">
                <p className="text-xs font-mono text-muted mb-4">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-ink font-heading font-bold text-xl mb-1">{item.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-molten-deep mb-4">
                  {item.spec}
                </p>
                <p className="text-body text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          THE SPARK + PRINT SHOP
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="overflow-hidden rounded-panel border-[1.5px] border-ink bg-molten grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16">
              <span className="inline-flex items-center rounded-full bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-white -rotate-2">
                The perfect pairing
              </span>
              <h2 className="mt-6 text-5xl sm:text-6xl font-heading font-bold tracking-[-0.045em] leading-[0.92] text-ink">
                The Spark + Print Shop
              </h2>
              <p className="mt-5 text-xl text-ink font-heading">
                A custom website from {sparkPrice}, and your print pieces for{" "}
                <span className="font-bold">{PRINT_SHOP.priceLabel}</span> more.
              </p>
              <p className="mt-4 max-w-xl text-ink/80 leading-relaxed">
                The Spark is built for new businesses, freelancers, and local service providers
                getting their brand out for the first time. That&apos;s exactly when you need
                business cards to hand out, postcards to announce your launch, envelopes for your
                first invoices, and a brochure for the counter. Adding Print Shop means it all
                launches together, in one look, from one team.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/packages/website/spark"
                  data-track="Print Shop page: Spark details"
                  className="btn btn-primary min-h-13 px-7"
                >
                  See The Spark &rarr;
                </Link>
                <Link
                  href="/contact"
                  data-track="Print Shop page: Spark + Print Shop"
                  className="btn btn-glass min-h-13 px-7 hover:bg-ink hover:text-white"
                >
                  Get The Spark + Print Shop
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 border-t-[1.5px] lg:border-t-0 lg:border-l-[1.5px] border-ink bg-paper flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Your launch kit</p>
              {[
                {
                  name: "The Spark",
                  price: `from ${sparkPrice}`,
                  items: [
                    "Custom 5-page website",
                    "Mobile-first design & on-page SEO",
                    "Contact form, Google Maps & analytics",
                  ],
                },
                {
                  name: "Print Shop",
                  price: `+${PRINT_SHOP.priceLabel}`,
                  items: ["Business cards", "Postcards", "#10 & A6 envelopes", "Tri-fold brochures"],
                },
              ].map((group) => (
                <div key={group.name} className="mt-5 border-t border-ink/15 pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-heading font-bold text-lg text-ink">{group.name}</p>
                    <p className="font-heading font-bold text-ink whitespace-nowrap">{group.price}</p>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <span aria-hidden="true" className="text-accent-ink font-bold">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="mt-6 text-xs text-muted leading-relaxed">
                Prices are starting points. You&apos;ll get an exact quote on a free, no-obligation
                call.
              </p>
            </div>
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
              From your brand to your hands
            </h2>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              Print Shop runs alongside your package, so your print pieces are ready when your
              site goes live.
            </p>
          </div>
          <ol className="lg:col-span-8 border-t border-ink/10">
            {steps.map((item, i) => (
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
          WORKS WITH EVERY PACKAGE
          ============================================= */}
      <section className="py-16 lg:py-20">
        <nav aria-label="Packages that include Print Shop" className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">Works With Every Package</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-10 max-w-3xl">
            Add Print Shop to any package for {PRINT_SHOP.priceLabel}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pairings.map((item) => (
              <Link key={item.href} href={item.href} className="glass-card rounded-card p-6 flex flex-col">
                <span className="font-heading font-bold text-lg text-ink">{item.name}</span>
                <span className="mt-1 text-xs text-muted">{item.note}</span>
                <span className="mt-5 text-sm font-semibold text-ink">
                  + Print Shop {PRINT_SHOP.priceLabel} &rarr;
                </span>
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
            Print Shop FAQ
          </h2>
          <div className="border-t border-ink/10">
            {PRINT_SHOP_FAQS.map((faq) => (
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
              Launch online and in print.
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-10 max-w-lg">
              Start with The Spark, add Print Shop for {PRINT_SHOP.priceLabel}, and get a website,
              business cards, postcards, envelopes, and brochures that all look like they belong
              together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/packages/builder"
                data-track="Print Shop CTA: builder"
                className="btn btn-primary text-center"
              >
                Build Your Package
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
