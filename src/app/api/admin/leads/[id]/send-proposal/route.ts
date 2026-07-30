import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/app/api/admin/_utils";
import {
  getLeadById,
  getLatestGeneratedLeadPage,
  updateGeneratedLeadPage,
  updateLead,
} from "@/lib/leads/repository";

const resend = new Resend(process.env.RESEND_API_KEY);
const proposalFrom =
  process.env.LEAD_PROPOSAL_EMAIL_FROM || "Foundry Frame <noreply@foundryframe.com>";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/admin/leads/[id]/send-proposal">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    if (!lead.contact_email) {
      return NextResponse.json(
        { error: "Lead has no contact email. Add one before sending." },
        { status: 400 }
      );
    }

    const generatedPage = await getLatestGeneratedLeadPage(id);
    if (!generatedPage) {
      return NextResponse.json(
        { error: "No generated landing page found. Generate one first." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const previewUrl = `${baseUrl.replace(/\/$/, "")}/lead-preview/${generatedPage.slug}`;

    const packages = Array.isArray(generatedPage.package_recommendations)
      ? generatedPage.package_recommendations
      : [];

    const packageHtml = packages
      .map((pkg) => {
        const deliverables = Array.isArray(pkg.deliverables)
          ? pkg.deliverables.map((item: string) => `<li>${esc(item)}</li>`).join("")
          : "";

        return `
          <div style="margin-bottom:16px;padding:12px;border:1px solid #e5e7eb;">
            <h4 style="margin:0 0 8px 0;">${esc(String(pkg.packageName ?? "Recommended Package"))}</h4>
            <p style="margin:0 0 8px 0;"><strong>Investment:</strong> ${esc(String(pkg.estimatedInvestment ?? "Custom"))}</p>
            <p style="margin:0 0 8px 0;"><strong>Timeline:</strong> ${esc(String(pkg.timeline ?? "TBD"))}</p>
            <p style="margin:0 0 8px 0;">${esc(String(pkg.rationale ?? ""))}</p>
            <ul style="margin:0 0 0 16px;padding:0;">${deliverables}</ul>
          </div>
        `;
      })
      .join("");

    const subject = `Website growth proposal for ${lead.company_name || lead.name}`;

    const { error } = await resend.emails.send({
      from: proposalFrom,
      to: lead.contact_email,
      subject,
      html: `
        <h2 style="font-family:Arial,sans-serif;">A modern website concept for ${esc(lead.company_name || lead.name)}</h2>
        <p style="font-family:Arial,sans-serif;line-height:1.5;">
          We analyzed your current website and created a proposed modern direction focused on SEO, conversion, and trust-building.
        </p>
        <p style="font-family:Arial,sans-serif;line-height:1.5;">
          Review your custom preview here:<br />
          <a href="${esc(previewUrl)}" target="_blank" rel="noopener noreferrer">${esc(previewUrl)}</a>
        </p>
        <h3 style="font-family:Arial,sans-serif;">Recommended package paths</h3>
        ${packageHtml || "<p style=\"font-family:Arial,sans-serif;\">Custom package recommendations are included in your preview.</p>"}
        <p style="font-family:Arial,sans-serif;line-height:1.5;">
          If helpful, reply directly and we can walk through the recommendations together.
        </p>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await Promise.all([
      updateGeneratedLeadPage(generatedPage.id, { status: "sent" }),
      updateLead(lead.id, { status: "sent" }),
    ]);

    return NextResponse.json({
      success: true,
      previewUrl,
      sentTo: lead.contact_email,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to send proposal email.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
