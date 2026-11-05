/**
 * Homepage - Foundry Frame
 * =========================
 * Light glass landing page: a hero with floating glass bubbles (a package,
 * the launch timeline, a Google review), then stats, services, website
 * packages, reviews, industries, the free audit, and a closing CTA.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import AuditForm from "@/components/AuditForm";
import GoogleReviews from "@/components/GoogleReviews";
import PackageHighlights from "@/components/PackageHighlights";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import { getPublishedServices } from "@/lib/cms/public-data";
import { websitePackages } from "@/lib/packages/website";
import { FOUNDING_SPOTS_OPEN, GOOGLE_REVIEWS } from "@/lib/site-facts";

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
const fallbackServices = [
  {
    title: "Branding & Identity",
    description:
      "Distinctive brand systems that resonate with your audience and stand the test of time.",
  },
  {
    title: "Web Design & Dev",
    description:
      "Custom websites designed to convert visitors into loyal customers.",
  },
  {
    title: "Social Media",
    description:
      "Strategic social management that builds community and drives reach.",
  },
  {
    title: "Digital Strategy",
    description:
      "Data-driven strategies that amplify your brand and maximize ROI.",
  },
] as const;

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
  { value: "1:1", label: "Work Direct with the Founder", href: undefined },
  { value: "6–12", label: "Weeks to Launch", href: undefined },
  { value: String(FOUNDING_SPOTS_OPEN), label: "Founding Client Spots Open", href: "/founding" },
] as const;

/* ============================================================
   COMPONENT: Homepage
   ============================================================ */
export default async function Home() {
  const cmsServices = await getPublishedServices(4);
  const services =
    cmsServices.length > 0
      ? cmsServices.map((service) => ({
          title: service.name,
          description:
            service.short_description ||
            service.description ||
            "Custom service delivery aligned to your business goals.",
        }))
      : fallbackServices;

  const spark = websitePackages.find((pkg) => pkg.slug === "spark");
  const review = GOOGLE_REVIEWS[0];

  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Hero copy is static (no FadeIn) so the headline — the page's LCP
              element — paints immediately instead of after hydration. */}
          <div className="lg:col-span-7">
            {/* Eyebrow + availability badge */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="eyebrow">Creative Agency — Ohio</span>
              <span className="glass-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-accent-deep">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(196,130,26,0.2)]" />
                Booking New Projects
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.95] tracking-[-0.035em]">
              <span className="block text-2xl sm:text-3xl font-medium tracking-normal text-muted mb-5">
                Foundry Frame
                <span className="sr-only">:</span>
              </span>
              Ohio Web Design & Branding Agency
            </h1>

            <p className="mt-8 max-w-xl text-body text-lg leading-relaxed">
              Foundry Frame builds custom websites, brand systems, and digital
              strategy for small businesses and growth-focused brands across Ohio
              and beyond. Friendly, founder-led, and focused on results you can
              measure.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <Link href="/audit" className="btn btn-primary min-h-13 px-7">
                Get a Free Website Audit
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link href="/packages" className="btn btn-glass min-h-13 px-7">
                See Our Packages
              </Link>
            </div>
          </div>

          {/* Floating bubbles */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {spark && (
              <Link
                href={`/packages/website/${spark.slug}`}
                className="glass-card rounded-card p-7 self-end w-full max-w-sm"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.14em] text-muted">Entry-Level Package</span>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink">
                    {spark.badge}
                  </span>
                </span>
                <span className="block mt-4 font-heading font-bold text-3xl tracking-tight text-ink">
                  {spark.name}
                </span>
                <span className="block mt-1 text-sm text-muted">
                  {spark.headline} &middot; {spark.pricePrefix?.toLowerCase()}{" "}
                  <span className="font-semibold text-ink">{spark.price}</span>
                </span>
                <span className="mt-5 flex flex-col gap-2.5">
                  {spark.features.slice(0, 3).map((feature) => (
                    <span key={feature.title} className="flex gap-2.5 text-sm text-ink-soft">
                      <span aria-hidden="true" className="font-bold text-accent-ink">&#10003;</span>
                      {feature.title}
                    </span>
                  ))}
                </span>
                <span className="mt-5 inline-flex text-sm font-semibold text-accent-deep">
                  See what&apos;s included &rarr;
                </span>
              </Link>
            )}
            <div className="flex flex-wrap items-center gap-5">
              <div className="glass shrink-0 w-32 h-32 rounded-full flex flex-col items-center justify-center text-center">
                <span className="font-heading font-bold text-3xl tracking-tight text-ink">6–12</span>
                <span className="text-xs text-muted">weeks to launch</span>
              </div>
              {review && (
                <figure className="glass rounded-card p-6 flex-1 min-w-[14rem] max-w-sm">
                  <p
                    className="text-accent tracking-[0.15em]"
                    role="img"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}
                  </p>
                  <blockquote className="mt-2 text-[15px] leading-relaxed text-ink">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2 text-xs text-muted">
                    {review.author} &middot; Google review
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          STATS
          ============================================= */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                {stat.href ? (
                  <Link href={stat.href} className="glass-accent block h-full rounded-card p-7 lg:p-8">
                    <span className="block text-5xl font-heading font-bold tracking-tight text-ink">
                      {stat.value}
                    </span>
                    <span className="block mt-2 text-sm font-semibold text-accent-deep">
                      {stat.label} &rarr;
                    </span>
                  </Link>
                ) : (
                  <div className="glass h-full rounded-card p-7 lg:p-8">
                    <div className="text-5xl font-heading font-bold tracking-tight text-ink">{stat.value}</div>
                    <div className="mt-2 text-sm text-muted">{stat.label}</div>
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* =============================================
          SERVICES
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Header */}
          <FadeIn className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow">Services</span>
              <h2 className="mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-[-0.03em] leading-none text-ink">
                Web Design, Branding & Digital Strategy
              </h2>
            </div>
            <Link href="/services" className="btn btn-glass shrink-0">
              All Services &rarr;
            </Link>
          </FadeIn>

          {/* Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <StaggerItem key={service.title} className="glass rounded-card p-8">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/80 text-sm font-semibold text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-ink font-heading font-semibold text-xl">
                  {service.title}
                </h3>
                <p className="mt-2 text-body text-[15px] leading-relaxed">
                  {service.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* =============================================
          WEBSITE PACKAGES
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn className="mb-12">
            <span className="eyebrow">Website Packages</span>
            <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-[-0.03em] leading-none text-ink">
              Custom websites, built for results
            </h2>
            <p className="mt-4 max-w-xl text-body text-lg leading-relaxed">
              Every site is designed from scratch and hand-coded. No templates, no shortcuts.
            </p>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {websitePackages.map((pkg) => {
              // The Spark, our entry-level package, is the one we point people to first.
              const featured = pkg.slug === "spark";
              return (
                <StaggerItem
                  key={pkg.slug}
                  className={`${featured ? "glass-dark" : "glass"} rounded-card p-8 flex flex-col`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-xs uppercase tracking-[0.14em] ${featured ? "text-white/70" : "text-muted"}`}>
                      Tier {pkg.tier}
                    </span>
                    {pkg.badge && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          featured ? "bg-accent text-ink" : "border border-ink/20 text-ink-soft"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <h3 className={`mt-4 font-heading font-bold text-2xl tracking-tight ${featured ? "text-white" : "text-ink"}`}>
                    {pkg.name}
                  </h3>
                  <p className={`mt-4 text-sm ${featured ? "text-white/70" : "text-muted"}`}>
                    {pkg.pricePrefix ?? "Scoped in discovery"}
                  </p>
                  <p className={`font-heading font-bold text-4xl tracking-tight ${featured ? "text-white" : "text-ink"}`}>
                    {pkg.price}
                  </p>
                  <ul className="mt-5 mb-8 flex flex-col gap-2.5">
                    {pkg.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature.title}
                        className={`flex gap-2.5 text-sm ${featured ? "text-white/85" : "text-ink-soft"}`}
                      >
                        <span aria-hidden="true" className={`font-bold ${featured ? "text-accent" : "text-accent-ink"}`}>
                          &#10003;
                        </span>
                        {feature.title}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/packages/website/${pkg.slug}`}
                    className={`btn mt-auto ${featured ? "btn-accent" : "btn-glass"}`}
                  >
                    Full details <span className="sr-only">on {pkg.name}</span> &rarr;
                  </Link>
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
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <span className="eyebrow">Industries We Serve</span>
          </FadeIn>
          <div className="mt-8 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="glass rounded-full px-6 py-3.5 font-heading font-semibold text-lg sm:text-2xl tracking-tight text-ink"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          AUDIT LEAD CAPTURE
          ============================================= */}
      <section id="audit" className="py-16 lg:py-24 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="glass glow-field rounded-panel overflow-hidden p-8 sm:p-12 lg:p-16">
            <FadeIn className="max-w-2xl mb-10">
              <span className="eyebrow">Free Website Audit</span>
              <h2 className="mt-5 text-4xl sm:text-5xl font-heading font-bold tracking-[-0.03em] text-ink mb-4">
                Is your website losing you clients?
              </h2>
              <p className="text-body text-base leading-relaxed">
                Enter your URL and get a free website audit in about a minute —
                your SEO, speed, design, and accessibility scores, plus a
                prioritized fix list. No pitch, no obligation.{" "}
                <Link
                  href="/audit"
                  className="text-ink font-semibold underline underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors"
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
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn className="glass-dark rounded-panel p-8 sm:p-12 lg:p-16">
            <span className="text-xs uppercase tracking-[0.14em] text-white/70">Start a Project</span>
            <h2 className="mt-5 max-w-3xl text-4xl sm:text-6xl font-heading font-bold tracking-[-0.03em] leading-[0.95] text-white">
              Let&apos;s build your next client-winning website.
            </h2>
            <p className="mt-6 text-accent-glow text-xs uppercase tracking-[0.14em] font-semibold">
              We take on a limited number of projects each quarter
            </p>
            <p className="mt-4 text-white/80 text-base leading-relaxed max-w-lg">
              Custom websites starting at $1,500. No templates, no fluff — built
              to turn visitors into paying clients and delivered in 6–12 weeks.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
                className="btn btn-accent"
              >
                Book a Free Discovery Call
              </Link>
              <Link
                href="/contact"
                className="btn border border-white/25 text-white hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
