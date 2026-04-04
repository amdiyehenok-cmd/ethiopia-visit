"use client";

import { useState } from "react";
import { monthlyRecommendations, ethiopianSeasons } from "@/data/seasons";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function SeasonalPage() {
  const [active, setActive] = useState(new Date().getMonth() + 1);
  const data = monthlyRecommendations[active];
  const seasonEntry = Object.entries(ethiopianSeasons).find(([, s]) =>
    s.months.includes(active),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl text-gold-light md:text-6xl">Seasonal guide</h1>
      <p className="mt-4 max-w-2xl text-ivory/65">
        Kiremt, Bega, Belg—and what they mean for your routes.
      </p>

      <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
        {MONTHS.map((m, i) => {
          const monthNum = i + 1;
          const s = Object.entries(ethiopianSeasons).find(([, v]) => v.months.includes(monthNum));
          const color = s?.[1].color ?? "#C9A84C";
          return (
            <button
              key={m}
              type="button"
              onClick={() => setActive(monthNum)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                active === monthNum ? "border-gold-primary bg-gold-primary/15 text-gold-light" : "border-white/10 bg-white/5 text-ivory/70"
              }`}
              style={{ boxShadow: active === monthNum ? `0 0 0 1px ${color}55` : undefined }}
            >
              {m}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-ivory/45">Dominant season</p>
          <p className="font-display text-3xl text-ivory">{seasonEntry?.[1].label ?? "—"}</p>
          <p className="mt-2 text-sm text-ivory/65">{seasonEntry?.[1].description}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-gold-primary/80">Weather</p>
          <p className="mt-2 text-ivory/80">{data.weatherNote}</p>
          <p className="mt-4 text-sm text-ivory/55">{data.tip}</p>
        </GlassCard>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl text-ivory">Top destinations</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.topDestinations.map((d) => (
            <li key={d} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ivory">
              {d}
            </li>
          ))}
        </ul>
        {data.avoid.length > 0 && (
          <h3 className="mt-8 font-display text-xl text-ethiopia-red/90">Consider avoiding</h3>
        )}
        <ul className="mt-2 list-disc pl-6 text-sm text-ivory/60">
          {data.avoid.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex justify-center">
        <GoldButton href={`/planner?month=${active}`}>Plan for {MONTHS[active - 1]}</GoldButton>
      </div>
    </div>
  );
}
