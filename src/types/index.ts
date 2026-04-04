export interface Destination {
  id: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  highlights: string[];
  image: string;
  bestMonths: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  location: string;
  description: string;
  stars: number;
  pricePerNight: number;
  currency?: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  affiliateUrl: string;
  affiliateId?: string;
  featured?: boolean;
}

export interface Festival {
  id: string;
  name: string;
  shortName: string;
  month: number;
  day: number;
  description: string;
  significance: string;
  bestPlaces: string[];
  whatToWear: string;
  photoTips: string;
  image: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  specialty: string;
}

export interface ItineraryDay {
  day: number;
  location: string;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  accommodation: { name: string; priceRange: string };
  estimatedCost: number;
  tips: string;
}

export interface PlannerResult {
  title: string;
  summary: string;
  days: ItineraryDay[];
  totalEstimatedCost: number;
  bestTimeToVisit: string;
  visaNote: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
