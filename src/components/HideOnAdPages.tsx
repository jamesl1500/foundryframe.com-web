/**
 * HideOnAdPages - Foundry Frame
 * ===============================
 * Leaves out the site-wide header, footer and floating badges on ad landing
 * pages (/go/<slug>), so those pages keep visitors on their one offer.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { usePathname } from "next/navigation";
import { AD_PAGE_PREFIX } from "@/lib/funnels";

export default function HideOnAdPages({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith(AD_PAGE_PREFIX)) return null;
  return <>{children}</>;
}
