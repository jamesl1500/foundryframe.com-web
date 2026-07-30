import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LooseSupabaseClient } from "@/lib/supabase/loose-client";
import { validateCmsPayload } from "@/lib/cms/validation";
import type { CmsEntity } from "@/lib/cms/types";
import { badRequest, parseEntityOrFail, requireAdmin } from "@/app/api/admin/_utils";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/admin/[entity]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { entity } = await context.params;
  const parsed = parseEntityOrFail(entity);
  if (parsed.response || !parsed.config) return parsed.response;
  const supabaseAdmin = getSupabaseAdminClient();
  const db = supabaseAdmin as unknown as LooseSupabaseClient;

  const { data, error } = await db
    .from(parsed.config.table)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/[entity]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { entity } = await context.params;
  const parsed = parseEntityOrFail(entity);
  if (parsed.response || !parsed.config) return parsed.response;
  const supabaseAdmin = getSupabaseAdminClient();
  const db = supabaseAdmin as unknown as LooseSupabaseClient;

  try {
    const input = (await request.json()) as Record<string, unknown>;
    const validation = validateCmsPayload(entity as CmsEntity, input);

    if (validation.errors.length > 0) {
      return badRequest(validation.errors.join(" "));
    }

    const { data, error } = await db
      .from(parsed.config.table)
      .insert(validation.payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return badRequest("Invalid JSON payload.");
  }
}
