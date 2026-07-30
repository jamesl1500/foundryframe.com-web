/**
 * Homepage - Foundry Frame
 * =========================
 * Flat, brutalist-minimal landing page. Large typography,
 * thin rule dividers, B&W with sparse red accent.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AuditForm from "@/components/AuditForm";
import { getHomepageTestimonials, getPublishedServices } from "@/lib/cms/public-data";

export const metadata: Metadata = {
  title: "Ohio Web Design Agency | Foundry Frame",
  description:
    "Foundry Frame is an Ohio web design agency in Lorain building custom, conversion-focused websites for small businesses and growth brands.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ohio Web Design Agency | Foundry Frame",
    description:
      "Custom websites from $1,500 built to convert. No templates. Launch in 6-12 weeks.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame | Creative Design Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ohio Web Design Agency | Foundry Frame",
    description:
      "Custom websites from $1,500 built to convert. No templates. Launch in 6-12 weeks.",
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
  { value: "2026", label: "Launched" },
  { value: "2 Left", label: "Q3 Project Slots" },
  { value: "8", label: "Projects Completed" },
  { value: "100%", label: "On-Time Delivery" },
] as const;

/* ============================================================
   DATA: Testimonials
   ============================================================ */
const fallbackTestimonials = [
  {
    quote:
      "Professional, fast, and genuinely invested in our success. Delivered on time and the site looks incredible.",
    name: "Marcus T.",
    title: "Founder, Apex Athletics",
  },
  {
    quote:
      "Best investment we made this year. Clean design, works perfectly on mobile, and our bounce rate dropped significantly.",
    name: "Lisa R.",
    title: "Director, Verdant Spaces",
  },
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

  const cmsTestimonials = await getHomepageTestimonials(3);
  const testimonials =
    cmsTestimonials.length > 0
      ? cmsTestimonials
      : fallbackTestimonials.map((item) => ({
          ...item,
          featured: false,
        }));

  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="relative min-h-screen flex items-end pb-20 pt-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/stock/case-verdant-spaces.jpg"
            alt="Creative workspace"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          {/* Eyebrow + availability badge */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Creative Agency — Ohio
            </p>
            <span className="text-xs uppercase tracking-[0.15em] font-bold bg-white text-black px-3 py-1">
              2 Q3 Slots Remaining
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-heading font-bold text-white leading-[0.9] tracking-tight mb-10">
            Ohio Web Design
            <br />
            & Branding Agency
          </h1>

          {/* Sub */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 border-t border-white/20 pt-8">
            <p className="max-w-md text-gray-400 text-sm leading-relaxed">
              Foundry Frame builds custom websites, brand systems, and digital
              strategy for small businesses and growth-focused brands across
              Ohio and beyond.
            </p>
            <div className="flex gap-4">
              <a
                href="#audit"
                className="px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Get a Free Website Audit
              </a>
              <Link
                href="/packages"
                className="px-6 py-3 border border-white/30 text-white text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                See Our Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          SERVICES
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                Services
              </p>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white">
                Web Design, Branding & Digital Strategy
              </h2>
            </div>
            <Link
              href="/services"
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-white border-b border-gray-400 hover:border-white pb-1 transition-colors"
            >
              All Services
            </Link>
          </div>

          {/* Grid */}
          <div className="border-t border-white/10">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-white/10"
              >
                <div className="md:col-span-1 text-gray-500 text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-4 text-white font-heading font-semibold text-lg">
                  {service.title}
                </h3>
                <p className="md:col-span-7 text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          TESTIMONIALS
          ============================================= */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
              Client Results
            </p>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-black">
              What Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-black p-8 lg:p-10 flex flex-col gap-6"
              >
                <p className="text-white text-base leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-white text-sm font-bold">{t.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Start Your Project
            </Link>
          </div>{" "}
        </div>
      </section>

      {/* =============================================
          INDUSTRIES MARQUEE
          ============================================= */}
      <section className="py-16 bg-black border-y border-white/10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Industries We Serve
          </p>
        </div>
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...industries, ...industries].map((industry, i) => (
            <span
              key={`${industry}-${i}`}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white hover:text-white/20 transition-colors cursor-default"
            >
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* =============================================
          STATS
          ============================================= */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-8 lg:p-12 text-center"
              >
                <div className="text-5xl sm:text-6xl font-heading font-bold text-black mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          AUDIT LEAD CAPTURE
          ============================================= */}
      <section
        id="audit"
        className="py-24 lg:py-32 bg-black border-t border-white/10"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
              Free Offer
            </p>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
              Is your website losing you clients?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enter your URL and email — we&apos;ll review your site against 5
              key conversion factors and send you a personalised audit within 24
              hours. No pitch, no obligation.
            </p>
          </div>
          <AuditForm />
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32 bg-white border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
              Start a Project
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-black leading-[0.95] mb-4">
              Let&apos;s build your next client-winning website.
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-8 font-bold">
              2 project slots remaining for Q3 2026
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-lg">
              Custom websites from $1,500. No templates. No fluff. Built to
              convert visitors into paying clients — delivered in 6–12 weeks.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://calendly.com/jlatten-foundryframe/30min"
                className="px-8 py-4 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Book a Free Discovery Call
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-black/20 text-black font-bold text-sm uppercase tracking-wider hover:bg-black/5 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
