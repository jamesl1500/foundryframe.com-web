/**
 * Location Open Graph Image - Foundry Frame
 * ==========================================
 * Share image for each /locations/[slug] page: "Web Design" plus the city,
 * read from src/lib/seo/locations.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { OgImageContent, fitHeadlineSize, size, contentType } from "@/lib/og-image";
import { getLocation } from "@/lib/seo/locations";

export const alt = "Foundry Frame web design for local Ohio businesses";
export { size, contentType };

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocation(slug);
  const headline = location ? ["Web Design", location.city] : undefined;

  return new ImageResponse(
    headline && location ? (
      <OgImageContent
        headline={headline}
        headlineSize={fitHeadlineSize(headline)}
        tagline={`${location.county}, Ohio · Custom small business websites from $1,500`}
      />
    ) : (
      <OgImageContent />
    ),
    { ...size }
  );
}
