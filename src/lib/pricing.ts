import pricingData from "@/data/pricing.json";
import { eachDayOfInterval, parseISO, isWithinInterval } from "date-fns";

type SpecialPeriod = {
  name: string;
  from: string;
  to: string;
  nightlyRate: number;
};

export function getNightlyRate(date: Date): number {
  const special = pricingData.specialPeriods.find((period: SpecialPeriod) =>
    isWithinInterval(date, {
      start: parseISO(period.from),
      end: parseISO(period.to),
    })
  );
  return special ? special.nightlyRate : pricingData.defaultNightlyRate;
}

export function calculateTotal(checkIn: Date, checkOut: Date): {
  total: number;
  breakdown: { date: string; rate: number }[];
} {
  const days = eachDayOfInterval({ start: checkIn, end: new Date(checkOut.getTime() - 86400000) });

  const breakdown = days.map((day) => ({
    date: day.toISOString().split("T")[0],
    rate: getNightlyRate(day),
  }));

  const total = breakdown.reduce((sum, d) => sum + d.rate, 0);
  return { total, breakdown };
}
