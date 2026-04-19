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
  title: "About Us",
  description:
    "Learn about Foundry Frame — a creative design agency founded in 2026 in Ohio.",
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
          STORY
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Our studio"
                fill
                className="object-cover grayscale"
              />
            </div>

            {/* Copy */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
                Our Story
              </p>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white leading-tight mb-8">
                Built on passion, driven by craft
              </h2>
              <div className="space-y-5 text-gray-400 text-sm leading-relaxed">
                <p>
                  Foundry Frame was born in 2026 from a simple belief: every
                  brand deserves a creative partner that cares as deeply about
                  their success as they do. Based in Ohio, we combine
                  strategic thinking with bold creative execution.
                </p>
                <p>
                  We&apos;re not a factory. We&apos;re a workshop. Every project
                  gets the focused attention it deserves. From startups finding
                  their voice to established brands ready for reinvention, we
                  approach each collaboration with fresh eyes and relentless
                  dedication.
                </p>
                <p>
                  Our work spans branding, web design, photography, videography,
                  and digital strategy — but our real product is the
                  transformation our clients experience.
                </p>
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
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[0.95] mb-8">
              Want to work together?
            </h2>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
