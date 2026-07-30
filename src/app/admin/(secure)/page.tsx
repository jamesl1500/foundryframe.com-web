import Link from "next/link";
import { CMS_ENTITIES } from "@/lib/cms/types";
import { CMS_CONFIG } from "@/lib/cms/config";

export default function AdminDashboardPage() {
  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Content Operations</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">CMS Dashboard</h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl mb-8 lg:mb-10">
          This admin area is connected to Supabase and designed for full lifecycle content management. You can create, edit, publish, feature, and remove records across all core website entities.
        </p>

        <article className="border border-emerald-300/30 bg-black p-8 lg:p-10 mb-8 lg:mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 mb-4">AI Sales Workflow</p>
          <h2 className="text-3xl font-heading font-bold text-white mb-3">Lead Website Generator</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-3xl">
            Create leads, run Playwright + Claude website audits to identify SEO and conversion issues, then auto-generate tailored landing page concepts with package recommendations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/leads"
              className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
            >
              Open Leads Workbench
            </Link>
            <Link
              href="/admin/leads/new"
              className="px-4 py-2 border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/5"
            >
              Create Lead
            </Link>
          </div>
        </article>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {CMS_ENTITIES.map((entity) => {
            const config = CMS_CONFIG[entity];

            return (
              <article key={entity} className="bg-black p-8 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Collection</p>
                <h2 className="text-3xl font-heading font-bold text-white mb-3">{config.label}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-7">{config.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/${entity}`}
                    className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
                  >
                    Manage {config.label}
                  </Link>
                  <Link
                    href={`/admin/${entity}/new`}
                    className="px-4 py-2 border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/5"
                  >
                    Create {config.singularLabel}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
