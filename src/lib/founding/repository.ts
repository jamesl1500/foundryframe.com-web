import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LooseSupabaseClient } from "@/lib/supabase/loose-client";

export type FoundingApplicationRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  business: string;
  website_url: string | null;
  timeline: string;
  budget_range: string;
  status: string;
  email_sent: boolean;
};

function db() {
  return getSupabaseAdminClient() as unknown as LooseSupabaseClient;
}

export async function insertFoundingApplication(
  row: Omit<FoundingApplicationRecord, "id" | "created_at" | "updated_at" | "status">
): Promise<FoundingApplicationRecord> {
  const { data, error } = await db().from("founding_applications").insert(row).select("*").single();

  if (error) throw new Error(error.message);
  return data as FoundingApplicationRecord;
}

export async function listFoundingApplications(): Promise<FoundingApplicationRecord[]> {
  const { data, error } = await db()
    .from("founding_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);
  return (data ?? []) as FoundingApplicationRecord[];
}

export async function markFoundingApplicationEmailed(id: string): Promise<void> {
  const { error } = await db().from("founding_applications").update({ email_sent: true }).eq("id", id);
  if (error) throw new Error(error.message);
}
