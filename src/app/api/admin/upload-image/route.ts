import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { badRequest, requireAdmin } from "@/app/api/admin/_utils";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const STORAGE_BUCKET = "cms-assets";

function sanitizeSegment(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9-_]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get("file");
  const entity = String(formData.get("entity") ?? "misc").trim();
  const fieldKey = String(formData.get("fieldKey") ?? "image").trim();

  if (!(file instanceof File)) {
    return badRequest("Image file is required.");
  }

  if (!file.type.startsWith("image/")) {
    return badRequest("Only image uploads are supported.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return badRequest("Image must be 8MB or smaller.");
  }

  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() || "png"
    : "png";

  const safeEntity = sanitizeSegment(entity || "misc");
  const safeField = sanitizeSegment(fieldKey || "image");
  const filePath = `${safeEntity}/${safeField}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const supabaseAdmin = getSupabaseAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return NextResponse.json({
    url: publicUrl,
    path: filePath,
  });
}
