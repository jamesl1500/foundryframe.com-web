/**
 * Individual Case Study Page - Foundry Frame
 * ============================================
 * Flat, minimal case study layout. Grayscale hero,
 * clean data rows, image gallery grid.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ============================================================
   DATA: Case studies
   ============================================================ */
const caseStudies: Record<
  string,
  {
    title: string;
    category: string;
    heroImage: string;
    overview: string;
    challenge: string;
    solution: string;
    results: { metric: string; value: string }[];
    services: string[];
    gallery: string[];
  }
> = {
  "apex-athletics": {
    title: "Apex Athletics",
    category: "Branding & Web",
    heroImage:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
    overview:
      "Apex Athletics needed a complete brand overhaul to match their premium positioning in the competitive fitness market. We delivered a bold new identity system and a high-converting website.",
    challenge:
      "Apex's existing brand felt outdated and didn't reflect the energy and ambition of their community. Their website was slow, clunky, and not converting visitors into members.",
    solution:
      "We developed a sharp, energetic brand identity centered on bold typography and a striking monochrome palette with electric accents. The new website was built for speed, with clear conversion paths and immersive imagery.",
    results: [
      { metric: "Membership Growth", value: "+200%" },
      { metric: "Website Speed", value: "2x faster" },
      { metric: "Bounce Rate", value: "-45%" },
      { metric: "Social Following", value: "+150%" },
    ],
    services: ["Brand Identity", "Web Design", "Photography", "Social Media"],
    gallery: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    ],
  },
  "bloom-botanicals": {
    title: "Bloom Botanicals",
    category: "Photography & Identity",
    heroImage:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80",
    overview:
      "Bloom Botanicals is a premium plant and floral studio. We created a refined visual identity and product photography system that elevated their brand.",
    challenge:
      "Bloom's beautiful products weren't being represented well online. Their branding lacked cohesion and their product photography was inconsistent.",
    solution:
      "We developed an elegant, nature-inspired brand identity with a clean typographic system. Our photography direction created a consistent visual language across all channels.",
    results: [
      { metric: "Online Sales", value: "+180%" },
      { metric: "Instagram Growth", value: "+300%" },
      { metric: "Avg Order Value", value: "+25%" },
      { metric: "Brand Recognition", value: "3x" },
    ],
    services: ["Brand Identity", "Photography", "Packaging", "Social Media"],
    gallery: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    ],
  },
  "verdant-spaces": {
    title: "Verdant Spaces",
    category: "Web & Strategy",
    heroImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    overview:
      "Verdant Spaces is a commercial interior design firm. We redesigned their digital presence and developed a content strategy that positions them as industry leaders.",
    challenge:
      "Their website didn't reflect the caliber of their work. They needed a digital presence that matched the sophistication of their physical spaces.",
    solution:
      "We built an immersive portfolio website with full-bleed imagery and a content strategy centered on thought leadership.",
    results: [
      { metric: "Lead Generation", value: "+250%" },
      { metric: "Time on Site", value: "+180%" },
      { metric: "Portfolio Views", value: "+400%" },
      { metric: "Qualified Leads", value: "+120%" },
    ],
    services: ["Web Design", "Digital Strategy", "Content", "SEO"],
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      "https://images.unsplash.com/photo-1505409859467-3a796fd5798e?w=800&q=80",
    ],
  },
  "iron-and-oak": {
    title: "Iron & Oak",
    category: "Video & Branding",
    heroImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920&q=80",
    overview:
      "Iron & Oak is a handcrafted furniture studio. We produced a cinematic brand film and developed a visual identity that honors their craftsmanship.",
    challenge:
      "Iron & Oak's story of meticulous craftsmanship wasn't being told. Their online presence didn't convey the quality and care that goes into every piece.",
    solution:
      "We produced a 90-second brand film showcasing their process from raw material to finished piece, paired with a refined brand identity system.",
    results: [
      { metric: "Video Views", value: "500K+" },
      { metric: "Custom Orders", value: "+300%" },
      { metric: "Press Features", value: "12" },
      { metric: "Revenue Growth", value: "+175%" },
    ],
    services: ["Videography", "Brand Identity", "Photography", "Web Design"],
    gallery: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    ],
  },
  "pulse-fitness": {
    title: "Pulse Fitness",
    category: "Social Media & Photography",
    heroImage:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80",
    overview:
      "Pulse Fitness is a boutique gym chain. We built their social media presence from scratch and created a library of aspirational fitness photography.",
    challenge:
      "Pulse had zero social media presence and no professional visual content. They needed to establish credibility and attract members.",
    solution:
      "We developed a content strategy, produced a full photography library, and managed their social channels for the first six months.",
    results: [
      { metric: "Followers", value: "25K+" },
      { metric: "Engagement Rate", value: "8.5%" },
      { metric: "New Members", value: "+150%" },
      { metric: "Content Pieces", value: "200+" },
    ],
    services: ["Social Media", "Photography", "Content Strategy"],
    gallery: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    ],
  },
  "metro-eats": {
    title: "Metro Eats",
    category: "Branding & Advertising",
    heroImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
    overview:
      "Metro Eats is a multi-location restaurant group. We rebranded their flagship location and launched a city-wide advertising campaign.",
    challenge:
      "Metro Eats was losing market share to trendier competitors. Their brand felt dated and their marketing was unfocused.",
    solution:
      "We created a bold, contemporary rebrand and launched a multi-channel advertising campaign targeting urban professionals.",
    results: [
      { metric: "Foot Traffic", value: "+85%" },
      { metric: "Ad ROI", value: "6.2x" },
      { metric: "Brand Awareness", value: "+200%" },
      { metric: "Revenue", value: "+120%" },
    ],
    services: ["Brand Identity", "Advertising", "Photography", "Graphic Design"],
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    ],
  },
  "summit-realty": {
    title: "Summit Realty",
    category: "Web & Photography",
    heroImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    overview:
      "Summit Realty is a luxury real estate firm. We designed a property-focused website and produced an extensive library of architectural photography.",
    challenge:
      "Summit's listings weren't getting the attention they deserved. Their website was template-based and their photography was amateur.",
    solution:
      "We built a custom website with immersive property pages and produced professional architectural photography for their top listings.",
    results: [
      { metric: "Listing Views", value: "+350%" },
      { metric: "Inquiry Rate", value: "+200%" },
      { metric: "Avg Days on Market", value: "-40%" },
      { metric: "Client Satisfaction", value: "100%" },
    ],
    services: ["Web Design", "Photography", "SEO", "Content"],
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
  },
  "craft-collective": {
    title: "Craft Collective",
    category: "Full Brand Package",
    heroImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80",
    overview:
      "Craft Collective is a co-working space for creative professionals. We delivered a complete brand package from identity to web to environmental design.",
    challenge:
      "Craft Collective was launching a new concept and needed a brand that would attract creative professionals — designers, photographers, developers.",
    solution:
      "We created an identity that balances professionalism with creative energy, built a conversion-focused website, and designed their physical space signage.",
    results: [
      { metric: "Pre-Launch Signups", value: "500+" },
      { metric: "Occupancy (Month 1)", value: "85%" },
      { metric: "Press Coverage", value: "8 features" },
      { metric: "Member Satisfaction", value: "4.9/5" },
    ],
    services: ["Brand Identity", "Web Design", "Graphic Design", "Photography", "Environmental Design"],
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80",
    ],
  },
};

/* ============================================================
   METADATA
   ============================================================ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) return { title: "Not Found" };

  return {
    title: study.title,
    description: study.overview,
  };
}

/* ============================================================
   STATIC PARAMS
   ============================================================ */
export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

/* ============================================================
   COMPONENT: Case Study Page
   ============================================================ */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies[slug];

  if (!study) notFound();

  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0">
          <Image
            src={study.heroImage}
            alt={study.title}
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider hover:text-white transition-colors mb-8"
          >
            &larr; All Projects
          </Link>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
            {study.category}
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight">
            {study.title}
          </h1>
        </div>
      </section>

      {/* =============================================
          OVERVIEW
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                Overview
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {study.overview}
              </p>
            </div>
            <div>
              {/* Services */}
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                Services
              </p>
              <div className="flex flex-wrap gap-2">
                {study.services.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 border border-white/20 text-gray-400 text-xs uppercase tracking-wider"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          CHALLENGE & SOLUTION
          ============================================= */}
      <section className="py-24 lg:py-32 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                The Challenge
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {study.challenge}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                Our Solution
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {study.solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          RESULTS
          ============================================= */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-12">
            Results
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
            {study.results.map((r) => (
              <div key={r.metric} className="bg-white p-8 text-center">
                <div className="text-4xl sm:text-5xl font-heading font-bold text-black mb-2">
                  {r.value}
                </div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">
                  {r.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          GALLERY
          ============================================= */}
      <section className="bg-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {study.gallery.map((img, i) => (
            <div key={i} className="aspect-[4/3] relative overflow-hidden bg-black">
              <Image
                src={img}
                alt={`${study.title} gallery ${i + 1}`}
                fill
                className="object-cover grayscale"
              />
            </div>
          ))}
        </div>
      </section>

      {/* =============================================
          BACK
          ============================================= */}
      <section className="py-16 bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/case-studies"
            className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
          >
            &larr; All Projects
          </Link>
        </div>
      </section>
    </>
  );
}
