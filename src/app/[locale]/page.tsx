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
                href="https://www.airbnb.com/rooms/1681755602554370759"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                {tr.about.airbnb}
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
            <Link href={`/${l}/book`} className="hover:text-stone-warm transition-colors">{tr.footer.book}</Link>
          </nav>
          <p className="font-sans text-xs">© {new Date().getFullYear()} Bouda Krista</p>
        </div>
      </footer>
    </>
  );
}
