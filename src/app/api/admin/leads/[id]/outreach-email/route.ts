import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_utils";
import { getLeadById } from "@/lib/leads/repository";
import { draftLeadOutreachEmail } from "@/lib/leads/service";

export const maxDuration = 60;

export async function POST(
  request: Request,
  context: RouteContext<"/api/admin/leads/[id]/outreach-email">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const draft = await draftLeadOutreachEmail(lead, baseUrl);
    return NextResponse.json({ data: draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email draft failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
