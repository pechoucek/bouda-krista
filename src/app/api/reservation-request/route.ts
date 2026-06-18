import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, apartment, apartmentName, guestName, guestEmail, nights, total, locale } = await req.json();

  if (!checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const from       = "Bouda Krista <rezervace@bouda-krista.cz>";
  const ownerEmail = "chaloupka.krista@gmail.com";
  const isCz       = locale === "cs";

  // ── Owner notification ─────────────────────────────────────────────────
  const ownerResult = await resend.emails.send({
    from,
    to: ownerEmail,
    replyTo: guestEmail,
    subject: `Nová poptávka: ${guestName} · ${apartmentName} · ${checkIn} – ${checkOut}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
        <h2 style="margin-bottom:0.5rem">Nová poptávka rezervace — Bouda Krista</h2>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1rem 0"/>
        <table style="width:100%;font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
          <tr><td style="color:#5e975e;padding:6px 0;width:160px">Host</td><td>${guestName}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">E-mail</td><td><a href="mailto:${guestEmail}">${guestEmail}</a></td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Apartmán</td><td>${apartmentName}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Příjezd</td><td>${checkIn}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Odjezd</td><td>${checkOut}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Počet nocí</td><td>${nights}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Odhadovaná cena</td><td><strong>${total} Kč</strong></td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1rem 0"/>
        <p style="font-family:sans-serif;font-size:0.85rem;color:#5e975e">
          Odpovězte přímo na tento e-mail — odpověď půjde hostovi.
        </p>
      </div>
    `,
  });

  console.log("Owner email result:", JSON.stringify(ownerResult));

  // ── Guest confirmation ─────────────────────────────────────────────────
  await resend.emails.send({
    from,
    to: guestEmail,
    replyTo: ownerEmail,
    subject: isCz
      ? "Přijali jsme vaši poptávku — Bouda Krista"
      : "We received your reservation request — Bouda Krista",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
        <h1 style="font-size:1.8rem;margin-bottom:0.5rem">
          ${isCz ? "Vaše poptávka byla přijata" : "Your request has been received"}
        </h1>
        <p style="color:#5e975e;font-family:sans-serif;font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase">
          Bouda Krista · Rokytnice nad Jizerou
        </p>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <table style="width:100%;font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
          <tr><td style="color:#5e975e;padding:6px 0;width:160px">${isCz ? "Apartmán" : "Apartment"}</td><td>${apartmentName}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Příjezd" : "Check-in"}</td><td>${checkIn}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Odjezd" : "Check-out"}</td><td>${checkOut}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Počet nocí" : "Nights"}</td><td>${nights}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Odhadovaná cena" : "Estimated price"}</td><td><strong>${total} Kč</strong></td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;color:#1a311a">
          ${isCz
            ? `Dobrý den ${guestName},<br/><br/>obdrželi jsme vaši poptávku a ozveme se vám co nejdříve s potvrzením dostupnosti a platebními instrukcemi.`
            : `Dear ${guestName},<br/><br/>we have received your reservation request and will get back to you shortly to confirm availability and provide payment instructions.`
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
}
