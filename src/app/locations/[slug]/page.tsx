/**
 * Location Landing Page - Foundry Frame
 * =======================================
 * "Web design in <city>" pages for the towns Foundry Frame serves. Content
 * lives in src/lib/seo/locations.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/seo/LandingPage";
import {
  citiesOf,
  findLocationByName,
  getLocation,
  locations,
  relatedLocations,
} from "@/lib/seo/locations";
import { industries } from "@/lib/seo/industries";
import { parsePriceSpecification } from "@/lib/schema-price";
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  GEO_COORDINATES,
  GOOGLE_MAPS_URL,
  OPENING_HOURS_SPECIFICATION,
  POSTAL_ADDRESS,
} from "@/lib/site-facts";

const siteUrl = "https://www.foundryframe.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};

  const title = `Web Design in ${location.city}, OH`;
  const url = `/locations/${location.slug}`;

  return {
    title,
    description: location.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: location.metaDescription,
      url,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: location.metaDescription,
      images: ["/twitter-image"],
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  const pageUrl = `${siteUrl}/locations/${location.slug}`;
  const ohio = { "@type": "State", name: "Ohio" };
  const areaServed = [
    ...citiesOf(location).map((name) => ({ "@type": "City", name, containedInPlace: ohio })),
    ...location.nearby.flatMap((name) =>
      name.split(" & ").map((place) => ({ "@type": "Place", name: `${place}, OH` }))
    ),
    { "@type": "AdministrativeArea", name: `${location.county}, Ohio` },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${pageUrl}#business`,
      name: "Foundry Frame",
      description: location.metaDescription,
      url: pageUrl,
      image: `${siteUrl}/james-latten.jpg`,
      logo: `${siteUrl}/logo.svg`,
      telephone: BUSINESS_PHONE,
      email: BUSINESS_EMAIL,
      priceRange: "$$",
      address: POSTAL_ADDRESS,
      geo: GEO_COORDINATES,
      hasMap: GOOGLE_MAPS_URL,
      openingHoursSpecification: OPENING_HOURS_SPECIFICATION,
      areaServed,
      parentOrganization: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Web Design in ${location.city}, Ohio`,
      serviceType: "Web Design",
      url: pageUrl,
      description: location.metaDescription,
      provider: { "@id": `${pageUrl}#business` },
      areaServed,
      offers: {
        "@type": "Offer",
        description: "Custom 5-page small business website",
        priceSpecification: parsePriceSpecification("Starting at $1,500"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Areas We Serve", item: `${siteUrl}/locations` },
        { "@type": "ListItem", position: 3, name: location.city, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: location.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <LandingPage
      structuredData={structuredData}
      backLink={{ label: "Areas We Serve", href: "/locations" }}
      eyebrow={`${location.city}, Ohio · ${location.county}`}
      heading={`${location.city} Web Design for Small Businesses`}
      intro={location.intro}
      featuresEyebrow={`Why ${location.city} businesses work with us`}
      featuresHeading={`A local web designer for ${location.city}`}
      features={location.localAngle}
      checklistHeading={`Also serving businesses near ${location.city}`}
      checklist={location.nearby.map((name) => {
        const page = findLocationByName(name);
        return page && page !== location
          ? { label: name, href: `/locations/${page.slug}` }
          : name;
      })}
      faqHeading={`${location.city} web design FAQ`}
      faqs={location.faqs}
      related={[
        {
          heading: "More areas we serve",
          links: [
            ...relatedLocations(location).map((other) => ({
              label: `${other.city} web design`,
              href: `/locations/${other.slug}`,
            })),
            { label: "All areas", href: "/locations" },
          ],
        },
        {
          heading: "Websites for your industry",
          links: industries.map((industry) => ({
            label: industry.name,
            href: `/industries/${industry.slug}`,
          })),
        },
        {
          heading: "Services and pricing",
          links: [
            { label: "Web design", href: "/services/web-design" },
            { label: "Branding", href: "/services/branding" },
            { label: "Website packages", href: "/packages/website" },
            { label: "Free website audit", href: "/audit" },
          ],
        },
      ]}
      auditHeading={`How does your ${location.city} business website score?`}
    />
  );
}
