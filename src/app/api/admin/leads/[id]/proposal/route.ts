import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_utils";
import {
  getLeadById,
  listPublishedPackagesForLeads,
  listPublishedServicesForLeads,
} from "@/lib/leads/repository";
import { generateLeadProposal } from "@/lib/leads/service";
import type { ProposalLineItem } from "@/lib/leads/types";

function parseNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function parseLineItems(value: unknown): Promise<ProposalLineItem[]> {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw new Error("Select between 1 and 20 services or packages.");
  }

  const [packages, services] = await Promise.all([
    listPublishedPackagesForLeads(),
    listPublishedServicesForLeads(),
  ]);
  const packageById = new Map(packages.map((item) => [item.id, item]));
  const serviceById = new Map(services.map((item) => [item.id, item]));

  return value.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      throw new Error("Invalid proposal line item.");
    }

    const item = entry as Record<string, unknown>;
    const catalogId = typeof item.catalogId === "string" ? item.catalogId.trim() : "";
    const kind = item.kind;
    const price = parseNumber(item.price, -1);

    if (!catalogId || !["package", "service", "custom"].includes(String(kind))) {
      throw new Error("Each proposal item needs a valid name and type.");
    }
    if (price < 0 || price > 1_000_000) {
      throw new Error("Each proposal item needs a valid price.");
    }

    if (kind === "package") {
      const catalogItem = packageById.get(catalogId);
      if (!catalogItem) throw new Error("A selected package is unavailable or unpublished.");
      return {
        catalogId,
        kind,
        name: catalogItem.name,
        description: catalogItem.description || catalogItem.tagline || "",
        price,
        deliverables: catalogItem.features ?? [],
      };
    }

    if (kind === "service") {
      const catalogItem = serviceById.get(catalogId);
      if (!catalogItem) throw new Error("A selected service is unavailable or unpublished.");
      return {
        catalogId,
        kind,
        name: catalogItem.name,
        description: catalogItem.description || catalogItem.short_description || "",
        price,
        deliverables: catalogItem.deliverables ?? [],
      };
    }

    const name = typeof item.name === "string" ? item.name.trim() : "";
    const description = typeof item.description === "string" ? item.description.trim() : "";
    if (!name) throw new Error("Custom proposal items need a name.");
    return {
      catalogId: `custom-${index + 1}`,
      kind: "custom",
      name: name.slice(0, 150),
      description: description.slice(0, 1000),
      price,
      deliverables: [],
    };
  });
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/admin/leads/[id]/proposal">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const projectBrief = typeof body.projectBrief === "string" ? body.projectBrief.trim() : "";
    const instructions = typeof body.instructions === "string" ? body.instructions.trim() : "";
    const timelineWeeks = parseNumber(body.timelineWeeks, 8);
    const depositPercent = parseNumber(body.depositPercent, 50);
    const discount = parseNumber(body.discount, 0);
    const items = await parseLineItems(body.items);

    if (projectBrief.length < 20 || projectBrief.length > 5000) {
      return NextResponse.json(
        { error: "Project brief must be between 20 and 5,000 characters." },
        { status: 400 }
      );
    }
    if (timelineWeeks < 1 || timelineWeeks > 104) {
      return NextResponse.json({ error: "Timeline must be between 1 and 104 weeks." }, { status: 400 });
    }
    if (depositPercent < 0 || depositPercent > 100) {
      return NextResponse.json({ error: "Deposit must be between 0% and 100%." }, { status: 400 });
    }
    if (discount < 0 || discount > items.reduce((sum, item) => sum + item.price, 0)) {
      return NextResponse.json({ error: "Discount cannot exceed the subtotal." }, { status: 400 });
    }

    const proposal = await generateLeadProposal({
      lead,
      projectBrief,
      items,
      timelineWeeks,
      depositPercent,
      discount,
      instructions: instructions.slice(0, 3000),
    });

    return NextResponse.json({ data: proposal });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proposal generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}