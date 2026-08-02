import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_utils";
import {
  renderDocx,
  type ProposalDocumentKind,
} from "@/lib/leads/documents";
import { getLeadProposalById } from "@/lib/leads/repository";
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

  const documentKind = document as ProposalDocumentKind;
  const bytes = await renderDocx(proposal, documentKind);
  const baseName = slugify(`${proposal.prepared_for}-${documentKind}`) || documentKind;
  const body = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${baseName}.docx"`,
      "Cache-Control": "private, no-store",
    },
  });
}