export type Locale = "cs" | "en";
export const locales: Locale[] = ["cs", "en"];
export const defaultLocale: Locale = "cs";

const t = {
  cs: {
    // Nav
    nav: {
      about:     "O nás",
      gallery:   "Galerie",
      amenities: "Vybavení",
      location:  "Kde jsme",
      contact:   "Kontakt",
      book:      "Rezervovat",
    },

    // Hero
    hero: {
      subtitle:    "Krkonošský národní park · Česká republika",
      description: "Horský úkryt se třemi designovými apartmány, soukromou saunou a dechberoucími výhledy na hory.",
      cta:         "Ověřit dostupnost",
      discover:    "Zjistit více",
    },

    // Stats
    stats: {
      guests:     "Hostů max.",
      bedrooms:   "Ložnice",
      apartments: "Apartmány",
      bathrooms:  "Koupelny",
    },

    // About
    about: {
      subtitle: "O ubytování",
      title:    "Horský úkryt v srdci Krkonoš",
      p1:       "Na krkonošském kopci stojí nově zrekonstruovaná Bouda Krista — objekt s bohatou historií a třemi designovými apartmány chytře propojenými: apartmán Tiny pro dva, apartmán Timber pro 2–4 hosty a apartmán Top Floor pro až pět hostů.",
      p2:       "Bouda je ideální pro velké rodiny nebo skupiny, které hledají klidný pobyt na horských loukách — se sdílenou saunou, terasou s výhledem na kostel a hory a klidem přírody kolem.",
      reserve:  "Rezervovat pobyt",
      airbnb:   "Zobrazit na Airbnb",
    },

    // Apartments section
    apartments: {
      subtitle:  "Tři prostory, jedna bouda",
      title:     "Apartmány",
      guests:    "hostů",
      perNight:  "Kč / noc",
      details:   "Zobrazit detail →",
      wholeNote: "Potřebujete celou boudu? Rezervujte všechny tři apartmány najednou pro až 11 hostů.",
      bookCta:   "Rezervovat pobyt",
      upTo:      "Až",
    },

    // Amenities
    amenities: {
      subtitle: "Co je zahrnuto",
      title:    "Vybavení",
      items: [
        { label: "Krb",              desc: "Útulný dřevěný krb v hlavním obývacím prostoru" },
        { label: "Soukromá sauna",   desc: "Sdílená sauna dostupná pro všechny hosty" },
        { label: "Rychlé Wi-Fi",     desc: "Rychlé připojení v celém objektu" },
        { label: "Plná kuchyně",     desc: "Tři vybavené kuchyňky — jedna na každý apartmán" },
        { label: "Parkoviště zdarma",desc: "Soukromé parkoviště pro více vozidel" },
        { label: "Terasa a balkón",  desc: "Panoramatická terasa s výhledem na kostel a hory" },
        { label: "Pračka",           desc: "Pračka k dispozici pro delší pobyty" },
        { label: "Národní park",     desc: "Umístění v Krkonošském národním parku" },
        { label: "Samoobslužný příjezd", desc: "Vstup přes schránku na klíče — přijeďte kdykoli" },
      ],
    },

    // Location
    location: {
      subtitle: "Jak se k nám dostanete",
      title:    "Rokytnice nad Jizerou, Krkonoše",
      p1:       "Bouda Krista leží uvnitř Krkonošského národního parku — největšího národního parku v České republice. Nejbližším městem je Rokytnice nad Jizerou, oblíbené lyžařské a turistické středisko v Krkonoších.",
      bullets: [
        "~1,5 hodiny z Prahy autem",
        "Přímé sjezdovky a turistické stezky v zimě i létě",
        "Parkování zdarma přímo v objektu",
      ],
      bookCta: "Rezervovat pobyt",
    },

    // CTA
    cta: {
      subtitle: "Připraveni na útěk?",
      title:    "Zarezervujte svůj pobyt",
      desc:     "Vyberte si termín, zaplaťte bezpečně online a okamžitě obdržíte potvrzení.",
      button:   "Ověřit dostupnost",
    },

    // Footer
    footer: {
      about:     "O nás",
      gallery:   "Galerie",
      amenities: "Vybavení",
      location:  "Kde jsme",
      contact:   "Kontakt",
      book:      "Rezervace",
    },

    // Book page
    book: {
      headerBack:  "← Zpět",
      subtitle:    "Rezervujte svůj pobyt",
      title:       "Rezervace Bouda Krista",
      step1:       "Krok 1 — Vyberte ubytování",
      step2label:  "Krok 2 — Vyberte termín",
      step3:       "Krok 3 — Vaše údaje",
      name:        "Celé jméno",
      namePlaceholder: "Vaše jméno",
      email:       "E-mail",
      emailPlaceholder: "vas@email.cz",
      errorFill:   "Vyplňte prosím všechna pole a vyberte termín.",
      nights:      "noc",
      nightsPlural:"í",
      total:       "Celkem",
      calculating: "Počítám…",
      submit:      "Odeslat poptávku",
      submitting:  "Odesílám…",
      payNote:     "Ozveme se vám co nejdříve s potvrzením a platebními instrukcemi.",
      rules:       "Pravidla domu",
      checkin:     "Příjezd po 15:00 · Odjezd do 11:00",
      selfCheckin: "Samoobslužné ubytování přes schránku na klíče",
    },

    // Contact
    contact: {
      subtitle:    "Máte otázky?",
      title:       "Napište nám",
      name:        "Jméno",
      namePlaceholder: "Vaše jméno",
      email:       "E-mail",
      emailPlaceholder: "vas@email.cz",
      message:     "Zpráva",
      messagePlaceholder: "Co vás zajímá?",
      submit:      "Odeslat zprávu",
      submitting:  "Odesílám…",
      success:     "Zpráva odeslána! Ozveme se vám co nejdříve.",
      error:       "Něco se pokazilo. Zkuste to prosím znovu.",
    },

    // Success
    success: {
      badge:   "Poptávka odeslána",
      title:   "Brzy se vám ozveme!",
      desc:    "Obdrželi jsme vaši poptávku a potvrzovací e-mail je na cestě. Ozveme se vám co nejdříve s potvrzením dostupnosti a platebními instrukcemi.",
      backHome:"Zpět na hlavní stránku",
    },
  },

  en: {
    // Nav
    nav: {
      about:     "About",
      gallery:   "Gallery",
      amenities: "Amenities",
      location:  "Location",
      contact:   "Contact",
      book:      "Book Now",
    },

    // Hero
    hero: {
      subtitle:    "Krkonoše National Park · Czech Republic",
      description: "A hilltop retreat with three designer apartments, private sauna, and breathtaking mountain views.",
      cta:         "Check Availability",
      discover:    "Discover More",
    },

    // Stats
    stats: {
      guests:     "Guests Max",
      bedrooms:   "Bedrooms",
      apartments: "Apartments",
      bathrooms:  "Bathrooms",
    },

    // About
    about: {
      subtitle: "About the Lodge",
      title:    "A Hilltop Retreat in the Heart of Krkonoše",
      p1:       "On a Krkonoše hilltop stands the newly renovated Bouda Krista — a property with an impressive history and three designer apartments intelligently interconnected: the Tiny apartment for two, the Timber apartment for 2–4 guests, and the Top Floor apartment for up to five.",
      p2:       "The Lodge is perfect for extended families or groups seeking a peaceful time in mountain meadows, with a shared sauna, a terrace overlooking the church and mountains, and quiet nature all around.",
      reserve:  "Reserve Your Stay",
      airbnb:   "View on Airbnb",
    },

    // Apartments section
    apartments: {
      subtitle:  "Three Spaces, One Lodge",
      title:     "The Apartments",
      guests:    "guests",
      perNight:  "CZK / night",
      details:   "View details →",
      wholeNote: "Need the whole lodge? Book all three apartments together for up to 11 guests.",
      bookCta:   "Book Your Stay",
      upTo:      "Up to",
    },

    // Amenities
    amenities: {
      subtitle: "What's Included",
      title:    "Lodge Amenities",
      items: [
        { label: "Indoor Fireplace",  desc: "Cozy wood-burning fireplace in the main living area" },
        { label: "Private Sauna",     desc: "Shared sauna available for all guests" },
        { label: "High-Speed WiFi",   desc: "Fast internet throughout the property" },
        { label: "Full Kitchen",      desc: "Three equipped kitchens — one per apartment" },
        { label: "Free Parking",      desc: "Private parking on premises for multiple vehicles" },
        { label: "Terrace & Balcony", desc: "Panoramic terrace overlooking the church and mountains" },
        { label: "Washer",            desc: "Washing machine available for longer stays" },
        { label: "National Park",     desc: "Located inside Krkonoše National Park" },
        { label: "Self Check-in",     desc: "Lockbox entry — arrive at your own convenience" },
      ],
    },

    // Location
    location: {
      subtitle: "Getting Here",
      title:    "Rokytnice nad Jizerou, Krkonoše",
      p1:       "Bouda Krista sits inside Krkonoše National Park — the largest national park in the Czech Republic. The nearest town is Rokytnice nad Jizerou, a well-known ski and hiking resort in the Giant Mountains.",
      bullets: [
        "~1.5 hours from Prague by car",
        "Direct ski lifts and hiking trails in winter and summer",
        "Free private parking on premises",
      ],
      bookCta: "Book Your Stay",
    },

    // CTA
    cta: {
      subtitle: "Ready to Escape?",
      title:    "Book Your Stay",
      desc:     "Select your dates, complete payment securely online, and receive instant confirmation.",
      button:   "Check Availability",
    },

    // Footer
    footer: {
      about:     "About",
      gallery:   "Gallery",
      amenities: "Amenities",
      location:  "Location",
      contact:   "Contact",
      book:      "Book",
    },

    // Book page
    book: {
      headerBack:  "← Back",
      subtitle:    "Reserve Your Stay",
      title:       "Book Bouda Krista",
      step1:       "Step 1 — Choose your accommodation",
      step2label:  "Step 2 — Select dates",
      step3:       "Step 3 — Your details",
      name:        "Full Name",
      namePlaceholder: "Your full name",
      email:       "Email",
      emailPlaceholder: "your@email.com",
      errorFill:   "Please fill in all fields and select your dates.",
      nights:      "night",
      nightsPlural:"s",
      total:       "Total",
      calculating: "Calculating…",
      submit:      "Send Reservation Request",
      submitting:  "Sending…",
      payNote:     "We will get back to you shortly to confirm availability and arrange payment.",
      rules:       "House Rules",
      checkin:     "Check-in after 15:00 · Check-out before 11:00",
      selfCheckin: "Self check-in via lockbox",
    },

    // Contact
    contact: {
      subtitle:    "Have questions?",
      title:       "Get in Touch",
      name:        "Name",
      namePlaceholder: "Your name",
      email:       "Email",
      emailPlaceholder: "your@email.com",
      message:     "Message",
      messagePlaceholder: "What would you like to know?",
      submit:      "Send Message",
      submitting:  "Sending…",
      success:     "Message sent! We'll get back to you as soon as possible.",
      error:       "Something went wrong. Please try again.",
    },

    // Success
    success: {
      badge:   "Request Sent",
      title:   "We'll be in touch soon!",
      desc:    "We received your reservation request and a confirmation email is on its way. We will contact you shortly to confirm availability and arrange payment.",
      backHome:"Back to Home",
    },
  },
} as const;

export type TranslationKey = typeof t.en;
export function useT(locale: Locale) {
  return t[locale];
}
