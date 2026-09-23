import { NextResponse } from "next/server";
import { runDueSavedSearches } from "@/lib/lead-finder/service";

export const maxDuration = 300;

/**
 * Scheduled job: re-runs saved Lead Finder searches that are due. Vercel Cron calls this with
 * `Authorization: Bearer $CRON_SECRET`; any other scheduler can do the same.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await runDueSavedSearches();
    return NextResponse.json({ data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scheduled lead search failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
