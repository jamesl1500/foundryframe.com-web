/**
 * Website Package Open Graph Image - Foundry Frame
 * ==================================================
 * Share image for each /packages/website/[slug] page: the tier name and
 * its starting price, read from src/lib/packages/website.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { OgImageContent, size, contentType } from "@/lib/og-image";
import { getWebsitePackage } from "@/lib/packages/website";

export const alt = "Foundry Frame custom website package";
export { size, contentType };

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getWebsitePackage(slug);

  return new ImageResponse(
    pkg ? (
      <OgImageContent
        headline={[pkg.name]}
        tagline={`${pkg.pricePrefix ? `${pkg.pricePrefix} ${pkg.price}` : "Custom pricing"} · ${pkg.headline}`}
      />
    ) : (
      <OgImageContent />
    ),
    { ...size }
  );
}
