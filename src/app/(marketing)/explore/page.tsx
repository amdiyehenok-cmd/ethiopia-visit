import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { Badge } from "@/components/ui/Badge";
import { ExploreMap } from "./ExploreMap";

export const metadata: Metadata = {
  title: "Explore Destinations & Smart Map",
  description:
    "Interactive map of Ethiopian attractions, hotels, and POIs—with OSRM routing and seasonal filters.",
};

export default function ExplorePage() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-white/10 bg-gradient-to-b from-dark-1 to-obsidian px-4 py-12 md:px-8">
        <h1 className="font-display text-5xl text-gold-light md:text-6xl">Explore Ethiopia</h1>
        <p className="mt-4 max-w-3xl text-ivory/65">
          Filter by category, season, and difficulty—then plan a driving route between two pins (free OSRM).
        </p>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
        <ExploreMap />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl text-ivory">Destination library</h2>
            <p className="mt-2 text-sm text-ivory/55">
              Deep dives for every region—pair with the map above.
            </p>
          </div>
          <Link
            href="/planner"
            className="btn-gold inline-flex rounded-full px-6 py-3 text-sm font-semibold text-obsidian"
          >
            Plan a route →
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <article
              key={d.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-gold-primary/40"
            >
              <div className="relative aspect-[4/3]">
                <Image src={d.image} alt={d.name} fill className="object-cover" sizes="400px" />
              </div>
              <div className="p-5">
                <Badge>{d.region}</Badge>
                <h3 className="mt-2 font-display text-3xl text-ivory">{d.name}</h3>
                <p className="mt-1 text-sm text-gold-light/90">{d.tagline}</p>
                <p className="mt-3 text-sm text-ivory/70">{d.description}</p>
                <p className="mt-3 text-xs text-ivory/45">Best: {d.bestMonths}</p>
                <Link
                  href="/planner"
                  className="mt-4 inline-block text-sm font-medium text-gold-primary hover:underline"
                >
                  Open AI planner →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
