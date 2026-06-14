const BASE = "https://a0.muscache.com/im/pictures/hosting/Hosting-1681755602554370759/original";
const p = (file: string) => `${BASE}/${file}?im_w=1440`;

export type ApartmentDetail = {
  id: string;
  name: string;
  nameCs: string;
  tagline: string;
  taglineCs: string;
  description: string;
  descriptionCs: string;
  guests: number;
  bedrooms: string;
  bedroomsCs: string;
  beds: string;
  bedsCs: string;
  bathrooms: string;
  bathroomsCs: string;
  amenities: string[];
  amenitiesCs: string[];
  photos: { url: string; alt: string }[];
  defaultNightlyRate: number;
};

export const apartmentDetails: ApartmentDetail[] = [
  {
    id: "tiny",
    name: "Tiny Apartment",
    nameCs: "Malý apartmán",
    tagline: "The cosiest retreat for two",
    taglineCs: "Nejútulnější úkryt pro dva",
    description:
      "The Tiny Apartment is a perfectly formed hideaway for two. It comes equipped with a kitchenette and a private bathroom with shower. The highlight is the most wonderful bed nook you will never want to leave — tucked in and snug, with everything you need within reach. Step outside onto your own private terrace and take in the mountain air.",
    descriptionCs:
      "Tiny je dokonale navržený úkryt pro dva. K dispozici je kuchyňský kout a vlastní koupelna se sprchou. Hlavní lákadlem je postelová nika, ze které nebudete chtít vstávat — útulná a schovaná, s vším po ruce. Vyjděte na vlastní soukromou terasu a vdechněte horský vzduch.",
    guests: 2,
    bedrooms: "1 bedroom",
    bedroomsCs: "1 ložnice",
    beds: "1 king-size bed",
    bedsCs: "1 manželská postel",
    bathrooms: "1 bathroom (shower)",
    bathroomsCs: "1 koupelna (sprcha)",
    amenities: ["Private terrace", "Kitchenette", "Private bathroom", "Shower", "Mountain views", "Self check-in"],
    amenitiesCs: ["Soukromá terasa", "Kuchyňský kout", "Vlastní koupelna", "Sprcha", "Výhledy na hory", "Samoobslužný příjezd"],
    photos: [
      { url: p("efb84fec-a3f7-4000-9851-04fcdd08219f.jpeg"), alt: "Kitchen" },
      { url: p("506cd52f-5769-4c76-bef1-604987f9ae22.png"),  alt: "Kitchenette" },
      { url: p("528fc3f5-4655-4c23-a91d-4bf7e989962f.jpeg"), alt: "Bedroom" },
      { url: p("44b4b68c-4979-43e8-9d6c-70b37aa20b56.png"),  alt: "Grounds and garden" },
    ],
    defaultNightlyRate: 4000,
  },
  {
    id: "timber",
    name: "Timber Apartment",
    nameCs: "Dřevěný apartmán",
    tagline: "Space for four with a fireplace",
    taglineCs: "Prostor pro čtyři s krbem",
    description:
      "The Timber Apartment spans two rooms: a bedroom with terrace access and a private bathroom with shower, plus a bright living area with a fully equipped kitchenette, dining area, and a sofa that converts into two separate beds. Gather around the fireplace on cool mountain evenings — this apartment has warmth in every sense.",
    descriptionCs:
      "Apartmán Timber se rozkládá ve dvou pokojích: ložnice s přístupem na terasu a vlastní koupelnou se sprchou a světlý obývací pokoj s plně vybaveným kuchyňským koutem, jídelní částí a pohovkou, která se rozloží na dvě samostatná lůžka. Sejděte se u krbu v chladných horských večerech — tento apartmán má teplo ve všech ohledech.",
    guests: 4,
    bedrooms: "2 rooms",
    bedroomsCs: "2 pokoje",
    beds: "1 king-size bed + extendable sofa bed",
    bedsCs: "1 manželská postel + rozkládací pohovka",
    bathrooms: "1 bathroom (shower)",
    bathroomsCs: "1 koupelna (sprcha)",
    amenities: ["Fireplace", "Terrace access", "Fully equipped kitchenette", "Dining area", "Sofa bed", "Private bathroom", "Mountain views", "Self check-in"],
    amenitiesCs: ["Krb", "Přístup na terasu", "Plně vybavená kuchyňka", "Jídelní část", "Rozkládací pohovka", "Vlastní koupelna", "Výhledy na hory", "Samoobslužný příjezd"],
    photos: [
      { url: p("661dc332-b833-43f7-b755-05977b10e7c2.jpeg"), alt: "Dining area" },
      { url: p("7c002b6b-0732-4dc5-a9db-b9138467ffc8.jpeg"), alt: "Terrace overlooking mountains" },
    ],
    defaultNightlyRate: 6000,
  },
  {
    id: "topfloor",
    name: "Top Floor Apartment",
    nameCs: "Apartmán v podkroví",
    tagline: "Sweeping views for up to five",
    taglineCs: "Výhledy do krajiny pro až pět hostů",
    description:
      "The Top Floor Apartment is the most spacious of the three. Two bedrooms — one with a king-size bed, one with a long bed sleeping three — are joined by a huge living room with a fully equipped kitchen, dining table, and a beautiful oak bench. A relaxation sofa sits by a French window that opens directly onto the meadows. The bathroom offers mountain views, and there is a separate toilet for added convenience.",
    descriptionCs:
      "Apartmán Top Floor je největší ze tří. Dvě ložnice — jedna s manželskou postelí, druhá s dlouhým lůžkem pro tři osoby — jsou propojeny velkou obývací místností s plně vybavenou kuchyní, jídelním stolem a krásnou dubovou lavicí. Relaxační pohovka stojí u francouzského okna, které se otevírá přímo do luk. Koupelna nabízí výhled na hory a pro pohodlí je k dispozici samostatné WC.",
    guests: 5,
    bedrooms: "2 bedrooms",
    bedroomsCs: "2 ložnice",
    beds: "1 king-size bed + 1 long bed (3 people)",
    bedsCs: "1 manželská postel + 1 dlouhé lůžko (3 osoby)",
    bathrooms: "1 bathroom with mountain view + separate toilet",
    bathroomsCs: "1 koupelna s výhledem na hory + samostatné WC",
    amenities: ["French window to meadows", "Mountain view bathroom", "Fully equipped kitchen", "Dining table", "Oak bench", "Relaxation sofa", "Separate toilet", "Self check-in"],
    amenitiesCs: ["Francouzské okno do luk", "Koupelna s výhledem na hory", "Plně vybavená kuchyně", "Jídelní stůl", "Dubová lavice", "Relaxační pohovka", "Samostatné WC", "Samoobslužný příjezd"],
    photos: [
      { url: p("f54188d1-e8b9-4f1d-b26f-332e20e8f8ab.jpeg"), alt: "Living area" },
      { url: p("ca759c1b-3914-45a0-927e-e7e978a0a1e7.jpeg"), alt: "Interior detail" },
      { url: p("2ace933b-898e-4e9f-a48e-cbeb0614c3e3.jpeg"), alt: "Kitchen" },
      { url: p("661dc332-b833-43f7-b755-05977b10e7c2.jpeg"), alt: "Dining area" },
      { url: p("1e0054ab-cd2e-4549-901f-363436729aae.jpeg"), alt: "Bedroom 1" },
      { url: p("32f5a38f-efa5-49e8-8de3-e04699c41cf2.jpeg"), alt: "Bedroom 2" },
      { url: p("528fc3f5-4655-4c23-a91d-4bf7e989962f.jpeg"), alt: "Bedroom 3" },
      { url: p("0912e09d-f5da-4156-9e94-f107980c5fad.jpeg"), alt: "Bathroom" },
      { url: p("81364994-282d-4e04-8b8a-7969c942ff54.jpeg"), alt: "Evening exterior" },
    ],
    defaultNightlyRate: 8000,
  },
  {
    id: "whole",
    name: "Whole House",
    nameCs: "Celý dům",
    tagline: "The entire Bouda Krista for your group",
    taglineCs: "Celá Bouda Krista pro vaši skupinu",
    description:
      "Book the entire Bouda Krista for your group of up to eleven guests. All three apartments — Tiny, Timber, and Top Floor — are yours exclusively, along with the shared sauna, garden, terraces, and mountain views. Perfect for family gatherings, celebrations, or a private retreat in the Krkonoše mountains.",
    descriptionCs:
      "Zarezervujte si celou Boudu Kristu pro skupinu až jedenácti hostů. Všechny tři apartmány — Tiny, Timber a Top Floor — jsou pouze pro vás, spolu se sdílenou saunou, zahradou, terasami a výhledy na hory. Ideální pro rodinná setkání, oslavy nebo soukromý pobyt v Krkonoších.",
    guests: 11,
    bedrooms: "All 3 apartments",
    bedroomsCs: "Všechny 3 apartmány",
    beds: "Multiple beds across all apartments",
    bedsCs: "Více lůžek napříč apartmány",
    bathrooms: "3 bathrooms + separate toilet",
    bathroomsCs: "3 koupelny + samostatné WC",
    amenities: ["Entire property", "Sauna", "Garden", "Multiple terraces", "Fireplace", "3 fully equipped kitchens", "Mountain views", "Self check-in"],
    amenitiesCs: ["Celý objekt", "Sauna", "Zahrada", "Více teras", "Krb", "3 plně vybavené kuchyně", "Výhledy na hory", "Samoobslužný příjezd"],
    photos: [
      { url: p("daa6a02b-06de-4b6d-8abb-cfbd6ab77c33.jpeg"), alt: "Bouda Krista exterior" },
      { url: p("f4479755-64b2-438b-a292-e86357b994dd.jpeg"), alt: "From the meadow" },
      { url: p("7c002b6b-0732-4dc5-a9db-b9138467ffc8.jpeg"), alt: "Terrace overlooking mountains" },
      { url: p("6c9f4591-e54b-47fe-97c0-d9db24f3700e.jpeg"), alt: "Sauna" },
    ],
    defaultNightlyRate: 12000,
  },
];
