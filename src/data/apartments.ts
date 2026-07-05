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
  guestsLabel?: string;
  guestsLabelCs?: string;
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
    name: "Tiny apartment",
    nameCs: "Malý apartmán",
    tagline: "The cosiest retreat for two",
    taglineCs: "Útulný úkryt pro dva",
    description:
      "This small apartment is a cozy retreat for two guests. It features a kitchenette and a private bathroom with a shower and toilet. In the large, comfortable bed with storage space, you can enjoy leisurely mornings, evenings with a book, or simply the quiet and the view of the surrounding meadows and mountain ridges. Through the large glass window, you can step out onto the covered terrace, which also offers a view of the mountains.",
    descriptionCs:
      "Malý apartmán je útulným útočištěm pro dva hosty. K dispozici je kuchyňský kout a vlastní koupelna se sprchou a toaletou. Ve velké pohodlné posteli s úložným prostorem si můžete vychutnat pomalá rána, večery s knihou nebo jen ticho a výhled do okolních luk a na horské hřebeny. Přes velké prosklené okno se dostanete na krytou terasu, opět s výhledem na hory.",
    guests: 2,
    guestsLabelCs: "Až 2 hosté",
    bedrooms: "1 bedroom",
    bedroomsCs: "1 ložnice",
    beds: "1 king-size bed",
    bedsCs: "1 manželská postel",
    bathrooms: "1 bathroom (shower)",
    bathroomsCs: "1 koupelna (sprcha)",
    amenities: ["Shared sauna", "Terrace with view", "Garden", "Kitchenette", "Private bathroom", "Mountain views", "Self check-in"],
    amenitiesCs: ["Sdílená sauna", "Terasa s výhledem", "Zahrada", "Kuchyňský kout", "Vlastní koupelna", "Výhledy na hory", "Samoobslužný příjezd"],
    photos: [
      { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/829fb174-5292-49e0-b7fa-c081b3ac7f84.jpeg?im_w=1440", alt: "Tiny apartment" },
      { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/c4790a5a-16e6-4207-9b2a-0c6015a02d65.jpeg?im_w=1440", alt: "Tiny apartment interior" },
      { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/6c8f1d25-9730-40d9-bf23-fad247f3a39c.jpeg?im_w=1440", alt: "Tiny apartment detail" },
      { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/256845f4-e08f-41f7-97d3-dc90722bc519.jpeg?im_w=1440", alt: "Tiny apartment kitchen" },
      { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/015d988d-f0dd-4bd4-9817-979ba919a7b6.jpeg?im_w=1440", alt: "Tiny apartment bathroom" },
      { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1646250768905855726/original/0f78d46d-636a-441c-8882-5ea6d80e3e9a.jpeg?im_w=1440", alt: "Tiny apartment view" },
    ],
    defaultNightlyRate: 4000,
  },
  {
    id: "timber",
    name: "Timber apartment",
    nameCs: "Roubený apartmán",
    tagline: "Space for two to four with a fireplace",
    taglineCs: "Prostor pro dva až čtyři s krbovými kamny",
    description:
      "The log cabin apartment consists of two rooms—a bright living room with a fully equipped kitchenette and a bedroom with a private bathroom featuring a shower and toilet, as well as direct access to the terrace and garden. It also features a large dining table with an oak bench and a comfortable sofa that can be converted into two separate beds. On chilly mountain evenings, a crackling fire in the wood-burning stove adds to the atmosphere of the log cabin.",
    descriptionCs:
      "Roubený apartmán tvoří dvě místnosti – světlý obývací pokoj s plně vybaveným kuchyňským koutem a ložnice s vlastní koupelnou se sprchou a toaletou a přímým vstupem na terasu i do zahrady. Nechybí velký jídelní stůl s dubovou lavicí ani pohodlná pohovka, kterou lze rozložit na dvě samostatná lůžka. Atmosféru roubené světnice během chladných horských večerů dotváří praskající oheň v krbových kamnech.",
    guests: 4,
    guestsLabel: "2–4",
    bedrooms: "2 rooms",
    bedroomsCs: "2 pokoje",
    beds: "1 king-size bed + extendable sofa bed into two separate beds",
    bedsCs: "1 manželská postel + rozkládací pohovka (dvě samostatná lůžka)",
    bathrooms: "1 bathroom (shower)",
    bathroomsCs: "1 koupelna (sprcha)",
    amenities: ["Shared sauna", "Terrace with view", "Garden", "Fireplace", "Fully equipped kitchen", "Dining area", "Sofa bed", "Private bathroom", "Mountain views", "Self check-in"],
    amenitiesCs: ["Sdílená sauna", "Terasa s výhledem", "Zahrada", "Krb", "Plně vybavená kuchyň", "Jídelní část", "Rozkládací pohovka", "Vlastní koupelna", "Výhledy na hory", "Samoobslužný příjezd"],
    photos: [
      { url: p("7c002b6b-0732-4dc5-a9db-b9138467ffc8.jpeg"), alt: "Terrace overlooking mountains" },
      { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1677566795867113387/original/6476fdbd-3791-48f8-bc0d-049af9a7d6e1.jpeg?im_w=1440", alt: "Timber apartment interior" },
      { url: p("18961a5f-670e-4ace-9bad-468d1d6c3fba.jpeg"), alt: "Garden and surroundings" },
      { url: p("7bf0b48b-6696-4e68-8ed1-50ad2bc2b223.jpeg"), alt: "Dining area" },
      { url: p("37f52843-5ac8-47db-b725-0e1c4f33d663.jpeg"), alt: "Interior detail" },
      { url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1677566795867113387/original/b30eef0e-0527-41b3-b9b2-2c5a564b63f1.jpeg?im_w=1440", alt: "Timber apartment bedroom" },
    ],
    defaultNightlyRate: 6000,
  },
  {
    id: "topfloor",
    name: "Top Floor apartment",
    nameCs: "Apartmán V podkroví",
    tagline: "Sweeping views for up to five",
    taglineCs: "Výhledy do krajiny až pro pět hostů",
    description:
      "The attic apartment is the most spacious of the three. It features two bedrooms—one with a double bed and the other with a large wooden platform bed that sleeps three. The bedrooms open onto a large living room with a fully equipped kitchen, a dining table, and an oak bench. Through the French window, you look directly out onto the meadows; the bathroom offers a view of the mountains, and a second separate restroom adds to the comfort of your stay.",
    descriptionCs:
      "Podkrovní apartmán je nejprostornější ze všech tří. Nabízí dvě ložnice – jednu s manželskou postelí a druhou s velkým dřevěným podiem pro tři osoby. Ložnice navazují na velký obývací pokoj s plně vybavenou kuchyní, jídelním stolem a dubovou lavicí. Francouzským oknem hledíme přímo do luk, z koupelny se otevírá výhled na hory a komfort pobytu doplňuje druhé samostatné WC.",
    guests: 5,
    bedrooms: "2 bedrooms",
    bedroomsCs: "2 ložnice",
    beds: "1 king-size bed + 1 long bed (3 people)",
    bedsCs: "1 manželská postel + 1 dlouhé lůžko (3 osoby)",
    bathrooms: "1 bathroom with mountain view + another separate toilet",
    bathroomsCs: "1 koupelna s výhledem na hory + druhé samostatné WC",
    amenities: ["Shared sauna", "Terrace with view", "Garden", "French window to meadows", "Mountain view bathroom", "Fully equipped kitchen", "Dining table", "Oak bench", "Washer", "Separate toilet", "Self check-in"],
    amenitiesCs: ["Sdílená sauna", "Terasa s výhledem", "Zahrada", "Francouzské okno do luk", "Koupelna s výhledem na hory", "Plně vybavená kuchyně", "Jídelní stůl", "Dubová lavice", "Pračka", "Samostatné WC", "Samoobslužný příjezd"],
    photos: [
      { url: p("e7c44742-2a8c-48be-8715-855bb4f8c178.jpeg"), alt: "Bathroom 2" },
      { url: p("81364994-282d-4e04-8b8a-7969c942ff54.jpeg"), alt: "Exterior evening view" },
      { url: p("a5864f8c-be58-48b3-9114-5e44ccdc0e89.jpeg"), alt: "Bathroom" },
      { url: p("889c16d1-13fd-4c3d-a964-cda51d08885e.jpeg"), alt: "Interior" },
      { url: p("8f9b5271-273c-416d-b92c-eeb3fbf30e85.jpeg"), alt: "Interior detail" },
      { url: p("32f5a38f-efa5-49e8-8de3-e04699c41cf2.jpeg"), alt: "Bedroom 1" },
      { url: p("528fc3f5-4655-4c23-a91d-4bf7e989962f.jpeg"), alt: "Bedroom 2" },
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
      "Book the entire Bouda Krista for your group of up to eleven guests. All three apartments — Tiny, Timber, and Top Floor — are yours exclusively, along with the shared sauna, garden, terrace, and mountain views. Perfect for family gatherings, celebrations, or a private retreat in the Krkonoše mountains.",
    descriptionCs:
      "Zarezervujte si celou Boudu Kristu pro skupinu až jedenácti hostů. Všechny tři apartmány — Malý, Roubený a V podkroví — jsou tu pouze pro vás, spolu se sdílenou saunou, zahradou, terasou a výhledy na hory. Ideální pro rodinná setkání, oslavy nebo soukromý pobyt v Krkonoších.",
    guests: 11,
    bedrooms: "All 3 apartments",
    bedroomsCs: "Všechny 3 apartmány",
    beds: "Multiple beds across all apartments",
    bedsCs: "Více lůžek napříč apartmány",
    bathrooms: "3 bathrooms + another separate toilet",
    bathroomsCs: "3 koupelny + další samostatné WC",
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
