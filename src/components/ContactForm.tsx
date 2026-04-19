"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-16 text-center">
        <p className="text-white text-lg font-medium mb-2">Message sent.</p>
        <p className="text-gray-500 text-sm">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-400 pb-0.5 hover:text-white hover:border-white transition-colors"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            placeholder="John"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="company"
          className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
        >
          Company / Brand
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
          placeholder="Acme Inc."
        />
      </div>

      <div>
        <label
          htmlFor="service"
          className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
        >
          Service *
        </label>
        <select
          id="service"
          name="service"
          required
          className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:outline-none focus:border-white transition-colors"
        >
          <option value="">Select a service...</option>
          <option value="Branding & Identity">Branding & Identity</option>
          <option value="Web Design & Development">Web Design & Development</option>
          <option value="Photography">Photography</option>
          <option value="Videography">Videography</option>
          <option value="Social Media">Social Media</option>
          <option value="Advertising">Advertising</option>
          <option value="Digital Strategy">Digital Strategy</option>
          <option value="Full Package">Full Package</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="budget"
          className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
        >
          Budget
        </label>
        <select
          id="budget"
          name="budget"
          className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:outline-none focus:border-white transition-colors"
        >
          <option value="">Select a range...</option>
          <option value="Under $2,500">Under $2,500</option>
          <option value="$2,500 – $5,000">$2,500 – $5,000</option>
          <option value="$5,000 – $10,000">$5,000 – $10,000</option>
          <option value="$10,000 – $25,000">$10,000 – $25,000</option>
          <option value="$25,000+">$25,000+</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
        >
          Project Details *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors resize-none"
          placeholder="Tell us about your project, goals, and timeline..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-8 py-4 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      <p className="text-gray-600 text-xs text-center">
        We&apos;ll get back to you within 24 business hours.
      </p>
    </form>
  );
}
