"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-forest-950/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-stone-warm tracking-wider">
          Bouda Krista
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            ["#about",      "About"],
            ["#gallery",    "Gallery"],
            ["#amenities",  "Amenities"],
            ["#location",   "Location"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-stone-warm/80 hover:text-stone-warm text-sm tracking-widest uppercase transition-colors"
            >
              {label}
            </a>
          ))}
          <Link href="/book" className="btn-primary py-3 px-6 text-xs">
            Book Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stone-warm"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-forest-950/98 px-6 pb-8 flex flex-col gap-6">
          {[
            ["#about",      "About"],
            ["#gallery",    "Gallery"],
            ["#amenities",  "Amenities"],
            ["#location",   "Location"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-stone-warm/80 hover:text-stone-warm text-sm tracking-widest uppercase"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link href="/book" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
