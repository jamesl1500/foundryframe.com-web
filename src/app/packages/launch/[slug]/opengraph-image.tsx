/**
 * Launch Bundle Open Graph Image - Foundry Frame
 * ================================================
 * Share image for each /packages/launch/[slug] page: the bundle name and
 * its starting price, read from src/lib/packages/launch.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { OgImageContent, size, contentType } from "@/lib/og-image";
import { getLaunchBundle, launchBundles } from "@/lib/packages/launch";

export const alt = "Foundry Frame launch bundle";
export { size, contentType };

/* Prerender one image per page at build time, so crawlers and link
   previews get a cached PNG instead of a fresh render on every request. */
export function generateStaticParams() {
  return launchBundles.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = getLaunchBundle(slug);

  return new ImageResponse(
    bundle ? (
      <OgImageContent
        headline={[bundle.name, "Launch Bundle"]}
        tagline={`${bundle.pricePrefix ? `${bundle.pricePrefix} ${bundle.price}` : "Custom pricing"} · Website, brand & support in one engagement`}
      />
    ) : (
      <OgImageContent />
    ),
    { ...size }
  );
}
