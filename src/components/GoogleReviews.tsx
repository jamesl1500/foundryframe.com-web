/**
 * Google Reviews - Foundry Frame
 * ================================
 * Glass panel of verbatim Google reviews from site-facts, linking out to
 * the Google Business Profile. Used on the homepage and every website
 * package details page. No review schema on purpose; see GOOGLE_REVIEWS.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { GOOGLE_MAPS_URL, GOOGLE_REVIEWS } from "@/lib/site-facts";

export default function GoogleReviews({ className = "" }: { className?: string }) {
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="glass rounded-panel p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-5">From Our Google Reviews</p>
            <div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-track="Google reviews: read on Google"
                className="btn btn-glass min-h-10 px-5 text-sm"
              >
                Read our reviews on Google &rarr;
              </a>
            </div>
          </div>
          <div
            className={`lg:col-span-8 grid grid-cols-1 gap-12 ${
              GOOGLE_REVIEWS.length > 1 ? "md:grid-cols-2" : ""
            }`}
          >
            {GOOGLE_REVIEWS.map((review) => (
              <figure key={review.author}>
                <p
                  className="text-accent text-xl tracking-[0.15em] mb-4"
                  role="img"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {"★".repeat(review.rating)}
                </p>
                <blockquote className="text-2xl sm:text-4xl font-heading font-semibold tracking-tight text-ink leading-tight">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm text-muted">
                  {review.author} &middot; Google review
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
