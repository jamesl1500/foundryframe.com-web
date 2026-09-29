"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatLineAmount, formatUsd } from "@/lib/package-builder/catalog";
import { QUOTE_STATUSES, type PackageQuoteRecord, type QuoteStatus } from "@/lib/package-builder/types";

const statusLabels: Record<QuoteStatus, string> = {
  new: "New",
  contacted: "Contacted",
  meeting_booked: "Meeting booked",
  won: "Won",
  lost: "Lost",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function QuotesClient({ quotes }: { quotes: PackageQuoteRecord[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<QuoteStatus | "all">("new");
  const [expandedId, setExpandedId] = useState("");
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: quotes.length };
    for (const quote of quotes) result[quote.status] = (result[quote.status] ?? 0) + 1;
    return result;
  }, [quotes]);

  const visible = activeTab === "all" ? quotes : quotes.filter((quote) => quote.status === activeTab);

  async function setStatus(id: string, status: QuoteStatus) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Unable to update quote.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update quote.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", ...QUOTE_STATUSES] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 border text-[10px] uppercase tracking-widest ${
              activeTab === tab ? "border-white bg-white text-black" : "border-white/20 text-gray-300 hover:bg-white/5"
            }`}
          >
            {tab === "all" ? "All" : statusLabels[tab]} ({counts[tab] ?? 0})
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {visible.length === 0 ? (
        <div className="border border-white/10 p-10 text-center text-sm text-gray-500">No quotes here yet.</div>
      ) : (
        <div className="divide-y divide-white/10 border border-white/10">
          {visible.map((quote) => {
            const expanded = expandedId === quote.id;
            const plus = quote.quote.hasFloorPrices ? "+" : "";
            return (
              <div key={quote.id} className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? "" : quote.id)}
                    className="flex-1 text-left"
                    aria-expanded={expanded}
                  >
                    <p className="text-white font-bold">
                      {quote.name}
                      {quote.company ? <span className="text-gray-400 font-normal"> · {quote.company}</span> : null}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(quote.created_at)} · {quote.quote.lines.map((line) => line.label).join(", ")}
                    </p>
                  </button>
                  <div className="text-right">
                    <p className="text-white font-heading font-bold">
                      {formatUsd(quote.one_time_total)}
                      {plus}
                      {quote.quote.hasCustomItems ? " + custom" : ""}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatUsd(quote.monthly_total)}
                      {quote.monthly_total > 0 ? plus : ""}/mo
                    </p>
                  </div>
                  <select
                    value={quote.status}
                    disabled={busyId === quote.id}
                    onChange={(event) => setStatus(quote.id, event.target.value as QuoteStatus)}
                    className="bg-black border border-white/20 px-3 py-2 text-xs uppercase tracking-widest text-white"
                    aria-label={`Status for ${quote.name}`}
                  >
                    {QUOTE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>

                {expanded && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 text-sm">
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-[10px] uppercase tracking-widest text-gray-500">Email</dt>
                        <dd>
                          <a href={`mailto:${quote.email}`} className="text-white underline">
                            {quote.email}
                          </a>
                        </dd>
                      </div>
                      {quote.phone && (
                        <div>
                          <dt className="text-[10px] uppercase tracking-widest text-gray-500">Phone</dt>
                          <dd>
                            <a href={`tel:${quote.phone}`} className="text-white underline">
                              {quote.phone}
                            </a>
                          </dd>
                        </div>
                      )}
                      {quote.website_url && (
                        <div>
                          <dt className="text-[10px] uppercase tracking-widest text-gray-500">Current website</dt>
                          <dd className="text-white break-all">{quote.website_url}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-[10px] uppercase tracking-widest text-gray-500">Preferred meeting</dt>
                        <dd className="text-white">
                          {quote.preferred_date
                            ? `${quote.preferred_date}${quote.preferred_window ? `, ${quote.preferred_window}` : ""}`
                            : "No preference"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-widest text-gray-500">Timeline shown</dt>
                        <dd className="text-white">{quote.quote.timeline}</dd>
                      </div>
                      {quote.notes && (
                        <div>
                          <dt className="text-[10px] uppercase tracking-widest text-gray-500">Notes</dt>
                          <dd className="text-gray-300 whitespace-pre-wrap">{quote.notes}</dd>
                        </div>
                      )}
                      {!quote.email_sent && (
                        <p className="text-xs text-amber-200">The notification email for this quote did not send.</p>
                      )}
                    </dl>
                    <div>
                      <ul className="space-y-3">
                        {quote.quote.lines.map((line) => (
                          <li key={line.label} className="flex justify-between gap-4">
                            <span>
                              <span className="text-white">{line.label}</span>
                              <span className="block text-xs text-gray-500">{line.detail}</span>
                            </span>
                            <span className="text-white whitespace-nowrap">{formatLineAmount(line)}</span>
                          </li>
                        ))}
                      </ul>
                      {quote.quote.notes.map((note) => (
                        <p key={note} className="text-xs text-gray-500 mt-3">
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
