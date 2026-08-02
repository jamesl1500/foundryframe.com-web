"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  LeadAuditRecord,
  LeadGeneratedPageRecord,
  LeadProposalRecord,
  LeadRecord,
  ProposalLineItem,
  PublishedPackageReference,
  PublishedServiceReference,
} from "@/lib/leads/types";

interface Props {
  lead: LeadRecord;
  latestAudit: LeadAuditRecord | null;
  latestPage: LeadGeneratedPageRecord | null;
  latestProposal: LeadProposalRecord | null;
  packages: PublishedPackageReference[];
  services: PublishedServiceReference[];
}

type ProposalDraftItem = ProposalLineItem;

const packageCategoryPurpose: Record<string, string> = {
  "website-packages": "Standalone website builds, from a focused starter site to a bespoke digital platform.",
  "launch-bundles": "Website, brand identity, and launch support combined into one coordinated engagement.",
  "maintenance-plans": "Ongoing website security, updates, performance, and development support.",
  "marketing-packages": "Recurring visibility, traffic, and lead-generation campaigns after launch.",
};

function formatCatalogPrice(price: number | null, billingPeriod?: string | null) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price ?? 0);

  return billingPeriod === "monthly" ? `${amount}/mo` : amount;
}

export default function LeadWorkbenchClient({
  lead,
  latestAudit,
  latestPage,
  latestProposal,
  packages,
  services,
}: Props) {
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
  const [creatingProposal, setCreatingProposal] = useState(false);
  const [proposal, setProposal] = useState(latestProposal);
  const [proposalItems, setProposalItems] = useState<ProposalDraftItem[]>([]);
  const [proposalBrief, setProposalBrief] = useState(lead.notes ?? "");
  const [proposalInstructions, setProposalInstructions] = useState("");
  const [timelineWeeks, setTimelineWeeks] = useState(8);
  const [depositPercent, setDepositPercent] = useState(50);
  const [discount, setDiscount] = useState(0);
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
  const proposalSubtotal = useMemo(
    () => proposalItems.reduce((sum, item) => sum + item.price, 0),
    [proposalItems]
  );
  const packageGroups = useMemo(() => {
    const groups = new Map<string, {
      name: string;
      slug: string;
      purpose: string;
      items: PublishedPackageReference[];
    }>();

    packages.forEach((item) => {
      const slug = item.category?.slug || "other";
      const current = groups.get(slug) ?? {
        name: item.category?.name || "Other Packages",
        slug,
        purpose: packageCategoryPurpose[slug] || "Custom packaged offers for a defined business outcome.",
        items: [],
      };
      current.items.push(item);
      groups.set(slug, current);
    });

    return Array.from(groups.values());
  }, [packages]);

  function toggleCatalogItem(item: ProposalDraftItem) {
    setProposalItems((current) => {
      const exists = current.some((entry) => entry.kind === item.kind && entry.catalogId === item.catalogId);
      return exists
        ? current.filter((entry) => !(entry.kind === item.kind && entry.catalogId === item.catalogId))
        : [...current, item];
    });
  }

  function updateProposalItem(index: number, patch: Partial<ProposalDraftItem>) {
    setProposalItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, ...patch } : item
    )));
  }

  function addCustomItem() {
    setProposalItems((current) => [
      ...current,
      {
        catalogId: `custom-${crypto.randomUUID()}`,
        kind: "custom",
        name: "",
        description: "",
        price: 0,
        deliverables: [],
      },
    ]);
  }

  async function createProposal() {
    setCreatingProposal(true);
    setError("");
    setSuccess("");

    const response = await fetch(`/api/admin/leads/${lead.id}/proposal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: proposalItems,
        projectBrief: proposalBrief,
        instructions: proposalInstructions,
        timelineWeeks,
        depositPercent,
        discount,
      }),
    });
    const result = (await response.json()) as { data?: LeadProposalRecord; error?: string };

    if (!response.ok || !result.data) {
      setError(result.error ?? "Proposal generation failed.");
      setCreatingProposal(false);
      return;
    }

    setProposal(result.data);
    setCreatingProposal(false);
    setSuccess("Proposal and service agreement drafts generated.");
    router.refresh();
  }

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

        <div className="border border-white/10 bg-black">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Proposal Studio</p>
              <h2 className="text-2xl font-heading font-bold text-white">Scope, price, generate.</h2>
            </div>
            <div className="md:text-right">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Proposal Total</p>
              <p className="text-2xl font-heading font-bold text-white">
                {formatCatalogPrice(Math.max(0, proposalSubtotal - discount))}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 xl:border-r border-white/10 space-y-8">
              <section>
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-xs font-bold text-white">01</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Choose the offer</h3>
                    <p className="text-xs text-gray-500 mt-1">Packages are grouped by what they accomplish.</p>
                  </div>
                </div>
                <div className="space-y-5">
                  {packageGroups.map((group) => (
                    <div key={group.slug}>
                      <div className="mb-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-white">{group.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{group.purpose}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.items.map((item) => {
                          const selected = proposalItems.some((entry) => entry.kind === "package" && entry.catalogId === item.id);
                          return (
                            <label key={item.id} className={`flex gap-3 border p-3 cursor-pointer ${selected ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"}`}>
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleCatalogItem({
                                  catalogId: item.id,
                                  kind: "package",
                                  name: item.name,
                                  description: item.description || item.tagline || "",
                                  price: item.price ?? 0,
                                  deliverables: item.features ?? [],
                                })}
                                className="mt-1 accent-white"
                              />
                              <span className="min-w-0">
                                <span className="flex items-baseline justify-between gap-2">
                                  <span className="text-sm font-bold text-white">{item.name}</span>
                                  <span className="text-xs text-gray-300 shrink-0">{formatCatalogPrice(item.price, item.billing_period)}</span>
                                </span>
                                <span className="block text-xs text-gray-500 mt-1 line-clamp-2">{item.description || item.tagline}</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <details className="mt-5 border border-white/10">
                  <summary className="cursor-pointer px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white">
                    Add individual services ({services.length})
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border-t border-white/10">
                    {services.map((item) => {
                      const selected = proposalItems.some((entry) => entry.kind === "service" && entry.catalogId === item.id);
                      return (
                        <label key={item.id} className={`flex gap-3 border p-3 cursor-pointer ${selected ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"}`}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleCatalogItem({
                              catalogId: item.id,
                              kind: "service",
                              name: item.name,
                              description: item.description || item.short_description || "",
                              price: item.starting_price ?? 0,
                              deliverables: item.deliverables ?? [],
                            })}
                            className="mt-1 accent-white"
                          />
                          <span className="min-w-0">
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="text-sm font-bold text-white">{item.name}</span>
                              <span className="text-xs text-gray-300 shrink-0">{formatCatalogPrice(item.starting_price)}</span>
                            </span>
                            <span className="block text-xs text-gray-500 mt-1 line-clamp-2">{item.short_description || item.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </details>
              </section>

              <section>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-bold text-white">02</span>
                    <h3 className="text-sm font-bold text-white">Review scope and pricing</h3>
                  </div>
                  <button type="button" onClick={addCustomItem} className="text-xs uppercase tracking-widest text-gray-300 hover:text-white">
                    + Custom item
                  </button>
                </div>
                {proposalItems.length === 0 ? (
                  <p className="text-sm text-gray-500 border border-dashed border-white/20 p-4">No scope selected.</p>
                ) : (
                  <div className="divide-y divide-white/10 border-y border-white/10">
                    {proposalItems.map((item, index) => (
                      <div key={`${item.kind}-${item.catalogId}`} className="grid grid-cols-1 sm:grid-cols-[1fr_130px_auto] gap-2 py-3">
                        <div className="space-y-2">
                          <input
                            value={item.name}
                            disabled={item.kind !== "custom"}
                            onChange={(event) => updateProposalItem(index, { name: event.target.value })}
                            aria-label={`Name for item ${index + 1}`}
                            className="w-full bg-transparent border-0 text-white text-sm px-0 py-2 disabled:text-gray-300"
                          />
                          {item.kind === "custom" ? (
                            <input
                              value={item.description}
                              onChange={(event) => updateProposalItem(index, { description: event.target.value })}
                              placeholder="What is included?"
                              aria-label={`Description for item ${index + 1}`}
                              className="w-full bg-white/5 border border-white/20 text-white text-xs px-3 py-2"
                            />
                          ) : null}
                        </div>
                        <label>
                          <span className="sr-only">Price for {item.name || `item ${index + 1}`}</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(event) => updateProposalItem(index, { price: Number(event.target.value) })}
                            className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setProposalItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                          aria-label={`Remove ${item.name || `item ${index + 1}`}`}
                          className="px-3 py-2 text-xs text-gray-500 hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <section className="p-6 space-y-5">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold text-white">03</span>
                <div>
                  <h3 className="text-sm font-bold text-white">Brief and terms</h3>
                  <p className="text-xs text-gray-500 mt-1">Claude writes the narrative; your inputs control the deal.</p>
                </div>
              </div>
              <label className="block">
                <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Project brief</span>
                <textarea
                  rows={7}
                  value={proposalBrief}
                  onChange={(event) => setProposalBrief(event.target.value)}
                  placeholder="Client goals, audience, constraints, and desired outcome."
                  className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3"
                />
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Weeks</span>
                  <input type="number" min="1" max="104" value={timelineWeeks} onChange={(event) => setTimelineWeeks(Number(event.target.value))} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-3" />
                </label>
                <label>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Deposit %</span>
                  <input type="number" min="0" max="100" value={depositPercent} onChange={(event) => setDepositPercent(Number(event.target.value))} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-3" />
                </label>
                <label>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Discount</span>
                  <input type="number" min="0" max={proposalSubtotal} value={discount} onChange={(event) => setDiscount(Number(event.target.value))} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-3" />
                </label>
              </div>
              <details className="border border-white/10">
                <summary className="cursor-pointer px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white">
                  Claude direction (optional)
                </summary>
                <div className="p-3 border-t border-white/10">
                  <textarea
                    rows={3}
                    value={proposalInstructions}
                    onChange={(event) => setProposalInstructions(event.target.value)}
                    placeholder="Tone, priorities, or strategic context."
                    className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3"
                  />
                </div>
              </details>
              <button
                type="button"
                onClick={createProposal}
                disabled={creatingProposal || proposalItems.length === 0 || proposalBrief.trim().length < 20}
                className="w-full px-5 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 disabled:opacity-50"
              >
                {creatingProposal ? "Drafting with Claude..." : "Generate Documents"}
              </button>

              {proposal ? (
                <div className="border border-emerald-300/30 p-4 space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-300">Latest Draft</p>
                    <h3 className="text-lg font-heading font-bold text-white mt-2">{proposal.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatCatalogPrice(proposal.total)} · Valid through {proposal.valid_until}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["proposal", "agreement"] as const).map((document) => (
                      <a
                        key={document}
                        href={`/api/admin/leads/${lead.id}/proposal/${proposal.id}/${document}/docx`}
                        className="px-3 py-3 border border-white/20 text-center text-[10px] uppercase tracking-widest text-white hover:bg-white/5"
                      >
                        Download {document === "proposal" ? "Proposal" : "Agreement"}
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-amber-200">Review business and legal terms before sending.</p>
                </div>
              ) : null}
            </section>
          </div>
        </div>

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
