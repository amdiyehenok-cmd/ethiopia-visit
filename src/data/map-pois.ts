import { hotels } from "@/data/hotels";

export type POICategory =
  | "attraction"
  | "hotel"
  | "restaurant"
  | "airport"
  | "hospital"
  | "market"
  | "church"
  | "national-park";

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  description: string;
  latitude: number;
  longitude: number;
  city: string;
  rating?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  openHours?: string;
  bestSeason?: string[];
  difficulty?: "easy" | "moderate" | "hard";
  affiliateUrl?: string;
}

const basePois: POI[] = [
  {
    id: "lalibela-churches",
    name: "Rock-Hewn Churches of Lalibela",
    category: "attraction",
    city: "Lalibela",
    latitude: 12.0317,
    longitude: 39.0447,
    description: "11 medieval monolithic cave churches, UNESCO World Heritage.",
    rating: 4.9,
    bestSeason: ["Oct", "Nov", "Jan", "Feb"],
    difficulty: "easy",
  },
  {
    id: "simien-np",
    name: "Simien Mountains National Park",
    category: "national-park",
    city: "Debark",
    latitude: 13.2167,
    longitude: 38.0833,
    description: "Africa's 'Grand Canyon' — gelada baboons, Ethiopian wolves, stunning views.",
    rating: 4.8,
    bestSeason: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    difficulty: "hard",
  },
  {
    id: "danakil",
    name: "Danakil Depression",
    category: "attraction",
    city: "Afar",
    latitude: 14.2417,
    longitude: 40.3,
    description: "Hottest place on Earth — alien sulphur lakes, active lava.",
    rating: 4.7,
    bestSeason: ["Nov", "Dec", "Jan", "Feb"],
    difficulty: "hard",
  },
  {
    id: "axum-stelae",
    name: "Obelisks of Axum",
    category: "attraction",
    city: "Axum",
    latitude: 14.1297,
    longitude: 38.7183,
    description: "Ancient towering stelae of the Aksumite empire.",
    rating: 4.8,
    bestSeason: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  },
  {
    id: "gondar-castles",
    name: "Fasil Ghebbi Royal Enclosure",
    category: "attraction",
    city: "Gondar",
    latitude: 12.6033,
    longitude: 37.4681,
    description: "17th century royal castle complex, Ethiopia's Camelot.",
    rating: 4.7,
    bestSeason: ["Oct", "Nov", "Dec", "Jan", "Feb"],
  },
  {
    id: "bale-mountains",
    name: "Bale Mountains National Park",
    category: "national-park",
    city: "Goba",
    latitude: 6.8333,
    longitude: 39.9,
    description: "Afroalpine plateau — largest Ethiopian wolf population.",
    rating: 4.8,
    bestSeason: ["Jun", "Jul", "Aug", "Sep"],
  },
  {
    id: "omo-valley",
    name: "Omo Valley Tribal Villages",
    category: "attraction",
    city: "Jinka",
    latitude: 5.7833,
    longitude: 36.55,
    description: "Home to 16 indigenous tribes preserving ancient traditions.",
    rating: 4.6,
    bestSeason: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  },
  {
    id: "tis-abay",
    name: "Blue Nile Falls (Tis Abay)",
    category: "attraction",
    city: "Bahir Dar",
    latitude: 11.4844,
    longitude: 37.5847,
    description: '"Smoking Water" — spectacular waterfall on the Blue Nile.',
    rating: 4.5,
    bestSeason: ["Jul", "Aug", "Sep", "Oct"],
  },
  {
    id: "lake-tana",
    name: "Lake Tana Monasteries",
    category: "church",
    city: "Bahir Dar",
    latitude: 11.9,
    longitude: 37.0667,
    description: "Ancient island monasteries on Ethiopia's largest lake.",
    rating: 4.7,
    bestSeason: ["Oct", "Nov", "Dec", "Jan", "Feb"],
  },
  {
    id: "harar-old-city",
    name: "Jugol — Walled City of Harar",
    category: "attraction",
    city: "Harar",
    latitude: 9.314,
    longitude: 42.1195,
    description: "4th holiest city in Islam — 368 mosques and nightly hyena feeding.",
    rating: 4.8,
    bestSeason: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  },
  {
    id: "addis-airport",
    name: "Addis Ababa Bole International Airport",
    category: "airport",
    city: "Addis Ababa",
    latitude: 8.9779,
    longitude: 38.7993,
    description: "Main international gateway to Ethiopia.",
    rating: 4.2,
  },
  {
    id: "merkato",
    name: "Merkato — Addis Market",
    category: "market",
    city: "Addis Ababa",
    latitude: 9.0247,
    longitude: 38.7469,
    description: "One of Africa's largest open-air markets.",
    rating: 4.4,
    bestSeason: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
  },
  {
    id: "yod-abyssinia",
    name: "Yod Abyssinia Restaurant",
    category: "restaurant",
    city: "Addis Ababa",
    latitude: 9.005,
    longitude: 38.76,
    description: "Traditional dinner with cultural dance performances.",
    rating: 4.6,
    priceLevel: 3,
  },
];

const hotelPois: POI[] = hotels.slice(0, 12).map((h) => ({
  id: `hotel-${h.id}`,
  name: h.name,
  category: "hotel" as const,
  description: h.description.slice(0, 160),
  latitude: h.latitude,
  longitude: h.longitude,
  city: h.city,
  rating: h.stars,
  affiliateUrl: h.affiliateUrl,
  priceLevel: Math.min(4, Math.max(1, Math.ceil(h.stars))) as 1 | 2 | 3 | 4,
}));

export const pois: POI[] = [...basePois, ...hotelPois];
