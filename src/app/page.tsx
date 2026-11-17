/**
 * Homepage - Foundry Frame
 * =========================
 * Flat, photo-led landing page built to put The Spark (the entry-level
 * website package) in front of every visitor:
 *
 *   1. Hero: headline, Spark CTA, and a pointer-reactive photo collage with
 *      a Spark "ticket" and a spinning Start Here badge
 *   2. Crossed ticker bands advertising The Spark
 *   3. The Spark showcase: price, what's included, an interactive preview
 *      of the five pages, and the launch timeline
 *   4. Who The Spark is for (photo cards)
 *   5. Stats, services (hover-reveal list), all website tiers, launch
 *      bundles + maintenance, reviews, industries, the free audit, and a
 *      photo CTA
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import AuditForm from "@/components/AuditForm";
import GoogleReviews from "@/components/GoogleReviews";
import PackageHighlights from "@/components/PackageHighlights";
import SparkShowcase from "@/components/SparkShowcase";
import Photo from "@/components/media/Photo";
import FadeIn from "@/components/motion/FadeIn";
import HoverRevealList, { type RevealItem } from "@/components/motion/HoverRevealList";
import Marquee from "@/components/motion/Marquee";
import PointerParallax from "@/components/motion/PointerParallax";
import SpinBadge from "@/components/motion/SpinBadge";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import { BOOKING_URL } from "@/lib/analytics";
import { getPublishedServices } from "@/lib/cms/public-data";
import { photoForService, type PhotoKey } from "@/lib/media/unsplash";
import { getWebsitePackage, websitePackages } from "@/lib/packages/website";
import { FOUNDING_SPOTS_OPEN, GOOGLE_REVIEWS } from "@/lib/site-facts";

/* Reads from the Supabase CMS. Admin saves refresh this page right away
   (see lib/cms/revalidate.ts); this is the fallback for other edits. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Foundry Frame | Ohio Web Design & Branding Agency" },
  description:
    "Foundry Frame is an Ohio web design agency in Lorain building custom, conversion-focused websites for small businesses and growth brands.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Foundry Frame | Ohio Web Design & Branding Agency",
    description:
      "Custom websites starting at $1,500, built to convert. No templates. Launch in 6-12 weeks.",
    url: "/",
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
    title: "Foundry Frame | Ohio Web Design & Branding Agency",
    description:
      "Custom websites starting at $1,500, built to convert. No templates. Launch in 6-12 weeks.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Services
   ============================================================ */
const fallbackServices: RevealItem[] = [
  {
    title: "Web Design & Dev",
    description: "Custom websites designed to convert visitors into loyal customers.",
    href: "/services/web-design",
    photo: "designDesk",
  },
  {
    title: "Branding & Identity",
    description:
      "Distinctive brand systems that resonate with your audience and stand the test of time.",
    href: "/services/branding",
    photo: "swatches",
  },
  {
    title: "Social Media",
    description: "Strategic social management that builds community and drives reach.",
    href: "/services/social-media",
    photo: "socialIcons",
  },
  {
    title: "Digital Strategy",
    description: "Data-driven strategies that amplify your brand and maximize ROI.",
    href: "/services/strategy",
    photo: "strategyDesk",
  },
];

const serviceDetailSlugs = new Set([
  "web-design",
  "branding",
  "social-media",
  "graphic-design",
  "advertising",
  "strategy",
]);

/* ============================================================
   DATA: Who The Spark is for
   ============================================================ */
const sparkAudiencePhotos: PhotoKey[] = ["openSign", "consultant", "barber", "woodworker"];

/* ============================================================
   DATA: Industries
   ============================================================ */
const industries = [
  "Fashion",
  "Real Estate",
  "Hospitality",
  "Health & Wellness",
  "Fitness",
  "Food & Beverage",
  "Technology",
  "Automotive",
  "Construction",
  "E-Commerce",
  "Tourism",
  "Entertainment",
] as const;

/* ============================================================
   DATA: Stats
   ============================================================ */
const stats = [
  { value: "2026", label: "Founded in Ohio", href: undefined },
  { value: "1:1", label: "Work direct with the founder", href: undefined },
  { value: "6–12", label: "Weeks to launch", href: undefined },
  {
    value: String(FOUNDING_SPOTS_OPEN),
    label: "Founding client spots open",
    href: "/founding",
  },
] as const;

const Star = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-[0.6em] w-[0.6em] shrink-0 ${className}`}>
    <path
      fill="currentColor"
      d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z"
    />
  </svg>
);

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/* ============================================================
   COMPONENT: Homepage
   ============================================================ */
export default async function Home() {
  const cmsServices = await getPublishedServices(4);
  const services: RevealItem[] =
    cmsServices.length > 0
      ? cmsServices.map((service) => ({
          title: service.name,
          description:
            service.short_description ||
            service.description ||
            "Custom service delivery aligned to your business goals.",
          href: serviceDetailSlugs.has(service.slug) ? `/services/${service.slug}` : "/services",
          photo: photoForService(service.slug, service.name),
        }))
      : fallbackServices;

  const spark = getWebsitePackage("spark")!;
  const review = GOOGLE_REVIEWS[0];

  const tickerItems = [
    "The Spark",
    `Custom 5-page websites ${spark.pricePrefix?.toLowerCase()} ${spark.price}`,
    "Hand-coded, never templated",
    `Live in ${spark.timeline}`,
    "You own everything",
  ];

  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-24">
        <div aria-hidden="true" className="paper-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          {/* Hero copy is static (no FadeIn) so the headline — the page's LCP
              element — paints immediately instead of after hydration. */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-8">
              <span className="eyebrow">Creative Agency — Lorain, Ohio</span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink">
                <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 rounded-full bg-molten motion-safe:animate-ping opacity-60" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-molten" />
                </span>
                Booking new projects
              </span>
            </div>

            <h1 className="font-heading font-bold text-ink text-[3.4rem] leading-[0.92] sm:text-7xl lg:text-[6.4rem] tracking-[-0.045em]">
              <span className="block text-base sm:text-lg font-semibold tracking-normal text-muted mb-6 leading-snug">
                Foundry Frame<span className="sr-only">{": "}</span>
                {/* The slash is drawn by CSS so it stays out of the heading's text */}
                <span aria-hidden="true" className="mx-2 text-molten-deep before:content-['/']" />
                Ohio Web Design &amp; Branding Agency
                <span className="sr-only">{" — "}</span>
              </span>
              Websites that make your business{" "}
              <em className="serif-accent text-molten-deep">impossible to ignore.</em>
            </h1>

            <p className="mt-8 max-w-xl text-body text-lg leading-relaxed">
              Custom websites, brand systems, and digital strategy for small
              businesses and growth-focused brands across Ohio and beyond.
              Founder-led, friendly, and focused on results you can measure.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href={`/packages/website/${spark.slug}`}
                data-track="Home hero: The Spark"
                className="btn btn-molten min-h-14 px-7 text-base"
              >
                Start with The Spark &middot; {spark.price}
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link href="/audit" className="btn btn-glass min-h-14 px-7 text-base">
                Get a free website audit
              </Link>
            </div>

            {review && (
              <figure className="mt-10 flex max-w-xl items-start gap-4 border-l-[3px] border-molten pl-5">
                <div>
                  <p
                    className="text-molten-deep tracking-[0.15em] text-sm"
                    role="img"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}
                  </p>
                  <blockquote className="mt-1 text-[15px] leading-relaxed text-ink">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-1 text-xs text-muted">
                    {review.author} &middot; Google review
                  </figcaption>
                </div>
              </figure>
            )}
          </div>

          {/* --- Photo collage + Spark ticket --- */}
          <PointerParallax className="lg:col-span-5" strength={22}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem]">
              {/* Main photo */}
              <div data-depth="0.4" className="absolute right-0 top-0 h-[64%] w-[76%]">
                <div className="relative h-full w-full overflow-hidden rounded-panel border-[1.5px] border-ink">
                  <div className="absolute inset-0 animate-ken-burns">
                    <Photo
                      name="barista"
                      sizes="(min-width: 1024px) 28vw, 76vw"
                      preload
                    />
                  </div>
                </div>
              </div>

              {/* Second photo */}
              <div data-depth="0.9" className="absolute bottom-0 right-[2%] w-[44%] rotate-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-card border-[1.5px] border-ink bg-sand">
                  <Photo name="barber" sizes="(min-width: 1024px) 14vw, 44vw" />
                </div>
              </div>

              {/* Spinning badge */}
              <div data-depth="-0.6" className="absolute left-[2%] top-[2%] z-10">
                <SpinBadge
                  id="hero-badge"
                  text="The Spark ✦ Start here ✦ From $1,500 ✦ "
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-paper border-[1.5px] border-ink"
                  center={
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-molten text-ink text-2xl">
                      <Star />
                    </span>
                  }
                />
              </div>

              {/* The Spark ticket */}
              <div data-depth="1.3" className="absolute left-0 top-[40%] z-10 w-[64%] -rotate-2">
                <Link
                  href={`/packages/website/${spark.slug}`}
                  data-track="Home hero: Spark ticket"
                  className="lift lift-molten group block rounded-card border-[1.5px] border-ink bg-ink p-5 sm:p-6 text-white"
                >
                  <span className="sticker">{spark.badge ?? "Start Here"}</span>
                  <span className="mt-4 block font-heading text-2xl sm:text-3xl font-bold tracking-tight">
                    {spark.name}
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm text-white/70">
                    {spark.headline}
                  </span>
                  <span className="mt-4 flex items-end justify-between gap-3 border-t border-white/20 pt-4">
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.14em] text-white/60">
                        {spark.pricePrefix}
                      </span>
                      <span className="block font-heading text-4xl sm:text-5xl font-bold leading-none text-molten">
                        {spark.price}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-molten text-ink text-lg transition-transform duration-300 group-hover:-rotate-45"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </PointerParallax>
        </div>
      </section>

      {/* =============================================
          TICKER BANDS
          ============================================= */}
      <section aria-label="The Spark at a glance" className="relative overflow-hidden py-10 sm:py-14">
        <p className="sr-only">
          The Spark: custom 5-page websites {spark.pricePrefix?.toLowerCase()} {spark.price},
          hand-coded, live in {spark.timeline}, and you own everything.
        </p>
        <div aria-hidden="true" className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[2.5deg] bg-ink py-3">
          <Marquee
            reverse
            duration={50}
            items={industries.map((industry) => (
              <span key={industry} className="font-heading text-lg font-semibold uppercase tracking-[0.1em] text-white/70">
                {industry}
              </span>
            ))}
            separator={<Star className="mx-6 text-molten text-lg" />}
          />
        </div>
        <Link
          href={`/packages/website/${spark.slug}`}
          data-track="Home ticker: The Spark"
          aria-label={`The Spark: custom 5-page websites ${spark.pricePrefix?.toLowerCase()} ${spark.price}`}
          className="relative block -rotate-[1.5deg] border-y-[1.5px] border-ink bg-molten py-4 sm:py-5 mx-[-5%]"
        >
          <Marquee
            duration={32}
            items={tickerItems.map((item) => (
              <span key={item} className="font-heading text-2xl sm:text-4xl font-bold uppercase tracking-[-0.02em] text-ink whitespace-nowrap">
                {item}
              </span>
            ))}
            separator={<Star className="mx-6 sm:mx-8 text-ink text-2xl sm:text-4xl" />}
          />
        </Link>
      </section>

      {/* =============================================
          THE SPARK SHOWCASE
          ============================================= */}
      <section id="the-spark" className="py-12 lg:py-20 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="on-dark relative isolate overflow-hidden rounded-panel bg-ink text-white px-6 py-12 sm:p-12 lg:p-16">
            {/* Sparks photo, faded into the panel's corner */}
            <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-[34rem] w-[34rem] opacity-45 [mask-image:radial-gradient(closest-side,black,transparent)]">
              <Photo name="sparkler" alt="" sizes="544px" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12">
              {/* --- Pitch --- */}
              <div className="lg:col-span-5">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="sticker">{spark.badge ?? "Start Here"}</span>
                  <span className="eyebrow">Entry-level website package</span>
                </div>
                <h2 className="mt-7 font-heading font-bold text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.045em]">
                  Meet <em className="serif-accent text-molten">The Spark.</em>
                </h2>
                <p className="mt-5 text-xl font-heading text-white/85">
                  {spark.tagline}
                </p>

                <div className="mt-8 flex items-end gap-5 border-y border-white/15 py-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/60">{spark.pricePrefix}</p>
                    <p className="font-heading font-bold text-7xl sm:text-8xl leading-[0.85] tracking-[-0.05em] text-molten">
                      {spark.price}
                    </p>
                  </div>
                  <p className="pb-1 text-sm leading-snug text-white/70 max-w-[12rem]">
                    A fully custom site, hand-coded. Not a template with your name dropped in.
                  </p>
                </div>

                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {spark.features.slice(0, 6).map((feature) => (
                    <li key={feature.title} className="flex gap-3 text-[15px] text-white/90">
                      <span aria-hidden="true" className="mt-[0.45em] h-2 w-2 shrink-0 bg-molten" />
                      {feature.title}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    data-track="Home Spark showcase: get started"
                    className="btn btn-molten min-h-14 px-7 text-base"
                  >
                    {spark.cta}
                  </Link>
                  <Link
                    href={`/packages/website/${spark.slug}`}
                    data-track="Home Spark showcase: details"
                    className="btn btn-ghost-light min-h-14 px-7 text-base"
                  >
                    See everything included &rarr;
                  </Link>
                </div>
              </div>

              {/* --- Interactive page preview --- */}
              <div className="lg:col-span-7 lg:pl-6">
                <p className="mb-4 text-sm text-white/70">
                  Click through the five pages every Spark site includes:
                </p>
                <SparkShowcase />
              </div>
            </div>

            {/* --- Launch timeline --- */}
            <div className="mt-16 border-t border-white/15 pt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
                <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
                  From first call to live site in{" "}
                  <span className="serif-accent text-molten">{spark.timeline}</span>
                </h3>
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  {spark.glance.map((item) => (
                    <span key={item.label}>
                      <span className="text-white/60">{item.label}: </span>
                      <span className="font-semibold">{item.value}</span>
                    </span>
                  ))}
                </div>
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/15 rounded-card overflow-hidden border border-white/15">
                {spark.process.map((step, i) => (
                  <li key={step.step} className="group bg-ink p-6 transition-colors hover:bg-[#221d17]">
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-molten font-mono text-xs text-molten transition-colors group-hover:bg-molten group-hover:text-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-heading font-semibold text-lg">{step.step}</span>
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          WHO THE SPARK IS FOR
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow">Who The Spark is for</span>
              <h2 className="mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-[-0.035em] leading-[0.95] text-ink">
                Built for businesses that are{" "}
                <em className="serif-accent text-molten-deep">just getting started.</em>
              </h2>
            </div>
            <p className="max-w-sm text-body leading-relaxed">
              You don&apos;t need a big budget to look like the best option in
              town. You need a site that&apos;s fast, clear, and yours.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {spark.bestFor.map((audience, i) => (
              <StaggerItem key={audience}>
                <Link
                  href={`/packages/website/${spark.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-card border-[1.5px] border-ink bg-sand lift"
                >
                  <Photo
                    name={sparkAudiencePhotos[i % sparkAudiencePhotos.length]}
                    alt=""
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent" />
                  <span className="absolute left-5 top-5 font-mono text-xs text-white/80">
                    0{i + 1}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block font-heading text-2xl font-bold leading-tight text-white">
                      {capitalize(audience)}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-molten px-3 py-1.5 text-xs font-semibold text-ink translate-y-2 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      The Spark fits &rarr;
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* =============================================
          STATS
          ============================================= */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-[1.5px] border-ink rounded-card overflow-hidden bg-paper">
            {stats.map((stat, i) => {
              const borders = `${i % 2 === 1 ? "border-l-[1.5px]" : ""} ${i >= 2 ? "border-t-[1.5px] lg:border-t-0" : ""} ${i === 2 ? "lg:border-l-[1.5px]" : ""} border-ink`;
              const body = (
                <>
                  <span className="block font-heading text-5xl lg:text-7xl font-bold tracking-[-0.05em] leading-none">
                    {stat.value}
                  </span>
                  <span className="mt-3 block text-sm">
                    {stat.label}
                    {stat.href && <span aria-hidden="true"> &rarr;</span>}
                  </span>
                </>
              );
              return stat.href ? (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className={`block p-6 lg:p-9 bg-molten text-ink transition-colors hover:bg-ink hover:text-white ${borders}`}
                >
                  {body}
                </Link>
              ) : (
                <div key={stat.label} className={`p-6 lg:p-9 text-ink ${borders}`}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =============================================
          SERVICES
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow">Services</span>
              <h2 className="mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-[-0.035em] leading-[0.95] text-ink">
                Web design, branding{" "}
                <em className="serif-accent text-molten-deep">&amp; digital strategy</em>
              </h2>
            </div>
            <Link href="/services" className="btn btn-glass shrink-0">
              All services &rarr;
            </Link>
          </FadeIn>
          <HoverRevealList items={services} />
        </div>
      </section>

      {/* =============================================
          WEBSITE PACKAGES
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Website Packages</span>
              <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-[-0.035em] leading-[0.95] text-ink">
                Custom websites,{" "}
                <em className="serif-accent text-molten-deep">built for results</em>
              </h2>
              <p className="mt-4 max-w-xl text-body text-lg leading-relaxed">
                Every site is designed from scratch and hand-coded. No
                templates, no shortcuts. Start small with The Spark and grow
                from there.
              </p>
            </div>
            <Link href="/packages/website" className="btn btn-glass shrink-0 self-start lg:self-auto">
              Compare all tiers &rarr;
            </Link>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {websitePackages.map((pkg) => {
              // The Spark, our entry-level package, is the one we point people to first.
              const featured = pkg.slug === "spark";
              return (
                <StaggerItem key={pkg.slug} className="relative">
                  {featured && (
                    <div className="absolute -right-3 -top-10 z-10">
                      <SpinBadge
                        id="tier-badge"
                        text="Most affordable ✦ Start here ✦ "
                        className="h-24 w-24 rounded-full bg-paper border-[1.5px] border-ink"
                        center={<Star className="text-molten-deep text-3xl" />}
                      />
                    </div>
                  )}
                  <div
                    className={`h-full rounded-card p-7 flex flex-col border-[1.5px] ${
                      featured
                        ? "bg-molten border-ink text-ink lift"
                        : "glass-card border-ink/15"
                    }`}
                  >
                    <div className="flex min-h-7 items-center justify-between gap-3">
                      <span className="font-mono text-xs uppercase tracking-[0.14em]">
                        Tier {pkg.tier}
                      </span>
                      {pkg.badge && !featured && (
                        <span className="rounded-full border border-ink/25 px-3 py-1 text-xs font-semibold text-ink-soft">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 font-heading font-bold text-3xl tracking-tight text-ink">
                      {pkg.name}
                    </h3>
                    <p className={`mt-1 text-sm ${featured ? "text-ink/75" : "text-muted"}`}>
                      {pkg.headline}
                    </p>
                    <p className={`mt-6 text-xs uppercase tracking-[0.14em] ${featured ? "text-ink/70" : "text-muted"}`}>
                      {pkg.pricePrefix ?? "Scoped in discovery"}
                    </p>
                    <p className="font-heading font-bold text-5xl tracking-[-0.04em] text-ink">
                      {pkg.price}
                    </p>
                    <ul className={`mt-6 mb-8 flex flex-col gap-2.5 border-t pt-5 ${featured ? "border-ink/30" : "border-ink/10"}`}>
                      {pkg.features.slice(0, 3).map((feature) => (
                        <li key={feature.title} className="flex gap-2.5 text-sm text-ink-soft">
                          <span
                            aria-hidden="true"
                            className={`mt-[0.45em] h-1.5 w-1.5 shrink-0 ${featured ? "bg-ink" : "bg-molten"}`}
                          />
                          {feature.title}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/packages/website/${pkg.slug}`}
                      className={`btn mt-auto ${featured ? "btn-primary" : "btn-glass"}`}
                    >
                      Full details <span className="sr-only">on {pkg.name}</span>{" "}
                      &rarr;
                    </Link>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* =============================================
          LAUNCH BUNDLES + MAINTENANCE
          ============================================= */}
      <PackageHighlights />

      {/* =============================================
          REVIEWS
          ============================================= */}
      <GoogleReviews />

      {/* =============================================
          INDUSTRIES
          ============================================= */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="eyebrow">Industries We Serve</h2>
          <Link
            href="/industries"
            className="text-sm font-semibold text-ink underline underline-offset-4 decoration-molten decoration-2 hover:text-molten-deep"
          >
            Websites by industry &rarr;
          </Link>
        </div>
        <Marquee
          duration={45}
          items={industries.slice(0, 6).map((industry) => (
            <span key={industry} className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.045em] text-ink whitespace-nowrap">
              {industry}
            </span>
          ))}
          separator={<Star className="mx-6 sm:mx-10 text-molten text-4xl sm:text-6xl" />}
        />
        <Marquee
          reverse
          duration={45}
          className="mt-2 sm:mt-4"
          items={industries.slice(6).map((industry) => (
            <span key={industry} className="serif-accent text-5xl sm:text-7xl lg:text-8xl text-ink-soft whitespace-nowrap">
              {industry}
            </span>
          ))}
          separator={<Star className="mx-6 sm:mx-10 text-ink text-4xl sm:text-6xl" />}
        />
      </section>

      {/* =============================================
          AUDIT LEAD CAPTURE
          ============================================= */}
      <section id="audit" className="py-16 lg:py-24 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-panel border-[1.5px] border-ink bg-paper">
            <div className="relative hidden lg:block lg:col-span-4 min-h-[28rem] border-r-[1.5px] border-ink">
              <Photo name="codeDesk" alt="" sizes="33vw" />
              <span className="sticker absolute left-6 top-6">Free tool</span>
            </div>
            <div className="lg:col-span-8 p-8 sm:p-12 lg:p-14">
              <FadeIn className="max-w-2xl mb-10">
                <span className="eyebrow">Free Website Audit</span>
                <h2 className="mt-5 text-4xl sm:text-5xl font-heading font-bold tracking-[-0.035em] leading-[0.95] text-ink mb-4">
                  Is your website{" "}
                  <em className="serif-accent text-molten-deep">losing you clients?</em>
                </h2>
                <p className="text-body text-base leading-relaxed">
                  Enter your URL and get a free website audit in about a minute —
                  your SEO, speed, design, and accessibility scores, plus a
                  prioritized fix list. No pitch, no obligation.{" "}
                  <Link
                    href="/audit"
                    className="text-ink font-semibold underline underline-offset-4 decoration-molten decoration-2 hover:text-molten-deep transition-colors"
                  >
                    See how the audit works
                  </Link>
                  .
                </p>
              </FadeIn>
              <FadeIn delay={0.15}>
                <AuditForm />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="on-dark relative isolate overflow-hidden rounded-panel border-[1.5px] border-ink bg-ink">
            <div aria-hidden="true" className="absolute inset-0 -z-10">
              <div className="absolute inset-0 animate-ken-burns">
                <Photo name="welding" alt="" sizes="(min-width: 1400px) 1400px, 100vw" />
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/85 to-ink/30" />
            </div>
            <FadeIn className="p-8 sm:p-12 lg:p-20 max-w-4xl">
              <span className="eyebrow">Start a Project</span>
              <h2 className="mt-6 text-5xl sm:text-7xl font-heading font-bold tracking-[-0.045em] leading-[0.9] text-white">
                Let&apos;s forge your next{" "}
                <em className="serif-accent text-molten">client-winning</em> website.
              </h2>
              <p className="mt-8 text-molten text-xs uppercase tracking-[0.16em] font-semibold">
                We take on a limited number of projects each quarter
              </p>
              <p className="mt-4 text-white/80 text-base leading-relaxed max-w-lg">
                Custom websites starting at {spark.price}. No templates, no fluff — built
                to turn visitors into paying clients and delivered in 6–12 weeks.
              </p>
              <div className="flex flex-wrap gap-3 mt-10">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-molten min-h-14 px-7 text-base"
                >
                  Book a Free Discovery Call
                </a>
                <Link href="/contact" className="btn btn-ghost-light min-h-14 px-7 text-base">
                  Contact Us
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
