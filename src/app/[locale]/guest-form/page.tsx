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

export default function GuestFormPage({ params }: Props) {
  const { locale } = use(params);
  const l = locale as Locale;
  const isCz = l === "cs";

  const [apartment, setApartment]         = useState(apartments[0].id);
  const [checkIn, setCheckIn]             = useState("");
  const [checkOut, setCheckOut]           = useState("");
  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [birthDate, setBirthDate]         = useState("");
  const [nationality, setNationality]     = useState("Česká republika");
  const [documentNumber, setDocumentNumber] = useState("");
  const [address, setAddress]             = useState("");
  const [loading, setLoading]             = useState(false);
  const [done, setDone]                   = useState(false);
  const [error, setError]                 = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/guest-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apartment, checkIn, checkOut, firstName, lastName, birthDate, nationality, documentNumber, address }),
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
              ? "Váš záznam byl úspěšně uložen do knihy hostů."
              : "Your record has been saved to the guest book."}
          </p>
        </div>
      </div>
    );
  }

  const field = (label: string, el: React.ReactNode) => (
    <div>
      <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">{label}</label>
      {el}
    </div>
  );

  const input = (value: string, onChange: (v: string) => void, type = "text", placeholder = "") => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full border border-forest-200 bg-white px-4 py-3 font-sans text-sm text-forest-900 focus:outline-none focus:border-forest-700"
    />
  );

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
            {isCz ? "Registrace hosta" : "Guest Book"}
          </h1>
          <p className="font-sans text-sm text-forest-500 mt-4">
            {isCz
              ? "Prosíme každého hosta nad 15 let o vyplnění tohoto formuláře. Údaje jsou zpracovávány v souladu s platnou legislativou."
              : "We ask every guest over 15 years to complete this form. Data is processed in accordance with applicable legislation."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm flex flex-col gap-6">
          {/* Apartment + dates */}
          {field(isCz ? "Apartmán" : "Apartment",
            <select
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="w-full border border-forest-200 bg-white px-4 py-3 font-sans text-sm text-forest-900 focus:outline-none focus:border-forest-700"
            >
              {apartments.map((a) => (
                <option key={a.id} value={a.id}>
                  {isCz ? (a.nameCz ?? a.name) : a.name}
                </option>
              ))}
            </select>
          )}

          <div className="grid grid-cols-2 gap-4">
            {field(isCz ? "Datum příjezdu" : "Check-in", input(checkIn, setCheckIn, "date"))}
            {field(isCz ? "Datum odjezdu" : "Check-out", input(checkOut, setCheckOut, "date"))}
          </div>

          <div className="border-t border-forest-100 pt-6">
            <p className="text-xs font-sans tracking-widest uppercase text-forest-400 mb-6">
              {isCz ? "Osobní údaje hosta" : "Guest personal details"}
            </p>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                {field(isCz ? "Jméno" : "First name", input(firstName, setFirstName, "text", isCz ? "Jméno" : "First name"))}
                {field(isCz ? "Příjmení" : "Last name", input(lastName, setLastName, "text", isCz ? "Příjmení" : "Last name"))}
              </div>
              {field(isCz ? "Datum narození" : "Date of birth", input(birthDate, setBirthDate, "date"))}
              {field(isCz ? "Státní příslušnost" : "Nationality",
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full border border-forest-200 bg-white px-4 py-3 font-sans text-sm text-forest-900 focus:outline-none focus:border-forest-700"
                >
                  {EU_NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
                </select>
              )}
              {field(isCz ? "Číslo dokladu totožnosti (OP / pas)" : "ID / Passport number",
                input(documentNumber, setDocumentNumber, "text", isCz ? "Číslo dokladu" : "Document number")
              )}
              {field(isCz ? "Adresa trvalého bydliště" : "Permanent address",
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isCz ? "Ulice, město, PSČ" : "Street, city, postcode"}
                  required
                  className="w-full border border-forest-200 bg-white px-4 py-3 font-sans text-sm text-forest-900 focus:outline-none focus:border-forest-700"
                />
              )}
            </div>
          </div>

          {error && <p className="text-red-600 font-sans text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? (isCz ? "Odesílám…" : "Submitting…")
              : (isCz ? "Odeslat záznam" : "Submit record")}
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
