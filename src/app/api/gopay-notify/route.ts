/**
 * GoPay payment notification endpoint.
 * GoPay POSTs here when a payment state changes.
 * Docs: https://doc.gopay.com/#payment-notification
 */
import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/gopay";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();

  // GoPay sends: id=<payment_id> as form-encoded body
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

  // Only act on successful payments
  if (payment.state !== "PAID") {
    return NextResponse.json({ received: true, state: payment.state });
  }

  const from       = process.env.EMAIL_FROM ?? "rezervace@lodgekrista.cz";
  const ownerEmail = process.env.OWNER_EMAIL;
  const totalKc    = (payment.amount / 100).toLocaleString("cs-CZ") + " Kč";

  // Parse check-in/check-out from order_description
  // Format: "Lodge Krista · 2025-07-01 – 2025-07-07 · 6 nocí · 4 osob"
  const descMatch  = payment.order_description.match(/(\d{4}-\d{2}-\d{2}) – (\d{4}-\d{2}-\d{2})/);
  const checkIn    = descMatch?.[1] ?? "—";
  const checkOut   = descMatch?.[2] ?? "—";
  const guestEmail = payment.payer.contact.email;
  const guestName  = `${payment.payer.contact.first_name} ${payment.payer.contact.last_name}`.trim();

  // ── Guest confirmation email ──────────────────────────────────────────
  await resend.emails.send({
    from,
    to: guestEmail,
    subject: "Rezervace potvrzena — Lodge Krista",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
        <h1 style="font-size:2rem;margin-bottom:0.5rem">Vaše rezervace je potvrzena</h1>
        <p style="color:#5e975e;font-family:sans-serif;font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase">
          Lodge Krista · Rokytnice nad Jizerou
        </p>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <table style="width:100%;font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
          <tr><td style="color:#5e975e;padding:6px 0;width:140px">Host</td><td>${guestName}</td></tr>
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

  // ── Owner notification ────────────────────────────────────────────────
  if (ownerEmail) {
    await resend.emails.send({
      from,
      to: ownerEmail,
      subject: `Nová rezervace: ${guestName} · ${checkIn} – ${checkOut}`,
      html: `
        <p>Nová rezervace byla uhrazena:</p>
        <ul>
          <li><b>Host:</b> ${guestName} (${guestEmail})</li>
          <li><b>Příjezd:</b> ${checkIn}</li>
          <li><b>Odjezd:</b> ${checkOut}</li>
          <li><b>Celkem:</b> ${totalKc}</li>
          <li><b>Objednávka:</b> ${payment.order_number}</li>
          <li><b>GoPay ID:</b> ${payment.id}</li>
        </ul>
      `,
    });
  }

  return NextResponse.json({ received: true });
}

// GoPay also sends a GET with ?id= when the user is redirected back
export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("id");
  if (paymentId) {
    // Fire-and-forget — same logic handled by POST above
    console.log("GoPay return GET notification, id:", paymentId);
  }
  return NextResponse.json({ ok: true });
}
