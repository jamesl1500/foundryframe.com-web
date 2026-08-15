/**
 * Audit Pending Notice - Foundry Frame
 * ======================================
 * Client-side poller for the shareable /audit/[id] page: silently checks
 * for completion while the audit is still pending/running and refreshes
 * the server component once it's done (or failed).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 4000;

export default function AuditPendingNotice({ auditId }: { auditId: string }) {
  const router = useRouter();
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    pollTimer.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/audit/${auditId}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "completed" || data.status === "failed") {
          router.refresh();
        }
      } catch {
        // Ignore transient network errors and keep polling.
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [auditId, router]);

  return (
    <div className="border border-white/20 p-8 sm:p-12 text-center">
      <div className="mx-auto mb-6 h-12 w-12 relative">
        <div className="absolute inset-0 border-2 border-accent/30 rounded-full" />
        <div className="absolute inset-0 border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
      <p className="text-white font-heading font-bold text-xl mb-2">
        Your audit is still running
      </p>
      <p className="text-gray-400 text-sm">
        This page will update automatically. You can also refresh it later — we&apos;ll email
        you a link to come back to these results.
      </p>
    </div>
  );
}
