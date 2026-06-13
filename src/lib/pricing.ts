import pricingData from "@/data/pricing.json";
import { eachDayOfInterval, parseISO, isWithinInterval } from "date-fns";

type SpecialPeriod = {
  name: string;
  from: string;
  to: string;
  multiplier: number;
};

type Apartment = {
  id: string;
  name: string;
  guests: string;
  defaultNightlyRate: number;
};

export const apartments: Apartment[] = pricingData.apartments;

export function getApartment(id: string): Apartment {
  return apartments.find((a) => a.id === id) ?? apartments[3];
}

export function getNightlyRate(date: Date, apartmentId: string): number {
  const apt = getApartment(apartmentId);
  const special = pricingData.specialPeriods.find((period: SpecialPeriod) =>
    isWithinInterval(date, {
      start: parseISO(period.from),
      end:   parseISO(period.to),
    })
  );
  return special
    ? Math.round(apt.defaultNightlyRate * special.multiplier)
    : apt.defaultNightlyRate;
}

export function calculateTotal(
  checkIn: Date,
  checkOut: Date,
  apartmentId: string
): { total: number; nights: number; nightlyRate: number } {
  const days = eachDayOfInterval({
    start: checkIn,
    end:   new Date(checkOut.getTime() - 86400000),
  });

  const rates = days.map((day) => getNightlyRate(day, apartmentId));
  const total = rates.reduce((sum, r) => sum + r, 0);
  const nights = days.length;
  // representative rate (first night, shown in UI)
  const nightlyRate = rates[0] ?? getApartment(apartmentId).defaultNightlyRate;

  return { total, nights, nightlyRate };
}
