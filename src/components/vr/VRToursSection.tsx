"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { vrTours, type VRTour } from "@/data/vr-tours";
import { GoldButton } from "@/components/ui/GoldButton";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { VRTourViewer } from "./VRTourViewer";

const tabs = [
  { id: "all", label: "All" },
  { id: "church", label: "Churches" },
  { id: "nature", label: "Nature" },
  { id: "landscape", label: "Landscapes" },
  { id: "city", label: "Cities" },
] as const;

export function VRToursSection() {
  const [filter, setFilter] = useState<(typeof tabs)[number]["id"]>("all");
  const [active, setActive] = useState<VRTour | null>(null);

  const list = useMemo(() => {
    if (filter === "all") return vrTours;
    return vrTours.filter((t) => t.category === filter);
  }, [filter]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              filter === t.id
                ? "border-gold-primary bg-gold-primary/15 text-gold-light"
                : "border-white/10 bg-white/5 text-ivory/70 hover:border-white/20",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-ivory/55 md:text-left">
        For the best experience, use headphones and fullscreen on mobile.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((tour) => (
          <article
            key={tour.id}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={tour.panoramaUrl}
                alt=""
                fill
                className="object-cover blur-sm transition duration-700 group-hover:scale-105 group-hover:blur-none"
                sizes="(max-width:768px) 100vw, 33vw"
              />
              <div className="absolute right-3 top-3 rounded-full border border-gold-primary/40 bg-black/50 px-2 py-1 text-xs font-semibold text-gold-light backdrop-blur-md">
                <span className="inline-block animate-pulse">360°</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <Badge className="mb-2 capitalize">{tour.category}</Badge>
                <h3 className="font-display text-2xl text-ivory">{tour.title}</h3>
                <p className="mt-1 text-sm text-gold-light/90">{tour.destination}</p>
                <GoldButton
                  className="mt-4 w-full justify-center text-sm"
                  onClick={() => setActive(tour)}
                >
                  Enter VR
                </GoldButton>
              </div>
            </div>
          </article>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <VRTourViewer key={active.id} tour={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
