/**
 * Audit Status API Route - Foundry Frame
 * =========================================
 * Polling endpoint for the audit form and the /audit/[id] page. Reads the
 * public (non-contact) columns of public.site_audits.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { getPublicSiteAudit, isAuditId } from "@/lib/audit/repository";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isAuditId(id)) {
    return Response.json({ error: "Invalid audit id." }, { status: 400 });
  }

  try {
    const audit = await getPublicSiteAudit(id);
    if (!audit) {
      return Response.json({ error: "Audit not found." }, { status: 404 });
    }
    return Response.json(audit, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(`Audit ${id}: status read failed:`, error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
