import type { Metadata } from "next";
import AuditCallout from "@/components/AuditCallout";
import Image from "next/image";
import Link from "next/link";
import { getPublishedCaseStudies } from "@/lib/cms/public-data";
import {
  FOUNDING_DISCOUNT_PERCENT,
  FOUNDING_SPOTS_OPEN,
  isInHouseProduct,
} from "@/lib/site-facts";

/* Reads from the Supabase CMS. Admin saves refresh this page right away
   (see lib/cms/revalidate.ts); this is the fallback for other edits. */
export const revalidate = 60;

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
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-6">
            Case Studies
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight max-w-4xl mb-6">
            Work we can show you
          </h1>
          <p className="text-muted text-sm mt-2 max-w-2xl mb-12">
            Foundry Frame is new, so the first projects here are products we
            designed, built, and run ourselves. Each one is labeled. Client work
            gets added as it launches.
          </p>

          {studies.length === 0 ? (
            <div className="glass rounded-card p-8 text-sm text-body">
              No published case studies yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {studies.map((study, index) => (
                <Link
                  key={study.id}
                  href={`/case-studies/${study.slug}`}
                  className="glass rounded-card group flex flex-col overflow-hidden hover:bg-white/75 transition-colors"
                >
                  {study.cover_image_url ? (
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-ink/10">
                      <Image
                        src={study.cover_image_url}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                  ) : null}
                  <div className="p-8 lg:p-10">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      {isInHouseProduct(study) ? (
                        <span className="text-xs uppercase tracking-widest border border-accent/40 text-accent-ink px-2 py-1 rounded-full">
                          In-house product
                        </span>
                      ) : null}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink leading-tight mb-3">
                      {study.title}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-muted mb-6">
                      {study.client_name}
                      {study.industry ? ` · ${study.industry}` : ""}
                    </p>
                    <p className="text-sm text-body leading-relaxed mb-6">
                      {study.summary || "Case study summary coming soon."}
                    </p>
                    {Array.isArray(study.services) &&
                    study.services.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {study.services.slice(0, 4).map((service) => (
                          <span
                            key={service}
                            className="text-xs uppercase tracking-widest border border-ink/10 text-muted px-2 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6">
              Your Project
            </p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-4">
              Want to be our first client case study?
            </h2>
            <p className="text-body text-sm leading-relaxed mb-10 max-w-lg">
              We&apos;re taking {FOUNDING_SPOTS_OPEN} Founding Clients this
              quarter, at {FOUNDING_DISCOUNT_PERCENT}% off any launch bundle.
              Tell us what you&apos;re building and we&apos;ll map out the right
              scope and next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/founding"
                className="btn btn-primary text-center"
              >
                Become a Founding Client
              </Link>
              <Link
                href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
                className="btn btn-glass text-center"
              >
                Book a Free Call
              </Link>
              <Link
                href="/contact"
                className="btn btn-glass text-center"
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
