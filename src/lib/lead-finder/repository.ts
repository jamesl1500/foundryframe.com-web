import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LooseSupabaseClient } from "@/lib/supabase/loose-client";
import type {
  LeadProspectRecord,
  LeadProspectSearchRecord,
  ProspectStatus,
} from "@/lib/lead-finder/types";

function db() {
  return getSupabaseAdminClient() as unknown as LooseSupabaseClient;
}

export async function listProspects(status?: ProspectStatus): Promise<LeadProspectRecord[]> {
  let query = db().from("lead_prospects").select("*");
  if (status) query = query.eq("status", status);

  const { data, error } = await query
    .order("score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);
  return (data ?? []) as LeadProspectRecord[];
}

export async function getProspectById(id: string): Promise<LeadProspectRecord | null> {
  const { data, error } = await db().from("lead_prospects").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as LeadProspectRecord | null;
}

/** Inserts prospects, silently skipping any whose dedupe_key already exists. Returns rows inserted. */
export async function insertProspects(
  rows: Array<Omit<LeadProspectRecord, "id" | "created_at" | "updated_at" | "lead_id" | "status">>
): Promise<number> {
  if (rows.length === 0) return 0;

  const { data, error } = await db()
    .from("lead_prospects")
    .upsert(rows, { onConflict: "dedupe_key", ignoreDuplicates: true })
    .select("id");

  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data.length : 0;
}

export async function updateProspect(
  id: string,
  patch: Partial<Pick<LeadProspectRecord, "status" | "lead_id">>
): Promise<LeadProspectRecord> {
  const { data, error } = await db()
    .from("lead_prospects")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as LeadProspectRecord;
}

export async function listProspectSearches(): Promise<LeadProspectSearchRecord[]> {
  const { data, error } = await db()
    .from("lead_prospect_searches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as LeadProspectSearchRecord[];
}

export async function getProspectSearchById(id: string): Promise<LeadProspectSearchRecord | null> {
  const { data, error } = await db()
    .from("lead_prospect_searches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as LeadProspectSearchRecord | null;
}

export async function createProspectSearch(
  input: Pick<LeadProspectSearchRecord, "query" | "location" | "sources">
): Promise<LeadProspectSearchRecord> {
  const { data, error } = await db()
    .from("lead_prospect_searches")
    .insert({ ...input, is_active: true })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as LeadProspectSearchRecord;
}

export async function updateProspectSearch(
  id: string,
  patch: Partial<Omit<LeadProspectSearchRecord, "id" | "created_at" | "updated_at">>
): Promise<LeadProspectSearchRecord> {
  const { data, error } = await db()
    .from("lead_prospect_searches")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as LeadProspectSearchRecord;
}

export async function deleteProspectSearch(id: string): Promise<void> {
  const { error } = await db().from("lead_prospect_searches").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
