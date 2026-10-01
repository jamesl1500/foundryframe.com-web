import { listFoundingApplications } from "@/lib/founding/repository";

async function loadApplications() {
  try {
    return { applications: await listFoundingApplications(), loadError: "" };
  } catch (error) {
    return {
      applications: [],
      loadError: error instanceof Error ? error.message : "Unable to load founding applications",
    };
  }
}

export default async function FoundingApplicationsPage() {
  const { applications, loadError } = await loadApplications();

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Founding Clients</p>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2">Applications</h1>
          <p className="text-sm text-gray-400 max-w-3xl">
            Every application sent from /founding. Each one is also emailed to jlatten@ and leads@ when it
            comes in.
          </p>
        </div>

        {loadError ? (
          <div className="border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-200">
            {loadError}. If the table doesn&apos;t exist yet, run
            <code className="mx-1">supabase/migrations/20261001000000_founding_applications.sql</code>
            against the Supabase project.
          </div>
        ) : applications.length === 0 ? (
          <div className="border border-white/10 p-8 text-sm text-gray-400">No applications yet.</div>
        ) : (
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/10">
                <tr>
                  <th className="p-4">Received</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Business</th>
                  <th className="p-4">Website</th>
                  <th className="p-4">Timeline</th>
                  <th className="p-4">Budget</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id} className="border-b border-white/10 last:border-b-0 text-gray-300">
                    <td className="p-4 whitespace-nowrap">
                      {new Date(application.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span className="block text-white">{application.name}</span>
                      <a href={`mailto:${application.email}`} className="text-xs text-gray-500 hover:text-white">
                        {application.email}
                      </a>
                    </td>
                    <td className="p-4">{application.business}</td>
                    <td className="p-4 break-all">{application.website_url || "None"}</td>
                    <td className="p-4">{application.timeline}</td>
                    <td className="p-4">{application.budget_range}</td>
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
