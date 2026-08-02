import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_utils";
import {
  renderDocx,
  renderPdf,
  type ProposalDocumentFormat,
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
  if (!["proposal", "agreement"].includes(document) || !["docx", "pdf"].includes(format)) {
    return NextResponse.json({ error: "Unsupported document format." }, { status: 404 });
  }

  const proposal = await getLeadProposalById(proposalId);
  if (!proposal || proposal.lead_id !== id) {
    return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
  }

  const documentKind = document as ProposalDocumentKind;
  const documentFormat = format as ProposalDocumentFormat;
  const bytes = documentFormat === "docx"
    ? await renderDocx(proposal, documentKind)
    : await renderPdf(proposal, documentKind);
  const baseName = slugify(`${proposal.prepared_for}-${documentKind}`) || documentKind;
  const contentType = documentFormat === "docx"
    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/pdf";
  const body = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${baseName}.${documentFormat}"`,
      "Cache-Control": "private, no-store",
    },
  });
}