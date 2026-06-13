import { NextRequest, NextResponse } from "next/server";
import ical from "node-ical";

export const revalidate = 3600;

const ICAL_URLS: Record<string, string | undefined> = {
  tiny:     process.env.AIRBNB_ICAL_TINY,
  timber:   process.env.AIRBNB_ICAL_TIMBER,
  topfloor: process.env.AIRBNB_ICAL_TOPFLOOR,
  whole:    process.env.AIRBNB_ICAL_WHOLE,
};

export async function GET(req: NextRequest) {
  const apartment = req.nextUrl.searchParams.get("apartment") ?? "whole";
  const icalUrl = ICAL_URLS[apartment] ?? ICAL_URLS["whole"];

  if (!icalUrl) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const data = await ical.fromURL(icalUrl);
    const blocked: { start: string; end: string }[] = [];

    for (const event of Object.values(data)) {
      if (event.type !== "VEVENT") continue;
      if (!event.start || !event.end) continue;
      blocked.push({
        start: new Date(event.start).toISOString(),
        end:   new Date(event.end).toISOString(),
      });
    }

    return NextResponse.json(blocked, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
