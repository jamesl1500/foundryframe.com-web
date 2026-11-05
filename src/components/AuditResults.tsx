/**
 * Audit Results - Foundry Frame
 * ===============================
 * Renders a completed audit: overall score, category breakdown, Lighthouse/
 * PageSpeed deep-dive, AI recommendations, and tailored service upsells.
 * Shared between the live scan flow and the shareable /audit/[id] page.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { AuditRead } from "@/lib/audit/types";
import {
  asRecord,
  extractList,
  formatMetricValue,
  getCategoryRecommendation,
  scoreTone,
  toLighthouseScore,
  toScore,
  toTitleCase,
} from "@/lib/audit/present";

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function AuditResults({ audit }: { audit: AuditRead }) {
  const overallScore = toScore(audit.overall_score) ?? 0;
  const tone = scoreTone(overallScore);

  const categoryEntries = Object.entries(asRecord(audit.category_scores))
    .map(([key, value]) => ({ key, score: toScore(value) }))
    .filter((entry): entry is { key: string; score: number } => entry.score !== null)
    .sort((a, b) => a.score - b.score);

  const findingsRecord = asRecord(audit.findings);
  const generalRecommendations = extractList(audit.ai_recommendations).slice(0, 8);

  const priorityCategories = categoryEntries.slice(0, 3);

  const lighthouseEntries = Object.entries(asRecord(audit.lighthouse_scores))
    .map(([key, value]) => ({ key, score: toLighthouseScore(value) }))
    .filter((entry): entry is { key: string; score: number } => entry.score !== null);

  const lighthouseMetrics = Object.entries(asRecord(audit.lighthouse_metrics));
  const lighthouseOpportunities = extractList(audit.lighthouse_opportunities).slice(0, 6);

  return (
    <div className="space-y-8">
      {/* --- Overall Score --- */}
      <div className="glass rounded-card p-8 flex flex-col sm:flex-row items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className={`text-6xl font-heading font-bold ${tone.text}`}
        >
          {overallScore}
          <span className="text-2xl text-muted">/100</span>
        </motion.div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Overall Site Score</p>
          <p className="text-ink-soft text-sm leading-relaxed">
            {audit.ai_summary || "Here's what we found when we scanned your website."}
          </p>
        </div>
      </div>

      {/* --- Category Breakdown --- */}
      {categoryEntries.length > 0 && (
        <div className="glass rounded-card p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-muted mb-5">Category Breakdown</p>
          <div className="space-y-4">
            {categoryEntries.map(({ key, score }) => {
              const categoryTone = scoreTone(score);
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink">{toTitleCase(key)}</span>
                    <span className={categoryTone.text}>{score}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/60 overflow-hidden">
                    <motion.div
                      className={`h-full ${categoryTone.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, ease: easeOut }}
                    />
                  </div>
                  {extractList(findingsRecord[key]).slice(0, 3).map((finding, idx) => (
                    <p key={idx} className="text-muted text-xs mt-2 pl-1">• {finding}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Lighthouse / PageSpeed Deep-Dive --- */}
      {audit.lighthouse_error ? (
        <p className="text-muted text-xs">
          Performance deep-dive unavailable: {audit.lighthouse_error}
        </p>
      ) : (
        (lighthouseEntries.length > 0 || lighthouseMetrics.length > 0 || lighthouseOpportunities.length > 0) && (
          <div className="glass rounded-card p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-muted mb-5">Performance Deep-Dive (PageSpeed)</p>

            {lighthouseEntries.length > 0 && (
              <div className="space-y-4 mb-6">
                {lighthouseEntries.map(({ key, score }) => {
                  const categoryTone = scoreTone(score);
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-ink">{toTitleCase(key)}</span>
                        <span className={categoryTone.text}>{score}/100</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/60 overflow-hidden">
                        <motion.div
                          className={`h-full ${categoryTone.bar}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, ease: easeOut }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {lighthouseMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {lighthouseMetrics.map(([key, value]) => (
                  <div key={key} className="rounded-bubble bg-white/60 border border-white p-3">
                    <p className="text-muted text-xs uppercase tracking-widest mb-1">{toTitleCase(key)}</p>
                    <p className="text-ink text-sm font-bold">{formatMetricValue(value)}</p>
                  </div>
                ))}
              </div>
            )}

            {lighthouseOpportunities.length > 0 && (
              <div>
                <p className="text-muted text-xs uppercase tracking-widest mb-2">Opportunities To Improve Speed</p>
                <ul className="space-y-2 text-sm text-ink-soft">
                  {lighthouseOpportunities.map((opportunity, idx) => (
                    <li key={idx}>• {opportunity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}

      {/* --- AI Recommendations --- */}
      {generalRecommendations.length > 0 && (
        <div className="glass rounded-card p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-muted mb-4">What We&apos;d Fix First</p>
          <ul className="space-y-2 text-sm text-ink-soft">
            {generalRecommendations.map((rec, idx) => (
              <li key={idx}>• {rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Recommended Services/Packages --- */}
      {priorityCategories.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-4">How Foundry Frame Can Help</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {priorityCategories.map(({ key }, idx) => {
              const rec = getCategoryRecommendation(key);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1, ease: easeOut }}
                  className="glass rounded-card p-6"
                >
                  <p className="text-xs uppercase tracking-widest text-accent-ink mb-2">{toTitleCase(key)}</p>
                  <h3 className="text-ink font-heading font-bold text-lg mb-2">{rec.label}</h3>
                  <p className="text-body text-sm mb-4">{rec.blurb}</p>
                  <Link href={rec.href} className="text-accent-ink text-xs uppercase tracking-widest hover:text-accent-ink transition-colors">
                    Learn More →
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="glass rounded-card p-8 text-center">
        <p className="text-ink font-heading font-bold text-2xl mb-2">
          Ready to fix what&apos;s holding your site back?
        </p>
        <p className="text-body text-sm mb-6">
          Talk to our team about the fastest path to a better-performing website.
        </p>
        <Link
          href="/contact"
          className="btn btn-primary"
        >
          Book A Strategy Call
        </Link>
      </div>
    </div>
  );
}
