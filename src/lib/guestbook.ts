import { createHash, timingSafeEqual } from "crypto";
import { czechAccountToIban } from "@/lib/payment-email";

export const MAX_GUESTS = 12;
export const RATE_CZK = 25;            // stay fee per person per night
export const VARIABLE_SYMBOL = "1215225";

// TODO: enter the account that receives the stay fee, e.g. "123456789/0800" or "19-2000145399/0800"
export const TAX_ACCOUNT = "166642003/5500";

// The secret link is /cs/domovni-kniha/<GUESTBOOK_KEY>
export function isValidKey(key: unknown): boolean {
  const secret = process.env.GUESTBOOK_KEY;
  if (!secret || typeof key !== "string") return false;
  const a = createHash("sha256").update(key).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b);
}

// Text inside the QR code ("QR platba"); null if the account is not set up yet
export function buildTaxSpayd(amountCzk: number): string | null {
  const iban = czechAccountToIban(TAX_ACCOUNT);
  if (!iban || amountCzk <= 0) return null;
  return `SPD*1.0*ACC:${iban}*AM:${amountCzk.toFixed(2)}*CC:CZK*X-VS:${VARIABLE_SYMBOL}*MSG:POPLATEK Z POBYTU`;
}
