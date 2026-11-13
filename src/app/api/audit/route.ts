/**
 * Audit API Route - Foundry Frame
 * =================================
 * Starts a free website audit. Saves the request to public.site_audits,
 * returns it straight away (status "pending") so the form can start
 * polling GET /api/audit/[id], then runs the audit after the response with
 * after() (src/lib/audit/run.ts) and best-effort notifies the team.
 *
 * Abuse protection: each audit fetches a visitor-chosen URL and spends
 * PageSpeed and Claude quota, so requests must come from this site and are
 * rate limited per IP and site-wide. If the limiter is unreachable the
 * request is refused rather than let through.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { after } from "next/server";
import { Resend } from "resend";
import { insertSiteAudit } from "@/lib/audit/repository";
import { runSiteAudit } from "@/lib/audit/run";
import { assertFetchableUrl, UnsafeUrlError } from "@/lib/audit/safe-fetch";
import { sendMetaLead } from "@/lib/server/meta-capi";
import { leadSourceEmailHtml, leadSourceFromRequest } from "@/lib/server/lead-source";
import { ipBucket, isSameSiteRequest, throttleHit } from "@/lib/server/request-guard";
import type { LeadSource } from "@/lib/lead-source";

/* The audit runs inside this invocation (via after()), so it needs the
   longer limit: PageSpeed alone can take a minute. */
export const maxDuration = 300;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PER_IP_LIMIT = 5; // audits per IP per hour
const SITE_WIDE_LIMIT = 60; // audits per hour from everyone combined

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeUrl(input: string): string {
  return /^https?:\/\//i.test(input) ? input : `https://${input}`;
}

async function notifyTeam(
  source: LeadSource | null,
  auditId: string,
  url: string,
  email: string,
  name?: string,
  company?: string
) {
  if (!resend) return;

  try {
    const resultsUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://www.foundryframe.com").replace(/\/+$/, "")}/audit/${auditId}`;
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
        <p><a href="${esc(resultsUrl)}">View the audit results</a> (ready a minute or two after the request)</p>
        ${leadSourceEmailHtml(source)}
      `,
    });
  } catch {
    // Best-effort notification only; never block the audit flow.
  }
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    const rawUrl = text(body.url, 500);
    const email = text(body.email, 200);
    const name = text(body.name, 120) || null;
    const company = text(body.company, 160) || null;
    const phone = text(body.phone, 40) || null;

    if (!rawUrl || !email) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    let url: string;
    try {
      url = assertFetchableUrl(normalizeUrl(rawUrl)).toString();
    } catch (error) {
      const message = error instanceof UnsafeUrlError ? error.message : "Please check the URL and try again.";
      return Response.json({ error: message }, { status: 400 });
    }

    const ipAllowed = await throttleHit(ipBucket("audit", request), PER_IP_LIMIT, 3600);
    const siteAllowed = ipAllowed === true ? await throttleHit("audit:all", SITE_WIDE_LIMIT, 3600) : ipAllowed;
    if (ipAllowed === null || siteAllowed === null) {
      return Response.json(
        { error: "We couldn't start your audit just now. Please try again in a few minutes." },
        { status: 503 }
      );
    }
    if (!ipAllowed || !siteAllowed) {
      return Response.json(
        { error: "You've requested a lot of audits. Please try again in an hour, or contact us and we'll run one for you." },
        { status: 429 }
      );
    }

    const source = leadSourceFromRequest(request);
    const audit = await insertSiteAudit({ url, email, name, company, phone, source });

    after(async () => {
      await Promise.all([
        runSiteAudit(audit.id),
        notifyTeam(source, audit.id, url, email, name ?? undefined, company ?? undefined),
      ]);
    });

    await sendMetaLead(request, body, {
      contentName: "audit",
      email,
      name: name ?? undefined,
    });

    return Response.json(audit, { status: 201 });
  } catch (error) {
    console.error("Audit request failed:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
