/**
 * Industry + Area Open Graph Image - Foundry Frame
 * =================================================
 * Share image for each /industries/[slug]/[area] page: the page title split
 * onto two lines, read from src/lib/seo/industry-areas.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { OgImageContent, fitHeadlineSize, size, contentType } from "@/lib/og-image";
import { getIndustryArea } from "@/lib/seo/industry-areas";

export const alt = "Foundry Frame industry websites for local Ohio businesses";
export { size, contentType };

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; area: string }>;
}) {
  const { slug, area } = await params;
  const page = getIndustryArea(slug, area);
  /* "Contractor Websites in Lorain County, OH" -> two lines at " in ". */
  const headline = page?.title.split(/ (?=in )/);

  return new ImageResponse(
    headline && page ? (
      <OgImageContent
        headline={headline}
        headlineSize={fitHeadlineSize(headline)}
        tagline="Custom websites from $1,500 · Built in Lorain, Ohio"
      />
    ) : (
      <OgImageContent />
    ),
    { ...size }
  );
}
