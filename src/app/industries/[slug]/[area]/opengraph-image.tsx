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
import { getIndustryArea, industryAreas } from "@/lib/seo/industry-areas";

export const alt = "Foundry Frame industry websites for local Ohio businesses";
export { size, contentType };

/* Prerender one image per page at build time, so crawlers and link
   previews get a cached PNG instead of a fresh render on every request. */
export function generateStaticParams() {
  return industryAreas.map(({ industrySlug, areaSlug }) => ({ slug: industrySlug, area: areaSlug }));
}

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
