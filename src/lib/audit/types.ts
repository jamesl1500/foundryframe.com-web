/**
 * Audit Types - Foundry Frame
 * =============================
 * Shared, client-safe types for the Site Audit Platform API. Contains no
 * server-only code so it can be imported from both client and server code.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export type AuditStatus = "pending" | "running" | "completed" | "failed";

export type AuditRequestPayload = {
  url: string;
  email: string;
  name?: string | null;
  company?: string | null;
  phone?: string | null;
};

export type AuditRead = {
  id: string;
  lead_id: string;
  url: string;
  status: AuditStatus;
  overall_score: number | null;
  category_scores: Record<string, unknown> | null;
  findings: Record<string, unknown> | null;
  ai_summary: string | null;
  ai_recommendations: Record<string, unknown> | null;
  lighthouse_scores: Record<string, unknown> | null;
  lighthouse_metrics: Record<string, unknown> | null;
  lighthouse_opportunities: unknown[] | null;
  lighthouse_error: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};
