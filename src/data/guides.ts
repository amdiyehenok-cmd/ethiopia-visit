export interface SampleExperience {
  title: string;
  duration: number;
  price: number;
  category: string;
}

export interface SampleGuide {
  id: string;
  name: string;
  city: string;
  bio: string;
  languages: string[];
  specialties: string[];
  rating: number;
  reviewCount: number;
  responseTime: string;
  verified: boolean;
  profilePhoto: string;
  coverPhoto: string;
  experiences: SampleExperience[];
  whatsapp?: string;
}

export const sampleGuides: SampleGuide[] = [
  {
    id: "g1",
    name: "Dawit Tadesse",
    city: "Addis Ababa",
    bio: "Born and raised in Addis, I have guided travelers through Ethiopia's wonders for 12 years. Expert in Orthodox Christian heritage, Oromo culture, and logistics across all regions.",
    languages: ["English", "Amharic", "French", "Oromo"],
    specialties: ["Lalibela Churches", "Coffee Ceremony", "Addis City Tours", "Cultural immersion"],
    rating: 4.9,
    reviewCount: 87,
    responseTime: "Within 30 min",
    verified: true,
    profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=85",
    experiences: [
      { title: "Traditional Coffee Ceremony & Mercato Market Tour", duration: 3, price: 35, category: "Culture" },
      { title: "Lalibela Rock Churches Full Day", duration: 8, price: 80, category: "History" },
      { title: "National Museum & Lucy Discovery Tour", duration: 4, price: 45, category: "History" },
    ],
    whatsapp: "+251911000001",
  },
  {
    id: "g2",
    name: "Meron Assefa",
    city: "Lalibela",
    bio: "Local guide specializing in rock churches, Timkat celebrations, and highland trekking routes around Lalibela. Born in a house with a view of Bete Giyorgis.",
    languages: ["English", "Amharic", "Italian"],
    specialties: ["Rock Churches", "Festivals", "Photography Tours", "Timkat"],
    rating: 4.95,
    reviewCount: 124,
    responseTime: "Within 1 hour",
    verified: true,
    profilePhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85",
    experiences: [
      { title: "Sunrise at Bete Giyorgis (exclusive access)", duration: 4, price: 55, category: "History" },
      { title: "All 11 Churches Full Circuit", duration: 10, price: 110, category: "History" },
      { title: "Timkat Festival Photography Walk", duration: 6, price: 75, category: "Culture" },
    ],
    whatsapp: "+251912000002",
  },
  {
    id: "g3",
    name: "Yonas Gebre",
    city: "Gondar",
    bio: "Historian and storyteller focused on Fasil Ghebbi, imperial Ethiopia, and Simien gateway logistics. MA in Ethiopian History from Gondar University.",
    languages: ["English", "Amharic", "Italian", "German"],
    specialties: ["Castles", "History", "Simien Treks", "Photography"],
    rating: 4.85,
    reviewCount: 64,
    responseTime: "Within 2 hours",
    verified: true,
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85",
    experiences: [
      { title: "Royal Enclosure & Bathhouse Immersive Tour", duration: 5, price: 55, category: "History" },
      { title: "Simien Mountains 3-Day Trek", duration: 72, price: 320, category: "Adventure" },
    ],
    whatsapp: "+251913000003",
  },
  {
    id: "g4",
    name: "Selam Haile",
    city: "Bahir Dar",
    bio: "Lake Tana monasteries, Blue Nile Falls, and birding—by boat and on foot. One of Ethiopia's few certified female wilderness guides.",
    languages: ["English", "Amharic", "Spanish"],
    specialties: ["Lake Tana Monasteries", "Blue Nile Falls", "Birding", "Boat tours"],
    rating: 4.92,
    reviewCount: 98,
    responseTime: "Within 30 min",
    verified: true,
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85",
    experiences: [
      { title: "Monastery Island Boat Tour (5 islands)", duration: 6, price: 65, category: "History" },
      { title: "Blue Nile Falls & Village Walk", duration: 4, price: 45, category: "Nature" },
      { title: "Lake Tana Birding Sunrise Cruise", duration: 3, price: 50, category: "Wildlife" },
    ],
    whatsapp: "+251914000004",
  },
  {
    id: "g5",
    name: "Kebede Alemu",
    city: "Danakil / Afar",
    bio: "Afar-born expedition guide for the Danakil Depression—Erta Ale, Dallol, and salt caravans. The only guide certified for overnight volcano access.",
    languages: ["English", "Amharic", "Afar"],
    specialties: ["Erta Ale Volcano", "Danakil Depression", "Salt Flats", "4x4 Expeditions"],
    rating: 4.97,
    reviewCount: 52,
    responseTime: "Within 4 hours",
    verified: true,
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=1200&q=85",
    experiences: [
      { title: "3-Day Danakil Depression Expedition", duration: 72, price: 450, category: "Adventure" },
      { title: "Erta Ale Overnight Lava Lake Trek", duration: 36, price: 280, category: "Adventure" },
    ],
    whatsapp: "+251915000005",
  },
  {
    id: "g6",
    name: "Tigist Bekele",
    city: "Omo Valley",
    bio: "Southern Ethiopia specialist—Mursi, Hamer, Karo, and Dorze communities. 15 years building ethical cultural tourism partnerships in the Omo Valley.",
    languages: ["English", "Amharic", "Hamer", "Konso"],
    specialties: ["Tribal Culture", "Ethical Photography", "Hamer Bull Jumping", "Omo Markets"],
    rating: 4.93,
    reviewCount: 73,
    responseTime: "Within 2 hours",
    verified: true,
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=85",
    experiences: [
      { title: "5-Day Omo Valley Cultural Immersion", duration: 120, price: 520, category: "Culture" },
      { title: "Turmi Tuesday Market & Hamer Village", duration: 8, price: 95, category: "Culture" },
      { title: "Ethical Photography Workshop in the Omo", duration: 5, price: 80, category: "Photography" },
    ],
    whatsapp: "+251916000006",
  },
  {
    id: "g7",
    name: "Fitsum Habtezion",
    city: "Axum",
    bio: "Tigray-born archaeologist and guide—Axum's stelae, the Ark of the Covenant church, and Tigray's lesser-known cliff churches.",
    languages: ["English", "Amharic", "Tigrinya", "Italian"],
    specialties: ["Axumite History", "Stelae", "Tigray Rock Churches", "Archaeology"],
    rating: 4.88,
    reviewCount: 41,
    responseTime: "Within 3 hours",
    verified: true,
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85",
    experiences: [
      { title: "Axum Stelae & Queen of Sheba Palace", duration: 6, price: 60, category: "History" },
      { title: "Abuna Yemata Cliff Church Ascent", duration: 7, price: 85, category: "Adventure" },
    ],
    whatsapp: "+251917000007",
  },
  {
    id: "g8",
    name: "Hirut Woldemariam",
    city: "Addis Ababa",
    bio: "Addis-based food and culture guide specializing in coffee trails, fasting cuisine, and the hidden jazz bars of Piazza. Author of 'Eating Ethiopia.'",
    languages: ["English", "Amharic", "French"],
    specialties: ["Coffee Trail", "Food Tours", "Jazz Bars", "Fasting Cuisine"],
    rating: 4.91,
    reviewCount: 109,
    responseTime: "Within 1 hour",
    verified: true,
    profilePhoto: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=85",
    experiences: [
      { title: "Addis Coffee Trail — 4 Legendary Buna Houses", duration: 4, price: 40, category: "Food" },
      { title: "Piazza Jazz Night & Tej Bet Tour", duration: 4, price: 45, category: "Nightlife" },
      { title: "Ethiopian Cooking Class with Hirut", duration: 5, price: 65, category: "Food" },
    ],
    whatsapp: "+251918000008",
  },
];
