import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Amenities from "@/components/Amenities";
import ApartmentsSection from "@/components/ApartmentsSection";
import { photos } from "@/data/photos";
import { useT, type Locale } from "@/i18n/translations";
import { notFound } from "next/navigation";
import Contact from "@/components/Contact";

const exteriorPhotos = photos.filter((p) => p.category === "exterior");

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!["cs", "en"].includes(locale)) notFound();
  const l = locale as Locale;
  const tr = useT(l);

  return (
    <>
      <Nav locale={l} />

      {/* Hero */}
      <Hero locale={l} />

      {/* Stats bar */}
      <div className="bg-forest-900 text-stone-warm py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["11", tr.stats.guests],
            ["5",  tr.stats.bedrooms],
            ["3",  tr.stats.apartments],
            ["3.5",tr.stats.bathrooms],
          ].map(([val, lbl]) => (
            <div key={lbl}>
              <div className="font-serif text-4xl text-gold">{val}</div>
              <div className="font-sans text-xs tracking-widest uppercase text-stone-warm/60 mt-1">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle mb-5">{tr.about.subtitle}</p>
            <h2 className="section-title mb-8">{tr.about.title}</h2>
            <p className="font-sans text-forest-700 leading-relaxed mb-6">{tr.about.p1}</p>
            <p className="font-sans text-forest-700 leading-relaxed mb-10">{tr.about.p2}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${l}/book`} className="btn-primary">{tr.about.reserve}</Link>
              <a
                href="https://www.instagram.com/bouda_krista"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @bouda_krista
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {exteriorPhotos.slice(0, 4).map((photo) => (
              <div key={photo.url} className="relative overflow-hidden aspect-square">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apartments */}
      <ApartmentsSection locale={l} />

      {/* Gallery */}
      <Gallery />

      {/* Amenities */}
      <Amenities locale={l} />

      {/* Location */}
      <section id="location" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle mb-5">{tr.location.subtitle}</p>
            <h2 className="section-title mb-8">{tr.location.title}</h2>
            <p className="font-sans text-forest-700 leading-relaxed mb-6">{tr.location.p1}</p>
            <ul className="font-sans text-sm text-forest-600 space-y-3 mb-10">
              {tr.location.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {bullet}
                </li>
              ))}
            </ul>
            <Link href={`/${l}/book`} className="btn-primary">{tr.location.bookCta}</Link>
          </div>

          <div className="relative h-96 bg-forest-100 overflow-hidden">
            <iframe
              title="Bouda Krista location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=15.40,50.70,15.55,50.80&layer=mapnik&marker=50.737,15.459"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <Contact locale={l} />

      {/* CTA banner */}
      <section className="relative py-32 overflow-hidden">
        <Image
          src={photos.find((p) => p.category === "outdoor")?.url ?? photos[21].url}
          alt="Bouda Krista balcony view"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-forest-950/75" />
        <div className="relative z-10 text-center px-6">
          <p className="section-subtitle text-gold mb-6">{tr.cta.subtitle}</p>
          <h2 className="font-serif text-5xl md:text-6xl text-stone-warm font-light mb-8">
            {tr.cta.title}
          </h2>
          <p className="font-sans text-stone-warm/70 text-lg mb-12 max-w-lg mx-auto">
            {tr.cta.desc}
          </p>
          <Link href={`/${l}/book`} className="btn-primary text-base px-12 py-5">
            {tr.cta.button}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-950 text-stone-warm/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl text-stone-warm mb-1">Bouda Krista</p>
            <p className="font-sans text-xs tracking-wider">Rokytnice nad Jizerou · Krkonoše · Czech Republic</p>
          </div>
          <nav className="flex gap-8 font-sans text-xs tracking-widest uppercase">
            <a href="#about"     className="hover:text-stone-warm transition-colors">{tr.footer.about}</a>
            <a href="#gallery"   className="hover:text-stone-warm transition-colors">{tr.footer.gallery}</a>
            <a href="#amenities" className="hover:text-stone-warm transition-colors">{tr.footer.amenities}</a>
            <a href="#location"  className="hover:text-stone-warm transition-colors">{tr.footer.location}</a>
            <a href="#contact"   className="hover:text-stone-warm transition-colors">{tr.footer.contact}</a>
            <Link href={`/${l}/book`} className="hover:text-stone-warm transition-colors">{tr.footer.book}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/bouda_krista"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-warm transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <p className="font-sans text-xs">© {new Date().getFullYear()} Bouda Krista</p>
          </div>
        </div>
      </footer>
    </>
  );
}
