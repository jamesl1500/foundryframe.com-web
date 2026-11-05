/**
 * About Us Page - Foundry Frame
 * ==============================
 * Flat, minimal about page. Large type, rule dividers,
 * B&W team photos, sparse layout.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import AuditCallout from "@/components/AuditCallout";
import Image from "next/image";
import Link from "next/link";
import SparkSpotlight from "@/components/SparkSpotlight";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "About Foundry Frame | Ohio Web Design Agency",
  description:
    "Learn about Foundry Frame, an Ohio web design and creative agency in Lorain focused on custom websites, branding, and growth strategy.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Foundry Frame",
    description:
      "Meet the Ohio team behind custom websites, branding, and creative strategy for growth-focused businesses.",
    url: "/about",
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
    title: "About Foundry Frame",
    description:
      "Meet the Ohio team behind custom websites, branding, and creative strategy for growth-focused businesses.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Values
   ============================================================ */
const values = [
  {
    title: "Creative Excellence",
    description:
      "We push boundaries to deliver work that inspires and stands apart.",
  },
  {
    title: "Strategic Thinking",
    description:
      "Every creative decision is grounded in strategy. We make things work.",
  },
  {
    title: "Authentic Partnership",
    description:
      "Your vision drives our process. Transparency is non-negotiable.",
  },
  {
    title: "Relentless Quality",
    description: "We obsess over every detail to ensure world-class results.",
  },
] as const;

/* ============================================================
   COMPONENT: About Page
   ============================================================ */
export default function AboutPage() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0">
          <Image
            src="/images/stock/about-team.jpg"
            alt="Foundry Frame team"
            fill
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-canvas/80" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn className="glass rounded-card max-w-3xl p-6 sm:p-8">
            <p className="eyebrow mb-6">
              About Us
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-ink leading-[0.9] tracking-tight">
              Ohio web design & branding agency
            </h1>
            <p className="text-ink-soft text-sm leading-relaxed max-w-2xl mt-6">
              We build thoughtful websites and brand systems for small
              businesses, founders, and growth-focused teams in Ohio and across
              the U.S. — and we&apos;re genuinely glad you&apos;re here.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* =============================================
          FOUNDER BIO
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <FadeIn
              direction="right"
              className="aspect-[4/5] relative overflow-hidden rounded-panel glass p-0"
            >
              <Image
                src="/james-latten.jpg"
                alt="James Latten, Founder of Foundry Frame"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </FadeIn>

            {/* Copy */}
            <div>
              <p className="eyebrow mb-6">
                The Founder
              </p>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink leading-tight mb-8">
                Hi, I&apos;m James.
              </h2>
              <div className="space-y-5 text-body text-sm leading-relaxed">
                <p>
                  I&apos;m a software engineer and designer from Lorain, Ohio. I
                  built Foundry Frame in 2026 after years of watching great
                  small businesses lose clients to websites that didn&apos;t do
                  them justice — slow, dated, or clearly built without much
                  care. Good businesses deserve better, and it&apos;s more
                  achievable than most owners think.
                </p>
                <p>
                  My background sits at the intersection of technical
                  engineering and visual design. I write the code, I design the
                  layouts, and I think hard about conversion — what makes
                  someone trust a business enough to reach out. That combination
                  is rare, and it&apos;s the thing I&apos;m most proud to bring
                  to every project.
                </p>
                <p>
                  Foundry Frame is deliberately small. I take on a limited
                  number of projects each quarter so every client gets direct
                  access to me — not a junior account manager. When you invest
                  in your website, you deserve to work with the person
                  who&apos;s actually building it.
                </p>
                <p>
                  I&apos;m results-focused above everything else. A site that
                  wins awards but doesn&apos;t bring in clients is a failed
                  site. Every decision I make — design, copy, structure — is in
                  service of one goal: turning your visitors into paying
                  customers.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <a
                  href="/contact"
                  className="btn btn-primary"
                >
                  Work With James
                </a>
                <a
                  href="https://www.linkedin.com/company/foundry-frame/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass min-h-10 px-5 text-sm"
                >
                  LinkedIn
                </a>
                <a
                  href="https://x.com/FoundryFrame"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass min-h-10 px-5 text-sm"
                >
                  X
                </a>
                <a
                  href="https://www.facebook.com/foundry.frame"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass min-h-10 px-5 text-sm"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          VALUES
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <p className="eyebrow mb-4">
              Core Values
            </p>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-16">
              What drives us
            </h2>
          </FadeIn>

          <StaggerContainer className="border-t border-ink/10">
            {values.map((value, i) => (
              <StaggerItem
                key={value.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-ink/10"
              >
                <div className="md:col-span-1 text-muted text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-4 text-ink font-heading font-semibold text-lg">
                  {value.title}
                </h3>
                <p className="md:col-span-7 text-muted text-sm leading-relaxed">
                  {value.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* =============================================

          THE SPARK

          ============================================= */}

      <SparkSpotlight heading="Work with us, starting with The Spark" />


      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-4">
              Want to work together?
            </h2>
            <p className="text-body text-sm leading-relaxed mb-10 max-w-lg">
              James takes on a limited number of projects each quarter. If
              you&apos;re serious about growing your business, let&apos;s talk
              before the next slot fills.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
                className="btn btn-primary"
              >
                Book a Free Discovery Call
              </Link>
            </div>
          </div>
        </div>
      </section>
      <AuditCallout />
    </>
  );
}
