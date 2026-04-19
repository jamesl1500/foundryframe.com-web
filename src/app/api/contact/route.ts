import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, phone, company, service, budget, message } = body;

    if (!firstName || !lastName || !email || !service || !message) {
      return Response.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const row = (label: string, value: string) =>
      `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(value)}</td></tr>`;

    const { error } = await resend.emails.send({
      from: "Foundry Frame <noreply@foundryframe.com>",
      to: "jlatten@foundryframe.com",
      replyTo: email,
      subject: `New Inquiry: ${esc(firstName)} ${esc(lastName)} — ${esc(service)}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          ${row("Name", `${firstName} ${lastName}`)}
          ${row("Email", email)}
          ${phone ? row("Phone", phone) : ""}
          ${company ? row("Company", company) : ""}
          ${row("Service", service)}
          ${budget ? row("Budget", budget) : ""}
          ${row("Message", message)}
        </table>
      `,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
