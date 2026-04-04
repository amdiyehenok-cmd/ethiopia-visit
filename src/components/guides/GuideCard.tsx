"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GoldButton } from "@/components/ui/GoldButton";
import { Badge } from "@/components/ui/Badge";
import type { SampleGuide } from "@/data/guides";

export function GuideCard({ guide }: { guide: SampleGuide }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="flex w-[320px] max-w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl"
      style={{ minHeight: 420 }}
    >
      <div className="relative h-44 w-full">
        <Image src={guide.coverPhoto} alt="" fill className="object-cover" sizes="320px" />
        <div className="absolute -bottom-10 left-4 h-20 w-20 overflow-hidden rounded-full border-2 border-gold-primary/40 bg-dark-2">
          <Image src={guide.profilePhoto} alt={guide.name} fill className="object-cover" sizes="80px" />
        </div>
        {guide.verified && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-primary/90 px-2 py-0.5 text-[10px] font-bold text-obsidian">
            Verified
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 pt-12">
        <h3 className="font-display text-2xl text-ivory">{guide.name}</h3>
        <p className="text-sm text-gold-light/90">{guide.city}</p>
        <p className="mt-2 line-clamp-3 text-sm text-ivory/65">{guide.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {guide.languages.slice(0, 3).map((l) => (
            <Badge key={l} className="text-[10px]">
              {l}
            </Badge>
          ))}
        </div>
        <p className="mt-3 text-xs text-ivory/45">
          ★ {guide.rating.toFixed(1)} · {guide.reviewCount} reviews · {guide.responseTime}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {guide.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-ivory/70"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-6">
          <GoldButton href={`/guides/${guide.id}`} className="w-full justify-center text-sm">
            View Profile
          </GoldButton>
        </div>
      </div>
    </motion.article>
  );
}
