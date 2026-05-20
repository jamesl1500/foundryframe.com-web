"use client";

import { useState } from "react";

export default function AuditForm() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-white/20 p-8 text-center">
        <p className="text-white font-heading font-bold text-2xl mb-2">
          You&apos;re on the list.
        </p>
        <p className="text-gray-400 text-sm">
          We&apos;ll review your site and send your free audit within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          required
          placeholder="yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-white/50 transition-colors"
        />
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-white/50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-8 py-3 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "Sending…" : "Get My Audit"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-3">{error}</p>
      )}
    </form>
  );
}
