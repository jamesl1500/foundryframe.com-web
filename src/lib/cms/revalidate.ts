/**
 * CMS revalidation - Foundry Frame
 * ==================================
 * Public pages that read from Supabase are prerendered for speed. After an
 * admin creates, edits, or deletes a CMS row, this marks the pages that show
 * that table as stale, so the next visit renders them with the new data. No
 * redeploy needed.
 *
 * Every CMS page also exports `revalidate = 60` as a safety net for edits
 * made outside the admin (e.g. straight in the Supabase dashboard).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { revalidatePath } from "next/cache";
import type { CmsEntity } from "@/lib/cms/types";

/* Literal paths, or [pattern, "page"] for every page of a dynamic route. */
const PAGES_BY_ENTITY: Record<CmsEntity, Array<string | [string, "page"]>> = {
  case_studies: ["/case-studies", ["/case-studies/[slug]", "page"], "/sitemap.xml"],
  services: ["/", "/services"],
  packages: ["/packages"],
  clients: ["/"],
};

export function revalidateCmsPages(entity: CmsEntity) {
  for (const page of PAGES_BY_ENTITY[entity]) {
    if (typeof page === "string") revalidatePath(page);
    else revalidatePath(page[0], page[1]);
  }
}
