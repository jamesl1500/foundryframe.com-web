/**
 * Audit Status API Route - Foundry Frame
 * =========================================
 * Polling endpoint proxying to the Python Site Audit Platform API.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { getAudit, AuditApiError } from "@/lib/audit/api";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!UUID_REGEX.test(id)) {
    return Response.json({ error: "Invalid audit id." }, { status: 400 });
  }

  try {
    const audit = await getAudit(id);
    return Response.json(audit, { status: 200 });
  } catch (error) {
    if (error instanceof AuditApiError) {
      return Response.json(
        { error: "Audit not found." },
        { status: error.status === 404 ? 404 : 502 }
      );
    }

    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
