"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { BOOKING_URL, trackConversion } from "@/lib/analytics";
import {
  ADDONS,
  FOUNDATIONS,
  MAINTENANCE_PLANS,
  MARKETING_PLANS,
  MEETING_WINDOWS,
  addonUnavailableReason,
  formatLineAmount,
  formatUsd,
  priceQuote,
  type MonthlyOption,
  type PackageSelection,
  type PricedQuote,
} from "@/lib/package-builder/catalog";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors";
const labelClass = "block text-xs uppercase tracking-wider text-gray-500 mb-2";

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function Step({ number, title, hint, children }: { number: string; title: string; hint: string; children: ReactNode }) {
  return (
    <section className="py-10 border-b border-white/10">
      <div className="flex items-baseline gap-4 mb-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">{number}</span>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">{title}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 max-w-2xl">{hint}</p>
      {children}
    </section>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  price,
  summary,
  meta,
  disabledReason,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  price: string;
  summary: string;
  meta?: string;
  disabledReason?: string | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabledReason)}
      aria-pressed={selected}
      className={`text-left p-5 border transition-colors h-full flex flex-col ${
        selected ? "border-accent bg-accent/10" : "border-white/10 hover:border-white/30"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-white font-bold">{title}</span>
        <span className={`text-sm whitespace-nowrap ${selected ? "text-accent" : "text-gray-400"}`}>{price}</span>
      </div>
      <span className="text-sm text-gray-400 leading-relaxed">{summary}</span>
      {(disabledReason || meta) && (
        <span className="mt-3 text-[10px] uppercase tracking-widest text-gray-500">{disabledReason || meta}</span>
      )}
    </button>
  );
}

function MonthlyPicker({
  options,
  value,
  onChange,
  noneLabel,
}: {
  options: MonthlyOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  noneLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <OptionCard selected={value === null} onClick={() => onChange(null)} title={noneLabel} price="$0" summary="You can add this any time later." />
      {options.map((option) => (
        <OptionCard
          key={option.id}
          selected={value === option.id}
          onClick={() => onChange(option.id)}
          title={option.name}
          price={`${formatUsd(option.price)}/mo`}
          summary={option.summary}
        />
      ))}
    </div>
  );
}

function QuoteSummary({ quote, children }: { quote: PricedQuote; children?: ReactNode }) {
  const plus = quote.hasFloorPrices ? "+" : "";
  return (
    <div className="border border-white/10 bg-white/[0.02] p-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4">Your package</p>
      {quote.lines.length === 0 ? (
        <p className="text-sm text-gray-500">Pick a starting point to see your price.</p>
      ) : (
        <ul className="space-y-3 mb-6">
          {quote.lines.map((line) => (
            <li key={line.label} className="flex justify-between gap-4 text-sm">
              <span className="text-gray-300">{line.label}</span>
              <span className="text-white whitespace-nowrap">{formatLineAmount(line)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs uppercase tracking-widest text-gray-500">One-time</span>
          <span className="text-2xl font-heading font-bold text-white">
            {formatUsd(quote.oneTimeTotal)}
            {quote.oneTimeTotal > 0 ? plus : ""}
          </span>
        </div>
        {quote.hasCustomItems && <p className="text-xs text-gray-500 text-right">+ custom scope priced on your call</p>}
        <div className="flex justify-between items-baseline">
          <span className="text-xs uppercase tracking-widest text-gray-500">Monthly</span>
          <span className="text-xl font-heading font-bold text-white">
            {formatUsd(quote.monthlyTotal)}
            {quote.monthlyTotal > 0 ? plus : ""}/mo
          </span>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-white/10 text-sm">
        <p className="text-gray-500">
          Estimated timeline: <span className="text-white">{quote.timeline}</span>
        </p>
        <p className="text-gray-500 mt-1">Kickoff within a week of your deposit.</p>
        {quote.notes.map((note) => (
          <p key={note} className="text-xs text-gray-500 mt-3">
            {note}
          </p>
        ))}
        {quote.hasFloorPrices && (
          <p className="text-xs text-gray-600 mt-3">
            Prices marked + are starting points. James confirms the exact number on your call, with no obligation.
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function PackageBuilder() {
  const [selection, setSelection] = useState<PackageSelection>({
    foundationId: "blueprint",
    maintenanceId: "active",
    marketingId: null,
    addons: {},
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedQuote, setSubmittedQuote] = useState<PricedQuote | null>(null);

  const quote = useMemo(() => priceQuote(selection), [selection]);
  const websites = FOUNDATIONS.filter((option) => option.group === "website");
  const bundles = FOUNDATIONS.filter((option) => option.group === "bundle");
  const noWebsite = FOUNDATIONS.find((option) => option.group === "none");

  function update(patch: Partial<PackageSelection>) {
    setSelection((current) => ({ ...current, ...patch }));
  }

  function setAddon(id: string, quantity: number) {
    setSelection((current) => ({ ...current, addons: { ...current.addons, [id]: Math.max(0, quantity) } }));
  }

  function foundationCard(option: (typeof FOUNDATIONS)[number]) {
    return (
      <OptionCard
        key={option.id}
        selected={selection.foundationId === option.id}
        onClick={() => update({ foundationId: option.id })}
        title={option.name}
        price={option.price === null ? "Custom" : option.price === 0 ? "$0" : `${formatUsd(option.price)}+`}
        summary={option.summary}
        meta={option.timeline}
      />
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const res = await fetch("/api/package-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, selection }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Something went wrong.");

      trackConversion("package_builder", {
        value: quote.oneTimeTotal,
        user: { email: String(form.email ?? ""), name: String(form.name ?? "") },
      });
      setSubmittedQuote(json?.quote ?? quote);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success" && submittedQuote) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 py-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Package sent</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white leading-tight mb-6">
            James has your package.
          </h2>
          <p className="text-gray-400 max-w-xl mb-4">
            Your picks and pricing are on their way to the team. You&apos;ll hear back within one business day to
            confirm the numbers and your meeting time.
          </p>
          <p className="text-gray-400 max-w-xl mb-8">
            Want to lock in a time right now? Grab any open slot on the calendar and we&apos;ll come to the call
            with your package ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors text-center"
            >
              Book my meeting now
            </a>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Build another package
            </button>
          </div>
        </div>
        <QuoteSummary quote={submittedQuote} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
      <div>
        <Step
          number="01"
          title="Pick your starting point"
          hint="A custom website on its own, or a launch bundle that adds branding, marketing, and maintenance in one engagement."
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">Websites</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">{websites.map(foundationCard)}</div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">Launch bundles</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">{bundles.map(foundationCard)}</div>
          {noWebsite && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{foundationCard(noWebsite)}</div>}
        </Step>

        <Step number="02" title="Add what you need" hint="Only pay for the extras that matter to you.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADDONS.map((addon) => {
              const reason = addonUnavailableReason(addon.id, selection);
              const quantity = selection.addons[addon.id] ?? 0;
              const price = `${formatUsd(addon.price)}${addon.isFloor ? "+" : ""}${addon.billing === "monthly" ? "/mo" : ""}${addon.perUnit ? " each" : ""}`;

              if (addon.perUnit) {
                return (
                  <div
                    key={addon.id}
                    className={`p-5 border ${quantity > 0 && !reason ? "border-accent bg-accent/10" : "border-white/10"} ${reason ? "opacity-40" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-white font-bold">{addon.name}</span>
                      <span className="text-sm text-gray-400 whitespace-nowrap">{price}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{addon.summary}</p>
                    {reason ? (
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">{reason}</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Remove one ${addon.name.toLowerCase()}`}
                          onClick={() => setAddon(addon.id, quantity - 1)}
                          className="w-9 h-9 border border-white/20 text-white hover:bg-white/5"
                        >
                          −
                        </button>
                        <span className="text-white w-8 text-center" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Add one ${addon.name.toLowerCase()}`}
                          onClick={() => setAddon(addon.id, Math.min(quantity + 1, addon.maxQuantity ?? 1))}
                          className="w-9 h-9 border border-white/20 text-white hover:bg-white/5"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <OptionCard
                  key={addon.id}
                  selected={quantity > 0 && !reason}
                  onClick={() => setAddon(addon.id, quantity > 0 ? 0 : 1)}
                  title={addon.name}
                  price={price}
                  summary={addon.summary}
                  disabledReason={reason}
                />
              );
            })}
          </div>
        </Step>

        <Step
          number="03"
          title="Keep it running"
          hint="Maintenance keeps your site updated, secure, and backed up after launch."
        >
          <MonthlyPicker
            options={MAINTENANCE_PLANS}
            value={selection.maintenanceId}
            onChange={(maintenanceId) => update({ maintenanceId })}
            noneLabel="No maintenance"
          />
        </Step>

        <Step number="04" title="Bring in customers" hint="Ongoing marketing to get your new site found and turning visitors into leads.">
          <MonthlyPicker
            options={MARKETING_PLANS}
            value={selection.marketingId}
            onChange={(marketingId) => update({ marketingId })}
            noneLabel="No marketing"
          />
        </Step>

        <Step
          number="05"
          title="Send it and pick a meeting time"
          hint="James reviews every package personally and replies within one business day to confirm your price and meeting."
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pb-name" className={labelClass}>
                  Your name *
                </label>
                <input id="pb-name" name="name" required className={inputClass} placeholder="Jane Doe" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="pb-email" className={labelClass}>
                  Email *
                </label>
                <input
                  id="pb-email"
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                  placeholder="jane@business.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="pb-company" className={labelClass}>
                  Business name
                </label>
                <input id="pb-company" name="company" className={inputClass} placeholder="Doe Bakery" autoComplete="organization" />
              </div>
              <div>
                <label htmlFor="pb-phone" className={labelClass}>
                  Phone
                </label>
                <input id="pb-phone" name="phone" type="tel" className={inputClass} placeholder="(555) 555-5555" autoComplete="tel" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="pb-website" className={labelClass}>
                  Current website (if any)
                </label>
                <input id="pb-website" name="websiteUrl" className={inputClass} placeholder="doebakery.com" autoComplete="url" />
              </div>
              <div>
                <label htmlFor="pb-date" className={labelClass}>
                  Preferred meeting day
                </label>
                <input id="pb-date" name="preferredDate" type="date"
                  // Set on focus, not render: this page is prerendered, so a render-time date would be stale.
                  onFocus={(event) => (event.currentTarget.min = tomorrow())}
                  className={`${inputClass} [color-scheme:dark]`} />
              </div>
              <div>
                <label htmlFor="pb-window" className={labelClass}>
                  Preferred time
                </label>
                <select id="pb-window" name="preferredWindow" className={`${inputClass} bg-black`} defaultValue="">
                  <option value="">Any time</option>
                  {MEETING_WINDOWS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="pb-notes" className={labelClass}>
                Anything else we should know?
              </label>
              <textarea
                id="pb-notes"
                name="notes"
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Goals, deadlines, sites you like, features you need..."
              />
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="pb-fax">Fax</label>
              <input id="pb-fax" name="fax" tabIndex={-1} autoComplete="off" />
            </div>

            {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === "sending" || quote.lines.length === 0}
              className="w-full px-8 py-4 bg-accent text-black text-sm font-medium uppercase tracking-wider hover:bg-accent-glow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending..." : "Send my package"}
            </button>
            <p className="text-gray-500 text-xs text-center">
              No payment now and no obligation. You&apos;ll be able to book an exact time on the next screen.
            </p>
          </form>
        </Step>
      </div>

      <aside className="lg:sticky lg:top-28 pt-10">
        <QuoteSummary quote={quote}>
          <a
            href="#pb-name"
            className="mt-6 block text-center px-6 py-3 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors"
          >
            Continue to send
          </a>
        </QuoteSummary>
      </aside>
    </div>
  );
}
