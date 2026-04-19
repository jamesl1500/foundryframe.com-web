/**
 * Services Page - Foundry Frame
 * ===============================
 * Flat, minimal services layout. Numbered rows
 * with thin border dividers, B&W imagery.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Foundry Frame's creative services: branding, web design, photography, videography, social media, graphic design, advertising, and digital strategy.",
};

/* ============================================================
   DATA: Services
   ============================================================ */
const services = [
  {
    id: "branding",
    title: "Branding & Identity",
    subtitle: "Define who you are.",
    description:
      "Your brand is more than a logo — it's the feeling people get when they interact with your business. We develop comprehensive identities that communicate your values and create lasting connections.",
    deliverables: [
      "Logo Design & Brand Mark",
      "Brand Strategy & Positioning",
      "Visual Identity System",
      "Brand Guidelines",
      "Typography & Color Palette",
      "Stationery & Collateral",
    ],
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  },
  {
    id: "web-design",
    title: "Web Design & Development",
    subtitle: "Your digital storefront.",
    description:
      "We design and build websites that convert. From responsive design to seamless UX, every pixel is intentional, every interaction purposeful.",
    deliverables: [
      "Custom Website Design",
      "Responsive Development",
      "E-Commerce Solutions",
      "CMS Integration",
      "SEO Optimization",
      "Performance Tuning",
    ],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: "social-media",
    title: "Social Media",
    subtitle: "Build your community.",
    description:
      "Strategic social media management that builds community and drives reach. We handle the content, strategy, and engagement so you can focus on your business.",
    deliverables: [
      "Content Strategy",
      "Content Creation",
      "Community Management",
      "Paid Social Campaigns",
      "Analytics & Reporting",
      "Influencer Partnerships",
    ],
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    subtitle: "Visual impact.",
    description:
      "Compelling visual assets that strengthen your brand across every touchpoint. Print, digital, environmental — we design it all.",
    deliverables: [
      "Marketing Collateral",
      "Packaging Design",
      "Print Design",
      "Presentation Design",
      "Signage & Environmental",
      "Digital Assets",
    ],
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  },
  {
    id: "advertising",
    title: "Advertising",
    subtitle: "Reach the right people.",
    description:
      "Strategic advertising that puts your brand in front of the right audience. We combine creative excellence with data-driven targeting.",
    deliverables: [
      "Campaign Strategy",
      "Ad Creative & Copywriting",
      "PPC & Search Ads",
      "Display & Programmatic",
      "Social Advertising",
      "Performance Analytics",
    ],
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    id: "strategy",
    title: "Digital Strategy",
    subtitle: "Think bigger.",
    description:
      "Data-driven marketing strategies that amplify your brand and maximize ROI. We help you understand your market, define your goals, and chart the path forward.",
    deliverables: [
      "Market Research & Analysis",
      "Digital Marketing Strategy",
      "Competitive Audit",
      "Content Strategy",
      "Conversion Optimization",
      "Quarterly Reviews",
    ],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
] as const;

/* ============================================================
   DATA: Process
   ============================================================ */
const process = [
  { step: "Discovery", description: "We learn your business, audience, and goals." },
  { step: "Strategy", description: "We define the approach and build the roadmap." },
  { step: "Create", description: "We design, build, and produce the work." },
  { step: "Refine", description: "We iterate until every detail is right." },
  { step: "Launch", description: "We deliver and measure the results." },
] as const;

/* ============================================================
   COMPONENT: Services Page
   ============================================================ */
export default function ServicesPage() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            Services
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            What we do best
          </h1>
        </div>
      </section>

      {/* =============================================
          SERVICE SECTIONS
          ============================================= */}
      {services.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-24 lg:py-32 ${
            i % 2 === 0 ? "bg-black" : "bg-gray-900"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start ${
                i % 2 !== 0 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div className={`aspect-[4/3] relative overflow-hidden ${i % 2 !== 0 ? "lg:order-2" : ""}`}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover grayscale"
                />
              </div>

              {/* Content */}
              <div className={i % 2 !== 0 ? "lg:order-1" : ""}>
                <p className="text-xs font-mono text-gray-500 mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
                  {service.title}
                </h2>
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-6">
                  {service.subtitle}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {service.description}
                </p>

                {/* Deliverables */}
                <div className="border-t border-white/10">
                  {service.deliverables.map((item) => (
                    <div
                      key={item}
                      className="py-3 border-b border-white/10 text-gray-300 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* =============================================
          PROCESS
          ============================================= */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
            How We Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-black mb-16">
            Our Process
          </h2>

          <div className="border-t border-black/10">
            {process.map((item, i) => (
              <div
                key={item.step}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-black/10"
              >
                <div className="md:col-span-1 text-gray-400 text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-3 text-black font-heading font-semibold text-lg">
                  {item.step}
                </h3>
                <p className="md:col-span-8 text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
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
              Let&apos;s build something together
            </h2>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Start a Project
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
