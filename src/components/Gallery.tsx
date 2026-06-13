"use client";

import { useState } from "react";
import Image from "next/image";
import { photos, categories } from "@/data/photos";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === "all"
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <p className="section-subtitle mb-4">Photo Tour</p>
        <h2 className="section-title">Inside Lodge Krista</h2>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-5 py-2 text-xs font-sans tracking-widest uppercase transition-all duration-200 border ${
              activeCategory === cat.key
                ? "bg-forest-700 text-stone-warm border-forest-700"
                : "border-forest-300 text-forest-700 hover:border-forest-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {filtered.map((photo, idx) => (
          <div
            key={photo.url}
            className="relative overflow-hidden cursor-pointer group break-inside-avoid"
            onClick={() => openLightbox(idx)}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              width={600}
              height={400}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ height: "auto" }}
            />
            <div className="absolute inset-0 bg-forest-950/0 group-hover:bg-forest-950/20 transition-all duration-300 flex items-center justify-center">
              <svg className="w-10 h-10 text-stone-warm opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-forest-950/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-stone-warm/70 hover:text-stone-warm"
            onClick={closeLightbox}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 md:left-8 text-stone-warm/70 hover:text-stone-warm"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative max-w-5xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightbox].url}
              alt={filtered[lightbox].alt}
              width={1440}
              height={960}
              className="max-h-[85vh] w-auto object-contain"
            />
            <p className="absolute bottom-0 left-0 right-0 text-center text-stone-warm/60 text-sm py-3 font-sans">
              {filtered[lightbox].alt} · {lightbox + 1} / {filtered.length}
            </p>
          </div>

          <button
            className="absolute right-4 md:right-8 text-stone-warm/70 hover:text-stone-warm"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
