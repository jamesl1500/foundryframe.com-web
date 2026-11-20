/**
 * Packages Hub - Foundry Frame
 * ===============================
 * Category index linking to Website, Launch, Maintenance,
 * and Marketing package sub-pages.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import AuditCallout from "@/components/AuditCallout";
import PackageHighlights from "@/components/PackageHighlights";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbList, webPage } from "@/lib/seo/schema";
import SparkSpotlight from "@/components/SparkSpotlight";
import PrintShopAddOn from "@/components/PrintShopAddOn";
import {
  formatPriceLabel,
  getPublishedPackages,
  type PublishedPackage,
} from "@/lib/cms/public-data";

/* Reads from the Supabase CMS. Admin saves refresh this page right away
   (see lib/cms/revalidate.ts); this is the fallback for other edits. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Web Design Packages & Pricing",
  description:
    "Websites from $1,500, launch bundles from $2,500, maintenance from $99/mo, marketing from $500/mo, and Print Shop for $150 with any package.",
  alternates: {
    canonical: "/packages",
  },
  openGraph: {
    title: "Web Design Packages & Pricing",
    description:
      "Website packages, launch bundles, maintenance and marketing plans, plus the new $150 Print Shop add-on, with transparent starting prices.",
    url: "/packages",
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
    title: "Web Design Packages & Pricing",
    description:
      "Website packages, launch bundles, maintenance and marketing plans, plus the new $150 Print Shop add-on, with transparent starting prices.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Categories
   ============================================================ */
const fallbackCategories = [
  {
    name: "Website Packages",
    href: "/packages/website",
    tagline: "Custom-built. Performance-first.",
    description:
      "From a clean 5-page launch site to a full enterprise build, every website we deliver is custom-designed and engineered for results — no templates, no shortcuts.",
    priceRange: "Starting at $1,500",
    tiers: ["The Spark", "The Blueprint", "The Architect", "The Monument"],
  },
  {
    name: "Launch Bundles",
    href: "/packages/launch",
    tagline: "Everything you need. One engagement.",
    description:
      "Bundled packages that combine a custom website, brand identity, and ongoing support into a single cohesive engagement — delivered by one team, on one timeline.",
    priceRange: "Starting at $2,500",
    tiers: ["Ignite", "Velocity", "Ascend", "Apex"],
  },
  {
    name: "Maintenance Plans",
    href: "/packages/maintenance",
    tagline: "Launch is day one, not the finish line.",
    description:
      "Keep your site fast, secure, and continuously improving. From essential protection to full white-glove retainer support — we handle it all.",
    priceRange: "From $99/mo",
    tiers: ["Steady", "Active", "Elite"],
  },
  {
    name: "Marketing Packages",
    href: "/packages/marketing",
    tagline: "Traffic. Leads. Growth.",
    description:
      "A great website only works when people can find it. Our marketing packages turn your digital presence into a consistent, measurable lead generation engine.",
    priceRange: "From $500/mo",
    tiers: ["Presence", "Momentum", "Dominate"],
  },
];

function getCategoryHref(slug: string) {
  switch (slug) {
    case "website-packages":
      return "/packages/website";
    case "launch-bundles":
      return "/packages/launch";
    case "maintenance-plans":
      return "/packages/maintenance";
    case "marketing-packages":
      return "/packages/marketing";
    default:
      return "/contact";
  }
}

function buildCategoryCards(packages: PublishedPackage[]) {
  const grouped = packages.reduce<Map<string, { name: string; href: string; tagline: string; description: string; priceRange: string; tiers: string[] }>>(
    (acc, pkg) => {
      const categorySlug = pkg.category?.slug || "";
      const key = categorySlug || pkg.category?.name || "featured-packages";
      const fallbackCategory =
        fallbackCategories.find((category) => getCategoryHref(categorySlug) === category.href) ||
        fallbackCategories[0];

      if (!acc.has(key)) {
        acc.set(key, {
          name: pkg.category?.name || fallbackCategory.name,
          href: getCategoryHref(categorySlug),
          tagline: fallbackCategory.tagline,
          description: fallbackCategory.description,
          priceRange: formatPriceLabel(pkg.price, pkg.billing_period),
          tiers: [],
        });
      }

      const entry = acc.get(key);
      if (entry) {
        entry.tiers.push(pkg.name);
      }

      return acc;
    },
    new Map()
  );

  return Array.from(grouped.values()).map((category, index) => ({
    number: String(index + 1).padStart(2, "0"),
    ...category,
  }));
}

/* ============================================================
   COMPONENT: Packages Hub
   ============================================================ */
export default async function PackagesPage() {
  const cmsPackages = await getPublishedPackages();

  const categories =
    cmsPackages.length > 0
      ? buildCategoryCards(cmsPackages)
      : fallbackCategories.map((category, index) => ({
          number: String(index + 1).padStart(2, "0"),
          ...category,
        }));

  return (
    <>
      <JsonLd
        data={[
          webPage("CollectionPage", {
            path: "/packages",
            name: "Web Design Packages & Pricing",
            description:
              "Website packages, launch bundles, maintenance plans, marketing packages, and the Print Shop add-on from Foundry Frame.",
            extra: {
              hasPart: [
                { "@type": "WebPage", name: "Website Packages", url: absoluteUrl("/packages/website") },
                { "@type": "WebPage", name: "Launch Bundles", url: absoluteUrl("/packages/launch") },
                { "@type": "WebPage", name: "Maintenance Plans", url: absoluteUrl("/packages/maintenance") },
                { "@type": "WebPage", name: "Marketing Packages", url: absoluteUrl("/packages/marketing") },
                { "@type": "WebPage", name: "Print Shop Add-On", url: absoluteUrl("/packages/print-shop") },
                { "@type": "WebPage", name: "Package Builder", url: absoluteUrl("/packages/builder") },
              ],
            },
          }),
          breadcrumbList([{ name: "Packages", path: "/packages" }]),
        ]}
      />
      {/* =============================================
          HERO
          ============================================= */}
      <PageHero
        kicker="Web Design Packages & Pricing"
        eyebrow="Packages"
        title={
          <>
            Simple, <em className="serif-accent text-molten-deep">transparent</em> pricing.
          </>
        }
        intro={
          <p>
            Four categories. Every scope. One team. Every price below is a
            starting point — we&apos;ll confirm the exact number on a free call,
            with no obligation to move forward.
          </p>
        }
        actions={
          <>
            <Link href="/packages/website/spark" className="btn btn-molten min-h-13 px-7">
              The Spark &middot; from $1,500 &rarr;
            </Link>
            <Link href="/contact" className="btn btn-primary min-h-13 px-7">
              Book a Free Call
            </Link>
            <Link href="/packages/builder" className="btn btn-glass min-h-13 px-7">
              Build Your Package
            </Link>
          </>
        }
        photo="shopOwners"
        photoLabel="No hidden fees"
      >
        <Link
          href="/packages/print-shop"
          data-track="Packages hero: Print Shop"
          className="group inline-flex min-h-11 items-center gap-3 rounded-full border-[1.5px] border-ink bg-paper py-1.5 pl-1.5 pr-4 text-sm text-ink"
        >
          <span className="shrink-0 rounded-full bg-molten px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
            New
          </span>
          <span>
            <span className="font-semibold">Print Shop</span> with every package for $150
          </span>
          <span aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </Link>
      </PageHero>

      {/* =============================================
          THE SPARK
          ============================================= */}
      <SparkSpotlight heading="New here? Start with The Spark" />

      {/* =============================================
          PRINT SHOP (NEW)
          ============================================= */}
      <PrintShopAddOn trackLabel="Packages hub: Print Shop" />

      {/* =============================================
          FEATURED: LAUNCH BUNDLES + MAINTENANCE PLANS
          ============================================= */}
      <PackageHighlights
        heading="Start with a launch bundle. Stay sharp with a maintenance plan."
        showAllLink={false}
      />


      {/* =============================================
          CATEGORY GRID
          ============================================= */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.number}
                href={cat.href}
                className="glass-card rounded-card group p-10 lg:p-14 flex flex-col"
              >
                <div className="flex items-start justify-between mb-8">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted">
                    {cat.number}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted group-hover:text-ink transition-colors">
                    View &rarr;
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-2 leading-tight">
                  {cat.name}
                </h2>
                <p className="text-xs uppercase tracking-widest text-muted mb-6">
                  {cat.tagline}
                </p>
                <p className="text-body text-sm leading-relaxed mb-8 max-w-sm">
                  {cat.description}
                </p>
                <div className="mt-auto">
                  <p className="text-xs text-muted uppercase tracking-widest mb-3">
                    Tiers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.tiers.map((tier) => (
                      <span
                        key={tier}
                        className="text-xs uppercase tracking-widest border border-ink/10 text-muted px-2 py-1 rounded-full"
                      >
                        {tier}
                      </span>
                    ))}
                  </div>
                  <p className="text-ink font-heading font-bold text-lg mt-6">
                    {cat.priceRange}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-6">
              Need a custom mix?
            </h2>
            <p className="text-muted text-sm mb-8 max-w-lg">
              Every engagement starts with a conversation. Tell us about your
              goals and we&apos;ll point you toward the right package — or build
              a custom scope that fits exactly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/packages/builder"
                className="btn btn-primary text-center"
              >
                Build Your Package
              </Link>
              <Link
                href="/contact"
                className="btn btn-glass text-center"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
      <AuditCallout />
    </>
  );
}
