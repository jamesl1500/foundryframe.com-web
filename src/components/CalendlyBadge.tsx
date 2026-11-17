/**
 * CalendlyBadge - Foundry Frame
 * ==============================
 * Floating consultation-booking pill (flat, ink-outlined).
 * Links directly to the Google Calendar booking page (no third-party
 * widget script required).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { BOOKING_URL } from "@/lib/analytics";

export default function CalendlyBadge() {
  return (
    <aside aria-label="Book a consultation">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 min-h-12 px-5 rounded-full border-[1.5px] border-ink bg-paper text-ink text-sm font-semibold transition-[translate,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-ink)]"
      >
        <span
          aria-hidden="true"
          className="w-2 h-2 rounded-full bg-molten"
        />
        <span className="sm:hidden">Book a call</span>
        <span className="hidden sm:inline">Book a free consultation</span>
      </a>
    </aside>
  );
}
