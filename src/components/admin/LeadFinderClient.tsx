"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  LeadProspectRecord,
  LeadProspectSearchRecord,
  ProspectSearchRunResult,
  ProspectSource,
  ProspectStatus,
} from "@/lib/lead-finder/types";

interface Props {
  prospects: LeadProspectRecord[];
  searches: LeadProspectSearchRecord[];
  sources: Record<ProspectSource, boolean>;
}

const sourceLabels: Record<ProspectSource, string> = {
  google_places: "Google Places",
  web_search: "Web search (Claude)",
};

const statusTabs: Array<{ id: ProspectStatus; label: string }> = [
  { id: "new", label: "New" },
  { id: "saved", label: "Saved" },
  { id: "promoted", label: "Promoted" },
  { id: "dismissed", label: "Dismissed" },
];

const inputClass = "w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm";
const labelClass = "block text-xs uppercase tracking-widest text-gray-400 mb-2";
const smallButton =
  "px-3 py-2 border border-white/20 text-[10px] uppercase tracking-widest text-white hover:bg-white/5 disabled:opacity-40";

function scoreTone(score: number) {
  if (score >= 60) return "border-emerald-300/40 text-emerald-200 bg-emerald-500/10";
  if (score >= 35) return "border-amber-300/40 text-amber-200 bg-amber-500/10";
  return "border-white/20 text-gray-300";
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "Never";
}

export default function LeadFinderClient({ prospects, searches, sources }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSources, setSelectedSources] = useState<ProspectSource[]>(
    (Object.keys(sources) as ProspectSource[]).filter((source) => sources[source])
  );
  const [saveSearch, setSaveSearch] = useState(true);
  const [running, setRunning] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [activeTab, setActiveTab] = useState<ProspectStatus>("new");
  const [minScore, setMinScore] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const counts = useMemo(() => {
    const result: Record<ProspectStatus, number> = { new: 0, saved: 0, promoted: 0, dismissed: 0 };
    prospects.forEach((prospect) => {
      result[prospect.status] += 1;
    });
    return result;
  }, [prospects]);

  const visible = useMemo(
    () => prospects.filter((prospect) => prospect.status === activeTab && prospect.score >= minScore),
    [prospects, activeTab, minScore]
  );

  async function request<T>(url: string, init: RequestInit): Promise<T | null> {
    setError("");
    const response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json" },
    });
    const result = (await response.json()) as { data?: T; error?: string };
    if (!response.ok || result.data === undefined) {
      setError(result.error ?? "Request failed.");
      return null;
    }
    return result.data;
  }

  function reportRun(result: ProspectSearchRunResult) {
    const parts = [`Checked ${result.candidates} businesses, added ${result.inserted} new prospects`];
    if (result.duplicates > 0) parts.push(`${result.duplicates} were already in the list`);
    setNotice(`${parts.join("; ")}.`);
    if (result.errors.length > 0) setError(result.errors.join(" "));
  }

  async function runSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRunning(true);
    setNotice("");
    const result = await request<ProspectSearchRunResult>("/api/admin/lead-finder/run", {
      method: "POST",
      body: JSON.stringify({ query, location, sources: selectedSources, save: saveSearch }),
    });
    setRunning(false);
    if (result) {
      reportRun(result);
      setActiveTab("new");
      router.refresh();
    }
  }

  async function rerunSearch(searchId: string) {
    setBusyId(searchId);
    setNotice("");
    const result = await request<ProspectSearchRunResult>("/api/admin/lead-finder/run", {
      method: "POST",
      body: JSON.stringify({ search_id: searchId }),
    });
    setBusyId("");
    if (result) {
      reportRun(result);
      router.refresh();
    }
  }

  async function toggleSearch(search: LeadProspectSearchRecord) {
    setBusyId(search.id);
    await request(`/api/admin/lead-finder/searches/${search.id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: !search.is_active }),
    });
    setBusyId("");
    router.refresh();
  }

  async function deleteSearch(search: LeadProspectSearchRecord) {
    if (!window.confirm(`Stop and delete the saved search "${search.query} in ${search.location}"?`)) return;
    setBusyId(search.id);
    await request(`/api/admin/lead-finder/searches/${search.id}`, { method: "DELETE" });
    setBusyId("");
    router.refresh();
  }

  async function setStatus(prospect: LeadProspectRecord, status: ProspectStatus) {
    setBusyId(prospect.id);
    await request(`/api/admin/lead-finder/prospects/${prospect.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setBusyId("");
    router.refresh();
  }

  async function promote(prospect: LeadProspectRecord) {
    setBusyId(prospect.id);
    const result = await request<{ leadId: string }>(`/api/admin/lead-finder/prospects/${prospect.id}/promote`, {
      method: "POST",
    });
    setBusyId("");
    if (result) router.push(`/admin/leads/${result.leadId}`);
  }

  function toggleSource(source: ProspectSource) {
    setSelectedSources((current) =>
      current.includes(source) ? current.filter((entry) => entry !== source) : [...current, source]
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
        <form onSubmit={runSearch} className="border border-white/10 p-6 lg:p-8 bg-black space-y-4">
          <h2 className="text-xl font-heading font-bold text-white">Find prospects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label>
              <span className={labelClass}>Type of business *</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                required
                placeholder="bakeries, landscapers, dentists"
                className={inputClass}
              />
            </label>
            <label>
              <span className={labelClass}>City or region *</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                required
                placeholder="Columbus, OH"
                className={inputClass}
              />
            </label>
          </div>

          <fieldset>
            <span className={labelClass}>Sources</span>
            <div className="flex flex-wrap gap-4">
              {(Object.keys(sourceLabels) as ProspectSource[]).map((source) => (
                <label key={source} className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    disabled={!sources[source]}
                    onChange={() => toggleSource(source)}
                  />
                  {sourceLabels[source]}
                  {!sources[source] && (
                    <span className="text-[10px] uppercase tracking-widest text-amber-300">
                      {source === "google_places" ? "needs GOOGLE_PLACES_API_KEY" : "needs ANTHROPIC_API_KEY"}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={saveSearch} onChange={(event) => setSaveSearch(event.target.checked)} />
            Save this search and re-run it daily
          </label>

          <button
            type="submit"
            disabled={running || selectedSources.length === 0}
            className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 disabled:opacity-50"
          >
            {running ? "Searching… this can take a couple of minutes" : "Run Search"}
          </button>
        </form>

        <div className="border border-white/10 p-6 lg:p-8 bg-black">
          <h2 className="text-xl font-heading font-bold text-white mb-1">Daily searches</h2>
          <p className="text-xs text-gray-500 mb-4">Active searches re-run once a day and add any new businesses they find.</p>
          {searches.length === 0 ? (
            <p className="text-sm text-gray-400">No saved searches yet.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {searches.map((search) => (
                <li key={search.id} className="py-3 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">
                        {search.query} <span className="text-gray-500">in</span> {search.location}
                      </p>
                      <p className="text-xs text-gray-500">
                        {search.sources.map((source) => sourceLabels[source]).join(" + ")} · last run{" "}
                        {formatDate(search.last_run_at)}
                        {search.last_run_found !== null && ` · ${search.last_run_found} new`}
                        {!search.is_active && " · paused"}
                      </p>
                      {search.last_run_error && <p className="text-xs text-amber-300 mt-1">{search.last_run_error}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button type="button" className={smallButton} disabled={busyId === search.id} onClick={() => rerunSearch(search.id)}>
                        {busyId === search.id ? "…" : "Run"}
                      </button>
                      <button type="button" className={smallButton} disabled={busyId === search.id} onClick={() => toggleSearch(search)}>
                        {search.is_active ? "Pause" : "Resume"}
                      </button>
                      <button type="button" className={smallButton} disabled={busyId === search.id} onClick={() => deleteSearch(search)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {notice && <div className="border border-emerald-300/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">{notice}</div>}
      {error && <div className="border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 border text-[10px] uppercase tracking-widest ${
                  activeTab === tab.id ? "border-white bg-white text-black" : "border-white/20 text-gray-300 hover:bg-white/5"
                }`}
              >
                {tab.label} ({counts[tab.id]})
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-400">
            Min score {minScore}
            <input type="range" min={0} max={90} step={5} value={minScore} onChange={(event) => setMinScore(Number(event.target.value))} />
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="border border-white/10 p-8 text-sm text-gray-400 bg-black">
            {prospects.length === 0 ? "No prospects yet. Run a search to find some." : "Nothing here with the current filters."}
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10">
            <table className="min-w-full text-sm bg-black">
              <thead className="bg-white/5">
                <tr>
                  {["Score", "Business", "Website", "Why", "Contact", "Actions"].map((label) => (
                    <th key={label} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-gray-400">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((prospect) => (
                  <tr key={prospect.id} className="border-t border-white/10 align-top hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <span className={`inline-block min-w-[3rem] text-center px-2 py-1 border text-sm font-bold ${scoreTone(prospect.score)}`}>
                        {prospect.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 min-w-[200px]">
                      <p className="text-white">{prospect.business_name}</p>
                      <p className="text-xs text-gray-500">
                        {[prospect.category, prospect.address ?? prospect.location].filter(Boolean).join(" · ")}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-1">
                        {sourceLabels[prospect.source]}
                        {prospect.review_count !== null && ` · ${prospect.review_count} reviews`}
                      </p>
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      {prospect.website_url ? (
                        <a href={prospect.website_url} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white break-all">
                          {prospect.domain ?? prospect.website_url}
                        </a>
                      ) : (
                        <span className="text-amber-200">No website</span>
                      )}
                      {prospect.source_url && (
                        <a href={prospect.source_url} target="_blank" rel="noreferrer" className="block text-xs text-gray-500 hover:text-white mt-1">
                          Where it was found ↗
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 min-w-[260px] max-w-[380px]">
                      <ul className="space-y-1">
                        {prospect.score_reasons.slice(0, 5).map((reason) => (
                          <li key={reason.signal} className="text-xs text-gray-300">
                            <span className="text-gray-500">+{reason.points}</span> {reason.signal}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">
                      {prospect.phone && <p>{prospect.phone}</p>}
                      {prospect.email && <p>{prospect.email}</p>}
                      {!prospect.phone && !prospect.email && <span className="text-gray-600">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {prospect.lead_id ? (
                          <Link href={`/admin/leads/${prospect.lead_id}`} className={smallButton}>
                            Open Lead
                          </Link>
                        ) : (
                          <button type="button" className={smallButton} disabled={busyId === prospect.id} onClick={() => promote(prospect)}>
                            Promote to Lead
                          </button>
                        )}
                        {prospect.status !== "promoted" && prospect.status !== "saved" && (
                          <button type="button" className={smallButton} disabled={busyId === prospect.id} onClick={() => setStatus(prospect, "saved")}>
                            Save
                          </button>
                        )}
                        {prospect.status !== "promoted" && prospect.status !== "dismissed" && (
                          <button type="button" className={smallButton} disabled={busyId === prospect.id} onClick={() => setStatus(prospect, "dismissed")}>
                            Dismiss
                          </button>
                        )}
                        {prospect.status === "dismissed" && (
                          <button type="button" className={smallButton} disabled={busyId === prospect.id} onClick={() => setStatus(prospect, "new")}>
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
