"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message || "Login failed.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="min-h-screen flex items-start py-14 lg:py-12">
      <div className="max-w-lg mx-auto w-full px-6">
        <div className="border border-white/10 p-8 bg-black">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Foundry Frame CMS</p>
          <h1 className="text-4xl font-heading font-bold text-white mb-3">Admin Access</h1>
          <p className="text-sm text-gray-400 mb-8">
            Sign in with your Supabase account to manage case studies, services, packages, and clients.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-white/50"
                placeholder="admin@foundryframe.com"
              />
            </label>

            <label className="block">
              <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
                className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-white/50"
                placeholder="Your secure password"
              />
            </label>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to CMS"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
