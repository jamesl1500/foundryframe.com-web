/**
 * Lead Source (server) - Foundry Frame
 * ======================================
 * Reads the visitor's lead source cookie from a form submission and formats
 * it for the notification emails. See src/lib/lead-source.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import {
  LEAD_SOURCE_COOKIE,
  describeLeadSource,
  leadSourceRows,
  parseLeadSourceCookie,
  type LeadSource,
} from "@/lib/lead-source";

export function leadSourceFromRequest(request: Request): LeadSource | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === LEAD_SOURCE_COOKIE) return parseLeadSourceCookie(rest.join("="));
  }
  return null;
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** A "Where this lead came from" block for the bottom of a notification email. */
export function leadSourceEmailHtml(source: LeadSource | null): string {
  const rows = leadSourceRows(source)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px;color:#666;border-bottom:1px solid #eee;">${esc(label)}</td><td style="padding:4px 12px;border-bottom:1px solid #eee;word-break:break-all;">${esc(value)}</td></tr>`
    )
    .join("");
  return `
    <h3 style="margin-top:24px;">Where this lead came from</h3>
    <p>${esc(describeLeadSource(source))}</p>
    ${rows ? `<table style="border-collapse:collapse;width:100%;max-width:600px;font-size:13px;">${rows}</table>` : ""}
  `;
}

type InsertResult = { data: unknown; error: { message: string } | null };

/**
 * Runs an insert that includes a `source` column, and retries it without that
 * column if the lead-source migration hasn't been run yet, so a lead is never
 * lost to a missing column.
 */
export async function insertWithSource(
  insert: (row: Record<string, unknown>) => PromiseLike<InsertResult>,
  row: Record<string, unknown>
): Promise<InsertResult> {
  const result = await insert(row);
  const missingColumn = result.error && /\bsource\b/.test(result.error.message) && /column/i.test(result.error.message);
  if (!missingColumn) return result;

  const withoutSource = { ...row };
  delete withoutSource.source;
  return insert(withoutSource);
}
