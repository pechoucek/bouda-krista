"use client";

import { useState, useEffect } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import BookingCalendar from "@/components/BookingCalendar";
import Link from "next/link";

export default function BookPage() {
  const [checkIn, setCheckIn]   = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests]     = useState(2);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [total, setTotal]       = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const nights = checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;

  // Fetch real price from server whenever dates change
  useEffect(() => {
    if (!checkIn || !checkOut) { setTotal(null); return; }
    setLoadingPrice(true);
    fetch("/api/price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkIn:  format(checkIn, "yyyy-MM-dd"),
        checkOut: format(checkOut, "yyyy-MM-dd"),
      }),
    })
      .then((r) => r.json())
      .then((d) => setTotal(d.total))
      .catch(() => setTotal(null))
      .finally(() => setLoadingPrice(false));
  }, [checkIn, checkOut]);

  const handleRangeChange = (ci: Date | null, co: Date | null) => {
    setCheckIn(ci);
    setCheckOut(co);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !name || !email) {
      setError("Please fill in all fields and select your dates.");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkIn:   format(checkIn, "yyyy-MM-dd"),
        checkOut:  format(checkOut, "yyyy-MM-dd"),
        guests,
        guestName: name,
        guestEmail: email,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-warm">
      {/* Header */}
      <div className="bg-forest-950 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-stone-warm tracking-wider">
            Bouda Krista
          </Link>
          <Link href="/" className="text-stone-warm/60 hover:text-stone-warm text-sm font-sans tracking-wider">
            ← Back
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="section-subtitle mb-3">Reserve Your Stay</p>
          <h1 className="section-title">Book Bouda Krista</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Calendar */}
          <div className="lg:col-span-3 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-forest-900 mb-6">Select Dates</h2>
            <BookingCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              onRangeChange={handleRangeChange}
            />
          </div>

          {/* Booking form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 shadow-sm mb-6">
              <h2 className="font-serif text-2xl text-forest-900 mb-6">Your Details</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-forest-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-forest-700 bg-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-forest-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-forest-700 bg-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full border border-forest-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-forest-700 bg-transparent"
                  >
                    {Array.from({ length: 11 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p className="text-red-600 font-sans text-sm">{error}</p>
                )}

                {/* Summary */}
                {nights > 0 && (
                  <div className="border-t border-forest-100 pt-5 space-y-2">
                    <div className="flex justify-between font-sans text-sm text-forest-700">
                      <span>{format(checkIn!, "MMM d")} – {format(checkOut!, "MMM d, yyyy")}</span>
                      <span>{nights} night{nights > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between font-serif text-lg text-forest-900 pt-2 border-t border-forest-100">
                      <span>Total</span>
                      <span>
                        {loadingPrice ? (
                          <span className="text-forest-400 text-sm">Calculating…</span>
                        ) : total ? (
                          `${total.toLocaleString("cs-CZ")} Kč`
                        ) : "—"}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !checkIn || !checkOut || loadingPrice}
                  className="btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Redirecting…" : "Proceed to Payment"}
                </button>

                <p className="text-xs font-sans text-forest-400 text-center">
                  Platba zabezpečena přes GoPay · Karty, bankovní převod, Google Pay
                </p>
              </form>
            </div>

            <div className="bg-forest-50 border border-forest-200 p-6 text-sm font-sans text-forest-700 space-y-2">
              <p className="font-semibold text-forest-900">House Rules</p>
              <p>Check-in after 15:00 · Check-out before 11:00</p>
              <p>Maximum 11 guests</p>
              <p>Self check-in via lockbox</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
