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
import AuditCallout from "@/components/AuditCallout";
import { industries } from "@/lib/seo/industries";

export const metadata: Metadata = {
  title: "Website Design by Industry",
  description:
    "Custom website design for restaurants, contractors, salons, real estate agents, gyms, and retail shops. Built around how your customers actually buy.",
  alternates: {
    canonical: "/industries",
  },
};

export default function IndustriesPage() {
  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Industries</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-[0.95] tracking-tight max-w-4xl">
            Websites built for how your customers buy
          </h1>
          <p className="mt-8 max-w-2xl text-gray-400 text-base leading-relaxed">
            A restaurant, a roofer, and a salon need very different websites. Pick your industry to see what we build and what we fix.
          </p>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {industries.map((item) => (
              <Link
                key={item.slug}
                href={`/industries/${item.slug}`}
                className="group bg-black p-8 hover:bg-gray-900 transition-colors"
              >
                <h2 className="text-white font-heading font-bold text-2xl mb-3 group-hover:text-accent-glow transition-colors">
                  {item.name}
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
