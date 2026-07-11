import { NextRequest, NextResponse } from "next/server";
import { saveBooking } from "@/lib/bookings";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { apartment, apartmentName, checkIn, checkOut, guestName, guestEmail } = await req.json();

  await saveBooking({
    id: crypto.randomUUID(),
    apartment,
    apartmentName,
    checkIn,
    checkOut,
    guestName,
    guestEmail,
    totalCzk: 0,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
