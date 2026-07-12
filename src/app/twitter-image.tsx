/**
 * Default Twitter Card Image - Foundry Frame
 * =============================================
 * Mirrors src/app/opengraph-image.tsx so Twitter/X shares use the same
 * generated brand image instead of the static founder portrait.
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
