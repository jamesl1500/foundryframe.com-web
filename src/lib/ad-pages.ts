/**
 * Ad page path - Foundry Frame
 * ==============================
 * The /go/ prefix on its own, so site-wide client components (the header
 * and chat hide themselves on ad pages) can check it without bundling all
 * the ad funnel copy in lib/funnels.ts into every page.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

/** Every ad landing page lives under this path. */
export const AD_PAGE_PREFIX = "/go/";
