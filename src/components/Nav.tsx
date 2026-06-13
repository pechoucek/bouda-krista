"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { useT, type Locale } from "@/i18n/translations";

type Props = { locale: Locale };

export default function Nav({ locale }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const tr = useT(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Build opposite-locale URL
  const otherLocale: Locale = locale === "cs" ? "en" : "cs";
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    ["#about",     tr.nav.about],
    ["#gallery",   tr.nav.gallery],
    ["#amenities", tr.nav.amenities],
    ["#location",  tr.nav.location],
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-forest-950/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Logo href={`/${locale}`} />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-stone-warm/80 hover:text-stone-warm text-sm tracking-widest uppercase transition-colors"
            >
              {label}
            </a>
          ))}
          <Link href={`/${locale}/book`} className="btn-primary py-3 px-6 text-xs">
            {tr.nav.book}
          </Link>
          {/* Language switcher */}
          <Link
            href={otherPath}
            className="text-stone-warm/50 hover:text-stone-warm text-xs tracking-widest uppercase transition-colors border border-stone-warm/20 hover:border-stone-warm/50 px-2 py-1"
          >
            {otherLocale.toUpperCase()}
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
          {navLinks.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-stone-warm/80 hover:text-stone-warm text-sm tracking-widest uppercase"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link href={`/${locale}/book`} className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
            {tr.nav.book}
          </Link>
          <Link
            href={otherPath}
            className="text-stone-warm/50 text-xs tracking-widest uppercase text-center"
            onClick={() => setMenuOpen(false)}
          >
            {otherLocale === "cs" ? "Česky" : "English"}
          </Link>
        </div>
      )}
    </header>
  );
}
