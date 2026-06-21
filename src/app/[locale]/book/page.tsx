"use client";

import { useState, useEffect, use } from "react";
import { format } from "date-fns";
import BookingCalendar from "@/components/BookingCalendar";
import Link from "next/link";
import Logo from "@/components/Logo";
import { apartments } from "@/lib/pricing";
import { useT, type Locale } from "@/i18n/translations";

type Props = { params: Promise<{ locale: string }> };

export default function BookPage({ params }: Props) {
  const { locale } = use(params);
  const l = locale as Locale;
  const tr = useT(l);

  const [apartment, setApartment]   = useState(apartments[3].id);
  const [checkIn, setCheckIn]       = useState<Date | null>(null);
  const [checkOut, setCheckOut]     = useState<Date | null>(null);
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [priceInfo, setPriceInfo]   = useState<{ total: number; nights: number; nightlyRate: number; discountName?: string } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const selectedApt = apartments.find((a) => a.id === apartment) ?? apartments[3];

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
      setError(tr.book.errorFill);
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/reservation-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkIn:      format(checkIn, "yyyy-MM-dd"),
        checkOut:     format(checkOut, "yyyy-MM-dd"),
        apartment,
        apartmentName: selectedApt.name,
        guestName:    name,
        guestEmail:   email,
        nights:       priceInfo?.nights ?? "—",
        total:        priceInfo?.total?.toLocaleString("cs-CZ") ?? "—",
        locale:       l,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      window.location.href = `/${l}/book/success`;
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
          <Logo href={`/${l}`} />
          <Link href={`/${l}`} className="text-stone-warm/60 hover:text-stone-warm text-sm font-sans tracking-wider">
            {tr.book.headerBack}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="section-subtitle mb-3">{tr.book.subtitle}</p>
          <h1 className="section-title">{tr.book.title}</h1>
        </div>

        {/* Step 1 */}
        <div className="mb-10">
          <p className="text-xs font-sans tracking-widest uppercase text-forest-500 mb-4">
            {tr.book.step1}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {apartments.map((apt) => (
              <button
                key={apt.id}
                type="button"
                onClick={() => setApartment(apt.id)}
                className={`p-5 text-left border-2 transition-all ${
                  apartment === apt.id
                    ? "border-forest-700 bg-forest-700 text-stone-warm"
                    : "border-forest-200 bg-white hover:border-forest-400"
                }`}
              >
                <div className={`font-serif text-lg mb-1 ${apartment === apt.id ? "text-stone-warm" : "text-forest-900"}`}>
                  {apt.name}
                </div>
                <div className={`font-sans text-xs mb-3 ${apartment === apt.id ? "text-stone-warm/70" : "text-forest-500"}`}>
                  {apt.guests}
                </div>
                <div className={`font-sans text-sm font-medium ${apartment === apt.id ? "text-gold" : "text-forest-700"}`}>
                  {apt.discountFrom ? (
                    <>
                      <span className="line-through opacity-50 mr-1">{apt.defaultNightlyRate.toLocaleString("cs-CZ")}</span>
                      {l === "cs" ? "od " : "from "}{apt.discountFrom.toLocaleString("cs-CZ")} Kč / {l === "cs" ? "noc" : "night"}
                    </>
                  ) : (
                    <>{apt.defaultNightlyRate.toLocaleString("cs-CZ")} Kč / {l === "cs" ? "noc" : "night"}</>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Step 2 — Calendar */}
          <div className="lg:col-span-3 bg-white p-8 shadow-sm">
            <p className="text-xs font-sans tracking-widest uppercase text-forest-500 mb-6">
              {tr.book.step2label} · <span className="text-forest-700">{selectedApt.name}</span>
            </p>
            <BookingCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              onRangeChange={handleRangeChange}
              apartment={apartment}
            />
          </div>

          {/* Step 3 */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 shadow-sm mb-6">
              <p className="text-xs font-sans tracking-widest uppercase text-forest-500 mb-6">
                {tr.book.step3}
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">
                    {tr.book.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-forest-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-forest-700 bg-transparent"
                    placeholder={tr.book.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">
                    {tr.book.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-forest-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-forest-700 bg-transparent"
                    placeholder={tr.book.emailPlaceholder}
                  />
                </div>

                {error && <p className="text-red-600 font-sans text-sm">{error}</p>}

                {checkIn && checkOut && (
                  <div className="border-t border-forest-100 pt-5 space-y-2">
                    {priceInfo?.discountName && (
                      <div className="bg-gold/10 border border-gold/40 px-3 py-2 flex items-center gap-2">
                        <span className="text-gold text-xs">✦</span>
                        <span className="font-sans text-xs text-forest-700">
                          {priceInfo.discountName} — {l === "cs" ? "zvýhodněná cena" : "special rate applied"}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-sans text-sm text-forest-700">
                      <span>{selectedApt.name}</span>
                    </div>
                    <div className="flex justify-between font-sans text-sm text-forest-700">
                      <span>{format(checkIn, "d. M.")} – {format(checkOut, "d. M. yyyy")}</span>
                      <span>
                        {priceInfo?.nights ?? "—"}{" "}
                        {l === "cs"
                          ? `noc${priceInfo && priceInfo.nights > 1 ? "í" : ""}`
                          : `night${priceInfo && priceInfo.nights !== 1 ? "s" : ""}`}
                      </span>
                    </div>
                    {priceInfo && !loadingPrice && (
                      <div className="flex justify-between font-sans text-sm text-forest-500">
                        <span>{priceInfo.nightlyRate.toLocaleString("cs-CZ")} Kč × {priceInfo.nights}</span>
                        <span>{priceInfo.total.toLocaleString("cs-CZ")} Kč</span>
                      </div>
                    )}
                    <div className="flex justify-between font-serif text-lg text-forest-900 pt-2 border-t border-forest-100">
                      <span>{tr.book.total}</span>
                      <span>
                        {loadingPrice ? (
                          <span className="text-forest-400 text-sm">{tr.book.calculating}</span>
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
                  {loading ? tr.book.submitting : tr.book.submit}
                </button>

                <p className="text-xs font-sans text-forest-400 text-center">
                  {tr.book.payNote}
                </p>
              </form>
            </div>

            <div className="bg-forest-50 border border-forest-200 p-6 text-sm font-sans text-forest-700 space-y-2">
              <p className="font-semibold text-forest-900">{tr.book.rules}</p>
              <p>{tr.book.checkin}</p>
              <p>{tr.book.selfCheckin}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
