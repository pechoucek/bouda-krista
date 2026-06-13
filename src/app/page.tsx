import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Amenities from "@/components/Amenities";
import { photos } from "@/data/photos";

const exteriorPhotos = photos.filter((p) => p.category === "exterior");

const apartments = [
  {
    name: "Tiny Apartment",
    capacity: "Up to 2 guests",
    desc: "A cosy, intimate space perfect for couples seeking a peaceful mountain escape.",
    beds: "1 bedroom · 1 bed",
  },
  {
    name: "Timber Apartment",
    capacity: "Up to 4 guests",
    desc: "Warm timber finishes and designer details make this mid-size apartment a favourite for small families.",
    beds: "2 bedrooms · 2 beds",
  },
  {
    name: "Top Floor Apartment",
    capacity: "Up to 5 guests",
    desc: "The crown of the lodge — sweeping views, the largest living space, and access to the panoramic terrace.",
    beds: "2 bedrooms · 3 beds",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <Hero />

      {/* Stats bar */}
      <div className="bg-forest-900 text-stone-warm py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["11", "Guests Max"],
            ["5",  "Bedrooms"],
            ["3",  "Apartments"],
            ["3.5","Bathrooms"],
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
            <p className="section-subtitle mb-5">About the Lodge</p>
            <h2 className="section-title mb-8">
              A Hilltop Retreat in the Heart of Krkonoše
            </h2>
            <p className="font-sans text-forest-700 leading-relaxed mb-6">
              On a Krkonoše hilltop stands the newly renovated Bouda Krista — a property with an impressive history and
              three designer apartments intelligently interconnected: the <em>Tiny</em> apartment for two, the{" "}
              <em>Timber</em> apartment for 2–4 guests, and the <em>Top Floor</em> apartment for up to five.
            </p>
            <p className="font-sans text-forest-700 leading-relaxed mb-10">
              The Lodge is perfect for extended families or groups seeking a peaceful time in mountain meadows, with a
              shared sauna, a terrace overlooking the church and mountains, and quiet nature all around.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book" className="btn-primary">Reserve Your Stay</Link>
              <a
                href="https://www.airbnb.com/rooms/1681755602554370759"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                View on Airbnb
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
      <section className="py-24 bg-forest-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-subtitle mb-4">Three Spaces, One Lodge</p>
            <h2 className="section-title">The Apartments</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {apartments.map((apt, i) => (
              <div key={apt.name} className="bg-white p-10 border-t-2 border-gold hover:shadow-lg transition-shadow">
                <div className="font-serif text-5xl text-forest-200 mb-4 select-none">0{i + 1}</div>
                <h3 className="font-serif text-2xl text-forest-900 mb-2">{apt.name}</h3>
                <p className="font-sans text-xs tracking-widest uppercase text-gold mb-4">{apt.capacity}</p>
                <p className="font-sans text-sm text-forest-600 leading-relaxed mb-6">{apt.desc}</p>
                <p className="font-sans text-xs text-forest-400 tracking-wide">{apt.beds}</p>
              </div>
            ))}
          </div>

          <p className="text-center font-sans text-sm text-forest-500 mt-10">
            Book the entire lodge for your group — all three apartments are available together.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <Gallery />

      {/* Amenities */}
      <Amenities />

      {/* Location */}
      <section id="location" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle mb-5">Getting Here</p>
            <h2 className="section-title mb-8">Rokytnice nad Jizerou, Krkonoše</h2>
            <p className="font-sans text-forest-700 leading-relaxed mb-6">
              Bouda Krista sits inside <strong>Krkonoše National Park</strong> — the largest national park in
              the Czech Republic. The nearest town is Rokytnice nad Jizerou, a well-known ski and hiking resort in
              the Giant Mountains (Krkonoše).
            </p>
            <ul className="font-sans text-sm text-forest-600 space-y-3 mb-10">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                ~1.5 hours from Prague by car
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Direct ski lifts and hiking trails in winter and summer
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Free private parking on premises
              </li>
            </ul>
            <Link href="/book" className="btn-primary">Book Your Stay</Link>
          </div>

          {/* Map embed placeholder */}
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
          <p className="section-subtitle text-gold mb-6">Ready to Escape?</p>
          <h2 className="font-serif text-5xl md:text-6xl text-stone-warm font-light mb-8">
            Book Your Stay
          </h2>
          <p className="font-sans text-stone-warm/70 text-lg mb-12 max-w-lg mx-auto">
            Select your dates, complete payment securely online, and receive instant confirmation.
          </p>
          <Link href="/book" className="btn-primary text-base px-12 py-5">
            Check Availability
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
            <a href="#about"     className="hover:text-stone-warm transition-colors">About</a>
            <a href="#gallery"   className="hover:text-stone-warm transition-colors">Gallery</a>
            <a href="#amenities" className="hover:text-stone-warm transition-colors">Amenities</a>
            <a href="#location"  className="hover:text-stone-warm transition-colors">Location</a>
            <Link href="/book"   className="hover:text-stone-warm transition-colors">Book</Link>
          </nav>
          <p className="font-sans text-xs">© {new Date().getFullYear()} Bouda Krista</p>
        </div>
      </footer>
    </>
  );
}
