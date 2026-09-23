import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_utils";
import { promoteProspect } from "@/lib/lead-finder/service";

export async function POST(
  request: Request,
  context: RouteContext<"/api/admin/lead-finder/prospects/[id]/promote">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    return NextResponse.json({ data: await promoteProspect(id) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to promote prospect.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
