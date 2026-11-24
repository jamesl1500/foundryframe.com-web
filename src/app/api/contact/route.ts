/**
 * Contact API Route - Foundry Frame
 * ===================================
 * Emails a contact form submission to the team. Like the other public form
 * routes, it only accepts same-site requests and is rate limited per IP and
 * site-wide (failing closed if the limiter is unreachable), so it can't be
 * used to spam the inbox.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { Resend } from "resend";
import { sendMetaLead } from "@/lib/server/meta-capi";
import { leadSourceEmailHtml, leadSourceFromRequest } from "@/lib/server/lead-source";
import { ipBucket, isSameSiteRequest, throttleHit } from "@/lib/server/request-guard";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PER_IP_LIMIT = 5; // messages per IP per hour
const SITE_WIDE_LIMIT = 60; // messages per hour from everyone combined
const SEND_FAILED = "We couldn't send your message just now. Please email jlatten@foundryframe.com.";

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

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    const firstName = text(body.firstName, 80);
    const lastName = text(body.lastName, 80);
    const email = text(body.email, 200);
    const message = text(body.message, 5000);

    if (!firstName || !lastName || !email || !message) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (!resend) {
      console.error("Contact form: RESEND_API_KEY is not set.");
      return Response.json({ error: SEND_FAILED }, { status: 503 });
    }

    const ipAllowed = await throttleHit(ipBucket("contact", request), PER_IP_LIMIT, 3600);
    const siteAllowed = ipAllowed === true ? await throttleHit("contact:all", SITE_WIDE_LIMIT, 3600) : ipAllowed;
    if (ipAllowed === null || siteAllowed === null) {
      return Response.json({ error: SEND_FAILED }, { status: 503 });
    }
    if (!ipAllowed || !siteAllowed) {
      return Response.json(
        { error: "You've sent several messages already. Please try again later or call (216) 889-7822." },
        { status: 429 }
      );
    }

    const row = (label: string, value: string) =>
      `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap;">${esc(value)}</td></tr>`;

    const { error } = await resend.emails.send({
      from: "Foundry Frame <noreply@foundryframe.com>",
      to: "jlatten@foundryframe.com",
      replyTo: email,
      subject: `New Inquiry: ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          ${row("Name", `${firstName} ${lastName}`)}
          ${row("Email", email)}
          ${row("Message", message)}
        </table>
        ${leadSourceEmailHtml(leadSourceFromRequest(request))}
      `,
    });

    if (error) {
      console.error("Contact email failed:", error.message);
      return Response.json({ error: SEND_FAILED }, { status: 500 });
    }

    await sendMetaLead(request, body, { contentName: "contact", email, name: firstName });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
