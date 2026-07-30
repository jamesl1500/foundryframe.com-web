"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LeadCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      company_name: String(formData.get("company_name") ?? ""),
      website_url: String(formData.get("website_url") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      contact_email: String(formData.get("contact_email") ?? ""),
      contact_phone: String(formData.get("contact_phone") ?? ""),
      company_size: String(formData.get("company_size") ?? ""),
      location: String(formData.get("location") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    const response = await fetch("/api/admin/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as {
      data?: { id: string };
      error?: string;
    };

    if (!response.ok || !result.data) {
      setError(result.error ?? "Unable to create lead.");
      setLoading(false);
      return;
    }

    router.push(`/admin/leads/${result.data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-white/10 p-6 lg:p-8 bg-black space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <label>
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Lead Name *</span>
          <input name="name" required className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm" />
        </label>

        <label>
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Company Name</span>
          <input name="company_name" className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm" />
        </label>

        <label className="lg:col-span-2">
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Website URL *</span>
          <input
            name="website_url"
            type="url"
            required
            placeholder="https://example.com"
            className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm"
          />
        </label>

        <label>
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Industry</span>
          <input name="industry" className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm" />
        </label>

        <label>
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Company Size</span>
          <input name="company_size" className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm" />
        </label>

        <label>
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Contact Email</span>
          <input name="contact_email" type="email" className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm" />
        </label>

        <label>
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Contact Phone</span>
          <input name="contact_phone" className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm" />
        </label>

        <label className="lg:col-span-2">
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Location</span>
          <input name="location" className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm" />
        </label>

        <label className="lg:col-span-2">
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Notes</span>
          <textarea name="notes" rows={4} className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm" />
        </label>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Lead"}
      </button>
    </form>
  );
}
