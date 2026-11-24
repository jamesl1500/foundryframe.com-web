/**
 * Industry Open Graph Image - Foundry Frame
 * ==========================================
 * Share image for each /industries/[slug] page: the industry name, split at
 * its "&" so it fits on two lines, read from src/lib/seo/industries.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { OgImageContent, fitHeadlineSize, size, contentType } from "@/lib/og-image";
import { getIndustry, industries } from "@/lib/seo/industries";

export const alt = "Foundry Frame website design for your industry";
export { size, contentType };

/* Prerender one image per page at build time, so crawlers and link
   previews get a cached PNG instead of a fresh render on every request. */
export function generateStaticParams() {
  return industries.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  const headline = industry?.name.split(/ (?=& )/);

  return new ImageResponse(
    headline && industry ? (
      <OgImageContent
        headline={headline}
        headlineSize={fitHeadlineSize(headline)}
        tagline={`Websites for ${industry.audience} · Custom sites from $1,500`}
      />
    ) : (
      <OgImageContent />
    ),
    { ...size }
  );
}
