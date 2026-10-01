/**
 * FoundingForm - Foundry Frame
 * ==============================
 * Short Founding Client application: name, email, business, current URL,
 * timeline, and budget range. Posts to /api/founding.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useState, type FormEvent } from "react";
import { BOOKING_URL, trackConversion } from "@/lib/analytics";
import { FOUNDING_BUDGETS, FOUNDING_TIMELINES } from "@/lib/founding/options";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors";
const labelClass = "block text-xs uppercase tracking-wider text-gray-500 mb-2";

export default function FoundingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/founding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Something went wrong.");

      trackConversion("founding", {
        user: { email: String(data.email ?? ""), name: String(data.name ?? "") },
      });
      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Application sent</p>
        <p className="text-white text-2xl font-heading font-bold mb-3">James has your application.</p>
        <p className="text-gray-400 text-sm mb-8 max-w-md">
          You&apos;ll hear back by email. Want to skip the wait? Grab a time on the calendar and we&apos;ll
          talk through your project.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors"
        >
          Book a call now
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fd-name" className={labelClass}>
            Your name *
          </label>
          <input id="fd-name" name="name" required className={inputClass} placeholder="Jane Doe" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="fd-email" className={labelClass}>
            Email *
          </label>
          <input
            id="fd-email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="jane@doebakery.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="fd-business" className={labelClass}>
            Business *
          </label>
          <input
            id="fd-business"
            name="business"
            required
            className={inputClass}
            placeholder="Doe Bakery"
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="fd-website" className={labelClass}>
            Current website
          </label>
          <input id="fd-website" name="websiteUrl" className={inputClass} placeholder="doebakery.com (or none yet)" autoComplete="url" />
        </div>
        <div>
          <label htmlFor="fd-timeline" className={labelClass}>
            Timeline *
          </label>
          <select id="fd-timeline" name="timeline" required defaultValue="" className={`${inputClass} bg-black`}>
            <option value="" disabled>
              Pick one
            </option>
            {FOUNDING_TIMELINES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fd-budget" className={labelClass}>
            Budget range *
          </label>
          <select id="fd-budget" name="budget" required defaultValue="" className={`${inputClass} bg-black`}>
            <option value="" disabled>
              Pick one
            </option>
            {FOUNDING_BUDGETS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="fd-fax">Fax</label>
        <input id="fd-fax" name="fax" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-10 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Apply for a founding spot"}
      </button>
    </form>
  );
}
