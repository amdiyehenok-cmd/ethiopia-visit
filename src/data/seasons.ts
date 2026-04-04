export const ethiopianSeasons = {
  Kiremt: {
    months: [6, 7, 8, 9],
    label: "Rainy Season",
    description:
      "Heavy rains. Best for Bale Mountains wildlife. Avoid Danakil/desert areas.",
    color: "#1A6B3A",
  },
  Bega: {
    months: [10, 11, 12, 1],
    label: "Dry Season",
    description: "Perfect weather. Best time for Lalibela, Simien, Gondar, most sites.",
    color: "#C9A84C",
  },
  Belg: {
    months: [2, 3, 4, 5],
    label: "Short Rains",
    description: "Light rains. Danakil OK. Flowers bloom. Fewer tourists.",
    color: "#3B82F6",
  },
};

export const monthlyRecommendations: Record<
  number,
  {
    topDestinations: string[];
    festivals: string[];
    avoid: string[];
    tip: string;
    weatherNote: string;
  }
> = {
  1: {
    topDestinations: ["Lalibela", "Axum", "Gondar", "Addis Ababa"],
    festivals: ["Timkat (Ethiopian Epiphany) — Jan 19", "Genna (Ethiopian Christmas) — Jan 7"],
    avoid: [],
    tip: "January is peak season. Book hotels 3 months ahead, especially for Timkat in Lalibela.",
    weatherNote: "Dry and cool. Perfect weather across Ethiopia.",
  },
  2: {
    topDestinations: ["Danakil Depression", "Omo Valley", "Harar"],
    festivals: [],
    avoid: [],
    tip: "Great time for Danakil before temperatures peak.",
    weatherNote: "Still dry, warming up in lowlands.",
  },
  3: {
    topDestinations: ["Omo Valley", "Harar", "Dire Dawa"],
    festivals: ["Eid Al-Fitr (varies)"],
    avoid: ["High altitudes — dusty"],
    tip: "Omo Valley tribes hold fascinating ceremonies in spring.",
    weatherNote: "Light rains beginning in some areas.",
  },
  4: {
    topDestinations: ["Addis Ababa", "Lake Langano", "Ziway"],
    festivals: ["Fasika (Ethiopian Easter — varies)"],
    avoid: [],
    tip: "Fasika is the most important Ethiopian holiday — extraordinary to witness.",
    weatherNote: "Mixed. Short rains possible.",
  },
  5: {
    topDestinations: ["Addis Ababa", "Bahir Dar", "Coffee regions"],
    festivals: [],
    avoid: ["Simien Mountains — muddy paths"],
    tip: "Visit coffee-growing regions — Kaffa, Sidama, Yirgacheffe.",
    weatherNote: "Rains increasing. Waterfalls starting.",
  },
  6: {
    topDestinations: ["Bale Mountains", "Addis Ababa"],
    festivals: [],
    avoid: ["Lalibela", "Simien", "Danakil"],
    tip: "Bale Mountains are lush and green — best time for Ethiopian wolves.",
    weatherNote: "Heavy rains begin. Green and dramatic.",
  },
  7: {
    topDestinations: ["Bale Mountains", "Lake Tana"],
    festivals: [],
    avoid: ["Most highland trek routes"],
    tip: "Blue Nile Falls at maximum power — spectacular.",
    weatherNote: "Peak rainy season.",
  },
  8: {
    topDestinations: ["Addis Ababa", "Bale Mountains"],
    festivals: [],
    avoid: ["Most outdoor adventures"],
    tip: "Visit the National Museum and cultural sites in Addis.",
    weatherNote: "Heaviest rains. Landscape beautiful but roads challenging.",
  },
  9: {
    topDestinations: ["Simien Mountains", "Lalibela", "Gondar"],
    festivals: [
      "Enkutatash (Ethiopian New Year) — Sep 11",
      "Meskel (Finding of True Cross) — Sep 27",
      "Irreecha (Oromo Thanksgiving)",
    ],
    avoid: [],
    tip: "Three of Ethiopia's biggest festivals in one month! Best month of year.",
    weatherNote: "Rains ending. Everything green and fresh.",
  },
  10: {
    topDestinations: ["Simien Mountains", "Lalibela", "Axum", "Gondar"],
    festivals: ["Irreecha"],
    avoid: [],
    tip: "Start of the best travel season. All routes open.",
    weatherNote: "Dry season begins. Cool and clear.",
  },
  11: {
    topDestinations: ["Danakil Depression", "Omo Valley", "Harar", "All of Ethiopia"],
    festivals: [],
    avoid: [],
    tip: "November is arguably the best month. Everywhere is accessible.",
    weatherNote: "Ideal. Dry, not too hot, clear skies.",
  },
  12: {
    topDestinations: ["All of Ethiopia"],
    festivals: ["Christmas preparations beginning"],
    avoid: [],
    tip: "Excellent month. Book ahead — tourist season at peak.",
    weatherNote: "Dry and cool everywhere.",
  },
};
