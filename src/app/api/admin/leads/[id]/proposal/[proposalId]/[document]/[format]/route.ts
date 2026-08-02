import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_utils";
import {
  downloadLeadProposalDocument,
  getLeadProposalById,
} from "@/lib/leads/repository";
import { slugify } from "@/lib/leads/utils";

export async function GET(
  request: Request,
  context: RouteContext<"/api/admin/leads/[id]/proposal/[proposalId]/[document]/[format]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id, proposalId, document, format } = await context.params;
  if (!["proposal", "agreement"].includes(document) || format !== "docx") {
    return NextResponse.json({ error: "Unsupported document format." }, { status: 404 });
  }

  const proposal = await getLeadProposalById(proposalId);
  if (!proposal || proposal.lead_id !== id) {
    return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
  }

  const storagePath = document === "proposal"
    ? proposal.proposal_storage_path
    : proposal.agreement_storage_path;
  if (!storagePath) {
    return NextResponse.json(
      { error: "This proposal predates stored documents. Generate a new proposal to download it." },
      { status: 404 }
    );
  }

  const body = await downloadLeadProposalDocument(storagePath);
  const baseName = slugify(`${proposal.prepared_for}-${document}`) || document;

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${baseName}.docx"`,
      "Cache-Control": "private, no-store",
    },
  });
}