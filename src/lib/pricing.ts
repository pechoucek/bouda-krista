import pricingData from "@/data/pricing.json";
import { eachDayOfInterval, parseISO, isWithinInterval } from "date-fns";

type SpecialPeriod = {
  name: string;
  from: string;
  to: string;
  multiplier?: number;
  absoluteRate?: number;
  apartmentId?: string;
  minNights?: number;
};

type StayDiscount = {
  name: string;
  apartmentId: string;
  from: string;
  to: string;
  minNights: number;
  fixedNightlyRate: number;
};

type Apartment = {
  id: string;
  name: string;
  guests: string;
  defaultNightlyRate: number;
  discountFrom?: number;
};

export const apartments: Apartment[] = pricingData.apartments;

export function getApartment(id: string): Apartment {
  return apartments.find((a) => a.id === id) ?? apartments[3];
}

export function getNightlyRate(date: Date, apartmentId: string): number {
  const apt = getApartment(apartmentId);
  const special = (pricingData.specialPeriods as SpecialPeriod[]).find((period) => {
    if (period.apartmentId && period.apartmentId !== apartmentId) return false;
    return isWithinInterval(date, { start: parseISO(period.from), end: parseISO(period.to) });
  });
  if (!special) return apt.defaultNightlyRate;
  if (special.absoluteRate !== undefined) return special.absoluteRate;
  return Math.round(apt.defaultNightlyRate * (special.multiplier ?? 1));
}

export function getPeriodMinNights(checkIn: Date, apartmentId: string): number {
  const period = (pricingData.specialPeriods as SpecialPeriod[]).find((p) => {
    if (p.apartmentId && p.apartmentId !== apartmentId) return false;
    if (!p.minNights) return false;
    return isWithinInterval(checkIn, { start: parseISO(p.from), end: parseISO(p.to) });
  });
  return period?.minNights ?? 2;
}

export function calculateTotal(
  checkIn: Date,
  checkOut: Date,
  apartmentId: string
): { total: number; nights: number; nightlyRate: number; discountName?: string } {
  const days = eachDayOfInterval({
    start: checkIn,
    end:   new Date(checkOut.getTime() - 86400000),
  });

  const nights = days.length;

  // Check if a stay discount applies to the entire stay
  const stayDiscount = (pricingData.stayDiscounts as StayDiscount[]).find((d) => {
    if (d.apartmentId !== apartmentId) return false;
    if (nights < d.minNights) return false;
    // Check-in must fall within the discount window
    return isWithinInterval(checkIn, {
      start: parseISO(d.from),
      end:   parseISO(d.to),
    });
  });

  if (stayDiscount) {
    const total = stayDiscount.fixedNightlyRate * nights;
    return { total, nights, nightlyRate: stayDiscount.fixedNightlyRate, discountName: stayDiscount.name };
  }

  const rates = days.map((day) => getNightlyRate(day, apartmentId));
  const total = rates.reduce((sum, r) => sum + r, 0);
  const nightlyRate = rates[0] ?? getApartment(apartmentId).defaultNightlyRate;

  return { total, nights, nightlyRate };
}
