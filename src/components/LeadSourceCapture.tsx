/**
 * LeadSourceCapture - Foundry Frame
 * ===================================
 * Records where a visitor came from (UTM tags, ad click IDs, referring site,
 * landing page) in a first-party cookie when they land, so the form API
 * routes can attach it to the lead. See src/lib/lead-source.ts.
 *
 * Runs once per full page load: ad and email clicks always arrive as one, and
 * in-site navigation never changes where the visitor came from.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect } from "react";
import {
  CLICK_ID_KEYS,
  LEAD_SOURCE_COOKIE,
  LEAD_SOURCE_MAX_AGE_DAYS,
  UTM_KEYS,
  isTrackedVisit,
  sanitizeLeadSource,
  serializeLeadSource,
  type LeadSource,
} from "@/lib/lead-source";

function hasStoredSource() {
  return document.cookie.split(";").some((part) => part.trim().startsWith(`${LEAD_SOURCE_COOKIE}=`));
}

function outsideReferrer(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const host = new URL(document.referrer).hostname;
    const ownSite = (h: string) => h.replace(/^www\./, "");
    return ownSite(host) === ownSite(window.location.hostname) ? undefined : host;
  } catch {
    return undefined;
  }
}

export default function LeadSourceCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const visit: Record<string, string | undefined> = {
        referrer: outsideReferrer(),
        landing_page: window.location.pathname,
        captured_at: new Date().toISOString(),
      };
      for (const key of UTM_KEYS) visit[key] = params.get(key) ?? undefined;
      const clickIdKey = CLICK_ID_KEYS.find((key) => params.get(key));
      if (clickIdKey) {
        visit.click_id_type = clickIdKey;
        visit.click_id = params.get(clickIdKey) ?? undefined;
      }

      const source: LeadSource | null = sanitizeLeadSource(visit);
      if (!source) return;
      // A plain direct visit only fills an empty slot; it never erases a campaign.
      if (!isTrackedVisit(source) && hasStoredSource()) return;

      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie =
        `${LEAD_SOURCE_COOKIE}=${serializeLeadSource(source)}; Path=/; ` +
        `Max-Age=${LEAD_SOURCE_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax${secure}`;
    } catch {
      // Attribution is best-effort; never break the page over it.
    }
  }, []);

  return null;
}
