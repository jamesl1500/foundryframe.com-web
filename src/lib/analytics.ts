/**
 * Analytics helpers - Foundry Frame
 * ===================================
 * Thin wrapper around the GA4 gtag snippet loaded in the root layout, so
 * components can report conversions without touching window.gtag directly.
 *
 * Conversion events (mark these as key events in GA4 > Admin > Events):
 *   - generate_lead      audit started or contact form sent (param: method)
 *   - book_call_click    click on the Google Calendar booking link
 *   - contact_click      click on a tel: or mailto: link (param: method)
 *   - cta_click          click on any link to /audit or /contact
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export const BOOKING_URL = "https://calendar.app.google/BugYDt3yg1oWBfpH7";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: EventParams) => void;
  }
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, {
    page_path: window.location.pathname,
    ...params,
  });
}
