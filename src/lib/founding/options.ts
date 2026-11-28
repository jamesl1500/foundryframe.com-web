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

/* Bands follow the founding prices (20% off): Ignite from $2,000, Velocity
   from $2,800, Ascend from $3,800, Apex custom. Older applications keep the
   band they were saved with. */
export const FOUNDING_BUDGETS = [
  "Under $2,000",
  "$2,000 – $3,000",
  "$3,000 – $4,000",
  "$4,000 – $6,000",
  "$6,000+",
  "Not sure yet",
] as const;
