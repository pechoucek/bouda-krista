import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { appendRows } from "@/lib/google-sheets";
import { MAX_GUESTS, RATE_CZK, VARIABLE_SYMBOL, buildTaxSpayd, isValidKey } from "@/lib/guestbook";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !isValidKey(body.key)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { arrival, departure, guests, payment } = body;
  if (!DATE.test(arrival) || !DATE.test(departure) || !["cash", "transfer"].includes(payment)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const nights = Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000);
  if (!Number.isFinite(nights) || nights < 1 || nights > 365) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }
  if (!Array.isArray(guests) || guests.length < 1 || guests.length > MAX_GUESTS) {
    return NextResponse.json({ error: "Invalid number of guests" }, { status: 400 });
  }

  const list = guests.map((g: Record<string, unknown>) => ({
    fn: clean(g.fn), ln: clean(g.ln), bd: clean(g.bd, 10), na: clean(g.na),
    ad: clean(g.ad, 300), id: clean(g.id), vi: clean(g.vi), pu: clean(g.pu),
  }));
  if (list.some((g) => !g.fn || !g.ln || !DATE.test(g.bd) || !g.na || !g.ad || !g.id)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // The amount is always calculated here, never taken from the browser
  const amount = list.length * nights * RATE_CZK;
  const sentAt = new Date().toISOString();

  try {
    await appendRows(
      list.map((g, i) => [
        sentAt, arrival, departure, nights, i + 1,
        g.fn, g.ln, g.bd, g.na, g.ad, g.id, g.vi, g.pu,
        payment === "cash" ? "hotově" : "převodem", amount,
      ])
    );
  } catch (err) {
    console.error("Guestbook: saving to Google Sheets failed:", err);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }

  let qrSvg: string | null = null;
  if (payment === "transfer") {
    const spayd = buildTaxSpayd(amount);
    if (spayd) qrSvg = await QRCode.toString(spayd, { type: "svg", margin: 1 });
  }

  return NextResponse.json({ ok: true, amount, nights, persons: list.length, vs: VARIABLE_SYMBOL, qrSvg });
}
