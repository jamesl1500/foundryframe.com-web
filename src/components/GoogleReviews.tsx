/**
 * Google Reviews - Foundry Frame
 * ================================
 * Compact band of verbatim Google reviews from site-facts, linking out to
 * the Google Business Profile. Used on the homepage and every website
 * package details page. No review schema on purpose; see GOOGLE_REVIEWS.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { GOOGLE_MAPS_URL, GOOGLE_REVIEWS } from "@/lib/site-facts";

export default function GoogleReviews({ className = "bg-black" }: { className?: string }) {
  return (
    <section className={`py-20 lg:py-24 border-t border-white/10 ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="lg:col-span-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
            From Our Google Reviews
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track="Google reviews: read on Google"
            className="text-xs uppercase tracking-wider text-gray-300 hover:text-white border-b border-gray-400 hover:border-white pb-1 transition-colors"
          >
            Read our reviews on Google &rarr;
          </a>
        </div>
        <div
          className={`lg:col-span-8 grid grid-cols-1 gap-12 ${
            GOOGLE_REVIEWS.length > 1 ? "md:grid-cols-2" : ""
          }`}
        >
          {GOOGLE_REVIEWS.map((review) => (
            <figure key={review.author}>
              <p
                className="text-accent text-lg tracking-widest mb-5"
                role="img"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {"★".repeat(review.rating)}
              </p>
              <blockquote className="text-2xl sm:text-3xl font-heading font-bold text-white leading-tight">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm text-gray-400">
                {review.author} &middot; Google review
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
