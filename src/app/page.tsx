/**
 * Homepage - Foundry Frame
 * =========================
 * Flat, brutalist-minimal landing page. Large typography,
 * thin rule dividers, B&W with sparse red accent.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Image from "next/image";
import Link from "next/link";

/* ============================================================
   DATA: Services
   ============================================================ */
const services = [
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
   DATA: Featured projects
   ============================================================ */
const featuredProjects = [
  {
    title: "Apex Athletics",
    category: "Branding & Web",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    slug: "apex-athletics",
  },
  {
    title: "Bloom Botanicals",
    category: "Photography & Identity",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
    slug: "bloom-botanicals",
  },
  {
    title: "Verdant Spaces",
    category: "Web & Strategy",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    slug: "verdant-spaces",
  },
  {
    title: "Iron & Oak",
    category: "Video & Branding",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    slug: "iron-and-oak",
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
  { value: "Open", label: "For projects" },
  { value: "1", label: "Team Member" },
  { value: "100%", label: "Retention" },
] as const;

/* ============================================================
   COMPONENT: Homepage
   ============================================================ */
export default function Home() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="relative min-h-screen flex items-end pb-20 pt-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Creative workspace"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          {/* Eyebrow */}
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">
            Creative Agency — Ohio
          </p>

          {/* Heading */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-heading font-bold text-white leading-[0.9] tracking-tight mb-10">
            We Forge
            <br />
            Bold Brands
          </h1>

          {/* Sub */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 border-t border-white/20 pt-8">
            <p className="max-w-md text-gray-400 text-sm leading-relaxed">
              Foundry Frame crafts unforgettable brand experiences through
              design, photography, video, and digital strategy.
            </p>
            <div className="flex gap-4">
              <Link
                href="/services"
                className="px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                View Services
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border border-white/30 text-white text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Contact
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
                What We Do
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
          FEATURED WORK
          ============================================= */}
      <section className="py-24 lg:py-32 bg-gray-900 hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                Selected Work
              </p>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-white border-b border-gray-400 hover:border-white pb-1 transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/case-studies/${project.slug}`}
                className="group relative aspect-[4/3] overflow-hidden bg-black"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    {project.category}
                  </p>
                  <h3 className="text-2xl font-heading font-bold text-white">
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
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
              <div key={stat.label} className="bg-white p-8 lg:p-12 text-center">
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
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
              Start a Project
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-[0.95] mb-8">
              Ready to build something extraordinary?
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-lg">
              Let&apos;s collaborate to create a brand experience that
              captivates your audience and drives real results.
            </p>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/packages"
                className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
