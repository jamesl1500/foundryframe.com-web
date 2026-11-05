/**
 * Spark Spotlight - Foundry Frame
 * =================================
 * Glass panel that puts The Spark, the entry-level website package, in
 * front of visitors as the place to start. The five page "bubbles" show
 * what the package includes at a glance. Copy and price read from
 * src/lib/packages/website.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";
import Float from "@/components/motion/Float";
import { getWebsitePackage } from "@/lib/packages/website";

const pages = ["Home", "About", "Services", "Contact", "+1 of your choice"];

export default function SparkSpotlight({
  heading = "Start with The Spark",
}: {
  heading?: string;
}) {
  const spark = getWebsitePackage("spark");
  if (!spark) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="glass glow-field relative overflow-hidden rounded-panel p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="glass-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-accent-deep">
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-accent"
                />
                {spark.badge ?? "Start Here"}
              </span>
              <span className="eyebrow">Entry-Level Website Package</span>
            </div>
            <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-[-0.03em] leading-[0.95] text-ink">
              {heading}
            </h2>
            <p className="mt-4 text-xl text-ink-soft font-heading">
              {spark.headline}, {spark.pricePrefix?.toLowerCase()}{" "}
              <span className="font-bold text-ink">{spark.price}</span>.
            </p>
            <p className="mt-4 max-w-xl text-body leading-relaxed">
              {spark.intro}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                "Mobile-first design",
                "On-page SEO built in",
                "Contact form & analytics",
                `Launch in ${spark.timeline}`,
              ].map((point) => (
                <li
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-white px-4 py-2 text-sm text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className="font-bold text-accent-ink"
                  >
                    &#10003;
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/packages/website/${spark.slug}`}
                data-track="Spark spotlight: details"
                className="btn btn-primary"
              >
                See what&apos;s included &rarr;
              </Link>
              <Link
                href="/contact"
                data-track="Spark spotlight: get started"
                className="btn btn-glass"
              >
                {spark.cta}
              </Link>
            </div>
          </div>

          {/* The five pages, as floating bubbles */}
          <div className="lg:col-span-5" aria-hidden="true">
            <div className="relative mx-auto max-w-sm">
              <div className="grid grid-cols-2 gap-3">
                {pages.map((page, i) => (
                  <Float
                    key={page}
                    className={i === pages.length - 1 ? "col-span-2" : ""}
                    delay={i * 0.7}
                    distance={5}
                    duration={6 + (i % 3)}
                  >
                    <div
                      className={`glass-light rounded-bubble p-4 ${i % 2 === 1 ? "translate-y-4" : ""}`}
                    >
                      <div className="flex gap-1.5 mb-3">
                        <span className="w-2 h-2 rounded-full bg-ink/15" />
                        <span className="w-2 h-2 rounded-full bg-ink/15" />
                        <span className="w-2 h-2 rounded-full bg-accent/60" />
                      </div>
                      <div className="h-2 w-3/4 rounded-full bg-ink/10" />
                      <div className="mt-2 h-2 w-1/2 rounded-full bg-ink/10" />
                      <p className="mt-4 font-heading font-semibold text-ink">
                        {page}
                      </p>
                    </div>
                  </Float>
                ))}
              </div>
              <div className="glass-dark absolute -top-6 -right-3 sm:-right-6 w-24 h-24 rounded-full flex flex-col items-center justify-center text-center">
                <span className="font-heading font-bold text-xl leading-none">
                  {spark.price}
                </span>
                <span className="mt-1 text-xs text-white/70">to start</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
