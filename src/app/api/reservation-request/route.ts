import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getRedis, saveBooking } from "@/lib/bookings";
import { SITE_URL, signToken } from "@/lib/payment-email";

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

  // ── Link behind the button: opens a preview page where you press "Odeslat" ──
  let buttonHref = `mailto:${guestEmail}`; // fallback if the private link can't be made
  try {
    buttonHref = `${SITE_URL}/api/reservation/send-payment?id=${reservationId}&token=${signToken(reservationId)}`;
  } catch (err) {
    console.error("Could not create payment link:", err);
  }

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
          <a href="${esc(buttonHref)}" style="display:inline-block;background:${BUTTON};color:#FFFFFF;padding:10px 22px;text-decoration:none;font-family:sans-serif;font-size:14px">
            Odeslat platební údaje hostovi
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

  return NextResponse.json({ ok: true });
}
