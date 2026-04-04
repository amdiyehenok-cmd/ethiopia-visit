"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { sampleGuides } from "@/data/guides";
import { GuideCard } from "@/components/guides/GuideCard";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { GoldButton } from "@/components/ui/GoldButton";
import { Badge } from "@/components/ui/Badge";

const CITIES = ["All cities", ...Array.from(new Set(sampleGuides.map((g) => g.city)))];
const SPECIALTIES = ["All", "History", "Culture", "Adventure", "Food", "Wildlife", "Photography"];

export default function GuidesPage() {
  const [cityFilter, setCityFilter] = useState("All cities");
  const [specFilter, setSpecFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "reviews">("rating");

  const guides = useMemo(() => {
    return sampleGuides
      .filter((g) => {
        if (cityFilter !== "All cities" && g.city !== cityFilter) return false;
        if (specFilter !== "All" && !g.specialties.some((s) => s.toLowerCase().includes(specFilter.toLowerCase()) || g.experiences.some((e) => e.category === specFilter))) return false;
        if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.bio.toLowerCase().includes(search.toLowerCase()) && !g.city.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : b.reviewCount - a.reviewCount);
  }, [cityFilter, specFilter, search, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-dark-1 via-dark-2 to-obsidian py-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 20% 60%, #1a6b3a 0%, transparent 50%), radial-gradient(circle at 80% 40%, #c9a84c 0%, transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 text-center md:px-8">
          <p className="text-xs uppercase tracking-widest text-gold-primary">Handpicked & verified</p>
          <ShimmerText className="mt-3 text-5xl md:text-7xl" as="h1">
            Local Guides
          </ShimmerText>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/60">
            8 expert guides — each one a storyteller, local, and trusted companion for your Ethiopian adventure.
          </p>
          {/* Stats bar */}
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {[
              { v: "8", l: "Verified guides" },
              { v: "4.9★", l: "Average rating" },
              { v: "648", l: "Reviews" },
              { v: "6", l: "Languages spoken" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-display text-3xl text-gold-light">{s.v}</p>
                <p className="text-xs uppercase tracking-widest text-ivory/40">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {/* Search + filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search guides, cities, specialties…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder-ivory/30 focus:border-gold-primary/50 focus:outline-none"
          />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-dark-2 px-3 py-2.5 text-sm text-ivory"
          >
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rating" | "reviews")}
            className="rounded-xl border border-white/10 bg-dark-2 px-3 py-2.5 text-sm text-ivory"
          >
            <option value="rating">Sort: Top rated</option>
            <option value="reviews">Sort: Most reviews</option>
          </select>
        </div>

        {/* Specialty tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpecFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                specFilter === s
                  ? "bg-gold-primary font-semibold text-obsidian"
                  : "border border-white/10 bg-white/5 text-ivory/60 hover:border-white/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-ivory/40">
          {guides.length} guide{guides.length !== 1 ? "s" : ""} found
          {cityFilter !== "All cities" ? ` in ${cityFilter}` : ""}
          {specFilter !== "All" ? ` · ${specFilter}` : ""}
        </p>

        {/* Guide cards grid */}
        {guides.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-4 text-ivory/60">No guides match your search.</p>
            <button
              type="button"
              onClick={() => { setSearch(""); setCityFilter("All cities"); setSpecFilter("All"); }}
              className="mt-4 text-sm text-gold-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {guides.map((g, i) => (
              <motion.div
                key={g.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <GuideCard guide={g} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Become a guide CTA */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-gold-primary/20 bg-gradient-to-br from-dark-2 via-dark-1 to-obsidian">
          <div className="flex flex-col items-center gap-8 p-10 text-center md:flex-row md:text-left">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&q=80"
                alt="Guide"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            <div className="flex-1">
              <Badge className="text-xs">For locals</Badge>
              <h2 className="mt-3 font-display text-4xl text-ivory">Are you an Ethiopian guide?</h2>
              <p className="mt-3 text-ivory/60 max-w-lg">
                Join Ethiopia Visit's verified guide network. Get bookings from international travellers, set your own rates, and grow your business with zero upfront cost.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <GoldButton href="/guides/become-a-guide">Apply now — it&apos;s free</GoldButton>
                <GoldButton href="/community" variant="outline">See community →</GoldButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
