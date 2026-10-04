import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LooseSupabaseClient } from "@/lib/supabase/loose-client";
import type { PackageQuoteRecord } from "@/lib/package-builder/types";
import { insertWithSource } from "@/lib/server/lead-source";

export { QUOTE_STATUSES, isQuoteStatus } from "@/lib/package-builder/types";
export type { PackageQuoteRecord, QuoteStatus } from "@/lib/package-builder/types";

function db() {
  return getSupabaseAdminClient() as unknown as LooseSupabaseClient;
}

export async function insertQuote(
  row: Omit<PackageQuoteRecord, "id" | "created_at" | "updated_at" | "status">
): Promise<PackageQuoteRecord> {
  const { data, error } = await insertWithSource(
    (values) => db().from("package_quotes").insert(values).select("*").single(),
    row
  );

  if (error) throw new Error(error.message);
  return data as PackageQuoteRecord;
}

export async function listQuotes(): Promise<PackageQuoteRecord[]> {
  const { data, error } = await db()
    .from("package_quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);
  return (data ?? []) as PackageQuoteRecord[];
}

export async function updateQuote(
  id: string,
  patch: Partial<Pick<PackageQuoteRecord, "status" | "email_sent">>
): Promise<PackageQuoteRecord> {
  const { data, error } = await db()
    .from("package_quotes")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as PackageQuoteRecord;
}
