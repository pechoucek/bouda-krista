import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getRedis } from "@/lib/bookings";
import { StoredReservation, buildSpayd, verifyToken } from "@/lib/payment-email";

// Serves the QR payment code (PNG) that is shown inside the payment email.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!id || !verifyToken(id, token)) return new NextResponse("Not found", { status: 404 });

  const raw = await getRedis().get(`reservation:${id}`);
  if (!raw) return new NextResponse("Not found", { status: 404 });

  const spayd = buildSpayd(JSON.parse(raw) as StoredReservation);
  if (!spayd) return new NextResponse("Not found", { status: 404 });

  const png = await QRCode.toBuffer(spayd, { type: "png", width: 360, margin: 2, errorCorrectionLevel: "M" });
  return new NextResponse(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=3600" },
  });
}
