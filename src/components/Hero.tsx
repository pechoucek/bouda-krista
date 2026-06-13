import Image from "next/image";
import Link from "next/link";
import { heroPhoto } from "@/data/photos";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src={heroPhoto.url}
        alt={heroPhoto.alt}
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/30 to-forest-950/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="section-subtitle text-gold mb-6 tracking-[0.4em]">
          Krkonoše National Park · Czech Republic
        </p>
        <h1 className="font-serif text-6xl md:text-8xl text-stone-warm font-light leading-none mb-6">
          Lodge Krista
        </h1>
        <p className="font-sans text-stone-warm/80 text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed">
          A hilltop retreat with three designer apartments, private sauna, and breathtaking mountain views.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/book" className="btn-primary">
            Check Availability
          </Link>
          <a href="#about" className="btn-outline border-stone-warm/70 text-stone-warm hover:bg-stone-warm/10 hover:text-stone-warm">
            Discover More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-stone-warm/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
