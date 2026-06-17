import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, message, locale } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const from       = "Bouda Krista <onboarding@resend.dev>";
  const ownerEmail = process.env.OWNER_EMAIL ?? "chaloupka.krista@gmail.com";

  if (!ownerEmail) {
    return NextResponse.json({ error: "Owner email not configured" }, { status: 500 });
  }

  try {
    // Notify owner
    await resend.emails.send({
      from,
      to: ownerEmail,
      replyTo: email,
      subject: `Dotaz z webu: ${name}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
          <h2 style="margin-bottom:0.5rem">Nová zpráva z webu Bouda Krista</h2>
          <hr style="border:none;border-top:1px solid #c2dbc2;margin:1rem 0"/>
          <p style="font-family:sans-serif;font-size:0.9rem"><b>Jméno:</b> ${name}</p>
          <p style="font-family:sans-serif;font-size:0.9rem"><b>E-mail:</b> <a href="mailto:${email}">${email}</a></p>
          <hr style="border:none;border-top:1px solid #c2dbc2;margin:1rem 0"/>
          <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.7;white-space:pre-wrap">${message}</p>
        </div>
      `,
    });

    // Auto-reply to sender
    const isCz = locale === "cs";
    await resend.emails.send({
      from,
      to: email,
      subject: isCz ? "Přijali jsme váš dotaz — Bouda Krista" : "We received your message — Bouda Krista",
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
          <h1 style="font-size:1.8rem;margin-bottom:0.5rem">
            ${isCz ? "Děkujeme za váš dotaz" : "Thank you for reaching out"}
          </h1>
          <p style="color:#5e975e;font-family:sans-serif;font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase">
            Bouda Krista · Rokytnice nad Jizerou
          </p>
          <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
          <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7">
            ${isCz
              ? `Dobrý den ${name},<br/><br/>obdrželi jsme vaši zprávu a odpovíme vám co nejdříve, zpravidla do 24 hodin.`
              : `Dear ${name},<br/><br/>we have received your message and will get back to you as soon as possible, usually within 24 hours.`
            }
          </p>
          <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
          <p style="font-family:sans-serif;font-size:0.8rem;color:#5e975e">
            Bouda Krista · Rokytnice nad Jizerou · Krkonoše
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email failed:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
