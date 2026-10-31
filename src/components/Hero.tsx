"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useT, type Locale } from "@/i18n/translations";

const HERO_PHOTOS = [
  { url: "/photos/DJI_0666.jpg",                              alt: "Bouda Krista exterior with cherry blossom tree", credit: "photo Lukáš Žentel" },
  { url: "/photos/7c002b6b-0732-4dc5-a9db-b9138467ffc8.jpeg", alt: "Lodge terrace overlooking mountains",            credit: null },
  { url: "/photos/18961a5f-670e-4ace-9bad-468d1d6c3fba.jpeg", alt: "Garden and surroundings",                        credit: null },
];

type Props = { locale: Locale };

export default function Hero({ locale }: Props) {
  const tr = useT(locale);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((i) => (i + 1) % HERO_PHOTOS.length), []);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + HERO_PHOTOS.length) % HERO_PHOTOS.length), []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const t = setTimeout(next, 6000);
    return () => clearTimeout(t);
  }, [current, next]);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Images */}
      {HERO_PHOTOS.map((photo, i) => (
        <div
          key={photo.url}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            className="object-cover object-center"
            priority={i === 0}
            quality={90}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/30 to-forest-950/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="section-subtitle text-gold mb-6 tracking-[0.4em]">
          {tr.hero.subtitle}
        </p>
        <h1 className="font-serif text-6xl md:text-8xl text-stone-warm font-light leading-none mb-6">
          Bouda Krista
        </h1>
        <p className="font-sans text-stone-warm/80 text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed">
          {tr.hero.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/book`} className="btn-primary">
            {tr.hero.cta}
          </Link>
          <a href="#about" className="btn-outline border-stone-warm/70 text-stone-warm hover:bg-stone-warm/10 hover:text-stone-warm">
            {tr.hero.discover}
          </a>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 text-stone-warm/60 hover:text-stone-warm transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next photo"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 text-stone-warm/60 hover:text-stone-warm transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Photo ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-stone-warm w-4" : "bg-stone-warm/40"}`}
          />
        ))}
      </div>

      {/* Photo credit */}
      {HERO_PHOTOS[current].credit && (
        <p className="absolute bottom-4 right-4 z-10 text-stone-warm/40 text-[11px] font-sans tracking-wide">
          {HERO_PHOTOS[current].credit}
        </p>
      )}

      {/* Scroll arrow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-stone-warm/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
