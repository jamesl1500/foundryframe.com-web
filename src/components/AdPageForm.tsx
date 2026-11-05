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
  "w-full px-4 py-3 bg-white/70 border border-ink/10 text-ink placeholder-muted focus:outline-none focus:border-accent transition-colors rounded-2xl";
const labelClass = "block text-xs uppercase tracking-wider text-muted mb-2";

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
        <p className="eyebrow mb-4">Sent</p>
        <p className="text-ink text-2xl font-heading font-bold mb-3">James has your details.</p>
        <p className="text-body text-sm mb-8 max-w-md">
          Watch your inbox for your plan. If you&apos;d rather talk it through, grab a time on the calendar.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
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
        className="btn btn-primary w-full sm:w-auto disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : funnel.form.submitLabel}
      </button>
    </form>
  );
}
