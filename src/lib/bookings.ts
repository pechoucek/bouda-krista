/**
 * Booking storage using Redis (ioredis).
 * Each apartment has its own list: bookings:{apartment} → JSON strings
 * Cross-blocking is handled at query time, not at write time.
 */
import Redis from "ioredis";

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
  createdAt: string;
};

const KEY = (apartment: string) => `bookings:${apartment}`;

const ALL_APARTMENTS = ["tiny", "timber", "topfloor", "whole"];

/** Save a booking only to its own apartment key — no cross-blocking in Redis. */
export async function saveBooking(booking: Booking): Promise<void> {
  const redis = getRedis();
  await redis.lpush(KEY(booking.apartment), JSON.stringify(booking));
}

/**
 * Get bookings for an apartment, including cross-block logic:
 * - Any individual apartment is also blocked when "whole" is booked.
 * - "whole" is blocked when any individual apartment is booked.
 */
export async function getBookings(apartment: string): Promise<Booking[]> {
  try {
    const redis = getRedis();

    if (apartment === "whole") {
      // Whole house is blocked if any apartment (including itself) has a booking
      const all = await Promise.all(
        ALL_APARTMENTS.map((apt) =>
          redis.lrange(KEY(apt), 0, -1).then((rows) =>
            rows.map((r) => JSON.parse(r) as Booking)
          )
        )
      );
      return all.flat();
    } else {
      // Individual apartment is blocked by its own bookings + any whole-house bookings
      const [own, whole] = await Promise.all([
        redis.lrange(KEY(apartment), 0, -1),
        redis.lrange(KEY("whole"), 0, -1),
      ]);
      return [
        ...own.map((r) => JSON.parse(r) as Booking),
        ...whole.map((r) => JSON.parse(r) as Booking),
      ];
    }
  } catch {
    return [];
  }
}

export async function clearBookings(apartment: string): Promise<void> {
  const redis = getRedis();
  await redis.del(KEY(apartment));
}
