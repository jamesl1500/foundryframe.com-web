/**
 * Default Open Graph Image - Foundry Frame
 * ==========================================
 * Generated at request/build time via next/og instead of reusing the static
 * founder portrait (james-latten.jpg) as the site-wide social share image.
 * Route segments with their own unique share image (blog/[slug]) set
 * openGraph.images explicitly and are unaffected.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { OgImageContent, size, contentType } from "@/lib/og-image";

export const alt = "Foundry Frame | Creative Design Agency";
export { size, contentType };

export default function Image() {
  return new ImageResponse(<OgImageContent />, { ...size });
}
