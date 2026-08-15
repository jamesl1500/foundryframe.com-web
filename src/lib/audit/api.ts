/**
 * Python Audit API Client - Foundry Frame
 * ==========================================
 * Server-only client for the Site Audit Platform API (FastAPI, hosted on AWS).
 * Never import this from client components — it uses server-only env vars.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { AuditRead, AuditRequestPayload } from "@/lib/audit/types";

export type { AuditStatus, AuditRead, AuditRequestPayload } from "@/lib/audit/types";

class AuditApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuditApiError";
    this.status = status;
  }
}

function getBaseUrl(): string {
  const baseUrl = process.env.PYTHON_AUDIT_API_URL;
  if (!baseUrl) {
    throw new Error("Missing PYTHON_AUDIT_API_URL environment variable.");
  }
  return baseUrl.replace(/\/+$/, "");
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const apiKey = process.env.AUDIT_API_KEY;
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  return headers;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "detail" in data
        ? JSON.stringify((data as { detail: unknown }).detail)
        : null) ?? `Audit API request failed with status ${res.status}.`;
    throw new AuditApiError(message, res.status);
  }

  return data as T;
}

export async function createAudit(payload: AuditRequestPayload): Promise<AuditRead> {
  const res = await fetch(`${getBaseUrl()}/audits`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return parseResponse<AuditRead>(res);
}

export async function getAudit(auditId: string): Promise<AuditRead> {
  const res = await fetch(`${getBaseUrl()}/audits/${encodeURIComponent(auditId)}`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  return parseResponse<AuditRead>(res);
}

export { AuditApiError };
