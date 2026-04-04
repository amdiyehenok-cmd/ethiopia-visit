"use client";

import { useEffect, useState } from "react";
import { Festival } from "@/types"; // Make sure you have this type
// import { festivals } from "@/data/festivals"; // now passed as prop

interface FestivalCountdownProps {
  festivals: Festival[];
}

function nextFestivalDate(festivals: Festival[]) {
  const now = new Date();
  const year = now.getFullYear();
  let best: { name: string; at: Date } | null = null;

  for (const f of festivals) {
    const at = new Date(year, f.month - 1, f.day);
    if (at < now) at.setFullYear(year + 1);
    if (!best || at < best.at) best = { name: f.shortName, at };
  }
  return best;
}

export function FestivalCountdown({ festivals }: FestivalCountdownProps) {
  const [left, setLeft] = useState<string>("");

  useEffect(() => {
    const nf = nextFestivalDate(festivals);
    if (!nf) return;

    const tick = () => {
      const diff = nf.at.getTime() - Date.now();
      if (diff <= 0) {
        setLeft("Today!");
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      setLeft(`${d}d ${h}h until ${nf.name}`);
    };

    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [festivals]);

  return (
    <div className="mt-10 rounded-2xl border border-gold-primary/30 bg-gold-primary/10 px-6 py-4 text-center">
      <p className="text-xs uppercase tracking-widest text-gold-primary/90">
        Next highlight
      </p>
      <p className="mt-1 font-display text-2xl text-ivory">{left || "…"}</p>
    </div>
  );
}