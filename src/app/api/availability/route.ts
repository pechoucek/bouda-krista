import { NextRequest, NextResponse } from "next/server";
import ical from "node-ical";
import { getBookings } from "@/lib/bookings";

export const revalidate = 0; // always fresh — bookings must show immediately

const ICAL_URLS: Record<string, string | undefined> = {
  tiny:     process.env.AIRBNB_ICAL_TINY,
  timber:   process.env.AIRBNB_ICAL_TIMBER,
  topfloor: process.env.AIRBNB_ICAL_TOPFLOOR,
  whole:    process.env.AIRBNB_ICAL_WHOLE,
};

export async function GET(req: NextRequest) {
  const apartment = req.nextUrl.searchParams.get("apartment") ?? "whole";
  const icalUrl   = ICAL_URLS[apartment] ?? ICAL_URLS["whole"];

  const blocked: { start: string; end: string }[] = [];

  // ── 1. Airbnb iCal ────────────────────────────────────────────────────
  if (icalUrl) {
    try {
      const data = await ical.fromURL(icalUrl);
      for (const event of Object.values(data)) {
        if (event.type !== "VEVENT") continue;
        if (!event.start || !event.end) continue;
        blocked.push({
          start: new Date(event.start).toISOString(),
          end:   new Date(event.end).toISOString(),
        });
      }
    } catch {
      // Airbnb unreachable — continue with local bookings
    }
  }

  // ── 2. Direct website bookings from Redis ─────────────────────────────
  try {
    const bookings = await getBookings(apartment);
    for (const b of bookings) {
      blocked.push({
        start: new Date(b.checkIn).toISOString(),
        end:   new Date(b.checkOut).toISOString(),
      });
    }
  } catch {
    // Redis unreachable — return Airbnb data only
  }

  return NextResponse.json(blocked, {
    headers: { "Cache-Control": "no-store" },
  });
}
