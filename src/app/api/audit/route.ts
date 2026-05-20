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
    const { url, email } = body;

    if (!url || !email) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Foundry Frame <noreply@foundryframe.com>",
      to: "jlatten@foundryframe.com",
      replyTo: email,
      subject: "New Free Website Audit Request",
      html: `
        <h2>New Website Audit Request</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr>
            <td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Website</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(url)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Email</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(email)}</td>
          </tr>
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
