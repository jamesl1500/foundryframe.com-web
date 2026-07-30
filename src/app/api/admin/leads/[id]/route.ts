import { NextResponse } from "next/server";
import { badRequest, requireAdmin } from "@/app/api/admin/_utils";
import { getLeadById, updateLead } from "@/lib/leads/repository";
import { normalizeWebsiteUrl } from "@/lib/leads/utils";

export async function GET(
  request: Request,
  context: RouteContext<"/api/admin/leads/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const data = await getLeadById(id);

    if (!data) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch lead.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/leads/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const payload = (await request.json()) as Record<string, unknown>;
    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const websiteUrl = payload.website_url
      ? normalizeWebsiteUrl(String(payload.website_url))
      : lead.website_url;

    if (!websiteUrl) {
      return badRequest("A valid website URL is required.");
    }

    const data = await updateLead(id, {
      name: String(payload.name ?? lead.name).trim(),
      company_name: String(payload.company_name ?? lead.company_name ?? "").trim() || null,
      website_url: websiteUrl,
      industry: String(payload.industry ?? lead.industry ?? "").trim() || null,
      contact_email: String(payload.contact_email ?? lead.contact_email ?? "").trim() || null,
      contact_phone: String(payload.contact_phone ?? lead.contact_phone ?? "").trim() || null,
      company_size: String(payload.company_size ?? lead.company_size ?? "").trim() || null,
      location: String(payload.location ?? lead.location ?? "").trim() || null,
      notes: String(payload.notes ?? lead.notes ?? "").trim() || null,
      status: String(payload.status ?? lead.status).trim() as
        | "new"
        | "qualified"
        | "analysis_ready"
        | "proposal_generated"
        | "sent"
        | "closed_won"
        | "closed_lost",
    });

    if (!data.name) {
      return badRequest("Lead name is required.");
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update lead.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
