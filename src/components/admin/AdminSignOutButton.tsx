"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminSignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={loading}
      className="px-4 py-2 border border-white/20 text-white text-xs uppercase tracking-wider hover:bg-white/5 disabled:opacity-60"
    >
      {loading ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
