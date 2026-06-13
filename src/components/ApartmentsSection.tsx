"use client";

import { useState } from "react";
import Link from "next/link";
import ApartmentModal from "@/components/ApartmentModal";
import { apartmentDetails, ApartmentDetail } from "@/data/apartments";

// Only show the 3 individual apartments (not whole house) in the about section
const displayApts = apartmentDetails.filter((a) => a.id !== "whole");

export default function ApartmentsSection() {
  const [modalApt, setModalApt] = useState<ApartmentDetail | null>(null);

  return (
    <section className="py-24 bg-forest-50">
      <ApartmentModal
        apartment={modalApt}
        onClose={() => setModalApt(null)}
        onBook={() => {}}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subtitle mb-4">Three Spaces, One Lodge</p>
          <h2 className="section-title">The Apartments</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayApts.map((apt) => (
            <button
              key={apt.id}
              type="button"
              onClick={() => setModalApt(apt)}
              className="group text-left bg-white border border-forest-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={apt.photos[0].url}
                  alt={apt.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <span className="font-serif text-xl text-stone-warm">{apt.name}</span>
                  <span className="font-sans text-xs text-stone-warm/70 tracking-wide">Up to {apt.guests} guests</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 border-t-2 border-gold">
                <p className="font-sans text-sm text-forest-600 leading-relaxed mb-4 line-clamp-3">
                  {apt.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-medium text-forest-700">
                    {apt.defaultNightlyRate.toLocaleString("cs-CZ")} Kč / noc
                  </span>
                  <span className="font-sans text-xs text-gold tracking-widest uppercase group-hover:underline">
                    View details →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="font-sans text-sm text-forest-500">
            Need the whole lodge? Book all three apartments together for up to 11 guests.
          </p>
          <Link href="/book" className="btn-primary inline-block">
            Book Your Stay
          </Link>
        </div>
      </div>
    </section>
  );
}
