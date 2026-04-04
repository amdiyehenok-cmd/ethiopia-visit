"use client";

import { GlassCard } from "@/components/ui/GlassCard";

const cities = [
  "All",
  "Addis Ababa",
  "Lalibela",
  "Bahir Dar",
  "Harar",
  "Simien Mountains",
  "Bale Mountains",
  "Omo Valley",
];

const amenityOptions = ["Pool", "Spa", "WiFi", "Restaurant", "Gym"];

type Props = {
  priceMax: number;
  setPriceMax: (n: number) => void;
  stars: number;
  setStars: (n: number) => void;
  city: string;
  setCity: (s: string) => void;
  amenities: string[];
  toggleAmenity: (a: string) => void;
};

export function HotelFilters({
  priceMax,
  setPriceMax,
  stars,
  setStars,
  city,
  setCity,
  amenities,
  toggleAmenity,
}: Props) {
  return (
    <GlassCard className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
          Price / night (USD)
        </p>
        <input
          type="range"
          min={40}
          max={400}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="mt-3 w-full accent-gold-primary"
        />
        <p className="mt-1 text-sm text-ivory/70">Up to ${priceMax}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
          Minimum stars
        </p>
        <div className="mt-2 flex gap-2">
          {[3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStars(s)}
              className={`rounded-full px-3 py-1 text-sm ${
                stars === s
                  ? "bg-gold-primary text-obsidian"
                  : "border border-white/15 bg-white/5 text-ivory/80"
              }`}
            >
              {s}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
          City
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-ivory outline-none focus:border-gold-primary/50"
        >
          {cities.map((c) => (
            <option key={c} value={c === "All" ? "" : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
          Amenities
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {amenityOptions.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`rounded-full px-3 py-1 text-xs ${
                amenities.includes(a)
                  ? "border border-gold-primary bg-gold-primary/15 text-gold-light"
                  : "border border-white/10 bg-white/5 text-ivory/70"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
