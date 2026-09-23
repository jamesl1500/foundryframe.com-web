/**
 * Industry Landing Page - Foundry Frame
 * =======================================
 * "Website design for <industry>" pages. Content lives in
 * src/lib/seo/industries.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/seo/LandingPage";
import { getIndustry, industries } from "@/lib/seo/industries";
import { locations } from "@/lib/seo/locations";

const siteUrl = "https://www.foundryframe.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};

  const title = `Website Design for ${industry.name}`;
  const url = `/industries/${industry.slug}`;

  return {
    title,
    description: industry.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: industry.metaDescription,
      url,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: industry.metaDescription,
      images: ["/twitter-image"],
    },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const pageUrl = `${siteUrl}/industries/${industry.slug}`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Website Design for ${industry.name}`,
      serviceType: "Web Design",
      url: pageUrl,
      description: industry.metaDescription,
      audience: { "@type": "BusinessAudience", name: industry.name },
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: [
        { "@type": "State", name: "Ohio" },
        { "@type": "AdministrativeArea", name: "United States" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Industries", item: `${siteUrl}/industries` },
        { "@type": "ListItem", position: 3, name: industry.name, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: industry.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <LandingPage
      structuredData={structuredData}
      backLink={{ label: "Industries", href: "/industries" }}
      eyebrow={`Websites for ${industry.name}`}
      heading={industry.headline}
      intro={[industry.intro]}
      featuresEyebrow="What we fix"
      featuresHeading={`Where most ${industry.audience} lose customers online`}
      features={industry.problems}
      checklistHeading={`What every site for ${industry.audience} needs`}
      checklist={industry.mustHaves}
      faqHeading="Common questions"
      faqs={industry.faqs}
      relatedHeading="Areas we serve"
      related={locations.map((location) => ({
        label: `${location.city} web design`,
        href: `/locations/${location.slug}`,
      }))}
      auditHeading="See how your current website scores"
    />
  );
}
