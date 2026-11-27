/**
 * Print Shop Add-On - Foundry Frame
 * ===================================
 * Puts the new Print Shop add-on ($150 with any package) in front of
 * visitors, and makes the case for pairing it with The Spark.
 *
 * - variant="feature": a full panel with the four print pieces and a
 *   Spark + Print Shop combo card. Used on the packages hub, the website
 *   packages page, and The Spark's details page.
 * - variant="banner": a compact strip for the other package pages
 *   (launch bundles, maintenance, marketing, other website tiers).
 *   Pass `included` on launch bundle pages: every bundle includes Print
 *   Shop at no extra cost, so the banner says so instead of quoting $150.
 *
 * Copy and price read from src/lib/packages/print-shop.ts and
 * src/lib/packages/website.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";
import Photo from "@/components/media/Photo";
import {
  PRINT_ITEMS,
  PRINT_SHOP,
  PRINT_SHOP_INCLUDED_TEXT,
  PRINT_SHOP_LARGER_RUNS,
} from "@/lib/packages/print-shop";
import { getWebsitePackage } from "@/lib/packages/website";

type PrintShopAddOnProps = {
  variant?: "feature" | "banner";
  /** Feature heading. Defaults to a line that names the add-on and its price. */
  heading?: string;
  /** Where the panel sits, for click tracking. */
  trackLabel?: string;
  /** Banner only: Print Shop comes with this package (launch bundles). */
  included?: boolean;
};

const sparkPrice = () => getWebsitePackage("spark")?.price ?? "$1,500";

export default function PrintShopAddOn({
  variant = "feature",
  heading,
  trackLabel = "Print Shop",
  included = false,
}: PrintShopAddOnProps) {
  return variant === "banner" ? (
    <PrintShopBanner trackLabel={trackLabel} included={included} />
  ) : (
    <PrintShopFeature heading={heading} trackLabel={trackLabel} />
  );
}

/* ============================================================
   FEATURE PANEL
   ============================================================ */
function PrintShopFeature({ heading, trackLabel }: { heading?: string; trackLabel: string }) {
  return (
    <section aria-labelledby="print-shop-heading" className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-panel border-[1.5px] border-ink bg-paper grid grid-cols-1 lg:grid-cols-12">
          {/* --- Copy + print pieces --- */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-14">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-molten px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink border-[1.5px] border-ink -rotate-2">
                {PRINT_SHOP.badge}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                Print Shop &middot; included as an option with every package
              </span>
            </div>
            <h2
              id="print-shop-heading"
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-[-0.04em] leading-[0.95] text-ink"
            >
              {heading ?? (
                <>
                  Add Print Shop to any package for{" "}
                  <em className="serif-accent text-molten-deep">{PRINT_SHOP.priceLabel}</em>
                </>
              )}
            </h2>
            <p className="mt-5 max-w-xl text-body text-lg leading-relaxed">
              Your website is only half of a first impression. For a flat{" "}
              <span className="font-semibold text-ink">{PRINT_SHOP.priceLabel}</span>, we design
              and print the pieces customers hold in their hands, matched to the brand on your
              new site. Every order includes{" "}
              <span className="font-semibold text-ink">{PRINT_SHOP_INCLUDED_TEXT}</span>.
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRINT_ITEMS.map((item, i) => (
                <li key={item.name} className="rounded-card border-[1.5px] border-ink/15 bg-canvas p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-heading font-bold text-lg text-ink">{item.name}</h3>
                    <span className="font-mono text-xs text-molten-deep">0{i + 1}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {item.spec}
                  </p>
                  <p className="mt-3 text-sm text-body leading-relaxed">{item.description}</p>
                  {item.included && (
                    <p className="mt-3 text-sm font-heading font-bold text-ink">{item.included}</p>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{PRINT_SHOP_LARGER_RUNS}</p>

            <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <Link
                href={PRINT_SHOP.href}
                data-track={`${trackLabel}: details`}
                className="btn btn-primary min-h-13 px-6 sm:px-7 w-full sm:w-auto"
              >
                See Print Shop &rarr;
              </Link>
              <Link
                href="/packages/builder"
                data-track={`${trackLabel}: builder`}
                className="btn btn-glass min-h-13 px-6 sm:px-7 w-full sm:w-auto"
              >
                Open the Package Builder
              </Link>
            </div>
          </div>

          {/* --- The Spark + Print Shop combo --- */}
          <div className="lg:col-span-5 flex flex-col border-t-[1.5px] lg:border-t-0 lg:border-l-[1.5px] border-ink bg-molten">
            <div className="relative h-56 lg:h-auto lg:flex-1 border-b-[1.5px] border-ink bg-ink">
              <Photo
                name="coffeeBrand"
                alt="Branded coffee cups and bags, an example of a brand carried into print"
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover opacity-90"
              />
              <span className="sticker absolute left-4 top-4">Best with The Spark</span>
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
                The perfect pairing
              </p>
              <p className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] leading-tight text-ink">
                The Spark + Print Shop
              </p>
              <dl className="mt-5 border-t-[1.5px] border-ink/30">
                <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-ink/20">
                  <dt className="text-sm text-ink">The Spark: custom 5-page website</dt>
                  <dd className="font-heading font-bold text-ink whitespace-nowrap">from {sparkPrice()}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-ink/20">
                  <dt className="text-sm text-ink">Print Shop add-on</dt>
                  <dd className="font-heading font-bold text-ink whitespace-nowrap">+{PRINT_SHOP.priceLabel}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-ink/80 leading-relaxed">
                Launch online and in print at the same time: one logo, one set of colors, one
                message on your website, cards, mailers, envelopes, and brochures.
              </p>
              <Link
                href="/packages/website/spark"
                data-track={`${trackLabel}: Spark pairing`}
                className="btn btn-primary mt-6 min-h-12 px-6 w-full sm:w-auto"
              >
                Start with The Spark &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   BANNER
   ============================================================ */
function PrintShopBanner({ trackLabel, included }: { trackLabel: string; included: boolean }) {
  const pieces = PRINT_ITEMS.map((item, i) => (
    <span key={item.name}>
      {i > 0 && (i === PRINT_ITEMS.length - 1 ? ", and " : ", ")}
      <span className="font-semibold text-ink">
        {item.name === "Custom envelopes" ? "custom #10 and A6 envelopes" : item.name.toLowerCase()}
      </span>
    </span>
  ));

  return (
    <section aria-label={included ? "Print Shop, included" : "Print Shop add-on"} className="py-10 lg:py-14">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="rounded-panel border-[1.5px] border-ink bg-paper p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-molten px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-ink border-[1.5px] border-ink">
                {included ? "Included" : PRINT_SHOP.badge}
              </span>
              <p className="font-heading text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-ink">
                {included
                  ? "Print Shop is included with every launch bundle"
                  : `Print Shop, with any package, for ${PRINT_SHOP.priceLabel}`}
              </p>
            </div>
            {included ? (
              <p className="mt-3 text-body text-sm sm:text-base leading-relaxed max-w-3xl">
                At no additional cost, we design and print {pieces} to match your new brand, so you
                launch online and in print at the same time.
              </p>
            ) : (
              <p className="mt-3 text-body text-sm sm:text-base leading-relaxed max-w-3xl">
                We design and print {pieces} to match your brand. Best paired with{" "}
                <Link href="/packages/website/spark" className="font-semibold text-molten-deep underline underline-offset-4">
                  The Spark
                </Link>{" "}
                ({sparkPrice()} + {PRINT_SHOP.priceLabel}) to launch online and in print together.
              </p>
            )}
            <p className="mt-2 text-body text-sm leading-relaxed max-w-3xl">
              Includes {PRINT_SHOP_INCLUDED_TEXT}. {PRINT_SHOP_LARGER_RUNS}
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
            <Link
              href={PRINT_SHOP.href}
              data-track={`${trackLabel}: banner details`}
              className="btn btn-molten min-h-12 px-6 w-full sm:w-auto"
            >
              See Print Shop &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
