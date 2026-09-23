/**
 * ConversionTracking - Foundry Frame
 * ====================================
 * One delegated click listener that reports lead-intent clicks (booking
 * link, phone, email, audit/contact CTAs) to GA4. Lives in the root layout
 * so server-rendered pages don't each need their own onClick handlers.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect } from "react";
import { BOOKING_URL, trackEvent } from "@/lib/analytics";

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
        trackEvent("book_call_click", { link_text: label });
      } else if (href.startsWith("tel:")) {
        trackEvent("contact_click", { method: "phone", link_text: label });
      } else if (href.startsWith("mailto:")) {
        trackEvent("contact_click", { method: "email", link_text: label });
      } else if (/^\/(audit|contact)(?:[?#]|$)/.test(href)) {
        trackEvent("cta_click", { destination: href, link_text: label });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
