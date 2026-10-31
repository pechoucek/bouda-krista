"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Booking = {
  id: string;
  apartment: string;
  apartmentName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  totalCzk: number;
  createdAt: string;
};

type SeasonPrices = { base: number; weekend: number; week: number; minNights: number };
type SpecialPeriod = { price: number; minNights: number };
type PriceConfig = {
  winter: SeasonPrices;
  summer: SeasonPrices;
  offseason: SeasonPrices;
  christmas: SpecialPeriod;
  newyear: SpecialPeriod;
  easter: SpecialPeriod;
};

const APT_OPTIONS = [
  { id: "tiny",     name: "Malý apartmán" },
  { id: "timber",   name: "Roubený apartmán" },
  { id: "topfloor", name: "Podkrovní apartmán" },
  { id: "whole",    name: "Celá chalupa" },
];

const DEFAULT_PRICES: PriceConfig = {
  winter:    { base: 10000, weekend: 12000, week: 65000, minNights: 2 },
  summer:    { base: 10000, weekend: 12000, week: 65000, minNights: 2 },
  offseason: { base: 10000, weekend: 11000, week: 60000, minNights: 2 },
  christmas: { price: 15000, minNights: 5 },
  newyear:   { price: 15000, minNights: 4 },
  easter:    { price: 12000, minNights: 3 },
};

const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-green-700";

function NumField({ label, value, onChange, step = 500, min = 0 }: {
  label: string; value: number; onChange: (v: number) => void; step?: number; min?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
        className={inputCls} step={step} min={min} />
    </div>
  );
}

function SeasonBlock({ label, emoji, value, onChange }: {
  label: string; emoji: string; value: SeasonPrices; onChange: (v: SeasonPrices) => void;
}) {
  const set = (field: keyof SeasonPrices, v: number) => onChange({ ...value, [field]: v });
  const color = emoji === "❄️" ? "#1d4ed8" : emoji === "☀️" ? "#92400e" : "#4b5563";
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color }}>{emoji} {label}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NumField label="Základní cena / noc (Kč)" value={value.base}      onChange={(v) => set("base", v)} />
        <NumField label="Víkend / noc — pá+so (Kč)" value={value.weekend}  onChange={(v) => set("weekend", v)} />
        <NumField label="Týden — 7 nocí celkem (Kč)" value={value.week}    onChange={(v) => set("week", v)} />
        <NumField label="Min. počet nocí"             value={value.minNights} onChange={(v) => set("minNights", v)} step={1} min={1} />
      </div>
    </div>
  );
}

function SpecialBlock({ label, value, onChange }: {
  label: string; value: SpecialPeriod; onChange: (v: SpecialPeriod) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <NumField label={`${label} — cena / noc (Kč)`} value={value.price}     onChange={(v) => onChange({ ...value, price: v })} />
      <NumField label="Min. počet nocí"               value={value.minNights} onChange={(v) => onChange({ ...value, minNights: v })} step={1} min={1} />
    </div>
  );
}

function AdminPanel() {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret") ?? "";

  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [adding, setAdding]         = useState(false);
  const [apartment, setApartment]   = useState("whole");
  const [checkIn, setCheckIn]       = useState("");
  const [checkOut, setCheckOut]     = useState("");
  const [guestName, setGuestName]   = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [formMsg, setFormMsg]       = useState("");

  const [prices, setPrices]               = useState<PriceConfig>(DEFAULT_PRICES);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [savingPrices, setSavingPrices]   = useState(false);
  const [pricesMsg, setPricesMsg]         = useState("");

  const load = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    const res = await fetch(`/api/admin/bookings?secret=${secret}`);
    if (!res.ok) { setError("Špatné heslo nebo chyba serveru."); setLoading(false); return; }
    setBookings(await res.json());
    setLoading(false);
  }, [secret]);

  const loadPrices = useCallback(async () => {
    if (!secret) return;
    setPricesLoading(true);
    const res = await fetch(`/api/admin/prices?secret=${secret}`);
    if (res.ok) setPrices(await res.json());
    setPricesLoading(false);
  }, [secret]);

  useEffect(() => { load(); loadPrices(); }, [load, loadPrices]);

  const handleDelete = async (b: Booking) => {
    if (!confirm(`Opravdu smazat rezervaci ${b.guestName} (${b.checkIn} – ${b.checkOut})?`)) return;
    setDeleting(b.id);
    await fetch(`/api/admin/bookings?secret=${secret}`, {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, apartment: b.apartment }),
    });
    setDeleting(null);
    load();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setAdding(true); setFormMsg("");
    const res = await fetch(`/api/admin/bookings?secret=${secret}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apartment, checkIn, checkOut, guestName, guestEmail }),
    });
    if (res.ok) {
      setFormMsg("✓ Blokace přidána.");
      setCheckIn(""); setCheckOut(""); setGuestName(""); setGuestEmail("");
      load();
    } else { setFormMsg("✗ Chyba. Zkuste znovu."); }
    setAdding(false);
  };

  const handleSavePrices = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingPrices(true); setPricesMsg("");
    const res = await fetch(`/api/admin/prices?secret=${secret}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prices),
    });
    setPricesMsg(res.ok ? "✓ Ceny uloženy." : "✗ Chyba při ukládání.");
    setSavingPrices(false);
  };

  if (!secret) return <div className="p-8 text-center text-red-600">Chybí heslo v URL: ?secret=...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-950 text-white px-6 py-4">
        <h1 className="font-serif text-xl">Bouda Krista — Správa</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* ── 1. BLOKACE ── */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Přidat blokaci / ruční rezervaci</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Apartmán</label>
              <select value={apartment} onChange={(e) => setApartment(e.target.value)} className={inputCls}>
                {APT_OPTIONS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Příjezd</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Odjezd</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Jméno hosta (nepovinné)</label>
              <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Jméno hosta" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">E-mail hosta (nepovinné)</label>
              <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="email@example.com" className={inputCls} />
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <button type="submit" disabled={adding}
                className="bg-green-900 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-800 disabled:opacity-50">
                {adding ? "Ukládám…" : "Přidat blokaci"}
              </button>
              {formMsg && <span className="text-sm text-gray-600">{formMsg}</span>}
            </div>
          </form>
        </div>

        {/* ── 2. PŘEHLED REZERVACÍ ── */}
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Všechny rezervace a blokace ({bookings.length})</h2>
            <button onClick={load} className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1 rounded">Obnovit</button>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Načítám…</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 text-sm">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Žádné rezervace.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Apartmán</th>
                  <th className="px-4 py-3 text-left">Příjezd</th>
                  <th className="px-4 py-3 text-left">Odjezd</th>
                  <th className="px-4 py-3 text-left">Host</th>
                  <th className="px-4 py-3 text-left">E-mail</th>
                  <th className="px-4 py-3 text-left">Cena</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{b.apartmentName}</td>
                    <td className="px-4 py-3 text-gray-700">{b.checkIn}</td>
                    <td className="px-4 py-3 text-gray-700">{b.checkOut}</td>
                    <td className="px-4 py-3 text-gray-700">{b.guestName || "—"}</td>
                    <td className="px-4 py-3">
                      {b.guestEmail ? <a href={`mailto:${b.guestEmail}`} className="text-green-700 hover:underline">{b.guestEmail}</a> : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {b.totalCzk > 0 ? `${b.totalCzk.toLocaleString("cs-CZ")} Kč` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(b)} disabled={deleting === b.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40">
                        {deleting === b.id ? "…" : "Smazat"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── 3. CENY ── */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Správa cen — Celá chalupa</h2>
          <p className="text-xs text-gray-400 mb-6">Změny se projeví okamžitě u nových rezervací.</p>

          {pricesLoading ? <p className="text-sm text-gray-400">Načítám ceny…</p> : (
            <form onSubmit={handleSavePrices} className="space-y-7">
              <SeasonBlock emoji="❄️" label="Zimní sezona (1. 12. – 1. 4.)"
                value={prices.winter} onChange={(v) => setPrices((p) => ({ ...p, winter: v }))} />
              <SeasonBlock emoji="☀️" label="Letní sezona (1. 7. – 1. 9.)"
                value={prices.summer} onChange={(v) => setPrices((p) => ({ ...p, summer: v }))} />
              <SeasonBlock emoji="🍂" label="Mimo sezonu"
                value={prices.offseason} onChange={(v) => setPrices((p) => ({ ...p, offseason: v }))} />

              <div>
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-3">🎄 Speciální období</p>
                <div className="space-y-4">
                  <SpecialBlock label="Vánoce (21. 12. – 28. 12.)"          value={prices.christmas} onChange={(v) => setPrices((p) => ({ ...p, christmas: v }))} />
                  <SpecialBlock label="Silvestr (28. 12. – 2. 1.)"          value={prices.newyear}   onChange={(v) => setPrices((p) => ({ ...p, newyear: v }))} />
                  <SpecialBlock label="Velikonoce (Velký pá – Pondělí)"     value={prices.easter}    onChange={(v) => setPrices((p) => ({ ...p, easter: v }))} />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t">
                <button type="submit" disabled={savingPrices}
                  className="bg-green-900 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-800 disabled:opacity-50">
                  {savingPrices ? "Ukládám…" : "Uložit ceny"}
                </button>
                {pricesMsg && <span className="text-sm text-gray-600">{pricesMsg}</span>}
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Načítám…</div>}>
      <AdminPanel />
    </Suspense>
  );
}
