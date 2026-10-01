/**
 * ConversionTracking - Foundry Frame
 * ====================================
 * One delegated click listener that reports lead-intent clicks (booking
 * link, phone, email, audit/contact/founding CTAs). Booking and phone clicks
 * are conversions, so they also go to Google Ads and Meta. Lives in the root
 * layout so server-rendered pages don't each need their own onClick handlers.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect } from "react";
import { BOOKING_URL, trackConversion, trackEvent } from "@/lib/analytics";

function linkLabel(anchor: HTMLAnchorElement) {
  return (anchor.dataset.track ?? anchor.textContent ?? "").trim().slice(0, 100);
}

export default function ConversionTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href") ?? "";
      const label = linkLabel(anchor);

      if (href.startsWith(BOOKING_URL)) {
        trackConversion("booking", { params: { link_text: label } });
      } else if (href.startsWith("tel:")) {
        trackConversion("call", { params: { link_text: label } });
      } else if (href.startsWith("mailto:")) {
        trackEvent("contact_click", { method: "email", link_text: label });
      } else if (/^\/(audit|contact|founding)(?:[?#]|$)/.test(href)) {
        trackEvent("cta_click", { destination: href, link_text: label });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
