import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCaseStudies } from "@/lib/cms/public-data";

export const metadata: Metadata = {
  title: "Case Studies | Foundry Frame",
  description:
    "Explore Foundry Frame case studies and real project outcomes across web design, branding, and digital strategy.",
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies | Foundry Frame",
    description:
      "Explore real results from Foundry Frame's branding, web design, and digital strategy projects.",
    url: "/case-studies",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame case studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Foundry Frame",
    description:
      "Explore real results from Foundry Frame's branding, web design, and digital strategy projects.",
    images: ["/twitter-image"],
  },
};

export default async function CaseStudiesPage() {
  const studies = await getPublishedCaseStudies();

  return (
    <>
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Case Studies</p>
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl mb-6">
          Results we can prove
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-2xl mb-12">
          A look at recent launches and growth outcomes across strategy, design, and development.
        </p>

        {studies.length === 0 ? (
          <div className="border border-white/10 p-8 text-sm text-gray-400">No published case studies yet.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {studies.map((study, index) => (
              <Link
                key={study.id}
                href={`/case-studies/${study.slug}`}
                className="group bg-black p-8 lg:p-10 hover:bg-gray-950 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-5">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight mb-3">
                  {study.title}
                </h2>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">
                  {study.client_name}
                  {study.industry ? ` · ${study.industry}` : ""}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {study.summary || "Case study summary coming soon."}
                </p>
                {Array.isArray(study.services) && study.services.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {study.services.slice(0, 4).map((service) => (
                      <span
                        key={service}
                        className="text-[10px] uppercase tracking-widest border border-white/10 text-gray-500 px-2 py-1"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        )}
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
              Your Project
            </p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[0.95] mb-4">
              Ready to become our next success story?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg">
              Tell us what you&apos;re building and where you want to go. We&apos;ll
              map out the right strategy, scope, and next steps for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://calendly.com/jlatten-foundryframe/30min"
                className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors text-center"
              >
                Book a Free Call
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors text-center"
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
