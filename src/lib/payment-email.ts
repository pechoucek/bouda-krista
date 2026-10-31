import { createHmac, timingSafeEqual } from "crypto";

export const SITE_URL    = "https://www.bouda-krista.cz";
export const MAIL_FROM   = "Bouda Krista <rezervace@bouda-krista.cz>";
export const OWNER_EMAIL = "chaloupka.krista@gmail.com";

// TODO: put your real bank account number here (only once, used in the payment email)
export const BANK_ACCOUNT = "166642003/5500";

// What reservation-request/route.ts stores in Redis under `reservation:<id>`
export type StoredReservation = {
  id: string;
  checkIn: string;
  checkOut: string;
  apartmentName?: string;
  guestName?: string;
  guestEmail: string;
  nights?: number | string;
  total?: number | string;
  locale?: string;
};

// ── Private link token ────────────────────────────────────────────────────
export function signToken(id: string): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not set");
  return createHmac("sha256", secret).update(`payment-mail:${id}`).digest("hex");
}

export function verifyToken(id: string, token: string): boolean {
  try {
    const expected = Buffer.from(signToken(id), "hex");
    const given = Buffer.from(token, "hex");
    return expected.length === given.length && timingSafeEqual(expected, given);
  } catch {
    return false;
  }
}

// ── Small helpers ─────────────────────────────────────────────────────────
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${Number(m[3])}. ${Number(m[2])}. ${m[1]}` : iso;
}

function nightsCz(n: number): string {
  if (n === 1) return "1 noc";
  if (n >= 2 && n <= 4) return `${n} noci`;
  return `${n} nocí`;
}

// ── QR platba (Czech QR payment standard, "SPAYD") ────────────────────────
// "19-2000145399/0800" or "2000145399/0800" -> IBAN, or null if the format is wrong
export function czechAccountToIban(account: string): string | null {
  const m = /^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/.exec(account.replace(/\s/g, ""));
  if (!m) return null;
  const bban = m[3] + (m[1] ?? "").padStart(6, "0") + m[2].padStart(10, "0");
  let rem = 0;
  for (const ch of bban + "123500") rem = (rem * 10 + Number(ch)) % 97; // "CZ00" -> 123500
  return `CZ${String(98 - rem).padStart(2, "0")}${bban}`;
}

function plain(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 .,:/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

// The text inside the QR code. Returns null if the account or price is not usable.
export function buildSpayd(r: StoredReservation): string | null {
  const iban = czechAccountToIban(BANK_ACCOUNT);
  const amount = Number(String(r.total ?? "").replace(/\s/g, ""));
  if (!iban || !Number.isFinite(amount) || amount <= 0) return null;
  const d = (iso: string) => fmtDate(iso).replace(/\s/g, "");
  const msg = plain(`Bouda Krista ${d(r.checkIn)}-${d(r.checkOut)}`);
  return `SPD*1.0*ACC:${iban}*AM:${amount.toFixed(2)}*CC:CZK*MSG:${msg}`;
}

// ── The email that is sent when the owner presses the button ──────────────
export function buildPaymentEmail(
  r: StoredReservation,
  opts?: { qrSrc?: string } // only used for local previews
): { subject: string; html: string } {
  const isCz = r.locale === "cs";
  const range = `${fmtDate(r.checkIn)} – ${fmtDate(r.checkOut)}`;

  const nightsNum = Number(r.nights);
  const nightsOk = Number.isFinite(nightsNum) && nightsNum > 0;
  const nightsTxt = !nightsOk
    ? String(r.nights ?? "")
    : isCz
      ? nightsCz(nightsNum)
      : nightsNum === 1 ? "1 night" : `${nightsNum} nights`;

  const totalNum = Number(String(r.total ?? "").replace(/\s/g, ""));
  const priceOk = Number.isFinite(totalNum) && totalNum > 0;
  const price = isCz
    ? priceOk ? `${totalNum.toLocaleString("cs-CZ")} Kč` : `${r.total} Kč`
    : priceOk ? `${totalNum.toLocaleString("en-GB")} CZK` : `${r.total} CZK`;

  const subject = isCz
    ? `Vaše rezervace — Bouda Krista, ${range}`
    : `Your reservation — Bouda Krista, ${range}`;

  // QR code image (served by /api/reservation/qr); left out if the account is not set up
  let qrSrc: string | null = null;
  if (opts?.qrSrc) {
    qrSrc = opts.qrSrc;
  } else if (buildSpayd(r)) {
    try {
      qrSrc = `${SITE_URL}/api/reservation/qr?id=${encodeURIComponent(r.id)}&token=${signToken(r.id)}`;
    } catch {
      qrSrc = null;
    }
  }
  const qrBlock = qrSrc
    ? `<p style="text-align:center;margin:0 0 1rem 0">
        <img src="${esc(qrSrc)}" width="180" height="180" alt="QR platba" style="display:inline-block;border:0"/><br/>
        <span style="font-family:sans-serif;font-size:0.8rem;color:#5e975e">${isCz ? "Naskenujte v bankovní aplikaci" : "Scan with your banking app"}</span>
      </p>`
    : "";

  const row = (label: string, value: string) =>
    `<tr><td style="color:#5e975e;padding:6px 0;width:160px;vertical-align:top">${label}</td><td>${value}</td></tr>`;

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a311a">
      <h1 style="font-size:1.8rem;line-height:1.25;margin-bottom:0.5rem">
        ${isCz ? "Platební údaje k Vaší rezervaci" : "Payment details for your reservation"}
      </h1>
      <p style="color:#5e975e;font-family:sans-serif;font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase">
        Bouda Krista · Rokytnice nad Jizerou
      </p>
      <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
      <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;color:#1a311a">
        ${isCz
          ? `Dobrý den,<br/><br/>děkujeme za Vaši rezervaci Boudy Kristy v termínu ${esc(range)} (${esc(nightsTxt)}). Pro její potvrzení prosíme o úhradu níže uvedené částky.`
          : `Hello,<br/><br/>thank you for your reservation at Bouda Krista for ${esc(range)} (${esc(nightsTxt)}). To confirm it, please pay the amount below.`}
      </p>
      <table style="width:100%;font-family:sans-serif;font-size:0.9rem;border-collapse:collapse;margin:0.5rem 0 1rem 0">
        ${row(isCz ? "Částka" : "Amount", `<strong>${esc(price)}</strong>`)}
        ${row(isCz ? "Číslo účtu" : "Account number", `<strong>${esc(BANK_ACCOUNT)}</strong>`)}
        ${row(
          isCz ? "Poznámka k platbě" : "Payment note",
          isCz
            ? `Vaše jméno a datum příjezdu (${esc(fmtDate(r.checkIn))})`
            : `Your name and arrival date (${esc(fmtDate(r.checkIn))})`
        )}
      </table>
      ${qrBlock}
      <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;color:#1a311a">
        ${isCz
          ? "Po přijetí platby Vám rezervaci potvrdíme. V případě jakýchkoli dotazů se nám neváhejte ozvat."
          : "Once we receive the payment, we will confirm your reservation. If you have any questions, please do not hesitate to contact us."}
      </p>
      <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;color:#1a311a;margin-top:1.5rem">
        ${isCz ? "S pozdravem" : "Kind regards"}<br/>Emma
      </p>
      <p style="font-family:sans-serif;font-size:0.85rem;line-height:1.7;color:#1a311a">
        <strong>Bouda Krista</strong><br/>
        <a href="https://www.bouda-krista.cz" style="color:#1a311a">www.bouda-krista.cz</a><br/>
        Tel.: <a href="tel:+420722425275" style="color:#1a311a">+420 722 425 275</a><br/>
        IG: <a href="https://www.instagram.com/bouda_krista" style="color:#1a311a">@bouda_krista</a>
      </p>
      <hr style="border:none;border-top:1px solid #c2dbc2;margin:1.5rem 0"/>
      <p style="font-family:sans-serif;font-size:0.8rem;color:#5e975e">
        Bouda Krista · Rokytnice nad Jizerou · Krkonoše
      </p>
    </div>
  `;

  return { subject, html };
}
