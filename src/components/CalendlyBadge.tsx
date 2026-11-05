/**
 * CalendlyBadge - Foundry Frame
 * ==============================
 * Floating consultation-booking pill on frosted glass.
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
        className="glass-light fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 min-h-12 px-5 rounded-full text-ink text-sm font-semibold hover:bg-white/90 transition-colors"
      >
        <span
          aria-hidden="true"
          className="w-2 h-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(196,130,26,0.2)]"
        />
        <span className="sm:hidden">Book a call</span>
        <span className="hidden sm:inline">Book a free consultation</span>
      </a>
    </aside>
  );
}
