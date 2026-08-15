/**
 * Audit Results Page - Foundry Frame
 * =====================================
 * Shareable, permalinked view of a single audit run so we can email leads
 * a link back to their results at any time.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAudit, AuditApiError } from "@/lib/audit/api";
import AuditResults from "@/components/AuditResults";
import AuditPendingNotice from "@/components/AuditPendingNotice";

export const metadata: Metadata = {
  title: "Your Website Audit Results | Foundry Frame",
  description: "Review your free Foundry Frame website audit results.",
  robots: { index: false, follow: false },
};

export default async function AuditDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let audit;
  try {
    audit = await getAudit(id);
  } catch (error) {
    if (error instanceof AuditApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
          Your Free Website Audit
        </p>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-[0.95] mb-2 break-all">
          {audit.url}
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          Scanned {new Date(audit.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {audit.status === "completed" && <AuditResults audit={audit} />}

        {audit.status === "failed" && (
          <div className="border border-red-400/30 p-8 text-center">
            <p className="text-white font-heading font-bold text-xl mb-2">
              This audit didn&apos;t complete
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {audit.error_message || "Something went wrong while scanning this site."}
            </p>
            <Link
              href="/audit"
              className="inline-block px-8 py-3 bg-accent text-black text-sm font-bold uppercase tracking-wider hover:bg-accent-glow transition-colors"
            >
              Start A New Audit
            </Link>
          </div>
        )}

        {(audit.status === "pending" || audit.status === "running") && (
          <AuditPendingNotice auditId={audit.id} />
        )}
      </div>
    </section>
  );
}
