import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getRedis, saveBooking } from "@/lib/bookings";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, apartment, apartmentName, guestName, guestEmail, guests, about, nights, total, locale } = await req.json();

  if (!checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const from       = "Bouda Krista <rezervace@bouda-krista.cz>";
  const ownerEmail = "chaloupka.krista@gmail.com";
  const helenaEmail = "helena.pechouckova@gmail.com";
  const isCz       = locale === "cs";

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
  const ownerResult = await resend.emails.send({
    from,
    to: ownerEmail,
    cc: [helenaEmail],
    replyTo: guestEmail,
    subject: `Nová rezervace: ${guestName} · ${apartmentName} · ${checkIn} – ${checkOut}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
        <h2 style="margin-bottom:0.5rem">Nová rezervace — Bouda Krista</h2>
        <p style="font-family:sans-serif;font-size:0.85rem;background:#fffbe6;border:1px solid #e6c800;padding:10px 14px;color:#7a6000;">
          ⚠️ Termín byl automaticky zablokován v kalendáři. Helena — prosím kontaktuj hosta pro vyřízení platby.
        </p>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1rem 0"/>
        <table style="width:100%;font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
          <tr><td style="color:#5e975e;padding:6px 0;width:160px">Host</td><td>${guestName}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">E-mail</td><td><a href="mailto:${guestEmail}">${guestEmail}</a></td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Počet hostů</td><td>${guests ?? "—"}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Apartmán</td><td>${apartmentName}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Příjezd</td><td>${checkIn}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Odjezd</td><td>${checkOut}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Počet nocí</td><td>${nights}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Cena</td><td><strong>${total} Kč</strong></td></tr>
          ${about ? `<tr><td style="color:#5e975e;padding:6px 0;vertical-align:top">O sobě</td><td style="font-style:italic">${about}</td></tr>` : ""}
        </table>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1rem 0"/>
        <p style="font-family:sans-serif;font-size:0.8rem;color:#5e975e">
          Rezervace ID: ${reservationId}
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
            ? `Dobrý den ${guestName},<br/><br/>vaše rezervace byla přijata a termín je pro vás rezervován. Ozveme se vám do 24 hodin s platebními instrukcemi.`
            : `Dear ${guestName},<br/><br/>your reservation has been accepted and the dates are held for you. We will contact you within 24 hours with payment instructions.`
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
