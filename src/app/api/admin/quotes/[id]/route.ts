import { NextResponse } from "next/server";
import { badRequest, requireAdmin } from "@/app/api/admin/_utils";
import { QUOTE_STATUSES, isQuoteStatus, updateQuote } from "@/lib/package-builder/repository";

/** Moves a package quote through the sales pipeline. */
export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/quotes/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    if (!isQuoteStatus(body.status)) {
      return badRequest(`Status must be one of: ${QUOTE_STATUSES.join(", ")}.`);
    }

    return NextResponse.json({ data: await updateQuote(id, { status: body.status }) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update quote.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
