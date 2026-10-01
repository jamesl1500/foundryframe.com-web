/**
 * Analytics helpers - Foundry Frame
 * ===================================
 * Thin wrapper around the GA4 / Google Ads gtag snippet and the Meta Pixel
 * loaded in the root layout, so components can report conversions without
 * touching window.gtag or window.fbq directly.
 *
 * GA4 events (mark the conversion ones as key events in GA4 > Admin > Events):
 *   - generate_lead      audit, contact form, package builder, or founding
 *                        application sent (param: method)
 *   - book_call_click    click on the Google Calendar booking link
 *   - contact_click      click on a tel: or mailto: link (param: method)
 *   - cta_click          click on any link to /audit, /contact or /founding
 *
 * On the production deployment, every conversion is also sent to Google Ads
 * (when NEXT_PUBLIC_GOOGLE_ADS_ID and that conversion's label are set) and to
 * Meta as a Pixel event plus a matching Conversions API event. Form leads are
 * sent to the Conversions API by the form's own API route after a successful
 * submission; click conversions (booking, call) go through /api/track. Both
 * Meta copies share one event ID so Meta counts them once.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export const BOOKING_URL = "https://calendar.app.google/BugYDt3yg1oWBfpH7";

/* --- Tracking IDs (all public; set in the deployment's env vars) ---
   AD_TRACKING_ENABLED is set in next.config.ts: on for the Vercel production
   deployment (or with AD_TRACKING_ENABLED=true), off for local and preview
   builds, so test traffic never reaches the live Google Ads and Meta accounts. */
export const AD_TRACKING_ENABLED = process.env.AD_TRACKING_ENABLED === "true";
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-2723XGFRH7";
export const GOOGLE_ADS_ID = AD_TRACKING_ENABLED ? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "" : "";
export const META_PIXEL_ID = AD_TRACKING_ENABLED
  ? process.env.NEXT_PUBLIC_META_PIXEL_ID || "28899294216427049"
  : "";

/* Each env var is read by its literal name so Next can inline it. */
const GOOGLE_ADS_LABELS = {
  audit: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_AUDIT || "",
  contact: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT || "",
  booking: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_BOOKING || "",
  call: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL || "",
};

export type ConversionKind = "audit" | "contact" | "package_builder" | "founding" | "booking" | "call";

/* Meta standard event names this site sends. Lead comes only from form API
   routes; /api/track only forwards the click events. */
export type MetaEventName = "Lead" | "Schedule" | "Contact";
export const META_CLICK_EVENT_NAMES = ["Schedule", "Contact"] as const;

/* Form kinds whose Meta Conversions API event is sent by the server. */
const SERVER_SIDE_KINDS: ReadonlySet<ConversionKind> = new Set(["audit", "contact", "package_builder", "founding"]);

const CONVERSIONS: Record<
  ConversionKind,
  { ga: string; gaParams: EventParams; adsLabel: string; meta: MetaEventName }
> = {
  audit: { ga: "generate_lead", gaParams: { method: "website_audit" }, adsLabel: GOOGLE_ADS_LABELS.audit, meta: "Lead" },
  contact: { ga: "generate_lead", gaParams: { method: "contact_form" }, adsLabel: GOOGLE_ADS_LABELS.contact, meta: "Lead" },
  package_builder: { ga: "generate_lead", gaParams: { method: "package_builder" }, adsLabel: GOOGLE_ADS_LABELS.contact, meta: "Lead" },
  founding: { ga: "generate_lead", gaParams: { method: "founding_application" }, adsLabel: GOOGLE_ADS_LABELS.contact, meta: "Lead" },
  booking: { ga: "book_call_click", gaParams: {}, adsLabel: GOOGLE_ADS_LABELS.booking, meta: "Schedule" },
  call: { ga: "contact_click", gaParams: { method: "phone" }, adsLabel: GOOGLE_ADS_LABELS.call, meta: "Contact" },
};

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, {
    page_path: window.location.pathname,
    ...params,
  });
}

/** An event ID for one conversion, shared by the browser and server copies. */
export function newConversionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Report a conversion to GA4, Google Ads and the Meta Pixel. For forms, pass
 * the `eventId` that was sent with the submission (see newConversionId) so
 * the pixel event matches the Conversions API event the server sent.
 */
export function trackConversion(
  kind: ConversionKind,
  options: { params?: EventParams; value?: number; eventId?: string } = {}
) {
  if (typeof window === "undefined") return;
  const conversion = CONVERSIONS[kind];
  const eventId = options.eventId || newConversionId();
  const value = options.value;

  trackEvent(conversion.ga, {
    ...conversion.gaParams,
    ...options.params,
    ...(value !== undefined ? { value, currency: "USD" } : {}),
  });

  if (GOOGLE_ADS_ID && conversion.adsLabel && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${conversion.adsLabel}`,
      transaction_id: eventId,
      ...(value !== undefined ? { value, currency: "USD" } : {}),
    });
  }

  if (!META_PIXEL_ID) return;

  const customData: EventParams = {
    content_name: kind,
    ...(value !== undefined ? { value, currency: "USD" } : {}),
  };

  if (typeof window.fbq === "function") {
    window.fbq("track", conversion.meta, customData, { eventID: eventId });
  }

  if (SERVER_SIDE_KINDS.has(kind)) return;

  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName: conversion.meta,
        eventId,
        sourceUrl: window.location.href,
        customData,
      }),
    }).catch(() => undefined);
  } catch {
    // Tracking must never break the page.
  }
}
