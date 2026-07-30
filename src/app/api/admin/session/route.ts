import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";

export async function POST() {
  try {
    const adminUser = await getCurrentAdminUser();

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to start admin session." }, { status: 500 });
  }
}

export async function DELETE() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
