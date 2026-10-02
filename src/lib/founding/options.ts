/**
 * Founding Client options - Foundry Frame
 * =========================================
 * Choices for the /founding application form, shared by the form and the
 * API route so the server only accepts values the form offers.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export const FOUNDING_TIMELINES = [
  "As soon as possible",
  "In the next 1–2 months",
  "In 3–6 months",
  "Just exploring",
] as const;

export const FOUNDING_BUDGETS = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure yet",
] as const;
