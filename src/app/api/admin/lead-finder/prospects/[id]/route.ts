import { NextResponse } from "next/server";
import { badRequest, requireAdmin } from "@/app/api/admin/_utils";
import { updateProspect } from "@/lib/lead-finder/repository";

/** Marks a prospect saved, dismissed, or back to new. Promotion has its own route. */
export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/lead-finder/prospects/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const status = body.status;
    if (status !== "new" && status !== "saved" && status !== "dismissed") {
      return badRequest("Status must be new, saved, or dismissed.");
    }

    return NextResponse.json({ data: await updateProspect(id, { status }) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update prospect.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
