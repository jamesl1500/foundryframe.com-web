/**
 * Spark Spotlight - Foundry Frame
 * =================================
 * Loud molten panel that puts The Spark, the entry-level website package,
 * in front of visitors as the place to start: price, what's included, the
 * five pages, the Print Shop pairing (+$150), and a photo with a spinning
 * price badge. Dropped into the
 * packages hub, About, the web design service page, and every city and
 * industry landing page. Copy and price read from src/lib/packages/website.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";
import Photo from "@/components/media/Photo";
import SpinBadge from "@/components/motion/SpinBadge";
import { PRINT_SHOP, PRINT_SHOP_INCLUDED_TEXT } from "@/lib/packages/print-shop";
import { getWebsitePackage } from "@/lib/packages/website";

const pages = ["Home", "About", "Services", "Contact", "+1 your pick"];

export default function SparkSpotlight({
  heading = "Start with The Spark",
}: {
  heading?: string;
}) {
  const spark = getWebsitePackage("spark");
  if (!spark) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-panel border-[1.5px] border-ink bg-molten grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-white -rotate-2">
                {spark.badge ?? "Start Here"}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                Entry-level website package
              </span>
            </div>
            <h2 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-[-0.045em] leading-[0.92] text-ink">
              {heading}
            </h2>
            <p className="mt-5 text-xl text-ink font-heading">
              {spark.headline}, {spark.pricePrefix?.toLowerCase()}{" "}
              <span className="font-bold">{spark.price}</span>.
            </p>
            <p className="mt-4 max-w-xl text-ink/80 leading-relaxed">
              {spark.intro}
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {[
                "Mobile-first design",
                "On-page SEO built in",
                "Contact form & analytics",
                `Launch in ${spark.timeline}`,
              ].map((point) => (
                <li
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-molten px-4 py-2 text-sm font-medium text-ink"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 bg-ink" />
                  {point}
                </li>
              ))}
            </ul>
            {/* The Spark pairs with the Print Shop add-on */}
            <Link
              href={PRINT_SHOP.href}
              data-track="Spark spotlight: Print Shop"
              className="group mt-7 flex max-w-xl flex-col sm:flex-row items-start gap-3 sm:gap-4 rounded-card border-[1.5px] border-ink bg-paper p-4 sm:p-5 transition-shadow hover:shadow-[4px_4px_0_var(--color-ink)]"
            >
              <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                {PRINT_SHOP.badge}
              </span>
              <span className="text-sm text-ink leading-relaxed">
                <span className="font-heading font-bold">
                  Add Print Shop to The Spark for {PRINT_SHOP.priceLabel}.
                </span>{" "}
                {PRINT_SHOP_INCLUDED_TEXT}, plus postcards and A6 envelopes, designed and printed
                to match your new site.{" "}
                <span className="font-semibold text-molten-deep underline-offset-4 group-hover:underline">
                  See Print Shop &rarr;
                </span>
              </span>
            </Link>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/packages/website/${spark.slug}`}
                data-track="Spark spotlight: details"
                className="btn btn-primary min-h-13 px-7"
              >
                See what&apos;s included &rarr;
              </Link>
              <Link
                href="/contact"
                data-track="Spark spotlight: get started"
                className="btn btn-glass min-h-13 px-7 hover:bg-ink hover:text-white"
              >
                {spark.cta}
              </Link>
            </div>
          </div>

          {/* Photo with the five pages and a spinning price badge */}
          <div className="relative lg:col-span-5 min-h-[22rem] border-t-[1.5px] lg:border-t-0 lg:border-l-[1.5px] border-ink bg-ink">
            <Photo
              name="sparkler"
              alt=""
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover opacity-90"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
              <SpinBadge
                id="spotlight-badge"
                text={`${spark.pricePrefix ?? "From"} ${spark.price} ✦ The Spark ✦ `}
                ringClassName="fill-white"
                className="h-28 w-28 rounded-full border-[1.5px] border-white/70 bg-ink/40"
                center={
                  <span className="font-heading text-lg font-bold leading-none text-molten">
                    {spark.price}
                  </span>
                }
              />
            </div>
            <ul aria-label="Pages included" className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5 sm:p-8">
              {pages.map((page, i) => (
                <li
                  key={page}
                  className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink border-[1.5px] border-ink"
                >
                  <span className="mr-1 font-mono text-[10px] text-molten-deep">0{i + 1}</span>
                  {page}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
