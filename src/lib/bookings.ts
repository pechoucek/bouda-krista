/**
 * Booking storage using Vercel KV (Redis).
 * Each booking is stored as: bookings:{apartment} → array of Booking objects
 */
import { kv } from "@vercel/kv";

export type Booking = {
  id: string;
  apartment: string;      // tiny | timber | topfloor | whole
  apartmentName: string;
  checkIn: string;        // YYYY-MM-DD
  checkOut: string;       // YYYY-MM-DD
  guestName: string;
  guestEmail: string;
  totalCzk: number;
  createdAt: string;      // ISO timestamp
};

const KEY = (apartment: string) => `bookings:${apartment}`;

export async function saveBooking(booking: Booking): Promise<void> {
  // Save to apartment-specific list
  await kv.lpush(KEY(booking.apartment), JSON.stringify(booking));

  // If it's an apartment (not whole house), also block the whole house calendar
  if (booking.apartment !== "whole") {
    const wholeBooking: Booking = {
      ...booking,
      id: `${booking.id}-whole`,
      apartment: "whole",
      apartmentName: `Whole House (${booking.apartmentName} booked)`,
    };
    await kv.lpush(KEY("whole"), JSON.stringify(wholeBooking));
  }

  // If whole house is booked, block all apartments
  if (booking.apartment === "whole") {
    for (const apt of ["tiny", "timber", "topfloor"]) {
      const aptBooking: Booking = {
        ...booking,
        id: `${booking.id}-${apt}`,
        apartment: apt,
        apartmentName: `${apt} (Whole House booked)`,
      };
      await kv.lpush(KEY(apt), JSON.stringify(aptBooking));
    }
  }
}

export async function getBookings(apartment: string): Promise<Booking[]> {
  try {
    const raw = await kv.lrange(KEY(apartment), 0, -1);
    return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r) as Booking);
  } catch {
    return [];
  }
}
