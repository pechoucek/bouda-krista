import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getRedis } from "@/lib/bookings";
import {
  MAIL_FROM,
  OWNER_EMAIL,
  StoredReservation,
  buildPaymentEmail,
  esc,
  verifyToken,
} from "@/lib/payment-email";

const resend = new Resend(process.env.RESEND_API_KEY);

function page(title: string, inner: string, status = 200) {
  const html = `<!DOCTYPE html>
<html lang="cs"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>
  body{font-family:system-ui,sans-serif;background:#f3f5f1;color:#1a311a;margin:0;padding:24px}
  .wrap{max-width:640px;margin:0 auto}
  .card{background:#fff;padding:20px;border-radius:8px;box-shadow:0 1px 6px rgba(0,0,0,.15);overflow-x:auto}
  .note{background:#e8efe5;padding:10px 14px;margin:16px 0;font-size:.9rem;border-radius:4px}
  button{background:#CEA1BC;color:#fff;border:0;padding:12px 28px;font-size:1rem;cursor:pointer;border-radius:4px}
</style>
</head><body><div class="wrap">${inner}</div></body></html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function loadReservation(id: string): Promise<StoredReservation | null> {
  const raw = await getRedis().get(`reservation:${id}`);
  return raw ? (JSON.parse(raw) as StoredReservation) : null;
}

function czTime(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString("cs-CZ", { timeZone: "Europe/Prague" });
}

const INVALID = `<div class="card"><p>Tento odkaz není platný.</p></div>`;
const NOT_FOUND = `<div class="card"><p>Rezervace nebyla nalezena (záznam se uchovává 30 dní).</p></div>`;

// Step 1 – the button in the notification email opens this preview page.
// Opening the page never sends anything, so link scanners can't trigger the email.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!id || !verifyToken(id, token)) return page("Neplatný odkaz", INVALID, 403);

  const r = await loadReservation(id);
  if (!r) return page("Rezervace nenalezena", NOT_FOUND, 404);

  const sentAt = await getRedis().get(`reservation-paymail:${id}`);
  const { subject, html } = buildPaymentEmail(r);
  const action = `/api/reservation/send-payment?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;

  return page(
    "Odeslat platební údaje",
    `
    <h2>Odeslat platební údaje hostovi</h2>
    <p>Komu: <strong>${esc(r.guestEmail)}</strong><br/>Předmět: <strong>${esc(subject)}</strong></p>
    <div class="card">${html}</div>
    ${
      sentAt
        ? `<div class="note">Tento e-mail už byl odeslán (${esc(czTime(sentAt))}).</div>`
        : `<form method="post" action="${esc(action)}" style="margin-top:16px">
             <button type="submit">Odeslat e-mail hostovi</button>
           </form>`
    }
    `
  );
}

// Step 2 – the "Odeslat" button on that page sends the email (only once).
export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!id || !verifyToken(id, token)) return page("Neplatný odkaz", INVALID, 403);

  const r = await loadReservation(id);
  if (!r) return page("Rezervace nenalezena", NOT_FOUND, 404);

  const redis = getRedis();
  const lockKey = `reservation-paymail:${id}`;

  // Only the first click gets the lock, so a double click can't send twice.
  const lock = await redis.set(lockKey, new Date().toISOString(), "EX", 60 * 24 * 60 * 60, "NX");
  if (lock !== "OK") {
    return page("Již odesláno", `<div class="card"><p>Tento e-mail už byl hostovi odeslán.</p></div>`);
  }

  const { subject, html } = buildPaymentEmail(r);
  const result = await resend.emails.send({
    from: MAIL_FROM,
    to: r.guestEmail,
    bcc: [OWNER_EMAIL],
    replyTo: OWNER_EMAIL,
    subject,
    html,
  });

  if (result.error) {
    console.error("Payment email failed:", JSON.stringify(result.error));
    await redis.del(lockKey); // allow another try
    return page(
      "Odeslání se nezdařilo",
      `<div class="card"><p>E-mail se nepodařilo odeslat. Zkuste to prosím znovu (odkaz v e-mailu je stále platný).</p></div>`,
      500
    );
  }

  return page(
    "Odesláno",
    `<div class="card"><h2>Hotovo ✓</h2><p>Platební údaje byly odeslány na <strong>${esc(r.guestEmail)}</strong>. Kopie přišla i vám.</p></div>`
  );
}
