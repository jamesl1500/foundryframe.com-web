/**
 * Founding Client Open Graph Image - Foundry Frame
 * ==================================================
 * Share image for /founding. The offer line reads from site-facts, so the
 * image stays in step with the page whenever the spots or discount change.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { OgImageContent, size, contentType } from "@/lib/og-image";
import { FOUNDING_DISCOUNT_PERCENT, FOUNDING_SPOTS_OPEN } from "@/lib/site-facts";

export const alt = `Foundry Frame Founding Client Program: ${FOUNDING_DISCOUNT_PERCENT}% off any launch bundle`;
export { size, contentType };

export default function Image() {
  return new ImageResponse(
    <OgImageContent
      headline={["Founding Client", "Program"]}
      tagline={`${FOUNDING_DISCOUNT_PERCENT}% off any launch bundle · ${FOUNDING_SPOTS_OPEN} spots this quarter`}
    />,
    { ...size }
  );
}
