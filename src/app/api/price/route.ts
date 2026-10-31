import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/bookings";
import { eachDayOfInterval } from "date-fns";

type SeasonPrices = { base: number; weekend: number; week: number; minNights: number };
type SpecialPeriod = { price: number; minNights: number };
type PriceConfig = {
  winter:    SeasonPrices;
  summer:    SeasonPrices;
  offseason: SeasonPrices;
  christmas: SpecialPeriod;
  newyear:   SpecialPeriod;
  easter:    SpecialPeriod;
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
    return {
      winter:    { ...DEFAULT.winter,    ...stored.winter },
      summer:    { ...DEFAULT.summer,    ...stored.summer },
      offseason: { ...DEFAULT.offseason, ...stored.offseason },
      christmas: { ...DEFAULT.christmas, ...stored.christmas },
      newyear:   { ...DEFAULT.newyear,   ...stored.newyear },
      easter:    { ...DEFAULT.easter,    ...stored.easter },
    };
  } catch {
    return DEFAULT;
  }
}

function getEasterSunday(year: number): Date {
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

type Season = "christmas" | "newyear" | "easter" | "winter" | "summer" | "offseason";

function getSeason(date: Date): Season {
  const m = date.getMonth(); // 0-indexed
  const d = date.getDate();
  const yr = date.getFullYear();

  if (m === 11 && d >= 21 && d <= 27) return "christmas";
  if ((m === 11 && d >= 28) || (m === 0 && d <= 1)) return "newyear";

  const easter = getEasterSunday(yr);
  const goodFriday = new Date(easter); goodFriday.setDate(easter.getDate() - 2);
  const easterMon  = new Date(easter); easterMon.setDate(easter.getDate() + 1);
  if (date >= goodFriday && date <= easterMon) return "easter";

  // Winter: Dec 1 – Mar 31
  if ((m === 11 && d >= 1) || m <= 2) return "winter";
  // Summer: Jul 1 – Aug 31
  if (m === 6 || m === 7) return "summer";

  return "offseason";
}

function isWeekend(date: Date): boolean {
  const dow = date.getDay(); // 0=Sun, 5=Fri, 6=Sat
  return dow === 5 || dow === 6;
}

function getNightlyRate(date: Date, config: PriceConfig): number {
  const season = getSeason(date);
  if (season === "christmas") return config.christmas.price;
  if (season === "newyear")   return config.newyear.price;
  if (season === "easter")    return config.easter.price;
  const s = config[season];
  return isWeekend(date) ? s.weekend : s.base;
}

function getMinNights(checkIn: Date, config: PriceConfig): number {
  const season = getSeason(checkIn);
  if (season === "christmas") return config.christmas.minNights;
  if (season === "newyear")   return config.newyear.minNights;
  if (season === "easter")    return config.easter.minNights;
  return config[season].minNights;
}

export async function POST(req: NextRequest) {
  const { checkIn, checkOut } = await req.json();

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing dates" }, { status: 400 });
  }

  const checkInDate  = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const config = await getPriceConfig();
  const minNights = getMinNights(checkInDate, config);

  const days = eachDayOfInterval({
    start: checkInDate,
    end:   new Date(checkOutDate.getTime() - 86400000),
  });
  const nights = days.length;

  // Weekly rate: exactly 7 nights in a regular season
  const checkInSeason = getSeason(checkInDate);
  if (nights === 7 && (checkInSeason === "winter" || checkInSeason === "summer" || checkInSeason === "offseason")) {
    const weekTotal = config[checkInSeason].week;
    return NextResponse.json({
      total:      weekTotal,
      nights:     7,
      nightlyRate: Math.round(weekTotal / 7),
      minNights,
    });
  }

  const rates = days.map((day) => getNightlyRate(day, config));
  const total = rates.reduce((sum, r) => sum + r, 0);
  const nightlyRate = rates[0] ?? config.offseason.base;

  return NextResponse.json({ total, nights, nightlyRate, minNights });
}
