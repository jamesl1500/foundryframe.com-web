import { NextResponse } from "next/server";
import { badRequest, requireAdmin } from "@/app/api/admin/_utils";
import { parseSearchInput } from "@/app/api/admin/lead-finder/_parse";
import { createProspectSearch, listProspectSearches } from "@/lib/lead-finder/repository";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    return NextResponse.json({ data: await listProspectSearches() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load saved searches.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const input = parseSearchInput((await request.json()) as Record<string, unknown>);
    if ("error" in input) return badRequest(input.error);

    return NextResponse.json({ data: await createProspectSearch(input) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save search.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
