/**
 * Industries Hub - Foundry Frame
 * ==============================
 * Index of the industry landing pages, linked from the footer so each one
 * gets crawled and passes internal-link equity.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import AuditCallout from "@/components/AuditCallout";
import { industries } from "@/lib/seo/industries";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Website Design by Industry",
  description:
    "Custom website design for restaurants, contractors, salons, real estate agents, gyms, and retail shops. Built around how your customers actually buy.",
  alternates: {
    canonical: "/industries",
  },
  openGraph: {
    title: "Website Design by Industry",
    description:
      "Custom website design for restaurants, contractors, salons, real estate agents, gyms, and retail shops. Built around how your customers actually buy.",
    url: "/industries",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Website Design by Industry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Design by Industry",
    description:
      "Custom website design for restaurants, contractors, salons, real estate agents, gyms, and retail shops. Built around how your customers actually buy.",
    images: ["/twitter-image"],
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Website Design by Industry",
    url: `${siteUrl}/industries`,
    about: { "@id": `${siteUrl}/#organization` },
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: industries.map((industry, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Website Design for ${industry.name}`,
        url: `${siteUrl}/industries/${industry.slug}`,
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${siteUrl}/industries` },
    ],
  },
];

export default function IndustriesPage() {
  return (
    <>
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <PageHero
        kicker="Website Design by Industry"
        eyebrow={<>Industries</>}
        title={
          <>
            Websites built for how your{" "}
            <em className="serif-accent text-molten-deep">customers buy</em>
          </>
        }
        intro={
          <>
            <p>
              A restaurant, a roofer, and a salon need very different websites. Pick your industry to see what we build and what we fix.
            </p>
          </>
        }
        actions={
          <>
            <Link href="/packages/website/spark" className="btn btn-molten min-h-13 px-7">
              Websites from $1,500 &rarr;
            </Link>
          </>
        }
        photo="chef"
        photoLabel="By industry"
      />

      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((item) => (
              <Link
                key={item.slug}
                href={`/industries/${item.slug}`}
                className="glass rounded-card group p-8 transition-colors"
              >
                <h2 className="text-ink font-heading font-bold text-2xl mb-3 group-hover:text-accent-ink transition-colors">
                  {item.name}
                </h2>
                <p className="text-body text-sm leading-relaxed">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AuditCallout />
    </>
  );
}
