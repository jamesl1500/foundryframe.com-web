import type { PackageSelection, PricedQuote } from "@/lib/package-builder/catalog";

export const QUOTE_STATUSES = ["new", "contacted", "meeting_booked", "won", "lost"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export type PackageQuoteRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  website_url: string | null;
  notes: string | null;
  selection: PackageSelection;
  quote: PricedQuote;
  one_time_total: number;
  monthly_total: number;
  preferred_date: string | null;
  preferred_window: string | null;
  status: QuoteStatus;
  email_sent: boolean;
};

export function isQuoteStatus(value: unknown): value is QuoteStatus {
  return typeof value === "string" && (QUOTE_STATUSES as readonly string[]).includes(value);
}
