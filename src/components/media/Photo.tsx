/**
 * Photo - Foundry Frame
 * =======================
 * An Unsplash photo from the catalog in lib/media/unsplash.ts, by key.
 * Not a client component: it resolves the photo's id and alt text where it
 * renders and hands only those to <UnsplashImage>, so pages rendered on the
 * server don't ship the whole photo catalog to the browser.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import UnsplashImage from "@/components/media/UnsplashImage";
import { photos, type PhotoKey } from "@/lib/media/unsplash";

type PhotoProps = {
  name: PhotoKey;
  /** Overrides the catalog's alt text. Pass "" for decorative photos. */
  alt?: string;
  className?: string;
  sizes?: string;
  /** Preload in <head>. Use only for the above-the-fold hero photo. */
  preload?: boolean;
} & (
  | { fill?: true; width?: never; height?: never }
  | { fill: false; width: number; height: number }
);

export default function Photo({
  name,
  alt,
  className = "object-cover",
  sizes = "100vw",
  preload = false,
  ...dimensions
}: PhotoProps) {
  const photo = photos[name];
  const sizing =
    dimensions.fill === false
      ? { width: dimensions.width, height: dimensions.height }
      : { fill: true as const };

  return (
    <UnsplashImage
      src={photo.id}
      alt={alt ?? photo.alt}
      sizes={sizes}
      className={className}
      preload={preload}
      {...sizing}
    />
  );
}
