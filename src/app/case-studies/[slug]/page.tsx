import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPublishedCaseStudies,
  getPublishedCaseStudyBySlug,
} from "@/lib/cms/public-data";

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
    title: `${study.title} Case Study`,
    description: study.summary || "Foundry Frame case study.",
    alternates: {
      canonical: `/case-studies/${study.slug}`,
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

  const metricItems = Array.isArray(study.metrics) ? study.metrics : [];
  const galleryImages = Array.isArray(study.gallery_urls)
    ? study.gallery_urls.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    : [];

  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black min-h-screen border-b border-white/10">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <Link
          href="/case-studies"
          className="text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:text-gray-400 transition-colors mb-6 inline-block"
        >
          &larr; All Case Studies
        </Link>

        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Case Study</p>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-[0.95] mb-4">
          {study.title}
        </h1>
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-8">
          {study.client_name}
          {study.industry ? ` · ${study.industry}` : ""}
        </p>

        {study.summary ? <p className="text-gray-300 text-base leading-relaxed mb-10">{study.summary}</p> : null}

        {study.cover_image_url ? (
          <Image
            src={study.cover_image_url}
            alt={study.title}
            width={1600}
            height={900}
            className="w-full h-auto border border-white/10 mb-10"
          />
        ) : null}

        {galleryImages.length > 0 ? (
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Project Gallery</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {galleryImages.map((imageUrl, index) => (
                <Image
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`${study.title} gallery image ${index + 1}`}
                  width={1000}
                  height={750}
                  className="w-full h-48 object-cover border border-white/10"
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 mb-10">
          <div className="bg-black p-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Challenge</p>
            <p className="text-sm text-gray-300 leading-relaxed">{study.challenge || "Not specified."}</p>
          </div>
          <div className="bg-black p-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Solution</p>
            <p className="text-sm text-gray-300 leading-relaxed">{study.solution || "Not specified."}</p>
          </div>
          <div className="bg-black p-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Results</p>
            <p className="text-sm text-gray-300 leading-relaxed">{study.results || "Not specified."}</p>
          </div>
        </div>

        {metricItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {metricItems.map((metric, index) => (
              <div key={`${metric.label || "metric"}-${index}`} className="bg-black p-6 text-center">
                <p className="text-3xl font-heading font-bold text-white mb-2">{metric.value || "-"}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">{metric.label || "Metric"}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
