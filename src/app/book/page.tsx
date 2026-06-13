"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import BookingCalendar from "@/components/BookingCalendar";
import ApartmentModal from "@/components/ApartmentModal";
import Link from "next/link";
import Logo from "@/components/Logo";
import { apartments } from "@/lib/pricing";
import { apartmentDetails, ApartmentDetail } from "@/data/apartments";

export default function BookPage() {
  const [apartment, setApartment]   = useState(apartments[3].id); // default: whole house
  const [checkIn, setCheckIn]       = useState<Date | null>(null);
  const [checkOut, setCheckOut]     = useState<Date | null>(null);
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [priceInfo, setPriceInfo]       = useState<{ total: number; nights: number; nightlyRate: number } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [modalApt, setModalApt]         = useState<ApartmentDetail | null>(null);

  const selectedApt = apartments.find((a) => a.id === apartment) ?? apartments[3];

  // Fetch real price whenever dates or apartment changes
  useEffect(() => {
    if (!checkIn || !checkOut) { setPriceInfo(null); return; }
    setLoadingPrice(true);
    fetch("/api/price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkIn:   format(checkIn, "yyyy-MM-dd"),
        checkOut:  format(checkOut, "yyyy-MM-dd"),
        apartment,
      }),
    })
      .then((r) => r.json())
      .then((d) => setPriceInfo(d))
      .catch(() => setPriceInfo(null))
      .finally(() => setLoadingPrice(false));
  }, [checkIn, checkOut, apartment]);

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
        checkIn:      format(checkIn, "yyyy-MM-dd"),
        checkOut:     format(checkOut, "yyyy-MM-dd"),
        apartment,
        apartmentName: selectedApt.name,
        guestName:    name,
        guestEmail:   email,
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
      <ApartmentModal
        apartment={modalApt}
        onClose={() => setModalApt(null)}
        onBook={(id) => setApartment(id)}
      />
      {/* Header */}
      <div className="bg-forest-950 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="light" />
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

        {/* Step 1 — Choose apartment */}
        <div className="mb-10">
          <p className="text-xs font-sans tracking-widest uppercase text-forest-500 mb-4">
            Step 1 — Choose your accommodation
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {apartmentDetails.map((apt) => {
              const isSelected = apartment === apt.id;
              return (
                <div key={apt.id} className={`border-2 transition-all overflow-hidden ${isSelected ? "border-forest-700" : "border-forest-200 hover:border-forest-400"}`}>
                  {/* Photo + info overlay */}
                  <button
                    type="button"
                    className="relative w-full aspect-[4/3] overflow-hidden block group"
                    onClick={() => setModalApt(apt)}
                    title="View details"
                  >
                    <img
                      src={apt.photos[0].url}
                      alt={apt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-end">
                      <span className="w-full text-center text-white font-sans text-xs tracking-widest uppercase py-2 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        View details
                      </span>
                    </div>
                  </button>

                  {/* Select button */}
                  <button
                    type="button"
                    onClick={() => setApartment(apt.id)}
                    className={`w-full p-3 text-left transition-colors ${isSelected ? "bg-forest-700" : "bg-white hover:bg-forest-50"}`}
                  >
                    <div className={`font-serif text-base mb-0.5 ${isSelected ? "text-stone-warm" : "text-forest-900"}`}>
                      {apt.name}
                    </div>
                    <div className={`font-sans text-xs mb-1 ${isSelected ? "text-stone-warm/70" : "text-forest-500"}`}>
                      Up to {apt.guests} guests
                    </div>
                    <div className={`font-sans text-sm font-medium ${isSelected ? "text-gold" : "text-forest-700"}`}>
                      {apt.defaultNightlyRate.toLocaleString("cs-CZ")} Kč / noc
                    </div>
                    {isSelected && (
                      <div className="font-sans text-xs text-stone-warm/60 mt-1">✓ Selected</div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Step 2 — Calendar */}
          <div className="lg:col-span-3 bg-white p-8 shadow-sm">
            <p className="text-xs font-sans tracking-widest uppercase text-forest-500 mb-6">
              Step 2 — Select dates · <span className="text-forest-700">{selectedApt.name}</span>
            </p>
            <BookingCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              onRangeChange={handleRangeChange}
              apartment={apartment}
            />
          </div>

          {/* Step 3 — Details & summary */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 shadow-sm mb-6">
              <p className="text-xs font-sans tracking-widest uppercase text-forest-500 mb-6">
                Step 3 — Your details
              </p>
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

                {error && <p className="text-red-600 font-sans text-sm">{error}</p>}

                {/* Price summary */}
                {checkIn && checkOut && (
                  <div className="border-t border-forest-100 pt-5 space-y-2">
                    <div className="flex justify-between font-sans text-sm text-forest-700">
                      <span>{selectedApt.name}</span>
                    </div>
                    <div className="flex justify-between font-sans text-sm text-forest-700">
                      <span>{format(checkIn, "MMM d")} – {format(checkOut, "MMM d, yyyy")}</span>
                      <span>{priceInfo?.nights ?? "—"} noc{priceInfo && priceInfo.nights > 1 ? "í" : ""}</span>
                    </div>
                    {priceInfo && !loadingPrice && (
                      <div className="flex justify-between font-sans text-sm text-forest-500">
                        <span>{priceInfo.nightlyRate.toLocaleString("cs-CZ")} Kč × {priceInfo.nights}</span>
                        <span>{priceInfo.total.toLocaleString("cs-CZ")} Kč</span>
                      </div>
                    )}
                    <div className="flex justify-between font-serif text-lg text-forest-900 pt-2 border-t border-forest-100">
                      <span>Celkem</span>
                      <span>
                        {loadingPrice ? (
                          <span className="text-forest-400 text-sm">Calculating…</span>
                        ) : priceInfo ? (
                          `${priceInfo.total.toLocaleString("cs-CZ")} Kč`
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
              <p>Self check-in via lockbox</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
