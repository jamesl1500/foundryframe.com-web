import QuotesClient from "@/components/admin/QuotesClient";
import { listQuotes } from "@/lib/package-builder/repository";

async function loadQuotes() {
  try {
    return { quotes: await listQuotes(), loadError: "" };
  } catch (error) {
    return {
      quotes: [],
      loadError: error instanceof Error ? error.message : "Unable to load package quotes",
    };
  }
}

export default async function PackageQuotesPage() {
  const { quotes, loadError } = await loadQuotes();

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Package Builder</p>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2">Package Quotes</h1>
          <p className="text-sm text-gray-400 max-w-3xl">
            Every package a visitor builds on /packages/builder, with the prices they saw and the meeting time
            they asked for. Each one is also emailed to jlatten@ and leads@ when it comes in.
          </p>
        </div>

        {loadError ? (
          <div className="border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-200">
            {loadError}. If the quotes table doesn&apos;t exist yet, run
            <code className="mx-1">supabase/migrations/20260929000000_package_quotes.sql</code>
            against the Supabase project.
          </div>
        ) : (
          <QuotesClient quotes={quotes} />
        )}
      </div>
    </section>
  );
}
