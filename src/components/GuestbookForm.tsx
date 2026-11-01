"use client";

import { useRef, useState } from "react";

type Locale = "cs" | "en";
type Guest = Record<string, string>;
type Result = { amount: number; nights: number; persons: number; vs: string; qrSvg: string | null; payment: string };

const MAX = 12;
const RATE = 25;

const PURPOSES = [
  ["Turistika / rekreace", "Tourism / recreation"],
  ["Služební cesta", "Business trip"],
  ["Jiný", "Other"],
];

const T = {
  cs: {
    title: "Domovní kniha", intro: "Vyplňte prosím údaje všech ubytovaných osob (až 12) před odesláním.",
    stay: "Pobyt", arrival: "Příjezd", departure: "Odjezd", guest: "Host", remove: "Odebrat", add: "+ Přidat hosta",
    fn: "Jméno", ln: "Příjmení", bd: "Datum narození", na: "Státní občanství", ad: "Trvalé bydliště (ulice, obec, PSČ, země)",
    id: "Číslo OP / cestovního dokladu", vi: "Číslo víza (jen cizinci)", pu: "Účel pobytu", defNa: "Česká republika",
    persons: "Počet osob", nights: "Počet nocí", fee: "Poplatek z pobytu",
    cash: "Odeslat dotazník, platba v hotovosti", bank: "Odeslat dotazník, platba převodem", sending: "Odesílám…",
    errDates: "Zadejte prosím příjezd a odjezd (odjezd musí být po příjezdu).", errSend: "Odeslání se nezdařilo. Zkuste to prosím znovu.",
    thanks: "Děkujeme, dotazník byl odeslán ✓", cashInfo: "Poplatek uhradíte v hotovosti:", bankInfo: "Uhraďte prosím poplatek z pobytu naskenováním QR kódu v bankovní aplikaci.",
    noQr: "QR kód se nepodařilo vytvořit, platbu domluvíme osobně.", vsLabel: "variabilní symbol",
  },
  en: {
    title: "Guest registration", intro: "Please fill in the details of all guests (up to 12) before submitting.",
    stay: "Stay", arrival: "Arrival", departure: "Departure", guest: "Guest", remove: "Remove", add: "+ Add guest",
    fn: "First name", ln: "Last name", bd: "Date of birth", na: "Nationality", ad: "Permanent address (street, city, postcode, country)",
    id: "ID / passport number", vi: "Visa number (foreigners only)", pu: "Purpose of stay", defNa: "",
    persons: "Guests", nights: "Nights", fee: "Local stay fee",
    cash: "Submit, pay in cash", bank: "Submit, pay by bank transfer", sending: "Sending…",
    errDates: "Please enter arrival and departure (departure must be after arrival).", errSend: "Sending failed. Please try again.",
    thanks: "Thank you, your form has been submitted ✓", cashInfo: "You will pay the fee in cash:", bankInfo: "Please pay the stay fee by scanning the QR code in your banking app.",
    noQr: "The QR code could not be created, we will arrange the payment in person.", vsLabel: "variable symbol",
  },
};

const FIELDS: [string, boolean, string][] = [
  ["fn", true, "text"], ["ln", true, "text"], ["bd", true, "date"], ["na", true, "text"],
  ["ad", true, "text"], ["id", true, "text"], ["vi", false, "text"],
];

const card = "bg-white border border-stone-200 rounded p-5 my-4";
const label = "block text-xs uppercase tracking-wider text-stone-500";
const input = "mt-1 w-full border border-stone-300 rounded px-3 py-2 bg-white text-forest-950 normal-case tracking-normal text-base";
const pinkBtn = "bg-[#CEA1BC] text-white px-5 py-3 rounded disabled:opacity-50";

export default function GuestbookForm({ locale, accessKey }: { locale: Locale; accessKey: string }) {
  const t = T[locale];
  const formRef = useRef<HTMLFormElement>(null);
  const newGuest = (): Guest => ({ fn: "", ln: "", bd: "", na: t.defNa, ad: "", id: "", vi: "", pu: PURPOSES[0][0] });

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState<Guest[]>([newGuest()]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const n = Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000);
  const nights = Number.isFinite(n) && n >= 1 ? n : 0;
  const amount = guests.length * nights * RATE;

  const setField = (i: number, k: string, v: string) =>
    setGuests((g) => g.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  async function submit(payment: "cash" | "transfer") {
    setError("");
    if (!nights) { setError(t.errDates); return; }
    if (!formRef.current?.reportValidity()) return;
    setSending(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: accessKey, arrival, departure, guests, payment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setResult({ ...data, payment });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(t.errSend);
    } finally {
      setSending(false);
    }
  }

  if (result) {
    return (
      <div className={`${card} text-center`}>
        <h1 className="text-2xl mb-3">{t.thanks}</h1>
        {result.payment === "cash" ? (
          <p>{t.cashInfo} <strong>{result.amount} Kč</strong></p>
        ) : result.qrSvg ? (
          <>
            <p className="mb-4">{t.bankInfo}</p>
            <div
              className="w-64 max-w-full mx-auto bg-white p-2 [&>svg]:block [&>svg]:w-full [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: result.qrSvg }}
            />
            <p className="mt-4"><strong>{result.amount} Kč</strong> · {t.vsLabel} <strong>{result.vs}</strong></p>
          </>
        ) : (
          <p>{t.noQr} <strong>{result.amount} Kč</strong></p>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={(e) => e.preventDefault()} className="text-forest-950">
      <h1 className="text-3xl mb-2">{t.title}</h1>
      <p className="text-stone-500 mb-4">{t.intro}</p>

      <div className={card}>
        <h2 className="text-lg mb-3">{t.stay}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className={label}>{t.arrival} *
            <input type="date" required value={arrival} onChange={(e) => setArrival(e.target.value)} className={input} />
          </label>
          <label className={label}>{t.departure} *
            <input type="date" required value={departure} onChange={(e) => setDeparture(e.target.value)} className={input} />
          </label>
        </div>
      </div>

      {guests.map((g, i) => (
        <div key={i} className={card}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg">{t.guest} {i + 1}</h2>
            {guests.length > 1 && (
              <button type="button" className="text-sm border border-stone-300 rounded px-3 py-1"
                onClick={() => setGuests((x) => x.filter((_, j) => j !== i))}>{t.remove}</button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {FIELDS.map(([k, req, type]) => (
              <label key={k} className={label}>{t[k as keyof typeof t]}{req ? " *" : ""}
                <input type={type} required={req} value={g[k]} onChange={(e) => setField(i, k, e.target.value)} className={input} />
              </label>
            ))}
            <label className={label}>{t.pu}
              <select value={g.pu} onChange={(e) => setField(i, "pu", e.target.value)} className={input}>
                {PURPOSES.map(([cs, en]) => <option key={cs} value={cs}>{locale === "cs" ? cs : en}</option>)}
              </select>
            </label>
          </div>
        </div>
      ))}

      <button type="button" disabled={guests.length >= MAX} onClick={() => setGuests((g) => [...g, newGuest()])}
        className="border border-stone-300 rounded px-4 py-2 disabled:opacity-40">{t.add}</button>

      <div className={card}>
        {t.persons}: <strong>{guests.length}</strong> · {t.nights}: <strong>{nights}</strong><br />
        {t.fee}: <strong>{guests.length} × {nights} × {RATE} Kč = {amount} Kč</strong>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={sending} onClick={() => submit("cash")} className={pinkBtn}>{sending ? t.sending : t.cash}</button>
        <button type="button" disabled={sending} onClick={() => submit("transfer")} className={pinkBtn}>{sending ? t.sending : t.bank}</button>
      </div>
      {error && <p className="text-red-700 mt-3">{error}</p>}
    </form>
  );
}
