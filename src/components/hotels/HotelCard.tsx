"use client";

import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import type { Hotel } from "@/types";

type Props = {
  hotel: Hotel;
  onOpen?: (h: Hotel) => void;
  className?: string;
};

export function HotelCard({ hotel, onOpen, className }: Props) {
  const img = hotel.images[0] ?? "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
  // Build affiliate URL — done client-side only to avoid SSR/CSR mismatch
  const bookHref = `/api/affiliate?url=${encodeURIComponent(hotel.affiliateUrl)}&hotelId=${encodeURIComponent(hotel.id)}`;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-dark-2/80 shadow-xl ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={() => onOpen?.(hotel)}
        className="relative block aspect-[4/5] w-full text-left"
      >
        <Image
          src={img}
          alt={hotel.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-5 backdrop-blur-md">
          <h3 className="font-display text-2xl text-ivory">{hotel.name}</h3>
          <p className="text-sm text-ivory/70">{hotel.location}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <StarRating stars={hotel.stars} />
            <span className="font-semibold text-gold-light">
              ${hotel.pricePerNight}
              <span className="text-xs font-normal text-ivory/50"> / night</span>
            </span>
          </div>
        </div>
      </button>
      <div className="border-t border-white/10 p-4">
        {/* suppressHydrationWarning prevents the false-positive hydration error */}
        <a
          href={bookHref}
          suppressHydrationWarning
          className="btn-gold flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold"
        >
          Book Now
        </a>
      </div>
    </article>
  );
}
