/**
 * Audit Form - Foundry Frame
 * ============================
 * Multi-step, animated audit flow:
 *   1. Enter a website URL
 *   2. Provide contact info to unlock the scan
 *   3. Animated "scanning" state while the Python audit API runs
 *   4. Redirect to the shareable /audit/[id] results page once complete
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { AuditRead } from "@/lib/audit/types";

type Step = "url" | "contact" | "scanning" | "error";

const SCAN_STAGES = [
  "Crawling your website…",
  "Analyzing SEO fundamentals…",
  "Checking performance & load speed…",
  "Reviewing design & user experience…",
  "Scanning for accessibility issues…",
  "Generating your recommendations…",
];

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 120_000;

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function AuditForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("url");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [stageIndex, setStageIndex] = useState(0);

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadline = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
      if (stageTimer.current) clearInterval(stageTimer.current);
    };
  }, []);

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setStep("contact");
  }

  function stopTimers() {
    if (pollTimer.current) clearInterval(pollTimer.current);
    if (stageTimer.current) clearInterval(stageTimer.current);
  }

  async function pollAudit(auditId: string) {
    try {
      const res = await fetch(`/api/audit/${auditId}`, { cache: "no-store" });
      const data: AuditRead = await res.json();

      if (!res.ok) {
        throw new Error("Audit not found.");
      }

      if (data.status === "completed") {
        stopTimers();
        router.push(`/audit/${auditId}`);
        return;
      }

      if (data.status === "failed") {
        stopTimers();
        setError(data.error_message ?? "The audit failed. Please try again.");
        setStep("error");
        return;
      }

      if (Date.now() > pollDeadline.current) {
        stopTimers();
        setError(
          "Your audit is taking longer than expected. We'll email your results as soon as they're ready."
        );
        setStep("error");
      }
    } catch {
      if (Date.now() > pollDeadline.current) {
        stopTimers();
        setError("We lost connection while scanning your site. Please try again.");
        setStep("error");
      }
    }
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStep("scanning");
    setStageIndex(0);

    stageTimer.current = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, SCAN_STAGES.length - 1));
    }, 4000);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email, name: name || undefined, company: company || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "We couldn't start your audit.");
      }

      pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
      pollTimer.current = setInterval(() => pollAudit(data.id), POLL_INTERVAL_MS);
      void pollAudit(data.id);
    } catch (err) {
      stopTimers();
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStep("error");
    }
  }

  function reset() {
    stopTimers();
    setError("");
    setStep("url");
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step === "url" && (
          <motion.form
            key="url"
            onSubmit={handleUrlSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="yourwebsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-accent text-black text-sm font-bold uppercase tracking-wider hover:bg-accent-glow transition-colors whitespace-nowrap"
              >
                Start My Free Audit
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              Takes about a minute. No credit card, no obligation.
            </p>
          </motion.form>
        )}

        {step === "contact" && (
          <motion.form
            key="contact"
            onSubmit={handleContactSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="border border-white/20 p-6 sm:p-8"
          >
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Auditing</p>
            <p className="text-white font-heading font-bold text-xl mb-6 break-all">{url}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="email"
                required
                autoFocus
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
              />
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Company (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors mb-4"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 px-8 py-3 bg-accent text-black text-sm font-bold uppercase tracking-wider hover:bg-accent-glow transition-colors whitespace-nowrap"
              >
                Send Me My Free Audit
              </button>
              <button
                type="button"
                onClick={() => setStep("url")}
                className="text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors"
              >
                Back
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              We&apos;ll email your full report and never spam you.
            </p>
          </motion.form>
        )}

        {step === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="border border-white/20 p-8 sm:p-12 text-center"
          >
            <div className="mx-auto mb-6 h-16 w-16 relative">
              <div className="absolute inset-0 border-2 border-accent/30 rounded-full" />
              <motion.div
                className="absolute inset-0 border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <p className="text-white font-heading font-bold text-xl mb-2">
              Scanning {url}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={stageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400 text-sm"
              >
                {SCAN_STAGES[stageIndex]}
              </motion.p>
            </AnimatePresence>
            <div className="mt-6 h-1 w-full max-w-sm mx-auto bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "5%" }}
                animate={{ width: "92%" }}
                transition={{ duration: POLL_TIMEOUT_MS / 1000, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="border border-red-400/30 p-8 text-center"
          >
            <p className="text-white font-heading font-bold text-xl mb-2">
              We hit a snag
            </p>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button
              onClick={reset}
              className="px-8 py-3 bg-accent text-black text-sm font-bold uppercase tracking-wider hover:bg-accent-glow transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
