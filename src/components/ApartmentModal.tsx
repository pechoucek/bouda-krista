"use client";

import { useState, useEffect } from "react";
import { ApartmentDetail } from "@/data/apartments";
import { type Locale } from "@/i18n/translations";

type Props = {
  apartment: ApartmentDetail | null;
  locale: Locale;
  onClose: () => void;
  onBook: (id: string) => void;
};

export default function ApartmentModal({ apartment, locale, onClose, onBook }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => { setPhotoIndex(0); }, [apartment]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!apartment) return null;

  const photos = apartment.photos;
  const isCz = locale === "cs";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo gallery */}
        <div className="relative aspect-[16/9] bg-forest-100 overflow-hidden">
          <img
            src={photos[photoIndex]?.url}
            alt={photos[photoIndex]?.alt}
            className="w-full h-full object-cover"
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 flex items-center justify-center text-lg transition-colors"
              >‹</button>
              <button
                onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 flex items-center justify-center text-lg transition-colors"
              >›</button>
            </>
          )}

          {photos.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white font-sans text-xs px-2 py-1">
              {photoIndex + 1} / {photos.length}
            </div>
          )}

          {photos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIndex ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white w-8 h-8 flex items-center justify-center transition-colors text-lg"
          >×</button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-serif text-2xl text-forest-900">{isCz ? apartment.nameCs : apartment.name}</h2>
              <p className="font-sans text-sm text-forest-500 mt-1">
                {isCz ? apartment.taglineCs : apartment.tagline}
              </p>
            </div>
            <div className="text-right">
              <div className="font-serif text-xl text-forest-900">
                {apartment.defaultNightlyRate.toLocaleString("cs-CZ")} Kč
              </div>
              <div className="font-sans text-xs text-forest-500">{isCz ? "za noc" : "per night"}</div>
            </div>
          </div>

          <div className="flex gap-4 py-4 border-y border-forest-100 mb-5 font-sans text-sm text-forest-700 flex-wrap">
            <span>👤 {apartment.guestsLabel ?? `${isCz ? "Až" : "Up to"} ${apartment.guests}`} {isCz ? "hostů" : "guests"}</span>
            <span>🛏 {isCz ? apartment.bedsCs : apartment.beds}</span>
            <span>🚿 {isCz ? apartment.bathroomsCs : apartment.bathrooms}</span>
          </div>

          <p className="font-sans text-sm text-forest-700 leading-relaxed mb-6">
            {isCz ? apartment.descriptionCs : apartment.description}
          </p>

          <div className="mb-8">
            <p className="font-sans text-xs tracking-widest uppercase text-forest-500 mb-3">
              {isCz ? "Co je k dispozici" : "What this place offers"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(isCz ? apartment.amenitiesCs : apartment.amenities).map((a) => (
                <div key={a} className="flex items-center gap-2 font-sans text-sm text-forest-700">
                  <span className="w-1 h-1 rounded-full bg-gold inline-block flex-shrink-0" />
                  {a}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { onBook(apartment.id); onClose(); }}
            className="btn-primary w-full text-center"
          >
            {isCz ? `Rezervovat — ${apartment.nameCs}` : `Book ${apartment.name}`}
          </button>
        </div>
      </div>
    </div>
  );
}
