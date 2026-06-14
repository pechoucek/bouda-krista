"use client";

import { useState } from "react";
import Link from "next/link";
import ApartmentModal from "@/components/ApartmentModal";
import { apartmentDetails, ApartmentDetail } from "@/data/apartments";
import { useT, type Locale } from "@/i18n/translations";

const displayApts = apartmentDetails.filter((a) => a.id !== "whole");

type Props = { locale: Locale };

export default function ApartmentsSection({ locale }: Props) {
  const [modalApt, setModalApt] = useState<ApartmentDetail | null>(null);
  const tr = useT(locale);

  return (
    <section className="py-24 bg-forest-50">
      <ApartmentModal
        apartment={modalApt}
        locale={locale}
        onClose={() => setModalApt(null)}
        onBook={() => {}}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subtitle mb-4">{tr.apartments.subtitle}</p>
          <h2 className="section-title">{tr.apartments.title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayApts.map((apt) => (
            <button
              key={apt.id}
              type="button"
              onClick={() => setModalApt(apt)}
              className="group text-left bg-white border border-forest-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={apt.photos[0].url}
                  alt={apt.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <span className="font-serif text-xl text-stone-warm">{locale === "cs" ? apt.nameCs : apt.name}</span>
                  <span className="font-sans text-xs text-stone-warm/70 tracking-wide">
                    {tr.apartments.upTo} {apt.guests} {tr.apartments.guests}
                  </span>
                </div>
              </div>

              <div className="p-6 border-t-2 border-gold">
                <p className="font-sans text-sm text-forest-600 leading-relaxed mb-4 line-clamp-3">
                  {locale === "cs" ? apt.descriptionCs : apt.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-medium text-forest-700">
                    {apt.defaultNightlyRate.toLocaleString("cs-CZ")} {tr.apartments.perNight}
                  </span>
                  <span className="font-sans text-xs text-gold tracking-widest uppercase group-hover:underline">
                    {tr.apartments.details}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="font-sans text-sm text-forest-500">
            {tr.apartments.wholeNote}
          </p>
          <Link href={`/${locale}/book`} className="btn-primary inline-block">
            {tr.apartments.bookCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
