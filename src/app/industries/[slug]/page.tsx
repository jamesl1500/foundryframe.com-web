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
import { websitePackages } from "@/lib/packages/website";
import { getIndustry, industries } from "@/lib/seo/industries";
import { locations } from "@/lib/seo/locations";
import { getCaseStudiesForIndustry } from "@/lib/cms/public-data";
import { areasForIndustry } from "@/lib/seo/industry-areas";

const siteUrl = "https://www.foundryframe.com";

/* "Recent work" reads from the Supabase CMS. Admin saves refresh this page
   right away (see lib/cms/revalidate.ts); this is the fallback for other edits. */
export const revalidate = 60;

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

  // Long industry names would push the title past what Google shows.
  const fullTitle = `Website Design for ${industry.name}`;
  const title = fullTitle.length <= 44 ? fullTitle : `Websites for ${industry.name}`;
  const url = `/industries/${industry.slug}`;

  /* Share image comes from opengraph-image.tsx in this folder. This object
     replaces the root openGraph rather than merging with it, so siteName
     and locale are repeated here. */
  return {
    title,
    description: industry.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: industry.metaDescription,
      url,
      type: "website",
      siteName: "Foundry Frame",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: industry.metaDescription,
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

  const { matched, studies } = await getCaseStudiesForIndustry(industry.slug);
  const areaPages = areasForIndustry(industry.slug);
  const pageUrl = `${siteUrl}/industries/${industry.slug}`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: `Website Design for ${industry.name}`,
      description: industry.metaDescription,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      mainEntity: { "@id": `${pageUrl}#service` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: `Website Design for ${industry.name}`,
      serviceType: "Web Design",
      url: pageUrl,
      description: industry.metaDescription,
      audience: { "@type": "BusinessAudience", name: industry.name },
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: [
        { "@type": "State", name: "Ohio" },
        { "@type": "Country", name: "United States" },
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
      related={[
        ...(areaPages.length > 0
          ? [
              {
                heading: `${industry.name} websites near you`,
                links: areaPages.map((page) => ({
                  label: `${industry.name} in ${page.area}`,
                  href: `/industries/${industry.slug}/${page.areaSlug}`,
                })),
              },
            ]
          : []),
        {
          heading: "Website packages",
          links: websitePackages.map((pkg) => ({
            label: pkg.linkLabel,
            href: `/packages/website/${pkg.slug}`,
          })),
        },
        {
          heading: "Areas we serve",
          links: locations.map((location) => ({
            label: `${location.city} web design`,
            href: `/locations/${location.slug}`,
          })),
        },
      ]}
      auditHeading="See how your current website scores"
      recentWork={studies}
      recentWorkHeading={
        matched.length > 0
          ? `Websites we’ve built, including for ${industry.audience}`
          : undefined
      }
      matchedWorkIds={matched.map((study) => study.id)}
      matchedWorkLabel={industry.name}
    />
  );
}
