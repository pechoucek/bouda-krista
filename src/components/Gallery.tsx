"use client";

import { useState } from "react";
import Image from "next/image";

const photos = [
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/0f78d46d-636a-441c-8882-5ea6d80e3e9a.jpeg?im_w=1440", alt: "Bouda Krista" },
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/88c132ff-5c79-40b7-a094-959a05128f2f.jpeg?im_w=1440", alt: "Bouda Krista" },
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/ef77d4b4-452f-4b93-a3d0-c366c3205906.jpeg?im_w=1440", alt: "Bouda Krista" },
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/3cabd249-e82b-417e-9d8d-85f8fdcea26c.jpeg?im_w=1440", alt: "Bouda Krista" },
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/30db18dc-c695-4ea5-873d-2a9d3abbc227.jpeg?im_w=1440", alt: "Bouda Krista" },
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1677566795867113387/original/a0052c7c-9e4e-4b02-8031-77beaf51ff5b.jpeg?im_w=1440", alt: "Bouda Krista" },
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1681755602554370759/original/daa6a02b-06de-4b6d-8abb-cfbd6ab77c33.jpeg?im_w=1440", alt: "Bouda Krista exterior" },
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1677566795867113387/original/bb5d30ad-61d3-4945-9c08-5b3f5e3feed1.jpeg?im_w=1440", alt: "Bouda Krista" },
  { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1681755602554370759/original/e1a7808e-7fd2-4d1e-bd22-d78a8aef1e7b.jpeg?im_w=1440", alt: "Bouda Krista" },
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

      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {photos.map((photo, idx) => (
          <div
            key={photo.url}
            className="relative overflow-hidden cursor-pointer group break-inside-avoid"
            onClick={() => setLightbox(idx)}
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
