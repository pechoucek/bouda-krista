import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/bookings";

export type GuestRecord = {
  id: string;
  submittedAt: string;
  apartment: string;
  checkIn: string;
  checkOut: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  documentNumber: string;
  address: string;
  nights: number;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { apartment, checkIn, checkOut, guests } = body;

  if (!checkIn || !checkOut || !Array.isArray(guests) || guests.length === 0) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }

  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  );

  const redis = await getRedis();
  const submittedAt = new Date().toISOString();

  for (const g of guests) {
    const { firstName, lastName, birthDate, nationality, documentNumber, address } = g;
    if (!firstName || !lastName || !birthDate || !documentNumber || !address) continue;

    const record: GuestRecord = {
      id: crypto.randomUUID(),
      submittedAt,
      apartment: apartment ?? "",
      checkIn,
      checkOut,
      nights,
      firstName,
      lastName,
      birthDate,
      nationality: nationality ?? "",
      documentNumber,
      address,
    };

    await redis.lpush("guests", JSON.stringify(record));
  }

  return NextResponse.json({ ok: true });
}
