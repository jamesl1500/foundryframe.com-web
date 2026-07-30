import Link from "next/link";
import { listLeads } from "@/lib/leads/repository";

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">AI Prospecting</p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2">Lead Website Generator</h1>
            <p className="text-sm text-gray-400 max-w-3xl">
              Add leads, analyze their existing websites with Playwright + Claude, and generate tailored landing page concepts with package recommendations.
            </p>
          </div>
          <Link
            href="/admin/leads/new"
            className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200"
          >
            Add New Lead
          </Link>
        </div>

        {leads.length === 0 ? (
          <div className="border border-white/10 p-8 text-sm text-gray-400 bg-black">No leads yet. Create your first lead to start analysis.</div>
        ) : (
          <div className="overflow-x-auto border border-white/10">
            <table className="min-w-full text-sm bg-black">
              <thead className="bg-white/5">
                <tr>
                  {[
                    "Lead",
                    "Company",
                    "Website",
                    "Industry",
                    "Status",
                    "Analyzed",
                    "Generated",
                    "Actions",
                  ].map((label) => (
                    <th key={label} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-gray-400">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-white/10 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white">{lead.name}</td>
                    <td className="px-4 py-3 text-gray-300">{lead.company_name || "-"}</td>
                    <td className="px-4 py-3 text-gray-300 truncate max-w-[280px]">{lead.website_url}</td>
                    <td className="px-4 py-3 text-gray-300">{lead.industry || "-"}</td>
                    <td className="px-4 py-3 text-gray-300">{lead.status.replaceAll("_", " ")}</td>
                    <td className="px-4 py-3 text-gray-300">{lead.last_analyzed_at ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-gray-300">{lead.generated_page_slug ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="px-3 py-2 border border-white/20 text-[10px] uppercase tracking-widest text-white hover:bg-white/5"
                      >
                        Open Workbench
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
