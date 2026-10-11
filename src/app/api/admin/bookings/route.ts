import { NextRequest, NextResponse } from "next/server";
import { getAllBookings, saveBooking, deleteBookingById } from "@/lib/bookings";
import { apartments } from "@/lib/pricing";
import crypto from "crypto";

function auth(req: NextRequest) {
  return req.nextUrl.searchParams.get("secret") === process.env.ADMIN_SECRET;
}

// GET — list all bookings
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bookings = await getAllBookings();
  return NextResponse.json(bookings);
}

// POST — add a block
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { apartment, checkIn, checkOut, guestName, guestEmail } = await req.json();
  if (!apartment || !checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const apt = apartments.find((a) => a.id === apartment);
  await saveBooking({
    id: crypto.randomUUID(),
    apartment,
    apartmentName: apt?.name ?? apartment,
    checkIn,
    checkOut,
    guestName:  guestName  || "Blokace",
    guestEmail: guestEmail || "",
    totalCzk:   0,
    createdAt:  new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}

// DELETE — remove a booking by id
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, apartment } = await req.json();
  if (!id || !apartment) return NextResponse.json({ error: "Missing id or apartment" }, { status: 400 });
  const deleted = await deleteBookingById(apartment, id);
  return NextResponse.json({ ok: deleted });
}
