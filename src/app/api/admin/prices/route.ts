import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/bookings";

const REDIS_KEY = "config:prices";

export type SeasonPrices = {
  base: number;      // per night weekday
  weekend: number;   // per night Fri+Sat
  week: number;      // total for 7-night stay
  minNights: number;
};

export type PriceConfig = {
  winter:    SeasonPrices; // 1. 12. – 1. 4.
  summer:    SeasonPrices; // 1. 7. – 1. 9.
  offseason: SeasonPrices; // zbytek roku
  christmas: { price: number; minNights: number }; // 21. 12. – 28. 12.
  newyear:   { price: number; minNights: number }; // 28. 12. – 2. 1.
  easter:    { price: number; minNights: number }; // Velký pá – Pondělí
};

const DEFAULT: PriceConfig = {
  winter:    { base: 10000, weekend: 12000, week: 65000, minNights: 2 },
  summer:    { base: 10000, weekend: 12000, week: 65000, minNights: 2 },
  offseason: { base: 10000, weekend: 11000, week: 60000, minNights: 2 },
  christmas: { price: 15000, minNights: 5 },
  newyear:   { price: 15000, minNights: 4 },
  easter:    { price: 12000, minNights: 3 },
};

function auth(req: NextRequest) {
  return req.nextUrl.searchParams.get("secret") === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const redis = getRedis();
    const raw = await redis.get(REDIS_KEY);
    const stored = raw ? JSON.parse(raw) : {};
    return NextResponse.json(deepMerge(DEFAULT, stored));
  } catch {
    return NextResponse.json(DEFAULT);
  }
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: PriceConfig = await req.json();
  const redis = getRedis();
  await redis.set(REDIS_KEY, JSON.stringify(body));
  return NextResponse.json({ ok: true });
}

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (override[key] && typeof override[key] === "object" && !Array.isArray(override[key])) {
      result[key] = deepMerge(
        (base[key] as Record<string, unknown>) ?? {},
        override[key] as Record<string, unknown>
      );
    } else {
      result[key] = override[key];
    }
  }
  return result;
}
