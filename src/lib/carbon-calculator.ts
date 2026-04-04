const EMISSION_FACTORS = {
  shortHaul: 0.255,
  mediumHaul: 0.195,
  longHaul: 0.147,
  bus: 0.089,
  car: 0.171,
  train: 0.041,
  localTuk: 0.095,
};

const AIRPORTS: Record<string, [number, number]> = {
  London: [51.4775, -0.4614],
  "New York": [40.6413, -73.7781],
  Dubai: [25.2532, 55.3657],
  Nairobi: [-1.3192, 36.9275],
  Cairo: [30.1219, 31.4056],
  Paris: [49.0097, 2.5478],
  Frankfurt: [50.0333, 8.5706],
  "Addis Ababa": [8.9779, 38.7993],
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateTripCarbon(
  fromCity: string,
  days: number,
  transport: string[],
): {
  flightKg: number;
  inCountryKg: number;
  totalKg: number;
  treesEquivalent: number;
  offsetCost: number;
  ecoTips: string[];
  rating: "low" | "medium" | "high";
} {
  const coords = AIRPORTS[fromCity] ?? AIRPORTS["London"];
  const addisCoords = AIRPORTS["Addis Ababa"];
  const distance = haversineDistance(coords[0], coords[1], addisCoords[0], addisCoords[1]);
  const factor =
    distance < 1500
      ? EMISSION_FACTORS.shortHaul
      : distance < 4000
        ? EMISSION_FACTORS.mediumHaul
        : EMISSION_FACTORS.longHaul;
  const flightKg = distance * factor * 2;
  let inCountryKg = days * 8;
  for (const t of transport) {
    if (t === "bus") inCountryKg += days * EMISSION_FACTORS.bus * 50;
    else if (t === "car") inCountryKg += days * EMISSION_FACTORS.car * 80;
    else if (t === "train") inCountryKg += days * EMISSION_FACTORS.train * 40;
  }
  const totalKg = flightKg + inCountryKg;
  return {
    flightKg: Math.round(flightKg),
    inCountryKg: Math.round(inCountryKg),
    totalKg: Math.round(totalKg),
    treesEquivalent: Math.round(totalKg / 21),
    offsetCost: Math.round(totalKg * 0.015),
    rating: totalKg < 500 ? "low" : totalKg < 1500 ? "medium" : "high",
    ecoTips: [
      "Stay in eco-lodges — Bale Mountain Lodge is solar-powered",
      "Take the Ethiopian Railways train where possible",
      "Join community-based tourism in Omo Valley",
      "Offset with Ethiopian reforestation projects",
      "Choose local restaurants to support communities directly",
    ],
  };
}
