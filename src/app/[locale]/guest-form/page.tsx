"use client";

import { use, useState } from "react";
import Logo from "@/components/Logo";
import { apartments } from "@/lib/pricing";
import type { Locale } from "@/i18n/translations";

type Props = { params: Promise<{ locale: string }> };

const EU_NATIONALITIES = [
  "Česká republika", "Slovensko", "Německo", "Polsko", "Rakousko", "Maďarsko",
  "Francie", "Itálie", "Španělsko", "Nizozemsko", "Belgie", "Švédsko", "Dánsko",
  "Norsko", "Finsko", "Švýcarsko", "Velká Británie", "USA", "Kanada", "Austrálie",
  "Jiná",
];

type Guest = {
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  documentNumber: string;
  address: string;
};

const emptyGuest = (): Guest => ({
  firstName: "", lastName: "", birthDate: "",
  nationality: "Česká republika", documentNumber: "", address: "",
});

export default function GuestFormPage({ params }: Props) {
  const { locale } = use(params);
  const l = locale as Locale;
  const isCz = l === "cs";

  const [apartment, setApartment] = useState(apartments[0].id);
  const [checkIn, setCheckIn]     = useState("");
  const [checkOut, setCheckOut]   = useState("");
  const [guests, setGuests]       = useState<Guest[]>([emptyGuest()]);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");

  const updateGuest = (i: number, field: keyof Guest, value: string) =>
    setGuests((prev) => prev.map((g, idx) => idx === i ? { ...g, [field]: value } : g));

  const addGuest = () => {
    if (guests.length < 11) setGuests((prev) => [...prev, emptyGuest()]);
  };

  const removeGuest = (i: number) =>
    setGuests((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/guest-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apartment, checkIn, checkOut, guests }),
    });
    const data = await res.json();
    if (data.ok) {
      setDone(true);
    } else {
      setError(data.error ?? "Chyba. Zkuste to prosím znovu.");
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-stone-warm flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="font-serif text-3xl text-forest-900 mb-4">
            {isCz ? "Děkujeme!" : "Thank you!"}
          </p>
          <p className="font-sans text-forest-600 text-sm">
            {isCz
              ? `Záznamy pro ${guests.length} ${guests.length === 1 ? "hosta" : "hosty/hostů"} byly úspěšně uloženy.`
              : `Records for ${guests.length} guest${guests.length !== 1 ? "s" : ""} saved successfully.`}
          </p>
        </div>
      </div>
    );
  }

  const inputCls = "w-full border border-forest-200 bg-white px-4 py-3 font-sans text-sm text-forest-900 focus:outline-none focus:border-forest-700";
  const labelCls = "block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2";

  return (
    <div className="min-h-screen bg-stone-warm">
      <div className="bg-forest-950 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <Logo href={`/${l}`} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="section-subtitle mb-3">
            {isCz ? "Ubytovací kniha" : "Guest Registration"}
          </p>
          <h1 className="section-title">
            {isCz ? "Registrace hostů" : "Guest Book"}
          </h1>
          <p className="font-sans text-sm text-forest-500 mt-4">
            {isCz
              ? "Prosíme o vyplnění údajů za každého hosta nad 15 let. Údaje jsou zpracovávány v souladu s platnou legislativou."
              : "Please fill in details for every guest over 15 years. Data is processed in accordance with applicable legislation."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Shared: apartment + dates */}
          <div className="bg-white p-8 shadow-sm flex flex-col gap-5">
            <div>
              <label className={labelCls}>{isCz ? "Apartmán" : "Apartment"}</label>
              <select
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className={inputCls}
              >
                {apartments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {isCz ? (a.nameCz ?? a.name) : a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{isCz ? "Datum příjezdu" : "Check-in"}</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{isCz ? "Datum odjezdu" : "Check-out"}</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required className={inputCls} />
              </div>
            </div>
          </div>

          {/* Guest cards */}
          {guests.map((g, i) => (
            <div key={i} className="bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-sans tracking-widest uppercase text-forest-500">
                  {isCz ? `Host ${i + 1}` : `Guest ${i + 1}`}
                </p>
                {guests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGuest(i)}
                    className="text-xs font-sans text-forest-400 hover:text-red-500 transition-colors"
                  >
                    {isCz ? "Odebrat" : "Remove"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{isCz ? "Jméno" : "First name"}</label>
                    <input type="text" value={g.firstName} onChange={(e) => updateGuest(i, "firstName", e.target.value)}
                      placeholder={isCz ? "Jméno" : "First name"} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{isCz ? "Příjmení" : "Last name"}</label>
                    <input type="text" value={g.lastName} onChange={(e) => updateGuest(i, "lastName", e.target.value)}
                      placeholder={isCz ? "Příjmení" : "Last name"} required className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{isCz ? "Datum narození" : "Date of birth"}</label>
                  <input type="date" value={g.birthDate} onChange={(e) => updateGuest(i, "birthDate", e.target.value)} required className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>{isCz ? "Státní příslušnost" : "Nationality"}</label>
                  <select value={g.nationality} onChange={(e) => updateGuest(i, "nationality", e.target.value)} className={inputCls}>
                    {EU_NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>{isCz ? "Číslo dokladu (OP / pas)" : "ID / Passport number"}</label>
                  <input type="text" value={g.documentNumber} onChange={(e) => updateGuest(i, "documentNumber", e.target.value)}
                    placeholder={isCz ? "Číslo dokladu" : "Document number"} required className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>{isCz ? "Adresa trvalého bydliště" : "Permanent address"}</label>
                  <input type="text" value={g.address} onChange={(e) => updateGuest(i, "address", e.target.value)}
                    placeholder={isCz ? "Ulice, město, PSČ" : "Street, city, postcode"} required className={inputCls} />
                </div>
              </div>
            </div>
          ))}

          {/* Add guest button */}
          {guests.length < 11 && (
            <button
              type="button"
              onClick={addGuest}
              className="w-full border-2 border-dashed border-forest-300 py-4 font-sans text-sm text-forest-500 hover:border-forest-500 hover:text-forest-700 transition-colors"
            >
              + {isCz ? `Přidat dalšího hosta (${guests.length}/11)` : `Add another guest (${guests.length}/11)`}
            </button>
          )}

          {error && <p className="text-red-600 font-sans text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? (isCz ? "Odesílám…" : "Submitting…")
              : (isCz
                  ? `Odeslat záznamy (${guests.length} ${guests.length === 1 ? "host" : "hosté/hostů"})`
                  : `Submit records (${guests.length} guest${guests.length !== 1 ? "s" : ""})`)}
          </button>

          <p className="text-xs font-sans text-forest-400 text-center">
            {isCz
              ? "Údaje jsou zpracovávány dle GDPR a zákona č. 326/1999 Sb."
              : "Data processed under GDPR and Act No. 326/1999 Coll."}
          </p>
        </form>
      </div>
    </div>
  );
}
