/**
 * TEST ONLY — remove before going live!
 * Creates a fake booking in Redis so you can verify the iCal export works.
 * Usage: GET /api/test-booking?apartment=timber&checkIn=2026-06-20&checkOut=2026-06-23
 */
import { NextRequest, NextResponse } from "next/server";
import { saveBooking } from "@/lib/bookings";

export async function GET(req: NextRequest) {
  const apartment  = req.nextUrl.searchParams.get("apartment")  ?? "timber";
  const checkIn    = req.nextUrl.searchParams.get("checkIn")    ?? "2026-06-20";
  const checkOut   = req.nextUrl.searchParams.get("checkOut")   ?? "2026-06-23";

  const aptNames: Record<string, string> = {
    tiny:     "Tiny Apartment",
    timber:   "Timber Apartment",
    topfloor: "Top Floor Apartment",
    whole:    "Whole House",
  };

  await saveBooking({
    id:            `test-${Date.now()}`,
    apartment,
    apartmentName: aptNames[apartment] ?? apartment,
    checkIn,
    checkOut,
    guestName:     "Test Guest",
    guestEmail:    "test@bouda-krista.cz",
    totalCzk:      6000,
    createdAt:     new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    message: `Test booking saved for ${apartment}: ${checkIn} – ${checkOut}`,
    icalUrl: `${process.env.NEXT_PUBLIC_URL}/api/ical/${apartment}`,
  });
}
