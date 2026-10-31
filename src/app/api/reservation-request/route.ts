import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getRedis, saveBooking } from "@/lib/bookings";

const resend = new Resend(process.env.RESEND_API_KEY);

// Guest-supplied text goes into HTML emails, so it must be escaped.
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// "2026-12-28" -> "28. 12. 2026" (falls back to the raw value)
function fmtDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${Number(m[3])}. ${Number(m[2])}. ${m[1]}` : iso;
}

function nightsLabel(n: number): string {
  if (n === 1) return "1 noc";
  if (n >= 2 && n <= 4) return `${n} noci`;
  return `${n} nocí`;
}

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, apartment, apartmentName, guestName, guestEmail, guests, about, nights, total, locale } = await req.json();

  if (!checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const from        = "Bouda Krista <rezervace@bouda-krista.cz>";
  const ownerEmail  = "chaloupka.krista@gmail.com";
  const helenaEmail = "helena.pechouckova@gmail.com";
  const isCz        = locale === "cs";

  // ── Save booking immediately to block the calendar ─────────────────────
  const reservationId = crypto.randomUUID();
  try {
    await saveBooking({
      id:            reservationId,
      apartment,
      apartmentName,
      checkIn,
      checkOut,
      guestName,
      guestEmail,
      totalCzk:      0,
      createdAt:     new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to save booking:", err);
  }

  // Also keep a Redis record for reference
  try {
    const redis = getRedis();
    await redis.set(
      `reservation:${reservationId}`,
      JSON.stringify({ id: reservationId, status: "confirmed-manual", checkIn, checkOut, apartment, apartmentName, guestName, guestEmail, nights, total, locale, createdAt: new Date().toISOString() }),
      "EX", 30 * 24 * 60 * 60,
    );
  } catch (err) {
    console.error("Failed to save reservation record:", err);
  }

  // ── Owner notification (CC Helena for manual payment handling) ─────────
  const TEXT   = "#46653B";
  const LINE   = "#46653B";
  const BOX    = "#FFFFFF";
  const ACCENT = "#CEA1BC";
  const BUTTON = "#CEA1BC";
  const SCRIPT = "'Allura','Great Vibes','Snell Roundhand','Brush Script MT',cursive";

  const nightsNum = Number(nights);
  const stayLabel = Number.isFinite(nightsNum) && nightsNum > 0 ? nightsLabel(nightsNum) : "—";
  const guestLang = isCz ? "Čeština" : "English";

  const divider = `<hr style="border:none;border-top:1px solid ${LINE};margin:16px 0"/>`;
  const item = (label: string, value: string) =>
    `<div style="font-family:sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${TEXT}">${label}</div>` +
    `<div style="font-family:sans-serif;font-size:16px;color:${TEXT};margin:2px 0 14px 0">${value}</div>`;

  const ownerResult = await resend.emails.send({
    from,
    to: ownerEmail,
    cc: [helenaEmail],
    replyTo: guestEmail,
    subject: `Nová rezervace: ${guestName} · ${fmtDate(checkIn)} – ${fmtDate(checkOut)} · ${stayLabel}`,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=Allura&display=swap" rel="stylesheet">
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:${TEXT}">

        <div style="background:${BOX};padding:22px 16px;text-align:center">
          <span style="font-family:${SCRIPT};font-size:44px;line-height:1.1;color:${ACCENT}">Nová rezervace</span>
        </div>

        ${divider}

        <div style="background:${BOX};padding:18px 16px;text-align:center">
          <div style="font-family:Georgia,serif;font-size:22px;color:${TEXT}">${esc(guestName)}</div>
          <div style="font-family:sans-serif;font-size:14px;margin-top:6px">
            <a href="mailto:${esc(guestEmail)}" style="color:${TEXT}">${esc(guestEmail)}</a>
          </div>
        </div>

        ${divider}

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr>
            <td width="50%" valign="top" style="background:${BOX};padding:16px 18px;border-right:4px solid #ffffff">
              ${item("Počet hostů", esc(guests ?? "—"))}
              ${item("Příjezd", esc(fmtDate(checkIn)))}
              ${item("Počet nocí", esc(nights))}
            </td>
            <td width="50%" valign="top" style="background:${BOX};padding:16px 18px;border-left:4px solid #ffffff">
              ${item("Apartmán", esc(apartmentName))}
              ${item("Odjezd", esc(fmtDate(checkOut)))}
              ${item("Cena", `<strong>${esc(total)} Kč</strong>`)}
            </td>
          </tr>
        </table>

        ${about ? `
        ${divider}
        <div style="background:${BOX};padding:16px 18px">
          <div style="font-family:sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${TEXT}">O sobě</div>
          <div style="font-family:Georgia,serif;font-size:15px;font-style:italic;line-height:1.6;color:${TEXT};margin-top:4px">${esc(about)}</div>
        </div>` : ""}

        <p style="text-align:center;margin:24px 0 16px 0">
          <a href="mailto:${esc(guestEmail)}" style="display:inline-block;background:${BUTTON};color:#FFFFFF;padding:10px 22px;text-decoration:none;font-family:sans-serif;font-size:14px">
            Odpovědět hostovi
          </a>
        </p>

        <p style="font-family:sans-serif;font-size:11px;color:${TEXT};text-align:center">
          Jazyk hosta: ${guestLang} · Rezervace ID: ${esc(reservationId)}
        </p>
      </div>
    `,
  });

  if (ownerResult.error) {
    console.error("Owner email failed:", JSON.stringify(ownerResult.error));
  }

  // ── Guest confirmation ─────────────────────────────────────────────────
  const guestResult = await resend.emails.send({
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
          <tr><td style="color:#5e975e;padding:6px 0;width:160px">${isCz ? "Apartmán" : "Apartment"}</td><td>${esc(apartmentName)}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Příjezd" : "Check-in"}</td><td>${esc(checkIn)}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Odjezd" : "Check-out"}</td><td>${esc(checkOut)}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Počet nocí" : "Nights"}</td><td>${esc(nights)}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Odhadovaná cena" : "Estimated price"}</td><td><strong>${esc(total)} Kč</strong></td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;color:#1a311a">
          ${isCz
            ? `Dobrý den ${esc(guestName)},<br/><br/>vaše rezervace byla přijata a termín je pro vás rezervován. Ozveme se vám do 24 hodin s platebními instrukcemi.`
            : `Dear ${esc(guestName)},<br/><br/>your reservation has been accepted and the dates are held for you. We will contact you within 24 hours with payment instructions.`
          }
        </p>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <p style="font-family:sans-serif;font-size:0.8rem;color:#5e975e">
          Bouda Krista · Rokytnice nad Jizerou · Krkonoše
        </p>
      </div>
    `,
  });

  if (guestResult.error) {
    console.error("Guest email failed:", JSON.stringify(guestResult.error));
  }

  return NextResponse.json({ ok: true });
}
