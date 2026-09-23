import Link from "next/link";
import LeadFinderClient from "@/components/admin/LeadFinderClient";
import { listProspects, listProspectSearches } from "@/lib/lead-finder/repository";
import { availableSources } from "@/lib/lead-finder/service";

async function loadFinderData() {
  try {
    const [prospects, searches] = await Promise.all([listProspects(), listProspectSearches()]);
    return { prospects, searches, loadError: "" };
  } catch (error) {
    return {
      prospects: [],
      searches: [],
      loadError: error instanceof Error ? error.message : "Unable to load Lead Finder data",
    };
  }
}

export default async function LeadFinderPage() {
  const { prospects, searches, loadError } = await loadFinderData();

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-8">
          <Link href="/admin/leads" className="text-xs uppercase tracking-widest text-gray-400 hover:text-white">
            ← Back to Leads
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-4 mb-3">AI Prospecting</p>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2">Lead Finder</h1>
          <p className="text-sm text-gray-400 max-w-3xl">
            Search the web for small businesses and brands that need a new website. Each prospect is scored on
            how outdated or missing its site is and on any public buying signals. Promote the good ones into the
            Leads workbench to analyze and pitch them.
          </p>
        </div>

        {loadError ? (
          <div className="border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-200">
            {loadError}. If the Lead Finder tables don&apos;t exist yet, run
            <code className="mx-1">supabase/migrations/20260923000000_lead_finder.sql</code>
            against the Supabase project.
          </div>
        ) : (
          <LeadFinderClient prospects={prospects} searches={searches} sources={availableSources()} />
        )}
      </div>
    </section>
  );
}
