import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/gopay";
import { calculateTotal } from "@/lib/pricing";
import { getRedis } from "@/lib/bookings";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const html = (title: string, body: string, color = "#1a311a") => `
<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Georgia,serif;background:#f5f0e8;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{background:#fff;max-width:480px;width:100%;padding:2.5rem;border:1px solid #c2dbc2}
h1{color:${color};font-size:1.5rem;margin:0 0 1rem}p{font-family:sans-serif;font-size:0.9rem;color:#444;line-height:1.7;margin:0}</style>
</head><body><div class="box"><h1>${title}</h1><p>${body}</p></div></body></html>`;

export async function GET(req: NextRequest) {
  const id      = req.nextUrl.searchParams.get("id");
  const token   = req.nextUrl.searchParams.get("token");
  const decline = req.nextUrl.searchParams.get("decline") === "1";

  if (!id || !token) {
    return new NextResponse(html("Chybný odkaz", "Odkaz je neplatný."), { status: 400, headers: { "Content-Type": "text/html" } });
  }

  const redis = getRedis();
  const raw   = await redis.get(`reservation:${id}`);

  if (!raw) {
    return new NextResponse(html("Rezervace nenalezena", "Rezervace neexistuje nebo vypršela."), { status: 404, headers: { "Content-Type": "text/html" } });
  }

  const res = JSON.parse(raw) as {
    id: string; token: string; status: string;
    checkIn: string; checkOut: string; apartment: string; apartmentName: string;
    guestName: string; guestEmail: string; nights: number; total: string; locale: string;
  };

  if (res.token !== token) {
    return new NextResponse(html("Přístup odepřen", "Neplatný bezpečnostní token.", "#a00"), { status: 403, headers: { "Content-Type": "text/html" } });
  }

  if (res.status !== "pending") {
    return new NextResponse(html("Již zpracováno", `Tato rezervace již byla <strong>${res.status === "approved" ? "schválena" : "odmítnuta"}</strong>.`), { status: 409, headers: { "Content-Type": "text/html" } });
  }

  // ── Decline path ──────────────────────────────────────────────────────
  if (decline) {
    await redis.set(`reservation:${id}`, JSON.stringify({ ...res, status: "declined" }), "EX", 30 * 24 * 60 * 60);

    await resend.emails.send({
      from:    "Bouda Krista <rezervace@bouda-krista.cz>",
      to:      res.guestEmail,
      subject: res.locale === "cs" ? "K vaší poptávce — Bouda Krista" : "About your request — Bouda Krista",
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
          <h1 style="font-size:1.5rem">${res.locale === "cs" ? "Omlouváme se" : "We're sorry"}</h1>
          <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7">
            ${res.locale === "cs"
              ? `Dobrý den ${res.guestName},<br/><br/>bohužel vámi požadovaný termín (${res.checkIn} – ${res.checkOut}) pro apartmán <strong>${res.apartmentName}</strong> není k dispozici. Zkuste prosím jiný termín nebo nás kontaktujte.`
              : `Dear ${res.guestName},<br/><br/>unfortunately the dates you requested (${res.checkIn} – ${res.checkOut}) for <strong>${res.apartmentName}</strong> are not available. Please try different dates or contact us directly.`
            }
          </p>
          <p style="font-family:sans-serif;font-size:0.8rem;color:#5e975e;margin-top:2rem">Bouda Krista · Rokytnice nad Jizerou</p>
        </div>`,
    });

    return new NextResponse(html("Rezervace odmítnuta", `Poptávka od <strong>${res.guestName}</strong> byla odmítnuta a host byl informován e-mailem.`), { headers: { "Content-Type": "text/html" } });
  }

  // ── Approve path ──────────────────────────────────────────────────────
  const baseUrl     = process.env.NEXT_PUBLIC_URL ?? "https://www.bouda-krista.cz";
  const orderNumber = `BK-${id}`;

  // Recalculate price from source of truth
  const { total, nights } = calculateTotal(new Date(res.checkIn), new Date(res.checkOut), res.apartment);

  console.log("GoPay env check — GO_ID:", process.env.GOPAY_GO_ID, "CLIENT_ID:", process.env.GOPAY_CLIENT_ID, "SANDBOX:", process.env.GOPAY_SANDBOX);

  let payment: { id: number; gw_url: string };
  try {
    payment = await createPayment({
      amountCzk:        total,
      orderNumber,
      orderDescription: `Bouda Krista · ${res.apartmentName} · ${res.checkIn} – ${res.checkOut} · ${nights} nocí`,
      guestName:        res.guestName,
      guestEmail:       res.guestEmail,
      returnUrl:        `${baseUrl}/${res.locale}/book/success?order=${orderNumber}`,
      notifyUrl:        `${baseUrl}/api/gopay-notify`,
      items: [{ name: `${res.apartmentName} – ${nights} nocí`, amount: Math.round(total / nights), count: nights }],
    });
  } catch (err) {
    console.error("GoPay createPayment failed:", err);
    return new NextResponse(html("Chyba platební brány", "Nepodařilo se vytvořit platební odkaz. Zkuste to prosím znovu.", "#a00"), { status: 500, headers: { "Content-Type": "text/html" } });
  }

  // Persist approved status + order mapping
  await Promise.all([
    redis.set(`reservation:${id}`, JSON.stringify({ ...res, status: "approved", orderNumber, gopayId: payment.id }), "EX", 30 * 24 * 60 * 60),
    redis.set(`gopay-order:${orderNumber}`, id, "EX", 30 * 24 * 60 * 60),
  ]);

  const totalFormatted = total.toLocaleString("cs-CZ");
  const isCz           = res.locale === "cs";

  // Email guest with payment link
  await resend.emails.send({
    from:    "Bouda Krista <rezervace@bouda-krista.cz>",
    to:      res.guestEmail,
    replyTo: "chaloupka.krista@gmail.com",
    subject: isCz ? "Vaše rezervace je schválena — zaplaťte online" : "Your reservation is approved — pay online",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
        <h1 style="font-size:1.8rem;margin-bottom:0.5rem">${isCz ? "Rezervace schválena" : "Reservation approved"}</h1>
        <p style="color:#5e975e;font-family:sans-serif;font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase">
          Bouda Krista · Rokytnice nad Jizerou
        </p>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <table style="width:100%;font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
          <tr><td style="color:#5e975e;padding:6px 0;width:160px">${isCz ? "Apartmán" : "Apartment"}</td><td>${res.apartmentName}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Příjezd" : "Check-in"}</td><td>${res.checkIn}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Odjezd" : "Check-out"}</td><td>${res.checkOut}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Nocí" : "Nights"}</td><td>${nights}</td></tr>
          <tr><td style="color:#5e975e;padding:6px 0">${isCz ? "Celkem k úhradě" : "Total to pay"}</td><td><strong>${totalFormatted} Kč</strong></td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7">
          ${isCz
            ? `Dobrý den ${res.guestName},<br/><br/>vaši rezervaci jsme schválili. Pro dokončení rezervace prosím zaplaťte online kliknutím na tlačítko níže.`
            : `Dear ${res.guestName},<br/><br/>we have approved your reservation. To complete your booking, please pay online by clicking the button below.`
          }
        </p>
        <div style="margin:2rem 0">
          <a href="${payment.gw_url}" style="display:inline-block;background:#1a311a;color:#f5f0e8;font-family:sans-serif;font-size:1rem;padding:14px 32px;text-decoration:none;font-weight:600;letter-spacing:0.05em">
            ${isCz ? "Zaplatit online →" : "Pay online →"}
          </a>
        </div>
        <p style="font-family:sans-serif;font-size:0.8rem;color:#999;line-height:1.6">
          ${isCz
            ? "Platební odkaz je platný 7 dní. Pokud máte otázky, odpovězte na tento e-mail."
            : "The payment link is valid for 7 days. If you have any questions, reply to this email."
          }
        </p>
        <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
        <p style="font-family:sans-serif;font-size:0.8rem;color:#5e975e">Bouda Krista · Rokytnice nad Jizerou · Krkonoše</p>
      </div>`,
  });

  return new NextResponse(
    html("Rezervace schválena ✓", `Platební odkaz byl odeslán na <strong>${res.guestEmail}</strong>.<br/><br/>Celková částka: <strong>${totalFormatted} Kč</strong>.`),
    { headers: { "Content-Type": "text/html" } },
  );
}
