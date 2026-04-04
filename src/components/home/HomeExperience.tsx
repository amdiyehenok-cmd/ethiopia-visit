"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { AdBanner } from "@/components/Ads/AdBanner";
import { GoldButton } from "@/components/ui/GoldButton";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { Badge } from "@/components/ui/Badge";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { CurrencyWidget } from "@/components/widgets/CurrencyWidget";
import { festivals } from "@/data/festivals";
import { dishes } from "@/data/cuisine";
import { destinations } from "@/data/destinations";
import { hotels } from "@/data/hotels";
import { HotelCard } from "@/components/hotels/HotelCard";
import { ItineraryDisplay } from "@/components/planner/ItineraryDisplay";
import { PDFExport } from "@/components/planner/PDFExport";
import type { PlannerResult } from "@/types";
import { AISearchBar } from "./AISearchBar";
import { SeasonalRecommendations } from "@/components/widgets/SeasonalRecommendations";
import { VRToursPreview } from "@/components/vr/VRToursPreview";
import { GuideCarousel } from "@/components/guides/GuideCarousel";
import { PhotoGrid } from "@/components/ugc/PhotoGrid";
import { BudgetEstimator } from "@/components/widgets/BudgetEstimator";

function useCountTo(target: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    setV(0);
    const steps = 48;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setV(Math.min(Math.round((target * i) / steps), target));
      if (i >= steps) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [target]);
  return v;
}

function TypingLine() {
  const text = "Your AI Tour Guide — Available 24/7";
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 42);
    return () => clearInterval(id);
  }, [text]);
  return (
    <h2 className="font-display text-4xl text-ivory md:text-5xl">
      {shown}
      <span className="animate-pulse text-gold-primary">|</span>
    </h2>
  );
}

export function HomeExperience() {
  const [plannerResult, setPlannerResult] = useState<PlannerResult | null>(null);
  const [destRef] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });
  const [hotelRef] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });
  const [festRef] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });
  const [dealRef] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });

  const pop = useCountTo(130);
  const unesco = useCountTo(9);
  const langs = useCountTo(80);
  const years = useCountTo(3000);

  const featuredDest = destinations.slice(0, 8);
  const topHotels = hotels.filter((h) => h.featured).slice(0, 8);
  const deals = hotels.slice(0, 10);

  return (
    <div className="flex flex-col">
      <HeroSlider />
      <AISearchBar onResult={setPlannerResult} />

      <div className="relative z-20 mx-auto mt-24 w-full max-w-5xl px-4">
        <AdBanner slot="home-hero" />
      </div>

      {plannerResult && (
        <section id="planner-results-home" className="mx-auto mt-16 max-w-5xl px-4">
          <div className="mb-4 flex flex-wrap justify-end gap-2">
            <PDFExport data={plannerResult} />
            <Link
              href="/planner"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-ivory/80"
            >
              Open full planner
            </Link>
          </div>
          <ItineraryDisplay data={plannerResult} />
        </section>
      )}

      <section className="mx-auto mt-24 w-full max-w-7xl px-4 md:px-8">
        <ShimmerText className="text-4xl md:text-5xl" as="h2">
          Explore Ethiopia
        </ShimmerText>
        <p className="mt-2 max-w-xl text-sm text-ivory/60">
          Netflix-style rows—lift, zoom, and fall in love with every region.
        </p>
        <div className="relative mt-8 overflow-hidden" ref={destRef}>
          <div className="flex gap-4">
            {featuredDest.map((d) => (
              <Link
                key={d.id}
                href="/explore"
                className="group relative h-[400px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <Badge>{d.region}</Badge>
                  <p className="mt-2 font-display text-3xl text-ivory">{d.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ivory/70">{d.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <VRToursPreview />
      </div>

      <div className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
        <SeasonalRecommendations />
      </div>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
        <h2 className="font-display text-4xl text-gold-light">Top Hotels</h2>
        <div className="relative mt-8 overflow-hidden" ref={hotelRef}>
          <div className="flex gap-5">
            {topHotels.map((h) => (
              <div key={h.id} className="w-[320px] shrink-0">
                <HotelCard hotel={h} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl text-gold-light">Meet your guides</h2>
            <p className="mt-2 text-sm text-ivory/55">Licensed-style profiles—expand with auth + Prisma.</p>
          </div>
          <Link href="/guides" className="text-sm text-gold-primary hover:underline">
            Find your guide →
          </Link>
        </div>
        <div className="mt-8">
          <GuideCarousel />
        </div>
      </section>

      <section className="relative mt-24 overflow-hidden border-y border-white/10 bg-[#080809] py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #1a6b3a 0 80px, transparent 80px 160px), repeating-linear-gradient(0deg, #bf1b2c 0 80px, transparent 80px 160px)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 text-center md:px-8">
          <TypingLine />
          <p className="mt-6 text-sm text-ivory/60">
            Gemini powers Habesha AI—your brilliant local friend, everywhere you roam.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <GoldButton href="/planner">Plan My Trip</GoldButton>
            <GoldButton href="/#habesha-chat" variant="outline">
              Chat with Guide
            </GoldButton>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-8">
        <WeatherWidget />
        <CurrencyWidget />
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
        <h2 className="font-display text-3xl text-ivory">Ethiopian Festivals</h2>
        <div className="relative mt-6 overflow-hidden" ref={festRef}>
          <div className="flex gap-4">
            {festivals.map((f) => (
              <Link
                key={f.id}
                href="/festivals"
                className="group relative h-56 w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10"
              >
                <Image src={f.image} alt={f.name} fill className="object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-xs text-gold-light">
                    {f.month}/{f.day}
                  </p>
                  <p className="font-display text-xl text-ivory">{f.shortName}</p>
                  <p className="line-clamp-2 text-xs text-ivory/65">{f.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <h2 className="font-display text-3xl text-gold-light">Cuisine Preview</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((d) => (
            <motion.div
              key={d.id}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="relative aspect-[4/3]">
                <Image src={d.image} alt={d.name} fill className="object-cover" sizes="400px" />
              </div>
              <div className="p-4">
                <p className="font-display text-2xl text-ivory">{d.name}</p>
                <p className="mt-1 text-sm text-ivory/65">{d.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <h2 className="font-display text-3xl text-ivory">Why Ethiopia</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Population", value: pop, suffix: "M+" },
            { label: "UNESCO Sites", value: unesco, suffix: "" },
            { label: "Languages", value: langs, suffix: "+" },
            { label: "Years of history", value: years, suffix: "+" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="font-display text-5xl text-gold-light">
                {s.value}
                {s.suffix}
              </p>
              <p className="mt-2 text-sm uppercase tracking-widest text-ivory/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
        <ShimmerText className="text-3xl" as="h2">
          Best Deals This Week
        </ShimmerText>
        <div className="relative mt-8 overflow-hidden" ref={dealRef}>
          <div className="flex gap-5">
            {deals.map((h) => (
              <div key={h.id} className="w-[300px] shrink-0">
                <HotelCard hotel={h} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <h2 className="font-display text-3xl text-ivory">Community snapshots</h2>
        <p className="mt-2 text-sm text-ivory/55">#EthiopiaVisit — upload yours on the community hub.</p>
        <div className="mt-6">
          <PhotoGrid />
        </div>
        <div className="mt-6 flex justify-center">
          <GoldButton href="/community" variant="outline" className="text-sm">
            Open community hub
          </GoldButton>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <BudgetEstimator compact />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h3 className="font-display text-2xl text-ivory">Plan smarter</h3>
            <p className="mt-2 text-sm text-ivory/60">
              Seasonal routing, VR previews, and OSRM map planning—then lock hotels with tracked affiliate links.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <GoldButton href="/budget" className="text-sm">
                Full budget tool
              </GoldButton>
              <GoldButton href="/explore" variant="outline" className="text-sm">
                Smart map
              </GoldButton>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/visa"
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-dark-2 to-obsidian p-8 transition hover:border-gold-primary/40"
          >
            <p className="text-xs uppercase tracking-widest text-gold-primary/90">Visa</p>
            <h3 className="mt-2 font-display text-3xl text-ivory">Visa checker</h3>
            <p className="mt-2 text-sm text-ivory/60">e-Visa guidance by nationality.</p>
          </Link>
          <Link
            href="/emergency"
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-ethiopia-red/20 to-dark-2 p-8 transition hover:border-ethiopia-red/50"
          >
            <p className="text-xs uppercase tracking-widest text-ethiopia-red/90">Safety</p>
            <h3 className="mt-2 font-display text-3xl text-ivory">Alerts & SOS</h3>
            <p className="mt-2 text-sm text-ivory/60">Embassies, hotlines, and preparedness.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
