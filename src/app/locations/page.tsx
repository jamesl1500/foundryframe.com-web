/**
 * Locations Hub - Foundry Frame
 * =============================
 * Index of the local (city) landing pages, linked from the footer so each one
 * gets crawled and passes internal-link equity.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import AuditCallout from "@/components/AuditCallout";
import { locations } from "@/lib/seo/locations";

export const metadata: Metadata = {
  title: "Web Design Across Northeast Ohio",
  description:
    "Foundry Frame builds custom websites for small businesses in Lorain, Elyria, Avon Lake, Amherst, Sandusky, Cleveland, and across Northeast Ohio.",
  alternates: {
    canonical: "/locations",
  },
};

export default function LocationsPage() {
  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Areas We Serve</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-[0.95] tracking-tight max-w-4xl">
            Web design across Northeast Ohio
          </h1>
          <p className="mt-8 max-w-2xl text-gray-400 text-base leading-relaxed">
            We&apos;re based in Lorain and work in person with small businesses across Lorain County, Erie County, and greater Cleveland. Remote projects anywhere in the U.S. are welcome too.
          </p>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {locations.map((item) => (
              <Link
                key={item.slug}
                href={`/locations/${item.slug}`}
                className="group bg-black p-8 hover:bg-gray-900 transition-colors"
              >
                <h2 className="text-white font-heading font-bold text-2xl mb-3 group-hover:text-accent-glow transition-colors">
                  {item.city}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AuditCallout />
    </>
  );
}
