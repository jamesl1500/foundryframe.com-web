/**
 * CalendlyBadge - Foundry Frame
 * ==============================
 * Floating consultation-booking badge. Links directly to the Google
 * Calendar booking page (no third-party widget script required).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

const BOOKING_URL = "https://calendar.app.google/BugYDt3yg1oWBfpH7";

export default function CalendlyBadge() {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-5 z-40 bg-accent text-black text-sm font-bold px-5 py-3 uppercase tracking-wider shadow-lg hover:bg-accent-glow transition-colors"
    >
      Book a free consultation
    </a>
  );
}

