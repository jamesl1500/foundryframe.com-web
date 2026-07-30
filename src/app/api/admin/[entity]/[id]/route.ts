import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LooseSupabaseClient } from "@/lib/supabase/loose-client";
import { validateCmsPayload } from "@/lib/cms/validation";
import type { CmsEntity } from "@/lib/cms/types";
import { badRequest, parseEntityOrFail, requireAdmin } from "@/app/api/admin/_utils";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/admin/[entity]/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { entity, id } = await context.params;
  const parsed = parseEntityOrFail(entity);
  if (parsed.response || !parsed.config) return parsed.response;
  const supabaseAdmin = getSupabaseAdminClient();
  const db = supabaseAdmin as unknown as LooseSupabaseClient;

  const { data, error } = await db
    .from(parsed.config.table)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/admin/[entity]/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { entity, id } = await context.params;
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
      .update(validation.payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return badRequest("Invalid JSON payload.");
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/admin/[entity]/[id]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { entity, id } = await context.params;
  const parsed = parseEntityOrFail(entity);
  if (parsed.response || !parsed.config) return parsed.response;
  const supabaseAdmin = getSupabaseAdminClient();
  const db = supabaseAdmin as unknown as LooseSupabaseClient;

  const result = (await (db
    .from(parsed.config.table)
    .delete()
    .eq("id", id) as unknown as Promise<{ error: { message: string } | null }>));
  const { error } = result;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
