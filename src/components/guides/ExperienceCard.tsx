"use client";

import { motion } from "framer-motion";
import { GoldButton } from "@/components/ui/GoldButton";

export type ExperienceListItem = {
  id: string;
  title: string;
  duration: number;
  price: number;
  category: string;
  guideName: string;
  guidePhoto: string;
  city: string;
};

export function ExperienceCard({ exp }: { exp: ExperienceListItem }) {
  const icon =
    exp.category.toLowerCase().includes("coffee") || exp.category.toLowerCase().includes("culture")
      ? "☕"
      : exp.category.toLowerCase().includes("trek") || exp.category.toLowerCase().includes("adventure")
        ? "🏔"
        : exp.category.toLowerCase().includes("history")
          ? "🏛"
          : "🎭";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-dark-2/80"
    >
      <div className="relative aspect-[16/9] bg-dark-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={exp.guidePhoto}
          alt=""
          className="h-full w-full object-cover opacity-90"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-lg backdrop-blur">
          {icon}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-gold-primary/90">{exp.category}</p>
        <h3 className="mt-1 font-display text-2xl text-ivory">{exp.title}</h3>
        <div className="mt-2 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={exp.guidePhoto} alt="" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-sm text-ivory/70">{exp.guideName}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ivory/55">
          <span className="rounded-full border border-white/10 px-2 py-0.5">{exp.duration}h</span>
          <span className="rounded-full border border-white/10 px-2 py-0.5">{exp.city}</span>
        </div>
        <p className="mt-4 font-display text-2xl text-gold-light">
          ${exp.price}
          <span className="text-sm font-sans text-ivory/45"> / person</span>
        </p>
        <div className="mt-4 flex gap-2">
          <GoldButton href={`/experiences/${exp.id}`} className="flex-1 justify-center text-sm">
            Book Now
          </GoldButton>
          <button
            type="button"
            className="rounded-full border border-white/15 px-3 text-lg text-gold-light hover:bg-white/5"
            aria-label="Save"
          >
            ♡
          </button>
        </div>
      </div>
    </motion.article>
  );
}
