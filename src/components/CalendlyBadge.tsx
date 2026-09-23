/**
 * CalendlyBadge - Foundry Frame
 * ==============================
 * Floating consultation-booking badge on brass-tinted frosted glass.
 * Links directly to the Google Calendar booking page (no third-party
 * widget script required).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { BOOKING_URL } from "@/lib/analytics";

export default function CalendlyBadge() {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-accent fixed bottom-5 left-5 z-40 text-white text-sm font-bold px-5 py-3 uppercase tracking-wider hover:bg-accent hover:text-black transition-colors"
    >
      Book a free consultation
    </a>
  );
}

