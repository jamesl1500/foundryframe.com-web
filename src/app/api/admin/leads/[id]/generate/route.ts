import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_utils";
import { getLeadById } from "@/lib/leads/repository";
import { generateLeadLandingPage } from "@/lib/leads/service";

export async function POST(
  request: Request,
  context: RouteContext<"/api/admin/leads/[id]/generate">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const generatedPage = await generateLeadLandingPage(lead);
    return NextResponse.json({ data: generatedPage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Landing page generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
