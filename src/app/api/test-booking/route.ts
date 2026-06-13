/**
 * TEST ONLY — remove before going live!
 * GET /api/test-booking?apartment=timber&checkIn=2026-06-16&checkOut=2026-06-18
 * GET /api/test-booking?clear=true&apartment=timber   ← wipes all bookings for that apartment
 */
import { NextRequest, NextResponse } from "next/server";
import { saveBooking, clearBookings } from "@/lib/bookings";

export async function GET(req: NextRequest) {
  const apartment  = req.nextUrl.searchParams.get("apartment")  ?? "timber";
  const shouldClear = req.nextUrl.searchParams.get("clear") === "true";

  const aptNames: Record<string, string> = {
    tiny:     "Tiny Apartment",
    timber:   "Timber Apartment",
    topfloor: "Top Floor Apartment",
    whole:    "Whole House",
  };

  if (shouldClear) {
    // Clear all apartment keys to wipe any cross-blocked leftovers
    await Promise.all(
      ["tiny", "timber", "topfloor", "whole"].map((apt) => clearBookings(apt))
    );
    return NextResponse.json({ ok: true, message: "Cleared all bookings for all apartments" });
  }

  const checkIn  = req.nextUrl.searchParams.get("checkIn")  ?? "2026-06-16";
  const checkOut = req.nextUrl.searchParams.get("checkOut") ?? "2026-06-18";

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
