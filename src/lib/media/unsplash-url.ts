/**
 * Unsplash URL builder - Foundry Frame
 * ======================================
 * Kept apart from the photo catalog (unsplash.ts) so the client image
 * loader can import it without pulling every photo's metadata into the
 * browser bundle.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

/**
 * Builds an images.unsplash.com URL at a given width. Unsplash's CDN
 * (imgix) handles the resize, crop, and AVIF/WebP conversion.
 */
export function unsplashUrl(id: string, width: number, quality = 75) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}
