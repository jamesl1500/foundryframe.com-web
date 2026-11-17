/**
 * PageHero - Foundry Frame
 * ==========================
 * The shared hero for interior pages: eyebrow, h1, intro, and actions on
 * the left; a framed Unsplash photo on the right, sitting on an offset
 * molten block with a slow Ken Burns push-in. On phones the photo drops
 * below the copy as a wide band.
 *
 * The h1 and copy are server-rendered with no reveal animation, so they
 * paint immediately (they're usually the page's LCP element).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import Photo from "@/components/media/Photo";
import type { PhotoKey } from "@/lib/media/unsplash";

type PageHeroProps = {
  eyebrow: ReactNode;
  /** h1 content. Wrap a word or phrase in <em className="serif-accent"> for the italic accent. */
  title: ReactNode;
  /** Small keyword line shown above the title, inside the h1, so slogan
      headlines still tell search engines what the page is about. */
  kicker?: string;
  intro?: ReactNode;
  /** Buttons row under the intro. */
  actions?: ReactNode;
  /** Extra content under the actions (notes, badges, small print). */
  children?: ReactNode;
  back?: { href: string; label: string };
  photo: PhotoKey;
  /** Short label on a sticker over the photo. */
  photoLabel?: string;
  /** Replaces the photo column entirely (e.g. a price card). */
  aside?: ReactNode;
  /** Extra classes for the h1 (e.g. a smaller size for long titles). */
  titleClassName?: string;
};

export default function PageHero({
  eyebrow,
  title,
  kicker,
  intro,
  actions,
  children,
  back,
  photo,
  photoLabel,
  aside,
  titleClassName = "text-5xl sm:text-7xl lg:text-[5.5rem]",
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-24">
      <div
        aria-hidden="true"
        className="paper-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        <div className="lg:col-span-7">
          {back && (
            <Link
              href={back.href}
              className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-ink transition-colors group-hover:bg-ink group-hover:text-white"
              >
                &larr;
              </span>
              {back.label}
            </Link>
          )}
          <div className="mb-6">
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h1
            className={`font-heading font-bold text-ink leading-[0.92] tracking-[-0.045em] ${titleClassName}`}
          >
            {kicker && (
              <span className="block mb-5 text-base sm:text-lg font-semibold tracking-normal leading-snug text-muted">
                {kicker}
                <span className="sr-only">{": "}</span>
              </span>
            )}
            {title}
          </h1>
          {intro && (
            <div className="mt-7 max-w-2xl space-y-4 text-body text-lg leading-relaxed">
              {intro}
            </div>
          )}
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
          {children && <div className="mt-6">{children}</div>}
        </div>

        <div className="lg:col-span-5">
          {aside ?? (
            <div className="relative mr-3 mb-3 sm:mr-4 sm:mb-4">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-panel bg-molten border-[1.5px] border-ink"
              />
              <div className="relative aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-panel border-[1.5px] border-ink bg-sand">
                <div className="absolute inset-0 animate-ken-burns">
                  <Photo
                    name={photo}
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    preload
                  />
                </div>
                {photoLabel && (
                  <span className="sticker absolute left-4 top-4">{photoLabel}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
