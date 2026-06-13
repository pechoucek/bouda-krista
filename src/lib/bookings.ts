/**
 * Booking storage using Redis (ioredis).
 * Each apartment has a list key: bookings:{apartment} → array of JSON strings
 */
import Redis from "ioredis";

// Reuse connection across serverless invocations
let client: Redis | null = null;

function getRedis(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL environment variable is not set");
    client = new Redis(url, { maxRetriesPerRequest: 3 });
  }
  return client;
}

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
  const redis = getRedis();

  // Save to apartment-specific list
  await redis.lpush(KEY(booking.apartment), JSON.stringify(booking));

  // If it's an apartment (not whole house), also block the whole house calendar
  if (booking.apartment !== "whole") {
    const wholeBooking: Booking = {
      ...booking,
      id: `${booking.id}-whole`,
      apartment: "whole",
      apartmentName: `Whole House (${booking.apartmentName} booked)`,
    };
    await redis.lpush(KEY("whole"), JSON.stringify(wholeBooking));
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
      await redis.lpush(KEY(apt), JSON.stringify(aptBooking));
    }
  }
}

export async function getBookings(apartment: string): Promise<Booking[]> {
  try {
    const redis = getRedis();
    const raw = await redis.lrange(KEY(apartment), 0, -1);
    return raw.map((r) => JSON.parse(r) as Booking);
  } catch {
    return [];
  }
}

export async function clearBookings(apartment: string): Promise<void> {
  const redis = getRedis();
  await redis.del(KEY(apartment));
  // Also clear cross-blocked keys
  if (apartment !== "whole") {
    await redis.del(KEY("whole"));
  } else {
    for (const apt of ["tiny", "timber", "topfloor"]) {
      await redis.del(KEY(apt));
    }
  }
}
