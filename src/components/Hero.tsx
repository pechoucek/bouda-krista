import Image from "next/image";
import Link from "next/link";
import { heroPhoto } from "@/data/photos";
import { useT, type Locale } from "@/i18n/translations";

type Props = { locale: Locale };

export default function Hero({ locale }: Props) {
  const tr = useT(locale);

  return (
    <section className="relative h-[78vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <Image
        src={heroPhoto.url}
        alt={heroPhoto.alt}
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/30 to-forest-950/70" />

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

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-stone-warm/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
