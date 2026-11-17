/**
 * Photo - Foundry Frame
 * =======================
 * next/image for Unsplash photos from the catalog in lib/media/unsplash.ts.
 * A custom loader asks Unsplash's CDN for each responsive size directly, so
 * we get srcset, lazy loading, and AVIF/WebP without routing images through
 * the Next.js optimizer. Client component because next/image's `loader`
 * prop is a function; server components pass the photo key instead.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { photos, unsplashUrl, type PhotoKey } from "@/lib/media/unsplash";

const unsplashLoader = ({ src, width, quality }: ImageLoaderProps) =>
  unsplashUrl(src, width, quality ?? 75);

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
    <Image
      loader={unsplashLoader}
      src={photo.id}
      alt={alt ?? photo.alt}
      sizes={sizes}
      className={className}
      preload={preload}
      {...sizing}
    />
  );
}
