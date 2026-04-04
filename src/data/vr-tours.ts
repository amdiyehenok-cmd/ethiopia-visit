export interface VRHotspot {
  pitch: number;
  yaw: number;
  type: "info" | "scene";
  text: string;
}

export interface VRTour {
  id: string;
  title: string;
  destination: string;
  description: string;
  panoramaUrl: string | null;  // null = go straight to immersive mode
  fallbackImage: string;
  hotspots: VRHotspot[];
  category: "church" | "nature" | "city" | "landscape";
}

// panoramaUrl is null for all until you upload real 360° equirectangular images to Cloudinary.
// The immersive parallax viewer activates automatically — still stunning.
export const vrTours: VRTour[] = [
  {
    id: "lalibela-bete-giyorgis",
    title: "Bete Giyorgis — Church of St. George",
    destination: "Lalibela",
    description: "Walk the sacred cross-shaped church carved 12 metres into solid volcanic tuff in the 12th century. A UNESCO World Heritage Site and one of the most extraordinary religious structures on Earth.",
    panoramaUrl: null,
    fallbackImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=90",
    category: "church",
    hotspots: [
      { pitch: -10, yaw: 30,  type: "info", text: "Cross-shaped roof carved from a single rock" },
      { pitch:   5, yaw: 150, type: "info", text: "12th century — commissioned by King Lalibela" },
      { pitch:  -5, yaw: -90, type: "info", text: "Sacred trench surrounding the church" },
    ],
  },
  {
    id: "simien-mountains",
    title: "Simien Mountains — Roof of Africa",
    destination: "Gondar Region",
    description: "Stand on the edge of Africa's most dramatic mountain range. Home to endemic Gelada baboons and the rare Ethiopian wolf — escarpments drop 1,500 metres straight down.",
    panoramaUrl: null,
    fallbackImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=90",
    category: "nature",
    hotspots: [
      { pitch:   0, yaw:  45,  type: "info", text: "Ras Dashen — Ethiopia's highest peak at 4,550m" },
      { pitch: -15, yaw: 180,  type: "info", text: "Gelada baboons graze on the escarpment" },
      { pitch:   5, yaw: 270,  type: "info", text: "UNESCO World Heritage Site since 1978" },
    ],
  },
  {
    id: "danakil-depression",
    title: "Danakil Depression — Alien Landscape",
    destination: "Afar Region",
    description: "The hottest and most otherworldly place on Earth. Technicolor acidic lakes, vast salt flats, and the active lava lake at Erta Ale volcano.",
    panoramaUrl: null,
    fallbackImage: "https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=1600&q=90",
    category: "landscape",
    hotspots: [
      { pitch:   5, yaw:  20,  type: "info", text: "Erta Ale — one of the world's few permanent lava lakes" },
      { pitch: -20, yaw: 200,  type: "info", text: "Dallol — world's most colourful hydrothermal field" },
      { pitch:   0, yaw: 100,  type: "info", text: "Salt miners have worked this plain for centuries" },
    ],
  },
  {
    id: "omo-valley",
    title: "Omo Valley — Living Cultures",
    destination: "Southern Ethiopia",
    description: "The Omo River basin hosts more ethnic diversity per square kilometre than almost anywhere on Earth. Hamer, Mursi, Karo, Dorze — a living mosaic of humanity.",
    panoramaUrl: null,
    fallbackImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600&q=90",
    category: "nature",
    hotspots: [
      { pitch:  0, yaw:  60,  type: "info", text: "Turmi Market — Hamer tribe meets every Tuesday" },
      { pitch: -5, yaw: 200,  type: "info", text: "Omo River — lifeline for 16 distinct tribes" },
    ],
  },
  {
    id: "axum-obelisks",
    title: "Obelisks of Axum",
    destination: "Axum, Tigray",
    description: "Ancient granite stelae reaching 33 metres high — carved by the Aksumite Empire 1,700 years ago. UNESCO treasures marking the royal tombs of one of history's greatest civilisations.",
    panoramaUrl: null,
    fallbackImage: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1600&q=90",
    category: "church",
    hotspots: [
      { pitch:  0, yaw:   0,  type: "info", text: "Obelisk of Axum — 24m, returned from Rome in 2008" },
      { pitch: 10, yaw: 180,  type: "info", text: "King Ezana's Stele — tallest standing at 33m" },
    ],
  },
  {
    id: "addis-meskel-square",
    title: "Meskel Square — Heart of Addis",
    destination: "Addis Ababa",
    description: "Ethiopia's most iconic public square where millions gather for the Meskel festival bonfire each September. The beating heart of modern Ethiopia.",
    panoramaUrl: null,
    fallbackImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=90",
    category: "city",
    hotspots: [
      { pitch:  0, yaw:  90,  type: "info", text: "National Theatre of Ethiopia" },
      { pitch:  0, yaw: 270,  type: "info", text: "Venue for Meskel and Enkutatash festivals" },
    ],
  },
];
