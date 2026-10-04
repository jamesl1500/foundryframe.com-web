/**
 * Ad Landing Page Lead API Route - Foundry Frame
 * ================================================
 * Receives the short form on /go/<slug>, adds it to the admin Leads
 * workbench (status "new", with the ad page and lead source in the notes),
 * and emails it to the team.
 *
 * Abuse protection matches /api/founding: same-site check, honeypot, and
 * durable per-IP and site-wide rate limits that fail closed.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { Resend } from "resend";
import { getFunnel } from "@/lib/funnels";
import { describeLeadSource } from "@/lib/lead-source";
import { createLead } from "@/lib/leads/repository";
import { leadSourceEmailHtml, leadSourceFromRequest } from "@/lib/server/lead-source";
import { sendMetaLead } from "@/lib/server/meta-capi";
import { ipBucket, isSameSiteRequest, throttleHit } from "@/lib/server/request-guard";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const RECIPIENTS = ["jlatten@foundryframe.com", "leads@foundryframe.com"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PER_IP_LIMIT = 3; // submissions per IP per hour
const SITE_WIDE_LIMIT = 30; // submissions per hour from everyone combined
const TOO_MANY = "Too many requests right now. Please try again later or email jlatten@foundryframe.com.";

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

/** "instagram.com/doe" -> "https://instagram.com/doe"; handles like "@doe" are kept as typed. */
function normalizeLink(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;
  return /^[^\s@]+\.[a-z]{2,}(\/|$)/i.test(input) ? `https://${input}` : input;
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

    const funnel = getFunnel(text(body.funnel, 80));
    const name = text(body.name, 120);
    const email = text(body.email, 200);
    const business = text(body.business, 160);
    const phone = text(body.phone, 40);
    const link = normalizeLink(text(body.link, 300));
    const note = text(body.note, 2000);

    if (!funnel) {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }
    if (!name || !email || !business || !link) {
      return Response.json({ error: "Please fill in every required field." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const ipAllowed = await throttleHit(ipBucket("ad-lead", request), PER_IP_LIMIT, 3600);
    const siteAllowed = ipAllowed === true ? await throttleHit("ad-lead:all", SITE_WIDE_LIMIT, 3600) : ipAllowed;
    if (ipAllowed === null || siteAllowed === null) {
      return Response.json(
        { error: "We couldn't take your request just now. Please email jlatten@foundryframe.com." },
        { status: 503 }
      );
    }
    if (!ipAllowed || !siteAllowed) {
      return Response.json({ error: TOO_MANY }, { status: 429 });
    }

    const source = leadSourceFromRequest(request);
    const notes = [
      `Inbound from the /go/${funnel.slug} ad page. Contact: ${name}.`,
      `Source: ${describeLeadSource(source)}`,
      note ? `Their note: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    let leadId: string | null = null;
    try {
      const lead = await createLead({
        name: business,
        company_name: business,
        website_url: link,
        contact_email: email,
        contact_phone: phone || null,
        notes,
        status: "new",
      });
      leadId = lead.id;
    } catch (error) {
      console.error("Ad page lead save failed:", error);
    }

    let emailSent = false;
    if (resend) {
      const row = (label: string, value: string) =>
        `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(value)}</td></tr>`;

      const { error } = await resend.emails.send({
        from: "Foundry Frame <noreply@foundryframe.com>",
        to: RECIPIENTS,
        replyTo: email,
        subject: `Ad page lead: ${business} (${name})`,
        html: `
          <h2>New lead from /go/${esc(funnel.slug)}</h2>
          <p>They asked for a short plan and a price by email.</p>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            ${row("Name", name)}
            ${row("Email", email)}
            ${row("Business", business)}
            ${row("Online now", link)}
            ${phone ? row("Phone", phone) : ""}
            ${note ? row("Note", note) : ""}
          </table>
          ${leadSourceEmailHtml(source)}
          ${leadId ? `<p><a href="https://www.foundryframe.com/admin/leads/${encodeURIComponent(leadId)}">Open in the admin Leads workbench</a></p>` : "<p><em>This lead could not be saved to the admin Leads page; this email is the only copy.</em></p>"}
        `,
      });
      if (error) {
        console.error("Ad page lead email failed:", error.message);
      } else {
        emailSent = true;
      }
    }

    if (!leadId && !emailSent) {
      return Response.json(
        { error: "We couldn't send your request just now. Please try again or email jlatten@foundryframe.com." },
        { status: 500 }
      );
    }

    await sendMetaLead(request, body, { contentName: `ad_page:${funnel.slug}`, email, name });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
