"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  LeadAuditRecord,
  LeadGeneratedPageRecord,
  LeadRecord,
} from "@/lib/leads/types";

interface Props {
  lead: LeadRecord;
  latestAudit: LeadAuditRecord | null;
  latestPage: LeadGeneratedPageRecord | null;
}

export default function LeadWorkbenchClient({ lead, latestAudit, latestPage }: Props) {
  const router = useRouter();
  const [state, setState] = useState({
    name: lead.name,
    company_name: lead.company_name ?? "",
    website_url: lead.website_url,
    industry: lead.industry ?? "",
    contact_email: lead.contact_email ?? "",
    contact_phone: lead.contact_phone ?? "",
    company_size: lead.company_size ?? "",
    location: lead.location ?? "",
    notes: lead.notes ?? "",
    status: lead.status,
  });
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sendingProposal, setSendingProposal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const issueCount = useMemo(() => latestAudit?.seo_issues?.length ?? 0, [latestAudit]);
  const normalizedRecommendations = useMemo(() => {
    const source = latestAudit?.recommendations;

    if (!source) {
      return [] as Array<{ category: string; action: string; expectedImpact: string }>;
    }

    const collection = Array.isArray(source)
      ? source
      : typeof source === "object" && source !== null && Array.isArray((source as { items?: unknown }).items)
        ? (source as { items: unknown[] }).items
        : [];

    return collection
      .map((entry) => {
        if (typeof entry === "string") {
          return {
            category: "seo",
            action: entry,
            expectedImpact: "",
          };
        }

        if (!entry || typeof entry !== "object") {
          return null;
        }

        const record = entry as Record<string, unknown>;
        const action =
          typeof record.action === "string"
            ? record.action
            : typeof record.title === "string"
              ? record.title
              : typeof record.recommendation === "string"
                ? record.recommendation
                : "";

        if (!action) {
          return null;
        }

        const category =
          typeof record.category === "string"
            ? record.category
            : typeof record.type === "string"
              ? record.type
              : "seo";

        const expectedImpact =
          typeof record.expectedImpact === "string"
            ? record.expectedImpact
            : typeof record.expected_impact === "string"
              ? record.expected_impact
              : typeof record.impact === "string"
                ? record.impact
                : "";

        return {
          category,
          action,
          expectedImpact,
        };
      })
      .filter((item): item is { category: string; action: string; expectedImpact: string } => item !== null);
  }, [latestAudit]);
  const recommendationCount = useMemo(() => normalizedRecommendations.length, [normalizedRecommendations]);

  async function saveLead() {
    setSaving(true);
    setError("");
    setSuccess("");

    const response = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "Unable to save lead.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess("Lead updated.");
    router.refresh();
  }

  async function analyzeWebsite() {
    setAnalyzing(true);
    setError("");
    setSuccess("");

    const response = await fetch(`/api/admin/leads/${lead.id}/analyze`, {
      method: "POST",
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "Website analysis failed.");
      setAnalyzing(false);
      return;
    }

    setAnalyzing(false);
    setSuccess("Analysis completed with Playwright crawl + Claude recommendations.");
    router.refresh();
  }

  async function generateLandingPage() {
    setGenerating(true);
    setError("");
    setSuccess("");

    const response = await fetch(`/api/admin/leads/${lead.id}/generate`, {
      method: "POST",
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "Landing page generation failed.");
      setGenerating(false);
      return;
    }

    setGenerating(false);
    setSuccess("Lead preview generated successfully.");
    router.refresh();
  }

  async function sendProposalEmail() {
    setSendingProposal(true);
    setError("");
    setSuccess("");

    const response = await fetch(`/api/admin/leads/${lead.id}/send-proposal`, {
      method: "POST",
    });

    const result = (await response.json()) as {
      error?: string;
      sentTo?: string;
    };

    if (!response.ok) {
      setError(result.error ?? "Unable to send proposal email.");
      setSendingProposal(false);
      return;
    }

    setSendingProposal(false);
    setSuccess(`Proposal email sent to ${result.sentTo ?? (state.contact_email || "lead contact")}.`);
    router.refresh();
  }

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border border-white/10 p-6 bg-black">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">Lead Workbench</p>
            <h1 className="text-4xl font-heading font-bold text-white">{lead.company_name || lead.name}</h1>
            <p className="text-sm text-gray-400 mt-2">{lead.website_url}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={analyzeWebsite}
              disabled={analyzing}
              className="px-4 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 disabled:opacity-60"
            >
              {analyzing ? "Analyzing..." : "Analyze Website"}
            </button>
            <button
              type="button"
              onClick={generateLandingPage}
              disabled={generating}
              className="px-4 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/5 disabled:opacity-60"
            >
              {generating ? "Generating..." : "Generate Landing Page"}
            </button>
            {latestPage ? (
              <Link
                href={`/lead-preview/${latestPage.slug}`}
                target="_blank"
                className="px-4 py-3 border border-emerald-300/40 text-emerald-200 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/10"
              >
                Open Preview
              </Link>
            ) : null}
            <button
              type="button"
              onClick={sendProposalEmail}
              disabled={sendingProposal || !latestPage || !state.contact_email}
              className="px-4 py-3 border border-cyan-300/40 text-cyan-200 text-xs font-bold uppercase tracking-wider hover:bg-cyan-500/10 disabled:opacity-50"
            >
              {sendingProposal ? "Sending..." : "Send Proposal Email"}
            </button>
          </div>
        </div>

        <div className="border border-white/10 p-6 bg-black">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Lead Details</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              ["Lead Name", "name"],
              ["Company", "company_name"],
              ["Website", "website_url"],
              ["Industry", "industry"],
              ["Contact Email", "contact_email"],
              ["Contact Phone", "contact_phone"],
              ["Company Size", "company_size"],
              ["Location", "location"],
            ].map(([label, key]) => (
              <label key={key}>
                <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">{label}</span>
                <input
                  value={String(state[key as keyof typeof state] ?? "")}
                  onChange={(event) => setState((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3"
                />
              </label>
            ))}

            <label>
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Status</span>
              <select
                value={state.status}
                onChange={(event) => setState((current) => ({ ...current, status: event.target.value as typeof state.status }))}
                className="w-full bg-black border border-white/20 text-white text-sm px-4 py-3"
                style={{ backgroundColor: "#000", color: "#fff" }}
              >
                <option value="new" style={{ backgroundColor: "#000", color: "#fff" }}>New</option>
                <option value="qualified" style={{ backgroundColor: "#000", color: "#fff" }}>Qualified</option>
                <option value="analysis_ready" style={{ backgroundColor: "#000", color: "#fff" }}>Analysis Ready</option>
                <option value="proposal_generated" style={{ backgroundColor: "#000", color: "#fff" }}>Proposal Generated</option>
                <option value="sent" style={{ backgroundColor: "#000", color: "#fff" }}>Sent</option>
                <option value="closed_won" style={{ backgroundColor: "#000", color: "#fff" }}>Closed Won</option>
                <option value="closed_lost" style={{ backgroundColor: "#000", color: "#fff" }}>Closed Lost</option>
              </select>
            </label>

            <label className="lg:col-span-2">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Notes</span>
              <textarea
                rows={4}
                value={state.notes}
                onChange={(event) => setState((current) => ({ ...current, notes: event.target.value }))}
                className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={saveLead}
              disabled={saving}
              className="px-4 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Lead"}
            </button>
            <Link href="/admin/leads" className="text-xs uppercase tracking-widest text-gray-400 hover:text-white">
              Back to Leads
            </Link>
          </div>
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {success ? <p className="text-sm text-green-300">{success}</p> : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <article className="border border-white/10 p-6 bg-black">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Latest Analysis</p>
            {!latestAudit ? (
              <p className="text-sm text-gray-400">No analysis yet. Run Analyze Website to generate a detailed Playwright + Claude audit.</p>
            ) : (
              <div className="space-y-4">
                <p className="text-4xl font-heading font-bold text-white">{latestAudit.score ?? "-"}/100</p>
                <p className="text-sm text-gray-300">{latestAudit.executive_summary}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-white/10 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">Issues Found</p>
                    <p className="text-2xl font-bold text-white">{issueCount}</p>
                  </div>
                  <div className="border border-white/10 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">Recommendations</p>
                    <p className="text-2xl font-bold text-white">{recommendationCount}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Link
                    href={`/admin/leads/${lead.id}/analysis`}
                    className="inline-flex px-4 py-3 border border-cyan-300/40 text-cyan-200 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500/10"
                    >
                    View Detailed Analysis
                    </Link>

                    {latestAudit.screenshot_url ? (
                    <Link href={latestAudit.screenshot_url} target="_blank" className="inline-flex px-4 py-3 border border-cyan-300/40 text-cyan-200 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500/10">
                        Open Captured Screenshot
                    </Link>
                    ) : null}
                </div>
              </div>
            )}
          </article>

          <article className="border border-white/10 p-6 bg-black">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Generated Preview</p>
            {!latestPage ? (
              <p className="text-sm text-gray-400">No generated page yet. After analysis, use Generate Landing Page to build a personalized concept with package recommendations.</p>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-bold text-white">{latestPage.page_title}</h3>
                <p className="text-sm text-gray-300">{latestPage.hero_subheadline}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Packages: {Array.isArray(latestPage.package_recommendations) ? latestPage.package_recommendations.length : 0}
                </p>
                <Link
                  href={`/lead-preview/${latestPage.slug}`}
                  target="_blank"
                  className="inline-flex px-4 py-3 border border-white/20 text-xs uppercase tracking-widest text-white hover:bg-white/5"
                >
                  Open Landing Preview
                </Link>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
