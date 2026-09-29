/**
 * Package Builder - Foundry Frame
 * =================================
 * Visitors assemble their own package (website or launch bundle, add-ons,
 * maintenance, marketing), see live pricing, pick a meeting time, and send
 * the quote to the team.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import PackageBuilder from "@/components/PackageBuilder";

const pageTitle = "Build Your Package — Instant Website Pricing";
const pageDescription =
  "Build your own website, branding, and marketing package and see the price instantly. Pick what you need, choose a meeting time, and get a confirmed quote within one business day.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/packages/builder",
  },
  openGraph: {
    title: `${pageTitle} | Foundry Frame`,
    description: pageDescription,
    url: "/packages/builder",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame | Ohio Web Design & Branding Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Foundry Frame`,
    description: pageDescription,
    images: ["/twitter-image"],
  },
};

export default function PackageBuilderPage() {
  return (
    <>
      <section className="pt-32 pb-10 lg:pt-40 lg:pb-12 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Package Builder</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Build your package. See your price.
          </h1>
          <p className="text-gray-400 text-sm mt-6 max-w-xl">
            Pick exactly what your business needs and watch the total update as you go. Send it over, choose a
            meeting time, and James will confirm your quote within one business day.
          </p>
        </div>
      </section>
      <section className="bg-black pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <PackageBuilder />
        </div>
      </section>
    </>
  );
}
