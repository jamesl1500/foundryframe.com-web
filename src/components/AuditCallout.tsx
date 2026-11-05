/**
 * AuditCallout - Foundry Frame
 * ==============================
 * Reusable frosted-glass banner that points visitors to the free website
 * audit. Dropped into high-intent pages (services, packages, FAQ, contact,
 * blog) so the audit is easy to find and gets internal-link equity.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";

interface AuditCalloutProps {
  heading?: string;
  body?: string;
  className?: string;
}

export default function AuditCallout({
  heading = "Not sure where to start? Get a free website audit.",
  body = "Enter your URL and see your SEO, speed, and design score in about a minute — free, with a prioritized fix list.",
  className = "",
}: AuditCalloutProps) {
  return (
    <section className={`py-14 ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="glass-accent flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-10 rounded-panel">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-ink mb-2">
              Free Tool
            </p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink mb-2">
              {heading}
            </h2>
            <p className="text-ink-soft text-sm leading-relaxed">{body}</p>
          </div>
          <Link
            href="/audit"
            className="btn btn-primary shrink-0 text-center"
          >
            Run My Free Audit
          </Link>
        </div>
      </div>
    </section>
  );
}
