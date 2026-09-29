/**
 * Package Quote API Route - Foundry Frame
 * =========================================
 * Receives a package built on /packages/builder, re-prices it from the
 * server-side catalog, saves it for the admin Quotes page, and emails the
 * itemized quote to the team.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { Resend } from "resend";
import {
  MEETING_WINDOWS,
  formatLineAmount,
  formatUsd,
  parseSelection,
  priceQuote,
  type PricedQuote,
} from "@/lib/package-builder/catalog";
import { insertQuote, updateQuote } from "@/lib/package-builder/repository";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const QUOTE_RECIPIENTS = ["jlatten@foundryframe.com", "leads@foundryframe.com"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

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

type Contact = {
  name: string;
  email: string;
  company: string;
  phone: string;
  websiteUrl: string;
  notes: string;
  preferredDate: string;
  preferredWindow: string;
};

function quoteEmailHtml(contact: Contact, quote: PricedQuote, quoteId: string | null) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(value)}</td></tr>`;
  const lineRow = (label: string, detail: string, amount: string) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;"><strong>${esc(label)}</strong><br><span style="color:#666;font-size:13px;">${esc(detail)}</span></td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">${esc(amount)}</td></tr>`;

  const meeting = contact.preferredDate
    ? `${contact.preferredDate}${contact.preferredWindow ? `, ${contact.preferredWindow}` : ""}`
    : "No preference given";
  const plus = quote.hasFloorPrices ? "+" : "";

  return `
    <h2>New Package Quote: ${esc(contact.name)}</h2>
    <table style="border-collapse:collapse;width:100%;max-width:640px;">
      ${row("Name", contact.name)}
      ${row("Email", contact.email)}
      ${contact.company ? row("Company", contact.company) : ""}
      ${contact.phone ? row("Phone", contact.phone) : ""}
      ${contact.websiteUrl ? row("Current website", contact.websiteUrl) : ""}
      ${row("Preferred meeting", meeting)}
      ${row("Estimated timeline", quote.timeline)}
      ${contact.notes ? row("Notes", contact.notes) : ""}
    </table>
    <h3 style="margin-top:24px;">Package</h3>
    <table style="border-collapse:collapse;width:100%;max-width:640px;">
      ${quote.lines.map((line) => lineRow(line.label, line.detail, formatLineAmount(line))).join("")}
      <tr><td style="padding:10px 12px;font-weight:bold;">One-time total</td><td style="padding:10px 12px;text-align:right;font-weight:bold;">${formatUsd(quote.oneTimeTotal)}${plus}${quote.hasCustomItems ? " + custom scope" : ""}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;">Monthly total</td><td style="padding:10px 12px;text-align:right;font-weight:bold;">${formatUsd(quote.monthlyTotal)}${quote.monthlyTotal > 0 ? plus : ""}/mo</td></tr>
    </table>
    ${quote.notes.length ? `<ul>${quote.notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul>` : ""}
    ${quoteId ? `<p><a href="https://www.foundryframe.com/admin/quotes">Open in the admin Quotes page</a></p>` : "<p><em>This quote could not be saved to the admin Quotes page; this email is the only copy.</em></p>"}
  `;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    // Honeypot: real visitors never see or fill this field.
    if (text(body.fax, 200)) {
      return Response.json({ success: true });
    }

    const selection = parseSelection(body.selection);
    if (!selection) {
      return Response.json({ error: "Please pick a starting point for your package." }, { status: 400 });
    }

    const contact: Contact = {
      name: text(body.name, 120),
      email: text(body.email, 200),
      company: text(body.company, 160),
      phone: text(body.phone, 40),
      websiteUrl: text(body.websiteUrl, 300),
      notes: text(body.notes, 3000),
      preferredDate: text(body.preferredDate, 10),
      preferredWindow: text(body.preferredWindow, 60),
    };

    if (!contact.name || !contact.email) {
      return Response.json({ error: "Name and email are required." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(contact.email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    const today = new Date().toISOString().slice(0, 10);
    if (contact.preferredDate && (!DATE_REGEX.test(contact.preferredDate) || contact.preferredDate < today)) {
      contact.preferredDate = "";
    }
    if (!(MEETING_WINDOWS as readonly string[]).includes(contact.preferredWindow)) {
      contact.preferredWindow = "";
    }

    const quote = priceQuote(selection);
    if (quote.lines.length === 0) {
      return Response.json({ error: "Add at least one item to your package." }, { status: 400 });
    }

    let quoteId: string | null = null;
    try {
      const saved = await insertQuote({
        name: contact.name,
        email: contact.email,
        company: contact.company || null,
        phone: contact.phone || null,
        website_url: contact.websiteUrl || null,
        notes: contact.notes || null,
        selection,
        quote,
        one_time_total: quote.oneTimeTotal,
        monthly_total: quote.monthlyTotal,
        preferred_date: contact.preferredDate || null,
        preferred_window: contact.preferredWindow || null,
        email_sent: false,
      });
      quoteId = saved.id;
    } catch (error) {
      console.error("Package quote save failed:", error);
    }

    let emailSent = false;
    if (resend) {
      const { error } = await resend.emails.send({
        from: "Foundry Frame <noreply@foundryframe.com>",
        to: QUOTE_RECIPIENTS,
        replyTo: contact.email,
        subject: `New Package Quote: ${contact.name}${contact.company ? ` (${contact.company})` : ""} — ${formatUsd(quote.oneTimeTotal)}${quote.monthlyTotal ? ` + ${formatUsd(quote.monthlyTotal)}/mo` : ""}`,
        html: quoteEmailHtml(contact, quote, quoteId),
      });
      if (error) {
        console.error("Package quote email failed:", error.message);
      } else {
        emailSent = true;
      }
    }

    if (quoteId && emailSent) {
      await updateQuote(quoteId, { email_sent: true }).catch(() => undefined);
    }

    if (!quoteId && !emailSent) {
      return Response.json(
        { error: "We couldn't send your package just now. Please try again or email jlatten@foundryframe.com." },
        { status: 500 }
      );
    }

    return Response.json({ success: true, quote });
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
