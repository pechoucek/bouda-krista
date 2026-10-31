import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/bookings";

const REDIS_KEY = "config:prices";

export type SeasonPrices = {
  base: number;    // per night weekday
  weekend: number; // per night Fri+Sat
  week: number;    // total for 7-night stay
};

export type PriceConfig = {
  winter:    SeasonPrices; // 1. 12. – 1. 4.
  summer:    SeasonPrices; // 1. 7. – 1. 9.
  offseason: SeasonPrices; // zbytek roku
  christmas: number;       // 21. 12. – 28. 12. (za noc)
  newyear:   number;       // 28. 12. – 2. 1.   (za noc)
  easter:    number;       // Velký pátek – Pondělí velikonoční (za noc)
};

export const DEFAULT_PRICES: PriceConfig = {
  winter:    { base: 10000, weekend: 12000, week: 65000 },
  summer:    { base: 10000, weekend: 12000, week: 65000 },
  offseason: { base: 10000, weekend: 11000, week: 60000 },
  christmas: 15000,
  newyear:   15000,
  easter:    12000,
};

function auth(req: NextRequest) {
  return req.nextUrl.searchParams.get("secret") === process.env.ADMIN_SECRET;
}

export async function GET() {
  try {
    const redis = getRedis();
    const raw = await redis.get(REDIS_KEY);
    const stored = raw ? JSON.parse(raw) : {};
    // merge with defaults so new fields always present
    return NextResponse.json({ ...DEFAULT_PRICES, ...stored });
  } catch {
    return NextResponse.json(DEFAULT_PRICES);
  }
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: PriceConfig = await req.json();
  const redis = getRedis();
  await redis.set(REDIS_KEY, JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
