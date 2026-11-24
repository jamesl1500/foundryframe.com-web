/**
 * Unsplash Image - Foundry Frame
 * ================================
 * The client half of <Photo>: next/image with a custom loader that asks
 * Unsplash's CDN for each responsive size directly, so we get srcset, lazy
 * loading, and AVIF/WebP without routing images through the Next.js
 * optimizer. A client component only because the `loader` prop is a
 * function; it takes the resolved id and alt text so the photo catalog
 * stays on the server.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { unsplashUrl } from "@/lib/media/unsplash-url";

const unsplashLoader = ({ src, width, quality }: ImageLoaderProps) =>
  unsplashUrl(src, width, quality ?? 75);

export type UnsplashImageProps = {
  /** The "photo-..." id from the catalog. */
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
} & ({ fill: true; width?: never; height?: never } | { fill?: false; width: number; height: number });

export default function UnsplashImage({ src, alt, className, sizes, preload, ...sizing }: UnsplashImageProps) {
  return (
    <Image
      loader={unsplashLoader}
      src={src}
      alt={alt}
      sizes={sizes}
      className={className}
      preload={preload}
      {...sizing}
    />
  );
}
