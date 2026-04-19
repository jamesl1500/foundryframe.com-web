/**
 * Case Studies Page - Foundry Frame
 * ===================================
 * Flat grid layout for project showcase.
 * Grayscale images, hover to color. Minimal.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Explore Foundry Frame's portfolio of creative projects across branding, web design, photography, and more.",
};

/* ============================================================
   DATA: Projects
   ============================================================ */
const projects = [
  {
    slug: "apex-athletics",
    title: "Apex Athletics",
    category: "Branding & Web",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  },
  {
    slug: "bloom-botanicals",
    title: "Bloom Botanicals",
    category: "Photography & Identity",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
  },
  {
    slug: "verdant-spaces",
    title: "Verdant Spaces",
    category: "Web & Strategy",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    slug: "iron-and-oak",
    title: "Iron & Oak",
    category: "Video & Branding",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
  },
  {
    slug: "pulse-fitness",
    title: "Pulse Fitness",
    category: "Social Media & Photography",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
  },
  {
    slug: "metro-eats",
    title: "Metro Eats",
    category: "Branding & Advertising",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  {
    slug: "summit-realty",
    title: "Summit Realty",
    category: "Web & Photography",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    slug: "craft-collective",
    title: "Craft Collective",
    category: "Full Brand Package",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
  },
] as const;

/* ============================================================
   COMPONENT: Case Studies Page
   ============================================================ */
export default function CaseStudiesPage() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            Work
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Selected projects
          </h1>
        </div>
      </section>

      {/* =============================================
          PROJECTS GRID
          ============================================= */}
      <section className="bg-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {projects.map((project) => (
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
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    {project.category}
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-heading font-bold text-white">
                    {project.title}
                  </h2>
                </div>
              </Link>
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
              Like what you see?
            </h2>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
