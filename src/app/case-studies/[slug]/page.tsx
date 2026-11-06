import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseStudyImages from "@/components/CaseStudyImages";
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

/* Only link out to http(s) URLs from the CMS; adds https:// when the
   editor typed a bare domain like "example.com". */
function safeExternalUrl(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
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
  const projectUrl = safeExternalUrl(study.project_url);
  const testimonialQuote = study.testimonial_quote?.trim();

  return (
    <>
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-ink leading-[0.95] max-w-4xl mb-4">
            {study.title}
          </h1>
          <p className="text-xs uppercase tracking-widest text-muted mb-8">
            {study.client_name}
            {study.industry ? ` · ${study.industry}` : ""}
          </p>

          {inHouse ? (
            <p className="text-sm text-body leading-relaxed border-l-2 border-accent/40 pl-4 mb-8 max-w-3xl">
              {study.client_name || study.title} is Foundry Frame&apos;s own
              product. We designed, built, and run it ourselves, so this is a
              look at our work rather than a client engagement.
            </p>
          ) : null}

          {study.summary ? (
            <p className="text-ink-soft text-base leading-relaxed mb-10 max-w-3xl">
              {study.summary}
            </p>
          ) : null}

          {projectUrl ? (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="Case study: Visit live site"
              className="btn btn-primary mb-10"
            >
              Visit the live site
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : null}

          <CaseStudyImages
            title={study.title}
            coverUrl={study.cover_image_url}
            galleryUrls={galleryImages}
          />

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

          {testimonialQuote ? (
            <figure className="glass rounded-card p-8 lg:p-12 mt-10">
              <p className="text-xs uppercase tracking-widest text-muted mb-4">
                Client Testimonial
              </p>
              <blockquote className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-ink leading-tight">
                &ldquo;{testimonialQuote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm text-muted">
                {study.testimonial_author?.trim() || study.client_name}
                {study.testimonial_author?.trim() && study.client_name
                  ? ` · ${study.client_name}`
                  : ""}
              </figcaption>
            </figure>
          ) : null}

          <hr
            aria-hidden="true"
            className="mt-16 lg:mt-20 h-px border-0 bg-linear-to-r from-transparent via-ink/15 to-transparent"
          />
        </div>
      </section>

      {/* =============================================
        CASE STUDY CTA
        ============================================= */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
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
