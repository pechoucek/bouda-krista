import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/gopay";
import { saveBooking } from "@/lib/bookings";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const paymentId = params.get("id");

  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
  }

  let payment;
  try {
    payment = await getPaymentStatus(paymentId);
  } catch (err) {
    console.error("GoPay status check failed:", err);
    return NextResponse.json({ error: "Status check failed" }, { status: 500 });
  }

  if (payment.state !== "PAID") {
    return NextResponse.json({ received: true, state: payment.state });
  }

  const from       = process.env.EMAIL_FROM ?? "Bouda Krista <chaloupka@bouda-krista.cz>";
  const ownerEmail = process.env.OWNER_EMAIL;
  const totalKc    = (payment.amount / 100).toLocaleString("cs-CZ") + " Kč";
  const guestEmail = payment.payer.contact.email;
  const guestName  = `${payment.payer.contact.first_name} ${payment.payer.contact.last_name}`.trim();

  // Parse from order_description: "Bouda Krista · Tiny Apartment · 2025-07-01 – 2025-07-07 · 6 nocí"
  const descMatch     = payment.order_description.match(/(\d{4}-\d{2}-\d{2}) – (\d{4}-\d{2}-\d{2})/);
  const aptMatch      = payment.order_description.match(/Bouda Krista · (.+?) ·/);
  const checkIn       = descMatch?.[1] ?? "—";
  const checkOut      = descMatch?.[2] ?? "—";
  const apartmentName = aptMatch?.[1] ?? "Whole House";

  // Map apartment name to ID
  const aptIdMap: Record<string, string> = {
    "Tiny Apartment":      "tiny",
    "Timber Apartment":    "timber",
    "Top Floor Apartment": "topfloor",
    "Whole House":         "whole",
  };
  const apartmentId = aptIdMap[apartmentName] ?? "whole";

  // ── Save booking to KV ─────────────────────────────────────────────────
  try {
    await saveBooking({
      id:            String(payment.id),
      apartment:     apartmentId,
      apartmentName,
      checkIn,
      checkOut,
      guestName,
      guestEmail,
      totalCzk:      payment.amount / 100,
      createdAt:     new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to save booking to KV:", err);
    // Don't fail the webhook — still send emails
  }

  // ── Guest confirmation email ───────────────────────────────────────────
  await resend.emails.send({
    from,
    to: guestEmail,
    subject: "Rezervace potvrzena — Bouda Krista",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
        <h1 style="font-size:2rem;margin-bottom:0.5rem">Vaše rezervace je potvrzena</h1>
        <p style="color:#5e975e;font-family:sans-serif;font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase">
          Bouda Krista · Rokytnice nad Jizerou
        </p>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <table style="width:100%;font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
          <tr><td style="color:#5e975e;padding:6px 0;width:140px">Host</td><td>${guestName}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Apartmán</td><td>${apartmentName}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Příjezd</td><td>${checkIn} po 15:00</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Odjezd</td><td>${checkOut} do 11:00</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Celkem zaplaceno</td><td><strong>${totalKc}</strong></td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">Číslo objednávky</td><td>${payment.order_number}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <p style="font-family:sans-serif;font-size:0.85rem;color:#5e975e;line-height:1.7">
          Vstup pomocí klíčového trezoru. Přístupové instrukce obdržíte 24 hodin před příjezdem.<br/>
          Dotazy? Odpovězte na tento e-mail.
        </p>
      </div>
    `,
  });

  // ── Owner notification ─────────────────────────────────────────────────
  if (ownerEmail) {
    await resend.emails.send({
      from,
      to: ownerEmail,
      subject: `Nová rezervace: ${guestName} · ${apartmentName} · ${checkIn} – ${checkOut}`,
      html: `
        <p>Nová rezervace byla uhrazena:</p>
        <ul>
          <li><b>Host:</b> ${guestName} (${guestEmail})</li>
          <li><b>Apartmán:</b> ${apartmentName}</li>
          <li><b>Příjezd:</b> ${checkIn}</li>
          <li><b>Odjezd:</b> ${checkOut}</li>
          <li><b>Celkem:</b> ${totalKc}</li>
          <li><b>Objednávka:</b> ${payment.order_number}</li>
          <li><b>GoPay ID:</b> ${payment.id}</li>
        </ul>
        <p>Nezapomeňte ručně zablokovat termín na Airbnb, nebo počkejte až se synchronizuje iCal.</p>
      `,
    });
  }

  return NextResponse.json({ received: true });
}

export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("id");
  if (paymentId) console.log("GoPay return GET notification, id:", paymentId);
  return NextResponse.json({ ok: true });
}
