"use client";

import { useMemo, useState } from "react";
import { HotelFilters } from "@/components/hotels/HotelFilters";
import { HotelGrid } from "@/components/hotels/HotelGrid";
import { HotelMap } from "@/components/hotels/HotelMap";
import { HotelModal } from "@/components/hotels/HotelModal";
import { hotels as allHotels } from "@/data/hotels";
import type { Hotel } from "@/types";

export function HotelsPageClient() {
  const [priceMax, setPriceMax] = useState(400);
  const [stars, setStars] = useState(3);
  const [city, setCity] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [mapMode, setMapMode] = useState(false);
  const [selected, setSelected] = useState<Hotel | null>(null);

  const filtered = useMemo(() => {
    return allHotels.filter((h) => {
      if (h.pricePerNight > priceMax) return false;
      if (h.stars < stars) return false;
      if (city && h.city !== city) return false;
      if (amenities.length && !amenities.every((a) => h.amenities.includes(a))) return false;
      return true;
    });
  }, [priceMax, stars, city, amenities]);

  function toggleAmenity(a: string) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row lg:px-8">
      <aside className="w-full shrink-0 lg:w-80">
        <HotelFilters
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          stars={stars}
          setStars={setStars}
          city={city}
          setCity={setCity}
          amenities={amenities}
          toggleAmenity={toggleAmenity}
        />
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMapMode(false)}
            className={`flex-1 rounded-xl py-2 text-sm ${
              !mapMode ? "bg-gold-primary text-obsidian" : "border border-white/15 bg-white/5"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setMapMode(true)}
            className={`flex-1 rounded-xl py-2 text-sm ${
              mapMode ? "bg-gold-primary text-obsidian" : "border border-white/15 bg-white/5"
            }`}
          >
            Map
          </button>
        </div>
      </aside>

      <div className="min-h-[560px] flex-1">
        {mapMode ? (
          <div className="h-[min(80vh,720px)] overflow-hidden rounded-2xl border border-white/10">
            <HotelMap hotels={filtered} className="h-full w-full" />
          </div>
        ) : (
          <HotelGrid hotels={filtered} onOpen={setSelected} />
        )}
      </div>

      <HotelModal hotel={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
