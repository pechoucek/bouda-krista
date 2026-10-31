import { NextRequest, NextResponse } from "next/server";
import { calculateTotal } from "@/lib/pricing";
import { getRedis } from "@/lib/bookings";

type SeasonPrices = { base: number; weekend: number; week: number; minNights: number };
type SpecialPeriod = { price: number; minNights: number };
type PriceConfig = {
  winter: SeasonPrices;
  summer: SeasonPrices;
  offseason: SeasonPrices;
  christmas: SpecialPeriod;
  newyear: SpecialPeriod;
  easter: SpecialPeriod;
};

const DEFAULT: PriceConfig = {
  winter:    { base: 10000, weekend: 12000, week: 65000, minNights: 2 },
  summer:    { base: 10000, weekend: 12000, week: 65000, minNights: 2 },
  offseason: { base: 10000, weekend: 11000, week: 60000, minNights: 2 },
  christmas: { price: 15000, minNights: 5 },
  newyear:   { price: 15000, minNights: 4 },
  easter:    { price: 12000, minNights: 3 },
};

async function getPriceConfig(): Promise<PriceConfig> {
  try {
    const redis = getRedis();
    const raw = await redis.get("config:prices");
    if (!raw) return DEFAULT;
    const stored = JSON.parse(raw);
    return { ...DEFAULT, ...stored };
  } catch {
    return DEFAULT;
  }
}

function getEasterSunday(year: number): Date {
  // Anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function getDynamicMinNights(checkIn: Date, config: PriceConfig): number {
  const m = checkIn.getMonth(); // 0-indexed
  const d = checkIn.getDate();
  const yr = checkIn.getFullYear();

  // Christmas: Dec 21–27
  if (m === 11 && d >= 21 && d <= 27) return config.christmas.minNights;

  // New Year: Dec 28 – Jan 1
  if ((m === 11 && d >= 28) || (m === 0 && d <= 1)) return config.newyear.minNights;

  // Easter: Good Friday (Easter Sunday - 2) through Easter Monday (Easter Sunday + 1)
  const easter = getEasterSunday(yr);
  const goodFriday = new Date(easter); goodFriday.setDate(easter.getDate() - 2);
  const easterMon  = new Date(easter); easterMon.setDate(easter.getDate() + 1);
  if (checkIn >= goodFriday && checkIn <= easterMon) return config.easter.minNights;

  // Winter: Dec 1 – Mar 31
  if ((m === 11 && d >= 1) || m <= 2) return config.winter.minNights;

  // Summer: Jul 1 – Aug 31
  if (m === 6 || m === 7) return config.summer.minNights;

  // Off-season
  return config.offseason.minNights;
}

function getSeason(checkIn: Date, config: PriceConfig): "christmas" | "newyear" | "easter" | "winter" | "summer" | "offseason" {
  const m = checkIn.getMonth();
  const d = checkIn.getDate();
  const yr = checkIn.getFullYear();
  if (m === 11 && d >= 21 && d <= 27) return "christmas";
  if ((m === 11 && d >= 28) || (m === 0 && d <= 1)) return "newyear";
  const easter = getEasterSunday(yr);
  const goodFriday = new Date(easter); goodFriday.setDate(easter.getDate() - 2);
  const easterMon  = new Date(easter); easterMon.setDate(easter.getDate() + 1);
  if (checkIn >= goodFriday && checkIn <= easterMon) return "easter";
  if ((m === 11 && d >= 1) || m <= 2) return "winter";
  if (m === 6 || m === 7) return "summer";
  return "offseason";
}

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, apartment } = await req.json();

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing dates" }, { status: 400 });
  }

  const aptId = apartment ?? "whole";
  const [result, config] = await Promise.all([
    Promise.resolve(calculateTotal(new Date(checkIn), new Date(checkOut), aptId)),
    getPriceConfig(),
  ]);

  const minNights = getDynamicMinNights(new Date(checkIn), config);
  const season = getSeason(new Date(checkIn), config);

  // Apply weekly pricing from admin config when exactly 7 nights and season has a weekly rate
  let finalResult = result;
  if (result.nights === 7 && (season === "winter" || season === "summer" || season === "offseason")) {
    const weekTotal = config[season].week;
    finalResult = {
      ...result,
      total: weekTotal,
      nightlyRate: Math.round(weekTotal / 7),
      rateBreakdown: undefined,
    };
  }

  return NextResponse.json({ ...finalResult, minNights });
}
