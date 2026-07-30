import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: membership, error: membershipError } = await supabase
    .from("cms_admin_users")
    .select("user_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError || !membership) {
    return null;
  }

  return {
    user,
    role: membership.role,
  };
}
