/**
 * Services Hub - Foundry Frame
 * ===============================
 * Category index linking to each individual service detail page.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices } from "@/lib/cms/public-data";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Web Design & Creative Services",
  description:
    "Explore Foundry Frame's creative services: web design & development, branding, social media, graphic design, advertising, and digital strategy.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Web Design & Creative Services",
    description:
      "Web design & development, branding, social media, and digital strategy services for growth-focused businesses.",
    url: "/services",
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
    title: "Web Design & Creative Services",
    description:
      "Web design & development, branding, social media, and digital strategy services for growth-focused businesses.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Services
   ============================================================ */
const fallbackServices = [
  {
    id: "web-design",
    title: "Web Design & Development",
    href: "/services/web-design",
    tagline: "Our flagship service.",
    description:
      "Custom-coded, conversion-focused websites built with Next.js and React — no templates, no page builders. This is the work we're best known for.",
    highlights: ["Custom Design", "Next.js Development", "E-Commerce", "Technical SEO"],
    featured: true,
  },
  {
    number: "02",
    id: "branding",
    title: "Branding & Identity",
    href: "/services/branding",
    tagline: "Define who you are.",
    description:
      "Comprehensive brand identities — logo, positioning, visual system, and guidelines — that create lasting connections with your audience.",
    highlights: ["Logo Design", "Brand Strategy", "Visual Identity", "Brand Guidelines"],
    featured: false,
  },
  {
    number: "03",
    id: "social-media",
    title: "Social Media",
    href: "/services/social-media",
    tagline: "Build your community.",
    description:
      "Strategic social media management that builds community and drives reach — content, strategy, and engagement handled end to end.",
    highlights: ["Content Strategy", "Content Creation", "Paid Social", "Reporting"],
    featured: false,
  },
  {
    number: "04",
    id: "graphic-design",
    title: "Graphic Design",
    href: "/services/graphic-design",
    tagline: "Visual impact.",
    description:
      "Compelling visual assets that strengthen your brand across every touchpoint — print, digital, and environmental.",
    highlights: ["Marketing Collateral", "Packaging", "Print Design", "Digital Assets"],
    featured: false,
  },
  {
    number: "05",
    id: "advertising",
    title: "Advertising",
    href: "/services/advertising",
    tagline: "Reach the right people.",
    description:
      "Strategic advertising that puts your brand in front of the right audience, combining creative excellence with data-driven targeting.",
    highlights: ["Campaign Strategy", "PPC & Search", "Social Ads", "Analytics"],
    featured: false,
  },
  {
    number: "06",
    id: "strategy",
    title: "Digital Strategy",
    href: "/services/strategy",
    tagline: "Think bigger.",
    description:
      "Data-driven marketing strategies that amplify your brand and maximize ROI — research, roadmap, and conversion optimization.",
    highlights: ["Market Research", "Content Strategy", "Conversion Optimization", "Quarterly Reviews"],
    featured: false,
  },
] as const;

const supportedServiceDetailSlugs = new Set([
  "web-design",
  "branding",
  "social-media",
  "graphic-design",
  "advertising",
  "strategy",
]);

/* ============================================================
   DATA: Process
   ============================================================ */
const process = [
  {
    step: "Discovery",
    description: "We learn your business, audience, and goals.",
  },
  {
    step: "Strategy",
    description: "We define the approach and build the roadmap.",
  },
  { step: "Create", description: "We design, build, and produce the work." },
  { step: "Refine", description: "We iterate until every detail is right." },
  { step: "Launch", description: "We deliver and measure the results." },
] as const;

/* ============================================================
   COMPONENT: Services Hub
   ============================================================ */
export default async function ServicesPage() {
  const cmsServices = await getPublishedServices();

  const services =
    cmsServices.length > 0
      ? cmsServices.map((service, index) => ({
          number: String(index + 1).padStart(2, "0"),
          id: service.id,
          title: service.name,
          href: supportedServiceDetailSlugs.has(service.slug)
            ? `/services/${service.slug}`
            : "/contact",
          tagline: service.timeline || "Built around your goals.",
          description:
            service.description ||
            service.short_description ||
            "Custom service delivery shaped to your business needs.",
          highlights:
            Array.isArray(service.deliverables) && service.deliverables.length > 0
              ? service.deliverables.slice(0, 4)
              : ["Custom Scope"],
          featured: Boolean(service.is_featured),
        }))
      : fallbackServices.map((service, index) => ({
          number: String(index + 1).padStart(2, "0"),
          ...service,
        }));

  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Creative design agency services",
    provider: {
      "@type": "Organization",
      name: "Foundry Frame",
      url: siteUrl,
    },
    areaServed: ["Ohio", "United States"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Foundry Frame Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        url: `${siteUrl}${service.href}`,
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          url: `${siteUrl}${service.href}`,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesStructuredData),
        }}
      />

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
          <p className="text-gray-500 text-sm mt-6 max-w-lg">
            Six disciplines, one team. Web design and development is our
            flagship — everything else is built to support it.
          </p>
        </div>
      </section>

      {/* =============================================
          SERVICES GRID
          ============================================= */}
      <section className="bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">
            {services.map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className={`group p-10 lg:p-14 flex flex-col transition-colors ${
                  service.featured
                    ? "bg-white hover:bg-gray-100 lg:col-span-2"
                    : "bg-black hover:bg-gray-950"
                }`}
              >
                <div className="flex items-start justify-between mb-8">
                  <span
                    className={`text-[10px] uppercase tracking-[0.3em] ${
                      service.featured ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    {service.number}
                  </span>
                  {service.featured ? (
                    <span className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1 font-bold">
                      Flagship Service
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 group-hover:text-white transition-colors">
                      View &rarr;
                    </span>
                  )}
                </div>
                <h2
                  className={`text-3xl sm:text-4xl font-heading font-bold mb-2 leading-tight ${
                    service.featured ? "text-black" : "text-white"
                  }`}
                >
                  {service.title}
                </h2>
                <p
                  className={`text-xs uppercase tracking-widest mb-6 ${
                    service.featured ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {service.tagline}
                </p>
                <p
                  className={`text-sm leading-relaxed mb-8 max-w-xl ${
                    service.featured ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {service.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {service.highlights.map((h) => (
                    <span
                      key={h}
                      className={`text-[10px] uppercase tracking-widest border px-2 py-1 ${
                        service.featured
                          ? "border-black/10 text-gray-500"
                          : "border-white/10 text-gray-500"
                      }`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
              Next Step
            </p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[0.95] mb-4">
              Book your free 30-min strategy call
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg">
              Tell us about your goals. We&apos;ll walk you through exactly
              how we&apos;d approach them — and what it would cost. No
              obligation, no hard sell.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://calendly.com/jlatten-foundryframe/30min"
                className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Book a Free Call
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors"
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
