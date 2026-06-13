export type Photo = {
  url: string;
  category: string;
  alt: string;
};

const BASE = "https://a0.muscache.com/im/pictures/hosting/Hosting-1681755602554370759/original";

export const photos: Photo[] = [
  { url: `${BASE}/daa6a02b-06de-4b6d-8abb-cfbd6ab77c33.jpeg?im_w=1440`, category: "exterior",  alt: "Lodge Krista exterior with cherry blossom tree" },
  { url: `${BASE}/f4479755-64b2-438b-a292-e86357b994dd.jpeg?im_w=1440`, category: "exterior",  alt: "Lodge Krista from the meadow" },
  { url: `${BASE}/81364994-282d-4e04-8b8a-7969c942ff54.jpeg?im_w=1440`, category: "exterior",  alt: "Lodge exterior evening view" },
  { url: `${BASE}/7c002b6b-0732-4dc5-a9db-b9138467ffc8.jpeg?im_w=1440`, category: "exterior",  alt: "Lodge terrace overlooking mountains" },
  { url: `${BASE}/44b4b68c-4979-43e8-9d6c-70b37aa20b56.png?im_w=1440`,  category: "exterior",  alt: "Lodge grounds and garden" },
  { url: `${BASE}/2ace933b-898e-4e9f-a48e-cbeb0614c3e3.jpeg?im_w=1440`, category: "kitchen",   alt: "Full kitchen 1" },
  { url: `${BASE}/efb84fec-a3f7-4000-9851-04fcdd08219f.jpeg?im_w=1440`, category: "kitchen",   alt: "Full kitchen 2" },
  { url: `${BASE}/506cd52f-5769-4c76-bef1-604987f9ae22.png?im_w=1440`,  category: "kitchen",   alt: "Kitchenette" },
  { url: `${BASE}/7bf0b48b-6696-4e68-8ed1-50ad2bc2b223.jpeg?im_w=1440`, category: "dining",    alt: "Dining area 1" },
  { url: `${BASE}/88cb79a5-544c-4ddf-8fa3-a0c6fecbfd8f.jpeg?im_w=1440`, category: "dining",    alt: "Dining area 2" },
  { url: `${BASE}/661dc332-b833-43f7-b755-05977b10e7c2.jpeg?im_w=1440`, category: "dining",    alt: "Dining area 3" },
  { url: `${BASE}/1e0054ab-cd2e-4549-901f-363436729aae.jpeg?im_w=1440`, category: "bedroom",   alt: "Bedroom 1" },
  { url: `${BASE}/32f5a38f-efa5-49e8-8de3-e04699c41cf2.jpeg?im_w=1440`, category: "bedroom",   alt: "Bedroom 2" },
  { url: `${BASE}/10aa88a8-0888-4436-b88f-936e8fff7b87.png?im_w=1440`,  category: "bedroom",   alt: "Bedroom 3" },
  { url: `${BASE}/528fc3f5-4655-4c23-a91d-4bf7e989962f.jpeg?im_w=1440`, category: "bedroom",   alt: "Bedroom 4" },
  { url: `${BASE}/da5819c9-edde-4f65-a79e-69efe01a2adc.png?im_w=1440`,  category: "bedroom",   alt: "Bedroom 5" },
  { url: `${BASE}/0912e09d-f5da-4156-9e94-f107980c5fad.jpeg?im_w=1440`, category: "bathroom",  alt: "Full bathroom 1" },
  { url: `${BASE}/d55034c6-0faa-4228-8b08-c5d8830f6e2f.jpeg?im_w=1440`, category: "bathroom",  alt: "Full bathroom 2" },
  { url: `${BASE}/a5864f8c-be58-48b3-9114-5e44ccdc0e89.jpeg?im_w=1440`, category: "bathroom",  alt: "Full bathroom 3" },
  { url: `${BASE}/e7c44742-2a8c-48be-8715-855bb4f8c178.jpeg?im_w=1440`, category: "bathroom",  alt: "Half bathroom" },
  { url: `${BASE}/7632dcd8-99da-4bcc-91c5-497c201de7ce.jpeg?im_w=1440`, category: "outdoor",   alt: "Patio" },
  { url: `${BASE}/1ab4cc1c-e237-4ee4-bec5-fc0eb32b5f8c.jpeg?im_w=1440`, category: "outdoor",   alt: "Balcony with mountain view" },
  { url: `${BASE}/18961a5f-670e-4ace-9bad-468d1d6c3fba.jpeg?im_w=1440`, category: "outdoor",   alt: "Garden and surroundings" },
  { url: `${BASE}/0784fb43-fd09-48d4-b11d-7b2803597a6a.jpeg?im_w=1440`, category: "outdoor",   alt: "Outdoor area" },
  { url: `${BASE}/f54188d1-e8b9-4f1d-b26f-332e20e8f8ab.jpeg?im_w=1440`, category: "interior",  alt: "Living area" },
  { url: `${BASE}/ca759c1b-3914-45a0-927e-e7e978a0a1e7.jpeg?im_w=1440`, category: "interior",  alt: "Interior detail" },
  { url: `${BASE}/15efab85-f6f0-4007-8f05-9362a978b3e7.jpeg?im_w=1440`, category: "interior",  alt: "Interior living space" },
  { url: `${BASE}/6c9f4591-e54b-47fe-97c0-d9db24f3700e.jpeg?im_w=1440`, category: "interior",  alt: "Sauna" },
  { url: `${BASE}/4c7750ae-cae3-42d2-8c33-befd8184aa0b.jpeg?im_w=1440`, category: "interior",  alt: "Fireplace area" },
  { url: `${BASE}/37f52843-5ac8-47db-b725-0e1c4f33d663.jpeg?im_w=1440`, category: "interior",  alt: "Additional interior" },
];

export const heroPhoto = photos[0];
export const galleryPhotos = photos.slice(1);

export const categories = [
  { key: "all",      label: "All" },
  { key: "exterior", label: "Exterior" },
  { key: "interior", label: "Interior" },
  { key: "kitchen",  label: "Kitchen" },
  { key: "dining",   label: "Dining" },
  { key: "bedroom",  label: "Bedrooms" },
  { key: "bathroom", label: "Bathrooms" },
  { key: "outdoor",  label: "Outdoor" },
];
