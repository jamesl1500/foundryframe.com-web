/**
 * Audit API Route - Foundry Frame
 * =================================
 * Proxies audit submissions to the Python Site Audit Platform API (AWS)
 * and best-effort notifies the team via email.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { Resend } from "resend";
import { createAudit, AuditApiError } from "@/lib/audit/api";
import { sendMetaLead } from "@/lib/server/meta-capi";
import { leadSourceEmailHtml, leadSourceFromRequest } from "@/lib/server/lead-source";
import type { LeadSource } from "@/lib/lead-source";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/i;

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  return URL_REGEX.test(trimmed) ? trimmed : `https://${trimmed}`;
}

async function notifyTeam(source: LeadSource | null, url: string, email: string, name?: string, company?: string) {
  if (!resend) return;

  try {
    await resend.emails.send({
      from: "Foundry Frame <noreply@foundryframe.com>",
      to: "jlatten@foundryframe.com",
      replyTo: email,
      subject: "New Free Website Audit Request",
      html: `
        <h2>New Website Audit Request</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Website</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(url)}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(email)}</td></tr>
          ${name ? `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(name)}</td></tr>` : ""}
          ${company ? `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(company)}</td></tr>` : ""}
        </table>
        ${leadSourceEmailHtml(source)}
      `,
    });
  } catch {
    // Best-effort notification only; never block the audit flow.
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, email, name, company, phone } = body ?? {};

    if (!url || !email) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const normalizedUrl = normalizeUrl(String(url));

    const audit = await createAudit({
      url: normalizedUrl,
      email: String(email),
      name: name ? String(name) : null,
      company: company ? String(company) : null,
      phone: phone ? String(phone) : null,
    });

    void notifyTeam(leadSourceFromRequest(request), normalizedUrl, String(email), name ? String(name) : undefined, company ? String(company) : undefined);

    await sendMetaLead(request, body, {
      contentName: "audit",
      email: String(email),
      name: name ? String(name) : undefined,
    });

    return Response.json(audit, { status: 201 });
  } catch (error) {
    if (error instanceof AuditApiError) {
      return Response.json(
        { error: "We couldn't start your audit. Please check the URL and try again." },
        { status: error.status === 422 ? 400 : 502 }
      );
    }

    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
