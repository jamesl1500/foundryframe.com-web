"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { BOOKING_URL, newConversionId, trackConversion } from "@/lib/analytics";
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
  "w-full px-4 py-3 bg-white/70 border border-ink/10 text-ink placeholder-muted focus:outline-none focus:border-accent transition-colors rounded-2xl";
const labelClass = "block text-xs uppercase tracking-wider text-muted mb-2";

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function Step({ number, title, hint, children }: { number: string; title: string; hint: string; children: ReactNode }) {
  return (
    <section className="py-10 border-b border-ink/10">
      <div className="flex items-baseline gap-4 mb-2">
        <span className="text-xs uppercase tracking-[0.3em] text-muted">{number}</span>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink">{title}</h2>
      </div>
      <p className="text-sm text-muted mb-6 max-w-2xl">{hint}</p>
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
      className={`text-left p-5 rounded-card border backdrop-blur-xl transition-colors h-full flex flex-col ${
        selected ? "border-accent bg-accent/15 shadow-[0_8px_24px_rgba(196,130,26,0.15)]" : "border-white/80 bg-white/55 hover:bg-white/75"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-ink font-bold">{title}</span>
        <span className={`text-sm whitespace-nowrap ${selected ? "text-accent-ink" : "text-body"}`}>{price}</span>
      </div>
      <span className="text-sm text-body leading-relaxed">{summary}</span>
      {(disabledReason || meta) && (
        <span className="mt-3 text-xs uppercase tracking-widest text-muted">{disabledReason || meta}</span>
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
    <div className="glass rounded-card p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Your package</p>
      {quote.lines.length === 0 ? (
        <p className="text-sm text-muted">Pick a starting point to see your price.</p>
      ) : (
        <ul className="space-y-3 mb-6">
          {quote.lines.map((line) => (
            <li key={line.label} className="flex justify-between gap-4 text-sm">
              <span className="text-ink-soft">{line.label}</span>
              <span className="text-ink whitespace-nowrap">{formatLineAmount(line)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="border-t border-ink/10 pt-4 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs uppercase tracking-widest text-muted">One-time</span>
          <span className="text-2xl font-heading font-bold text-ink">
            {formatUsd(quote.oneTimeTotal)}
            {quote.oneTimeTotal > 0 ? plus : ""}
          </span>
        </div>
        {quote.hasCustomItems && <p className="text-xs text-muted text-right">+ custom scope priced on your call</p>}
        <div className="flex justify-between items-baseline">
          <span className="text-xs uppercase tracking-widest text-muted">Monthly</span>
          <span className="text-xl font-heading font-bold text-ink">
            {formatUsd(quote.monthlyTotal)}
            {quote.monthlyTotal > 0 ? plus : ""}/mo
          </span>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-ink/10 text-sm">
        <p className="text-muted">
          Estimated timeline: <span className="text-ink">{quote.timeline}</span>
        </p>
        <p className="text-muted mt-1">Kickoff within a week of your deposit.</p>
        {quote.notes.map((note) => (
          <p key={note} className="text-xs text-muted mt-3">
            {note}
          </p>
        ))}
        {quote.hasFloorPrices && (
          <p className="text-xs text-muted mt-3">
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
    // Start people on The Spark, our entry-level website, with basic care.
    foundationId: "spark",
    maintenanceId: "steady",
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
    const conversionId = newConversionId();

    try {
      const res = await fetch("/api/package-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, selection, conversionId }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Something went wrong.");

      trackConversion("package_builder", { value: quote.oneTimeTotal, eventId: conversionId });
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
          <p className="eyebrow mb-4">Package sent</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink leading-tight mb-6">
            James has your package.
          </h2>
          <p className="text-body max-w-xl mb-4">
            Your picks and pricing are on their way to the team. You&apos;ll hear back within one business day to
            confirm the numbers and your meeting time.
          </p>
          <p className="text-body max-w-xl mb-8">
            Want to lock in a time right now? Grab any open slot on the calendar and we&apos;ll come to the call
            with your package ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-center"
            >
              Book my meeting now
            </a>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="btn btn-glass"
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
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3">Websites</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">{websites.map(foundationCard)}</div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3">Launch bundles</p>
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
                    className={`p-5 rounded-card border backdrop-blur-xl ${quantity > 0 && !reason ? "border-accent bg-accent/15" : "border-white/80 bg-white/55"} ${reason ? "opacity-40" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-ink font-bold">{addon.name}</span>
                      <span className="text-sm text-body whitespace-nowrap">{price}</span>
                    </div>
                    <p className="text-sm text-body mb-4">{addon.summary}</p>
                    {reason ? (
                      <span className="text-xs uppercase tracking-widest text-muted">{reason}</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Remove one ${addon.name.toLowerCase()}`}
                          onClick={() => setAddon(addon.id, quantity - 1)}
                          className="w-11 h-11 rounded-full border border-ink/15 bg-white/70 text-ink hover:bg-white"
                        >
                          −
                        </button>
                        <span className="text-ink w-8 text-center" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Add one ${addon.name.toLowerCase()}`}
                          onClick={() => setAddon(addon.id, Math.min(quantity + 1, addon.maxQuantity ?? 1))}
                          className="w-11 h-11 rounded-full border border-ink/15 bg-white/70 text-ink hover:bg-white"
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
                <select id="pb-window" name="preferredWindow" className={inputClass} defaultValue="">
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
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending..." : "Send my package"}
            </button>
            <p className="text-muted text-xs text-center">
              No payment now and no obligation. You&apos;ll be able to book an exact time on the next screen.
            </p>
          </form>
        </Step>
      </div>

      <aside className="lg:sticky lg:top-28 pt-10">
        <QuoteSummary quote={quote}>
          <a
            href="#pb-name"
            className="btn btn-primary mt-6 flex text-center"
          >
            Continue to send
          </a>
        </QuoteSummary>
      </aside>
    </div>
  );
}
