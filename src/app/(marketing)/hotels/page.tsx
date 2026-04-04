import type { Metadata } from "next";
import { HotelsPageClient } from "./HotelsPageClient";

export const metadata: Metadata = {
  title: "Luxury Hotels in Ethiopia",
  description:
    "Curated five-star and boutique stays across Addis Ababa, Lalibela, the Simien Mountains, and beyond—with Booking.com affiliate booking.",
};

export default function HotelsPage() {
  return (
    <div>
      <div className="border-b border-white/10 bg-gradient-to-b from-dark-1 to-obsidian px-4 py-16 md:px-8">
        <h1 className="font-display text-5xl text-gold-light md:text-6xl">Hotels</h1>
        <p className="mt-4 max-w-2xl text-ivory/65">
          Filter by price, stars, and city. Open a card for full details, then book with tracked
          affiliate links.
        </p>
      </div>
      <HotelsPageClient />
    </div>
  );
}
