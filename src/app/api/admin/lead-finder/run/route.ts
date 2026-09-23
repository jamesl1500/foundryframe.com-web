import { NextResponse } from "next/server";
import { badRequest, requireAdmin } from "@/app/api/admin/_utils";
import { parseSearchInput } from "@/app/api/admin/lead-finder/_parse";
import { createProspectSearch, getProspectSearchById } from "@/lib/lead-finder/repository";
import { runProspectSearch, runSavedSearch } from "@/lib/lead-finder/service";

export const maxDuration = 300;

/** Runs a one-off search, optionally saving it for the daily job, or re-runs a saved search by id. */
export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (typeof body.search_id === "string") {
      const search = await getProspectSearchById(body.search_id);
      if (!search) return NextResponse.json({ error: "Saved search not found." }, { status: 404 });
      return NextResponse.json({ data: await runSavedSearch(search) });
    }

    const input = parseSearchInput(body);
    if ("error" in input) return badRequest(input.error);

    if (body.save === true) {
      const search = await createProspectSearch(input);
      return NextResponse.json({ data: await runSavedSearch(search) });
    }

    return NextResponse.json({ data: await runProspectSearch(input) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Prospect search failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
