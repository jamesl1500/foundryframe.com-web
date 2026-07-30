import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { CMS_CONFIG } from "@/lib/cms/config";
import type { CmsEntity, CmsItem } from "@/lib/cms/types";

export async function getCmsItems(entity: CmsEntity): Promise<CmsItem[]> {
  const config = CMS_CONFIG[entity];
  const supabaseAdmin = getSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from(config.table)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CmsItem[];
}

export async function getCmsItemById(
  entity: CmsEntity,
  id: string
): Promise<CmsItem | null> {
  const config = CMS_CONFIG[entity];
  const supabaseAdmin = getSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from(config.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as CmsItem | null;
}
