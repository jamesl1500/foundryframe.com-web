/**
 * SEO metadata helpers - Foundry Frame
 * ======================================
 * Keeps titles and descriptions inside what Google shows in results
 * (about 60 and 155 characters), for pages whose copy comes from the CMS
 * or from content files and can run long.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

const TITLE_SUFFIX = " | Foundry Frame";
const MAX_TITLE = 60;

/** The page title, dropping the layout's " | Foundry Frame" suffix when it would push it past 60 characters. */
export function seoTitle(title: string): string | { absolute: string } {
  return title.length + TITLE_SUFFIX.length > MAX_TITLE ? { absolute: title } : title;
}

/** Shortens text to a meta description at a word boundary. */
export function summarize(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—-]\s*$/, "")}…`;
}
