/**
 * AdPageForm - Foundry Frame
 * ============================
 * The one short form on an ad landing page (/go/<slug>): name, email,
 * business, where they're online now, and an optional phone and note.
 * Posts to /api/ad-lead, which adds the lead to the admin Leads workbench.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useState, type FormEvent } from "react";
import { BOOKING_URL, newConversionId, trackConversion } from "@/lib/analytics";
import type { Funnel } from "@/lib/funnels";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors";
const labelClass = "block text-xs uppercase tracking-wider text-gray-500 mb-2";

export default function AdPageForm({ funnel }: { funnel: Funnel }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const conversionId = newConversionId();

    try {
      const res = await fetch("/api/ad-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, funnel: funnel.slug, conversionId }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Something went wrong.");

      trackConversion("ad_page", { eventId: conversionId, params: { funnel: funnel.slug } });
      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Sent</p>
        <p className="text-white text-2xl font-heading font-bold mb-3">James has your details.</p>
        <p className="text-gray-400 text-sm mb-8 max-w-md">
          Watch your inbox for your plan. If you&apos;d rather talk it through, grab a time on the calendar.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors"
        >
          Book a free call
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ad-name" className={labelClass}>
            Your name *
          </label>
          <input id="ad-name" name="name" required className={inputClass} placeholder="Jane Doe" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="ad-email" className={labelClass}>
            Email *
          </label>
          <input
            id="ad-email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="jane@doebakery.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="ad-business" className={labelClass}>
            Business name *
          </label>
          <input
            id="ad-business"
            name="business"
            required
            className={inputClass}
            placeholder="Doe Bakery"
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="ad-phone" className={labelClass}>
            Phone
          </label>
          <input id="ad-phone" name="phone" type="tel" className={inputClass} placeholder="Optional" autoComplete="tel" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ad-link" className={labelClass}>
            {funnel.form.linkLabel}
          </label>
          <input id="ad-link" name="link" required className={inputClass} placeholder={funnel.form.linkPlaceholder} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ad-note" className={labelClass}>
            Anything we should know?
          </label>
          <textarea
            id="ad-note"
            name="note"
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Optional: what you sell, what you'd like the site to do"
          />
        </div>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="ad-fax">Fax</label>
        <input id="ad-fax" name="fax" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-10 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : funnel.form.submitLabel}
      </button>
    </form>
  );
}
