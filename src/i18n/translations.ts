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
      p1:       "Na krkonošském kopci stojí nově zrekonstruovaná Bouda Krista — objekt s bohatou historií a třemi designovými, chytře propojenými apartmány. Nabízíme malý apartmán pro 2 hosty, roubený apartmán pro 2–4 hosty a podkrovní apartmán pro 5 hostů.",
      p2:       "Bouda je ideální pro páry, rodiny nebo skupiny přátel, které hledají klidný pobyt na horských loukách plných srnek, zajíců a ptáčků. Odpočinkovou atmosféru podpoří sdílená sauna, dřevěný chalupářský design nebo terasa s výhledem na hory a zvukem zurčícího potůčku.",
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
        { label: "Plná kuchyně",     desc: "Tři vybavené kuchyně — jedna na každý apartmán" },
        { label: "Parkoviště zdarma",desc: "Soukromé parkoviště pro více vozidel" },
        { label: "Terasa",           desc: "Panoramatická terasa s výhledem na kostel a hory" },
        { label: "Pračka",           desc: "Pračka k dispozici v Podkrovním apartmánu" },
        { label: "Národní park",     desc: "Umístění v Krkonošském národním parku" },
        { label: "Samoobslužný příjezd", desc: "Vstup přes schránku na klíče — přijeďte kdykoli" },
      ],
    },

    // Location
    location: {
      subtitle: "Jak se k nám dostanete",
      title:    "Rokytnice nad Jizerou, Krkonoše",
      p1:       "Bouda Krista leží v Krkonošském národním parku, ve městě Rokytnice nad Jizerou, které je oblíbeným lyžařským a turistickým střediskem v Krkonoších.",
      bullets: [
        "Přibližně 1,5 hodiny jízdy autem z Prahy",
        "Celoroční přístup na sjezdovky i turistické stezky",
        "Parkování zdarma přímo u chalupy",
      ],
      bookCta: "Rezervovat pobyt",
    },

    // Summer discount
    summerDeal: {
      badge:  "Letní nabídka",
      title:  "Housewarming sleva na celý dům",
      desc:   "Zarezervujte celý dům na týden nebo déle a získáte speciální cenu 10 000 Kč za noc místo obvyklých 12 000 Kč. Nabídka platí pro pobyty začínající od června do konce srpna 2026.",
      cta:    "Zobrazit dostupnost",
    },

    // CTA
    cta: {
      subtitle: "Místo v horách na vás čeká.",
      title:    "Rezervujte si svůj pobyt.",
      desc:     "Stačí vybrat termín, bezpečně zaplatit online a potvrzení vám dorazí během několika minut.",
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
      desc1:       "Máte dotaz ohledně ubytování, vybavení, dostupnosti nebo čehokoli dalšího? Rádi vám pomůžeme.",
      desc2:       "Ozvěte se nám prostřednictvím kontaktního formuláře nebo nám napište zprávu na Instagramu.",
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
      p1:       "On a hill in the Krkonoše Mountains stands the newly renovated Bouda Krista — a hut with a rich history and three stylish, cleverly interconnected apartments. We offer a small apartment for 2 guests, a timber apartment for 2–4 guests, and an attic apartment for 5 guests.",
      p2:       "The hut is ideal for couples, families, or groups of friends looking for a peaceful stay in mountain meadows teeming with roe deer, hares, and birds. The relaxing atmosphere is enhanced by a shared sauna, rustic wooden cottage design, and a terrace with mountain views and the sound of a babbling brook.",
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
        { label: "Full Kitchen",      desc: "Three fully equipped kitchens — one per apartment" },
        { label: "Free Parking",      desc: "Private parking on premises for multiple vehicles" },
        { label: "Terrace",           desc: "Panoramic terrace overlooking the church and mountains" },
        { label: "Washer",            desc: "Washing machine available in the Attic apartment" },
        { label: "National Park",     desc: "Located inside Krkonoše National Park" },
        { label: "Self Check-in",     desc: "Lockbox entry — arrive at your own convenience" },
      ],
    },

    // Location
    location: {
      subtitle: "Getting Here",
      title:    "Rokytnice nad Jizerou, Krkonoše",
      p1:       "Bouda Krista is located in the Krkonoše National Park, in the town of Rokytnice nad Jizerou, a popular skiing and hiking destination in the Krkonoše Mountains.",
      bullets: [
        "Approximately 1.5 hours by car from Prague",
        "Direct access to ski slopes and hiking trails",
        "Free parking on site",
      ],
      bookCta: "Book Your Stay",
    },

    // Summer discount
    summerDeal: {
      badge:  "Summer offer",
      title:  "Housewarming discount for the whole lodge",
      desc:   "Book the entire lodge for a week or more and get a special rate of 10,000 CZK per night instead of the usual 12,000 CZK. Valid for stays starting June through end of August 2026.",
      cta:    "Check availability",
    },

    // CTA
    cta: {
      subtitle: "Mountains are waiting for you.",
      title:    "Book your stay.",
      desc:     "Just select your dates, pay securely online, and receive your confirmation within a few minutes.",
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
      desc1:       "Do you have a question about the accommodation, amenities, availability, or anything else? We are happy to help.",
      desc2:       "Get in touch using the contact form or send us a message on Instagram.",
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
