import { NextResponse } from "next/server";
import { badRequest, requireAdmin } from "@/app/api/admin/_utils";
import { deleteProspectSearch, updateProspectSearch } from "@/lib/lead-finder/repository";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/lead-finder/searches/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.is_active !== "boolean") return badRequest("is_active must be true or false.");

    return NextResponse.json({ data: await updateProspectSearch(id, { is_active: body.is_active }) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update saved search.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/lead-finder/searches/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    await deleteProspectSearch(id);
    return NextResponse.json({ data: { id } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete saved search.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
