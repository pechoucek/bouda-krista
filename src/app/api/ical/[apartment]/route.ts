import { NextRequest, NextResponse } from "next/server";
import { getDirectBookings } from "@/lib/bookings";

function formatDate(dateStr: string): string {
  // Convert YYYY-MM-DD → YYYYMMDD
  return dateStr.replace(/-/g, "");
}

function escapeText(text: string): string {
  return text.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

// "whole-only" is a special variant that contains ONLY explicit whole-house bookings
// (not cross-blocks from individual apartments). Import this into Airbnb's apartment
// listings so they get blocked only when the whole house is actually booked.
const VALID_APARTMENTS = ["tiny", "timber", "topfloor", "whole", "whole-only"];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ apartment: string }> }
) {
  const { apartment } = await params;

  if (!VALID_APARTMENTS.includes(apartment)) {
    return new NextResponse("Not found", { status: 404 });
  }

  // "whole-only" reads only explicit whole-house bookings (never cross-blocks)
  const redisKey = apartment === "whole-only" ? "whole" : apartment;
  const bookings = await getDirectBookings(redisKey);

  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z/, "Z");

  const aptLabel = {
    tiny:     "Tiny Apartment",
    timber:   "Timber Apartment",
    topfloor: "Top Floor Apartment",
    whole:    "Whole House",
  }[apartment] ?? apartment;

  const events = bookings
    .map((b) => {
      const uid = `${b.id}@bouda-krista.cz`;
      return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${formatDate(b.checkIn)}`,
        `DTEND;VALUE=DATE:${formatDate(b.checkOut)}`,
        `SUMMARY:${escapeText(`Bouda Krista – ${aptLabel} – ${b.guestName}`)}`,
        `DESCRIPTION:${escapeText(`Rezervace přes web. Host: ${b.guestName} <${b.guestEmail}>`)}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  const cal = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bouda Krista//Rezervační systém//CS",
    `X-WR-CALNAME:Bouda Krista – ${aptLabel}`,
    "X-WR-TIMEZONE:Europe/Prague",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(cal, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="bouda-krista-${apartment}.ics"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
