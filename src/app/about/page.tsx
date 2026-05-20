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
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Foundry Frame",
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
        url: "/james-latten.jpg",
        width: 1200,
        height: 630,
        alt: "Foundry Frame team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Foundry Frame",
    description:
      "Meet the Ohio team behind custom websites, branding, and creative strategy for growth-focused businesses.",
    images: ["/james-latten.jpg"],
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
    description:
      "We obsess over every detail to ensure world-class results.",
  },
] as const;

/* ============================================================
   DATA: Team
   ============================================================ */
const team = [
  {
    name: "James Latten",
    role: "Founder & Creative Director",
    image: "/james-latten.jpg",
  },

] as const;

/* ============================================================
   DATA: Timeline
   ============================================================ */
const timeline = [
  { year: "2026", event: "Foundry Frame established in Ohio." },
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
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Foundry Frame team"
            fill
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">
            About Us
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            The people behind the work
          </h1>
        </div>
      </section>

      {/* =============================================
          FOUNDER BIO
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src="/james-latten.jpg"
                alt="James Latten, Founder of Foundry Frame"
                fill
                className="object-cover grayscale"
              />
            </div>

            {/* Copy */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
                The Founder
              </p>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white leading-tight mb-8">
                Hi, I&apos;m James.
              </h2>
              <div className="space-y-5 text-gray-400 text-sm leading-relaxed">
                <p>
                  I&apos;m a software engineer and designer from Lorain, Ohio.
                  I built Foundry Frame in 2026 after years of watching great
                  small businesses lose clients to websites that looked like
                  they were made in 2009 — or worse, by someone who clearly
                  didn&apos;t care.
                </p>
                <p>
                  My background sits at the intersection of technical
                  engineering and visual design. I write the code, I design
                  the layouts, and I think hard about conversion — what makes
                  someone trust a business enough to reach out. That
                  combination is rare, and it&apos;s the thing I&apos;m most
                  proud to bring to every project.
                </p>
                <p>
                  Foundry Frame is deliberately small. I take on a limited
                  number of projects each quarter so every client gets direct
                  access to me — not a junior account manager. If you&apos;re
                  investing $1,500 to $15,000+ in your website, you deserve
                  to work with the person who&apos;s actually building it.
                </p>
                <p>
                  I&apos;m results-focused above everything else. A site that
                  wins awards but doesn&apos;t bring in clients is a failed
                  site. Every decision I make — design, copy, structure — is
                  in service of one goal: turning your visitors into paying
                  customers.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                >
                  Work With James
                </a>
                <a
                  href="https://www.linkedin.com/company/foundry-frame/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-500 pb-0.5 hover:text-white hover:border-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          VALUES
          ============================================= */}
      <section className="py-24 lg:py-32 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
            Core Values
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-16">
            What drives us
          </h2>

          <div className="border-t border-white/10">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-white/10"
              >
                <div className="md:col-span-1 text-gray-500 text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-4 text-white font-heading font-semibold text-lg">
                  {value.title}
                </h3>
                <p className="md:col-span-7 text-gray-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          TIMELINE
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
            Milestones
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-16">
            Our journey
          </h2>

          <div className="border-t border-white/10">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-white/10"
              >
                <div className="md:col-span-2 text-white font-heading font-bold text-xl">
                  {item.year}
                </div>
                <p className="md:col-span-10 text-gray-400 text-sm">
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          TEAM
          ============================================= */}
      <section className="py-24 lg:py-32 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
            The Team
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-16">
            Meet the crew
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {team.map((member) => (
              <div key={member.name} className="bg-gray-900">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-heading font-semibold text-base">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[0.95] mb-4">
              Want to work together?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg">
              James takes on a limited number of projects each quarter.
              If you&apos;re serious about growing your business, let&apos;s
              talk before the next slot fills.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://calendly.com/jlatten-foundryframe/30min"
                className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Book a Free Discovery Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
