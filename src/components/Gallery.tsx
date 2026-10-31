"use client";

import { useState } from "react";
import Image from "next/image";

const photos = [
  { url: "/photos/IMG_2620.jpg",       alt: "Bouda Krista" },
  { url: "/photos/zentelFAR06286.jpg", alt: "Bouda Krista" },
  { url: "/photos/IMG_2770.jpg",       alt: "Bouda Krista" },
  { url: "/photos/DSCF8865.JPG",      alt: "Bouda Krista" },
  { url: "/photos/DSCF8782.JPG",      alt: "Bouda Krista" },
  { url: "/photos/DSCF8790.JPG",      alt: "Bouda Krista" },
  { url: "/photos/bb5d30ad.webp",     alt: "Bouda Krista" },
  { url: "/photos/e1a7808e.webp",     alt: "Bouda Krista" },
  { url: "/photos/0f78d46d.webp",     alt: "Bouda Krista" },
];

export default function Gallery({ locale = "cs" }: { locale?: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % photos.length : null));

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <p className="section-subtitle mb-4">{locale === "cs" ? "Fotogalerie" : "Photo Tour"}</p>
        <h2 className="section-title">{locale === "cs" ? "Jak vypadá Bouda Krista?" : "Inside Bouda Krista"}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo, idx) => (
          <div
            key={photo.url}
            className="relative overflow-hidden cursor-pointer group aspect-[4/3]"
            onClick={() => setLightbox(idx)}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-forest-950/0 group-hover:bg-forest-950/20 transition-all duration-300 flex items-center justify-center">
              <svg className="w-10 h-10 text-stone-warm opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-forest-950/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button className="absolute top-6 right-6 text-stone-warm/70 hover:text-stone-warm" onClick={closeLightbox}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button className="absolute left-4 md:left-8 text-stone-warm/70 hover:text-stone-warm" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative max-w-5xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[lightbox].url}
              alt={photos[lightbox].alt}
              width={1440}
              height={960}
              className="max-h-[85vh] w-auto object-contain"
            />
            <p className="absolute bottom-0 left-0 right-0 text-center text-stone-warm/60 text-sm py-3 font-sans">
              {lightbox + 1} / {photos.length}
            </p>
          </div>

          <button className="absolute right-4 md:right-8 text-stone-warm/70 hover:text-stone-warm" onClick={(e) => { e.stopPropagation(); next(); }}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
