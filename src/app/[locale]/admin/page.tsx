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

const APT_OPTIONS = [
  { id: "tiny",     name: "Malý apartmán" },
  { id: "timber",   name: "Roubený apartmán" },
  { id: "topfloor", name: "Podkrovní apartmán" },
  { id: "whole",    name: "Celá chalupa" },
];

function AdminPanel() {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret") ?? "";

  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [adding, setAdding]       = useState(false);

  // New block form
  const [apartment, setApartment] = useState("whole");
  const [checkIn, setCheckIn]     = useState("");
  const [checkOut, setCheckOut]   = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [formMsg, setFormMsg]     = useState("");

  const load = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    const res = await fetch(`/api/admin/bookings?secret=${secret}`);
    if (!res.ok) { setError("Špatné heslo nebo chyba serveru."); setLoading(false); return; }
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }, [secret]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (b: Booking) => {
    if (!confirm(`Opravdu smazat rezervaci ${b.guestName} (${b.checkIn} – ${b.checkOut})?`)) return;
    setDeleting(b.id);
    await fetch(`/api/admin/bookings?secret=${secret}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, apartment: b.apartment }),
    });
    setDeleting(null);
    load();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setFormMsg("");
    const res = await fetch(`/api/admin/bookings?secret=${secret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apartment, checkIn, checkOut, guestName, guestEmail }),
    });
    if (res.ok) {
      setFormMsg("✓ Blokace přidána.");
      setCheckIn(""); setCheckOut(""); setGuestName(""); setGuestEmail("");
      load();
    } else {
      setFormMsg("✗ Chyba. Zkuste znovu.");
    }
    setAdding(false);
  };

  if (!secret) return (
    <div className="p-8 text-center text-red-600">Chybí heslo v URL: ?secret=...</div>
  );

  const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-green-700";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-950 text-white px-6 py-4 flex items-center gap-4">
        <h1 className="font-serif text-xl">Bouda Krista — Správa rezervací</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* Add block */}
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

        {/* Bookings list */}
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Všechny rezervace a blokace ({bookings.length})
            </h2>
            <button onClick={load} className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1 rounded">
              Obnovit
            </button>
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
                      {b.guestEmail
                        ? <a href={`mailto:${b.guestEmail}`} className="text-green-700 hover:underline">{b.guestEmail}</a>
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {b.totalCzk > 0 ? `${b.totalCzk.toLocaleString("cs-CZ")} Kč` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(b)}
                        disabled={deleting === b.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40"
                      >
                        {deleting === b.id ? "…" : "Smazat"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
