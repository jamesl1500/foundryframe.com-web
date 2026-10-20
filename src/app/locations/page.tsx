/**
 * Locations Hub - Foundry Frame
 * =============================
 * Index of the local (city) landing pages, grouped by region and linked from
 * the footer so each one gets crawled and passes internal-link equity.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import AuditCallout from "@/components/AuditCallout";
import { locationRegions, locations } from "@/lib/seo/locations";

const siteUrl = "https://www.foundryframe.com";
const title = "Web Design Across Ohio: Areas We Serve";
const description =
  "Custom small business websites in Lorain, Elyria, Westlake, Lakewood, Cleveland, Akron, Columbus, and more Ohio cities, from a founder-led Lorain studio.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/locations",
  },
  openGraph: {
    title,
    description,
    url: "/locations",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"],
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${siteUrl}/locations`,
    about: { "@id": `${siteUrl}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: locations.map((location, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Web Design in ${location.city}, OH`,
        url: `${siteUrl}/locations/${location.slug}`,
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Areas We Serve", item: `${siteUrl}/locations` },
    ],
  },
];

export default function LocationsPage() {
  return (
    <>
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Areas We Serve</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-[0.95] tracking-tight max-w-4xl">
            Web design across Ohio
          </h1>
          <p className="mt-8 max-w-2xl text-gray-400 text-base leading-relaxed">
            We&apos;re based in Lorain and work in person with small businesses across Lorain County, the Lake Erie shore, and greater Cleveland. Akron, Columbus, and remote projects anywhere in the U.S. are welcome too.
          </p>
        </div>
      </section>

      {locationRegions.map((region) => {
        const regionLocations = locations.filter((item) => item.region === region);
        if (regionLocations.length === 0) return null;
        return (
          <section key={region} className="py-16 bg-black border-b border-white/10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">{region}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10">
                {regionLocations.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/locations/${item.slug}`}
                    className="group bg-black p-8 border-r border-b border-white/10 hover:bg-gray-900 transition-colors"
                  >
                    <h3 className="text-white font-heading font-bold text-2xl mb-3 group-hover:text-accent-glow transition-colors">
                      {item.city}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <AuditCallout />
    </>
  );
}
