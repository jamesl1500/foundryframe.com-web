/**
 * Founding Client Application API Route - Foundry Frame
 * =======================================================
 * Receives the short /founding application, saves it for the admin
 * Founding Clients page, and emails it to the team.
 *
 * Abuse protection: the honeypot only stops naive bots, so every request is
 * also checked against durable rate limits (per IP and site-wide) before
 * anything is saved or emailed. If the limiter is unreachable the request is
 * refused rather than let through.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { Resend } from "resend";
import { FOUNDING_BUDGETS, FOUNDING_TIMELINES } from "@/lib/founding/options";
import {
  insertFoundingApplication,
  markFoundingApplicationEmailed,
} from "@/lib/founding/repository";
import { sendMetaLead } from "@/lib/server/meta-capi";
import { ipBucket, isSameSiteRequest, throttleHit } from "@/lib/server/request-guard";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const RECIPIENTS = ["jlatten@foundryframe.com", "leads@foundryframe.com"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PER_IP_LIMIT = 3; // applications per IP per hour
const SITE_WIDE_LIMIT = 30; // applications per hour from everyone combined
const TOO_MANY = "Too many applications right now. Please try again later or email jlatten@foundryframe.com.";

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

function oneOf<T extends string>(value: string, options: readonly T[]): T | null {
  return (options as readonly string[]).includes(value) ? (value as T) : null;
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

    // Honeypot: real visitors never see or fill this field.
    if (text(body.fax, 200)) {
      return Response.json({ success: true });
    }

    const name = text(body.name, 120);
    const email = text(body.email, 200);
    const business = text(body.business, 160);
    const websiteUrl = text(body.websiteUrl, 300);
    const timeline = oneOf(text(body.timeline, 60), FOUNDING_TIMELINES);
    const budgetRange = oneOf(text(body.budget, 60), FOUNDING_BUDGETS);

    if (!name || !email || !business || !timeline || !budgetRange) {
      return Response.json({ error: "Please fill in every required field." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const ipAllowed = await throttleHit(ipBucket("founding", request), PER_IP_LIMIT, 3600);
    const siteAllowed = ipAllowed === true ? await throttleHit("founding:all", SITE_WIDE_LIMIT, 3600) : ipAllowed;
    if (ipAllowed === null || siteAllowed === null) {
      return Response.json(
        { error: "We couldn't take applications just now. Please email jlatten@foundryframe.com." },
        { status: 503 }
      );
    }
    if (!ipAllowed || !siteAllowed) {
      return Response.json({ error: TOO_MANY }, { status: 429 });
    }

    let applicationId: string | null = null;
    try {
      const saved = await insertFoundingApplication({
        name,
        email,
        business,
        website_url: websiteUrl || null,
        timeline,
        budget_range: budgetRange,
        email_sent: false,
      });
      applicationId = saved.id;
    } catch (error) {
      console.error("Founding application save failed:", error);
    }

    let emailSent = false;
    if (resend) {
      const row = (label: string, value: string) =>
        `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(value)}</td></tr>`;

      const { error } = await resend.emails.send({
        from: "Foundry Frame <noreply@foundryframe.com>",
        to: RECIPIENTS,
        replyTo: email,
        subject: `Founding Client application: ${name} (${business})`,
        html: `
          <h2>New Founding Client application</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            ${row("Name", name)}
            ${row("Email", email)}
            ${row("Business", business)}
            ${row("Current website", websiteUrl || "None")}
            ${row("Timeline", timeline)}
            ${row("Budget", budgetRange)}
          </table>
          ${applicationId ? `<p><a href="https://www.foundryframe.com/admin/founding">Open in the admin Founding Clients page</a></p>` : "<p><em>This application could not be saved to the admin page; this email is the only copy.</em></p>"}
        `,
      });
      if (error) {
        console.error("Founding application email failed:", error.message);
      } else {
        emailSent = true;
      }
    }

    if (applicationId && emailSent) {
      await markFoundingApplicationEmailed(applicationId).catch(() => undefined);
    }

    if (!applicationId && !emailSent) {
      return Response.json(
        { error: "We couldn't send your application just now. Please try again or email jlatten@foundryframe.com." },
        { status: 500 }
      );
    }

    await sendMetaLead(request, body, { contentName: "founding", email, name });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
