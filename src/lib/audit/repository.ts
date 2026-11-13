/**
 * Site Audit Repository - Foundry Frame
 * =======================================
 * Server-only Supabase access for public.site_audits
 * (supabase/migrations/20261113000000_site_audits.sql). Uses the service
 * role key, so never import this from client components.
 *
 * Public reads go through PUBLIC_COLUMNS so the requester's email and phone
 * never reach the browser, even though anyone with the audit id can load it.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LooseSupabaseClient } from "@/lib/supabase/loose-client";
import type { LeadSource } from "@/lib/lead-source";
import type { AuditRead, AuditStatus } from "@/lib/audit/types";

const TABLE = "site_audits";

const PUBLIC_COLUMNS = [
  "id",
  "url",
  "status",
  "overall_score",
  "category_scores",
  "findings",
  "ai_summary",
  "ai_recommendations",
  "lighthouse_scores",
  "lighthouse_metrics",
  "lighthouse_opportunities",
  "lighthouse_error",
  "error_message",
  "created_at",
  "updated_at",
].join(",");

/* A run lives inside one function invocation (maxDuration 300s on
   POST /api/audit). Anything still unfinished well past that was killed
   mid-scan and will never complete, so readers treat it as failed. */
const STALE_AFTER_MS = 7 * 60 * 1000;
const STALE_MESSAGE = "This audit was interrupted before it finished. Please start a new one.";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SiteAuditRequestRow = {
  id: string;
  url: string;
  email: string;
  name: string | null;
  company: string | null;
  status: AuditStatus;
};

export type SiteAuditResults = Pick<
  AuditRead,
  | "overall_score"
  | "category_scores"
  | "findings"
  | "ai_summary"
  | "ai_recommendations"
  | "lighthouse_scores"
  | "lighthouse_metrics"
  | "lighthouse_opportunities"
  | "lighthouse_error"
> & {
  final_url: string | null;
  scan_snapshot: Record<string, unknown> | null;
};

function db() {
  return getSupabaseAdminClient() as unknown as LooseSupabaseClient;
}

export function isAuditId(value: string): boolean {
  return UUID_REGEX.test(value);
}

function isStale(audit: AuditRead): boolean {
  if (audit.status !== "pending" && audit.status !== "running") return false;
  return Date.now() - new Date(audit.updated_at).getTime() > STALE_AFTER_MS;
}

export async function insertSiteAudit(row: {
  url: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  source: LeadSource | null;
}): Promise<AuditRead> {
  const { data, error } = await db().from(TABLE).insert(row).select(PUBLIC_COLUMNS).single();
  if (error) throw new Error(error.message);
  return data as AuditRead;
}

/** The public view of one audit, or null when the id is unknown or malformed. */
export async function getPublicSiteAudit(id: string): Promise<AuditRead | null> {
  if (!isAuditId(id)) return null;

  const { data, error } = await db().from(TABLE).select(PUBLIC_COLUMNS).eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const audit = data as AuditRead;
  if (!isStale(audit)) return audit;

  // Record the failure so the team sees it too; the guard on status keeps a
  // run that did finish in the meantime from being overwritten.
  await db()
    .from(TABLE)
    .update({ status: "failed", error_message: STALE_MESSAGE, completed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", audit.status)
    .then(undefined, () => undefined);

  return { ...audit, status: "failed", error_message: STALE_MESSAGE };
}

/**
 * Moves a pending audit to running and returns what the runner needs, or
 * null if it was already claimed (or doesn't exist), so a run never starts twice.
 */
export async function claimSiteAudit(id: string): Promise<SiteAuditRequestRow | null> {
  const { data, error } = await db()
    .from(TABLE)
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending")
    .select("id,url,email,name,company,status");

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as SiteAuditRequestRow[];
  return rows[0] ?? null;
}

export async function completeSiteAudit(id: string, results: SiteAuditResults): Promise<void> {
  const { error } = await db()
    .from(TABLE)
    .update({
      ...results,
      status: "completed",
      error_message: null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function failSiteAudit(
  id: string,
  message: string,
  scanSnapshot: Record<string, unknown> | null = null
): Promise<void> {
  const patch: Record<string, unknown> = {
    status: "failed",
    error_message: message,
    completed_at: new Date().toISOString(),
  };
  if (scanSnapshot) patch.scan_snapshot = scanSnapshot;

  const { error } = await db().from(TABLE).update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function markSiteAuditEmailed(id: string): Promise<void> {
  const { error } = await db()
    .from(TABLE)
    .update({ results_emailed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
