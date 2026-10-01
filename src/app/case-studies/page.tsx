import type { Metadata } from "next";
import AuditCallout from "@/components/AuditCallout";
import Link from "next/link";
import { getPublishedCaseStudies } from "@/lib/cms/public-data";
import { isInHouseProduct } from "@/lib/site-facts";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Products Foundry Frame designed, built, and runs, with the strategy, design, and development behind each one.",
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies | Foundry Frame",
    description:
      "Products Foundry Frame designed, built, and runs, with the strategy, design, and development behind each one.",
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
      "Products Foundry Frame designed, built, and runs, with the strategy, design, and development behind each one.",
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
          Work we can show you
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-2xl mb-12">
          Foundry Frame is new, so the first projects here are products we designed, built, and run
          ourselves. Each one is labeled. Client work gets added as it launches.
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
                <div className="flex items-center justify-between gap-4 mb-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  {isInHouseProduct(study) ? (
                    <span className="text-[10px] uppercase tracking-widest border border-accent/40 text-accent-glow px-2 py-1">
                      In-house product
                    </span>
                  ) : null}
                </div>
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
              Want to be our first client case study?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg">
              We&apos;re taking on a few Founding Clients who work directly with James at
              founding-client pricing. Tell us what you&apos;re building and we&apos;ll map out
              the right scope and next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/founding"
                className="px-8 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors text-center"
              >
                Become a Founding Client
              </Link>
              <Link
                href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
                className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors text-center"
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
      <AuditCallout />
    </>
  );
}
