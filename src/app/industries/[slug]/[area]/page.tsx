/**
 * Industry + Area Landing Page - Foundry Frame
 * ==============================================
 * "<Industry> websites in <area>" pages, e.g. /industries/contractors/
 * lorain-county-oh. Content lives in src/lib/seo/industry-areas.ts; only
 * the pairs listed there get a page.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/seo/LandingPage";
import { getCaseStudiesForIndustry } from "@/lib/cms/public-data";
import { getIndustry } from "@/lib/seo/industries";
import { areasForIndustry, getIndustryArea, industryAreas } from "@/lib/seo/industry-areas";
import { citiesOf, findLocationByName } from "@/lib/seo/locations";
import { seoTitle } from "@/lib/seo/meta";

const siteUrl = "https://www.foundryframe.com";

/* "Recent work" reads from the Supabase CMS. Admin saves refresh this page
   right away (see lib/cms/revalidate.ts); this is the fallback for other edits. */
export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return industryAreas.map(({ industrySlug, areaSlug }) => ({
    slug: industrySlug,
    area: areaSlug,
  }));
}

type Params = Promise<{ slug: string; area: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, area } = await params;
  const page = getIndustryArea(slug, area);
  if (!page) return {};

  const url = `/industries/${page.industrySlug}/${page.areaSlug}`;

  /* Share image comes from opengraph-image.tsx in this folder. This object
     replaces the root openGraph rather than merging with it, so siteName
     and locale are repeated here. */
  return {
    title: seoTitle(page.title),
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
      type: "website",
      siteName: "Foundry Frame",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
    },
  };
}

export default async function IndustryAreaPage({ params }: { params: Params }) {
  const { slug, area } = await params;
  const page = getIndustryArea(slug, area);
  const industry = getIndustry(slug);
  if (!page || !industry) notFound();

  const { matched, studies } = await getCaseStudiesForIndustry(industry.slug);
  const pageUrl = `${siteUrl}/industries/${industry.slug}/${page.areaSlug}`;
  const industryUrl = `${siteUrl}/industries/${industry.slug}`;

  const ohio = { "@type": "State", name: "Ohio" };
  const areaServed = [
    { "@type": "AdministrativeArea", name: `${page.area}, Ohio`, containedInPlace: ohio },
    ...page.towns.map((name) => ({ "@type": "City", name, containedInPlace: ohio })),
  ];

  const otherAreas = areasForIndustry(industry.slug).filter((other) => other !== page);
  const sameAreaIndustries = industryAreas.filter(
    (other) => other.area === page.area && other !== page
  );

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.metaDescription,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      mainEntity: { "@id": `${pageUrl}#service` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: page.title,
      serviceType: "Web Design",
      url: pageUrl,
      description: page.metaDescription,
      audience: { "@type": "BusinessAudience", name: industry.name },
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Industries", item: `${siteUrl}/industries` },
        { "@type": "ListItem", position: 3, name: industry.name, item: industryUrl },
        { "@type": "ListItem", position: 4, name: page.area, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <LandingPage
      structuredData={structuredData}
      backLink={{ label: industry.name, href: `/industries/${industry.slug}` }}
      eyebrow={`${industry.name} · ${page.area}, Ohio`}
      heading={page.headline}
      intro={page.intro}
      featuresEyebrow={`Why ${page.area} is different`}
      featuresHeading={`What ${industry.audience} in ${page.area} need from a website`}
      features={page.localFactors}
      checklistHeading={`What we build for ${industry.audience} in ${page.area}`}
      checklist={page.checklist}
      faqHeading={`${page.area} ${industry.audience} website FAQ`}
      faqs={page.faqs}
      recentWork={studies}
      recentWorkHeading={
        matched.length > 0
          ? `Websites we’ve built, including for ${industry.audience}`
          : undefined
      }
      matchedWorkIds={matched.map((study) => study.id)}
      matchedWorkLabel={industry.name}
      serviceArea={`${page.area}: ${page.towns.slice(0, 6).join(", ")}, and nearby`}
      related={[
        {
          heading: `${page.area} towns we serve`,
          links: page.towns.flatMap((name) => {
            const location = findLocationByName(name);
            /* "Avon" and "Avon Lake" share a page; link it once. */
            if (!location || citiesOf(location)[0] !== name) return [];
            return [{ label: `${location.city} web design`, href: `/locations/${location.slug}` }];
          }),
        },
        ...(sameAreaIndustries.length > 0
          ? [
              {
                heading: `More industries in ${page.area}`,
                links: sameAreaIndustries.map((other) => {
                  const otherIndustry = getIndustry(other.industrySlug);
                  return {
                    label: `${otherIndustry?.name ?? other.industrySlug} in ${other.area}`,
                    href: `/industries/${other.industrySlug}/${other.areaSlug}`,
                  };
                }),
              },
            ]
          : []),
        {
          heading: `${industry.name} websites`,
          links: [
            { label: `${industry.name}: overview`, href: `/industries/${industry.slug}` },
            ...otherAreas.map((other) => ({
              label: `${industry.name} in ${other.area}`,
              href: `/industries/${industry.slug}/${other.areaSlug}`,
            })),
            { label: "All industries", href: "/industries" },
          ],
        },
      ]}
      auditHeading={`How does your ${page.area} business website score?`}
    />
  );
}
