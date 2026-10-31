export type Photo = {
  url: string;
  category: string;
  alt: string;
};

export const photos: Photo[] = [
  { url: "/photos/81364994-282d-4e04-8b8a-7969c942ff54.jpeg", category: "exterior",  alt: "Lodge exterior evening view" },
  { url: "/photos/7c002b6b-0732-4dc5-a9db-b9138467ffc8.jpeg", category: "exterior",  alt: "Lodge terrace overlooking mountains" },
  { url: "/photos/44b4b68c-4979-43e8-9d6c-70b37aa20b56.png",  category: "exterior",  alt: "Lodge grounds and garden" },
  { url: "/photos/efb84fec-a3f7-4000-9851-04fcdd08219f.jpeg", category: "kitchen",   alt: "Full kitchen" },
  { url: "/photos/506cd52f-5769-4c76-bef1-604987f9ae22.png",  category: "kitchen",   alt: "Kitchenette" },
  { url: "/photos/7bf0b48b-6696-4e68-8ed1-50ad2bc2b223.jpeg", category: "dining",    alt: "Dining area 1" },
  { url: "/photos/88cb79a5-544c-4ddf-8fa3-a0c6fecbfd8f.jpeg", category: "dining",    alt: "Dining area 2" },
  { url: "/photos/661dc332-b833-43f7-b755-05977b10e7c2.jpeg", category: "dining",    alt: "Dining area 3" },
  { url: "/photos/32f5a38f-efa5-49e8-8de3-e04699c41cf2.jpeg", category: "bedroom",   alt: "Bedroom 1" },
  { url: "/photos/10aa88a8-0888-4436-b88f-936e8fff7b87.png",  category: "bedroom",   alt: "Bedroom 2" },
  { url: "/photos/528fc3f5-4655-4c23-a91d-4bf7e989962f.jpeg", category: "bedroom",   alt: "Bedroom 3" },
  { url: "/photos/da5819c9-edde-4f65-a79e-69efe01a2adc.png",  category: "bedroom",   alt: "Bedroom 4" },
  { url: "/photos/d55034c6-0faa-4228-8b08-c5d8830f6e2f.jpeg", category: "bathroom",  alt: "Full bathroom 1" },
  { url: "/photos/e7c44742-2a8c-48be-8715-855bb4f8c178.jpeg", category: "bathroom",  alt: "Full bathroom 2" },
  { url: "/photos/18961a5f-670e-4ace-9bad-468d1d6c3fba.jpeg", category: "outdoor",   alt: "Garden and surroundings" },
  { url: "/photos/0784fb43-fd09-48d4-b11d-7b2803597a6a.jpeg", category: "outdoor",   alt: "Outdoor area" },
  { url: "/photos/f54188d1-e8b9-4f1d-b26f-332e20e8f8ab.jpeg", category: "interior",  alt: "Living area" },
  { url: "/photos/6c9f4591-e54b-47fe-97c0-d9db24f3700e.jpeg", category: "interior",  alt: "Sauna" },
  { url: "/photos/37f52843-5ac8-47db-b725-0e1c4f33d663.jpeg", category: "interior",  alt: "Additional interior" },
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
