import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { seoTitle, summarize } from "@/lib/seo/meta";
import {
  getPublishedCaseStudies,
  getPublishedCaseStudyBySlug,
} from "@/lib/cms/public-data";
import { isInHouseProduct } from "@/lib/site-facts";

/* Reads from the Supabase CMS. Admin saves refresh this page right away
   (see lib/cms/revalidate.ts); this is the fallback for other edits. */
export const revalidate = 60;

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  const studies = await getPublishedCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getPublishedCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Case Study",
    };
  }

  return {
    title: seoTitle(`${study.title} | Case Study`),
    description: summarize(study.summary || "Foundry Frame case study."),
    alternates: {
      canonical: `/case-studies/${study.slug}`,
    },
    openGraph: {
      title: `${study.title} | Case Study | Foundry Frame`,
      description: summarize(study.summary || "Foundry Frame case study."),
      url: `/case-studies/${study.slug}`,
      type: "article",
      images: [
        {
          url: study.cover_image_url || "/opengraph-image",
          width: 1200,
          height: 630,
          alt: study.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.title} | Case Study | Foundry Frame`,
      description: summarize(study.summary || "Foundry Frame case study."),
      images: [study.cover_image_url || "/twitter-image"],
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = await getPublishedCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const inHouse = isInHouseProduct(study);
  const metricItems = Array.isArray(study.metrics) ? study.metrics : [];
  const galleryImages = Array.isArray(study.gallery_urls)
    ? study.gallery_urls.filter(
        (entry): entry is string =>
          typeof entry === "string" && entry.trim().length > 0,
      )
    : [];

  return (
    <>
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 min-h-screen">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <Link
            href="/case-studies"
            className="btn btn-glass min-h-10 px-4 text-sm mr-2 mb-6"
          >
            &larr; All Case Studies
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <p className="eyebrow">
              Case Study
            </p>
            {inHouse ? (
              <span className="text-xs uppercase tracking-widest border border-accent/40 text-accent-ink px-2 py-1 rounded-full">
                In-house product
              </span>
            ) : null}
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-ink leading-[0.95] mb-4">
            {study.title}
          </h1>
          <p className="text-xs uppercase tracking-widest text-muted mb-8">
            {study.client_name}
            {study.industry ? ` · ${study.industry}` : ""}
          </p>

          {inHouse ? (
            <p className="text-sm text-body leading-relaxed border-l-2 border-accent/40 pl-4 mb-8">
              {study.client_name || study.title} is Foundry Frame&apos;s own
              product. We designed, built, and run it ourselves, so this is a
              look at our work rather than a client engagement.
            </p>
          ) : null}

          {study.summary ? (
            <p className="text-ink-soft text-base leading-relaxed mb-10">
              {study.summary}
            </p>
          ) : null}

          {study.cover_image_url ? (
            <Image
              src={study.cover_image_url}
              alt={study.title}
              width={1600}
              height={900}
              className="w-full h-auto border border-ink/10 mb-10"
            />
          ) : null}

          {galleryImages.length > 0 ? (
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-muted mb-4">
                Project Gallery
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {galleryImages.map((imageUrl, index) => (
                  <Image
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`${study.title} gallery image ${index + 1}`}
                    width={1000}
                    height={750}
                    className="w-full h-48 object-cover border border-ink/10"
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="glass rounded-card p-6">
              <p className="text-xs uppercase tracking-widest text-muted mb-2">
                Challenge
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">
                {study.challenge || "Not specified."}
              </p>
            </div>
            <div className="glass rounded-card p-6">
              <p className="text-xs uppercase tracking-widest text-muted mb-2">
                Solution
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">
                {study.solution || "Not specified."}
              </p>
            </div>
            <div className="glass rounded-card p-6">
              <p className="text-xs uppercase tracking-widest text-muted mb-2">
                Results
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">
                {study.results || "Not specified."}
              </p>
            </div>
          </div>

          {metricItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metricItems.map((metric, index) => (
                <div
                  key={`${metric.label || "metric"}-${index}`}
                  className="glass rounded-card p-6 text-center"
                >
                  <p className="text-3xl font-heading font-bold text-ink mb-2">
                    {metric.value || "-"}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted">
                    {metric.label || "Metric"}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* =============================================
        CASE STUDY CTA
        ============================================= */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">
            Work With Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink leading-tight mb-4">
            {inHouse
              ? "Want something like this built for you?"
              : "Want results like these for your business?"}
          </h2>
          <p className="text-body text-sm leading-relaxed mb-8 max-w-md">
            We build custom websites and brand experiences for small businesses
            across Ohio and beyond. Book a free 30-min call and let&apos;s talk
            about your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              data-track="Case study CTA: Book a Free Call"
              className="btn btn-primary text-center"
            >
              Book a Free Call
            </Link>
            <Link
              href="/case-studies"
              className="btn btn-glass text-center"
            >
              More Case Studies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
