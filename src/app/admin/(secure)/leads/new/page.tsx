import Link from "next/link";
import LeadCreateForm from "@/components/admin/LeadCreateForm";

export default function NewLeadPage() {
  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <div className="mb-7">
          <Link href="/admin/leads" className="text-xs uppercase tracking-widest text-gray-400 hover:text-white">
            ← Back to Leads
          </Link>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mt-4 mb-2">Create New Lead</h1>
          <p className="text-gray-400 text-sm">
            Add a lead profile to kick off website analysis and AI-generated redesign concepts.
          </p>
        </div>

        <LeadCreateForm />
      </div>
    </section>
  );
}
