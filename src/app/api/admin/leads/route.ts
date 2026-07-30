import { NextResponse } from "next/server";
import { badRequest, requireAdmin } from "@/app/api/admin/_utils";
import { createLead, listLeads } from "@/lib/leads/repository";
import { normalizeWebsiteUrl } from "@/lib/leads/utils";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const data = await listLeads();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load leads.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = String(body.name ?? "").trim();
    const websiteUrl = normalizeWebsiteUrl(String(body.website_url ?? ""));

    if (!name) {
      return badRequest("Lead name is required.");
    }

    if (!websiteUrl) {
      return badRequest("A valid website URL is required.");
    }

    const data = await createLead({
      name,
      website_url: websiteUrl,
      company_name: String(body.company_name ?? "").trim() || null,
      industry: String(body.industry ?? "").trim() || null,
      contact_email: String(body.contact_email ?? "").trim() || null,
      contact_phone: String(body.contact_phone ?? "").trim() || null,
      company_size: String(body.company_size ?? "").trim() || null,
      location: String(body.location ?? "").trim() || null,
      notes: String(body.notes ?? "").trim() || null,
      status: "new",
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create lead.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
