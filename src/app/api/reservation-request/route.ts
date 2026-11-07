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

  // ── Save pending reservation to block the calendar + store for approval ──
  const reservationId = crypto.randomUUID();
  const approveToken  = crypto.randomUUID();
  const baseUrl       = "https://www.bouda-krista.cz";

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

  try {
    const redis = getRedis();
    await redis.set(
      `reservation:${reservationId}`,
      JSON.stringify({ id: reservationId, token: approveToken, status: "pending", checkIn, checkOut, apartment, apartmentName, guestName, guestEmail, nights, total, locale, createdAt: new Date().toISOString() }),
      "EX", 30 * 24 * 60 * 60,
    );
  } catch (err) {
    console.error("Failed to save reservation record:", err);
  }

  const approveUrl = `${baseUrl}/api/approve-reservation?id=${reservationId}&token=${approveToken}`;
  const declineUrl = `${baseUrl}/api/approve-reservation?id=${reservationId}&token=${approveToken}&decline=1`;

  // ── Owner notification ─────────────────────────────────────────────────
  const TEXT   = "#46653B";
  const LINE   = "#46653B";
  const BOX    = "#FFFFFF";
  const ACCENT = "#CEA1BC";
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
    subject: `Nová poptávka: ${guestName} · ${fmtDate(checkIn)} – ${fmtDate(checkOut)} · ${stayLabel}`,
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

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 16px auto">
          <tr>
            <td style="padding-right:12px">
              <a href="${esc(approveUrl)}" style="display:inline-block;background:#1a311a;color:#fff;padding:12px 24px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:600">
                ✓ Schválit a odeslat platební odkaz
              </a>
            </td>
            <td>
              <a href="${esc(declineUrl)}" style="display:inline-block;background:#f5f5f5;color:#666;padding:12px 18px;text-decoration:none;font-family:sans-serif;font-size:13px;border:1px solid #ddd">
                ✗ Odmítnout
              </a>
            </td>
          </tr>
        </table>

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
