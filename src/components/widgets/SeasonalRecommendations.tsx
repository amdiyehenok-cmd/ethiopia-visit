"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { monthlyRecommendations, ethiopianSeasons } from "@/data/seasons";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ShimmerText } from "@/components/ui/ShimmerText";

const MONTH_NAMES = [
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

export function SeasonalRecommendations() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const data = monthlyRecommendations[month];
  const season = useMemo(() => {
    const m = month;
    for (const [key, s] of Object.entries(ethiopianSeasons)) {
      if (s.months.includes(m)) return { key, ...s };
    }
    return { key: "Bega", ...ethiopianSeasons.Bega };
  }, [month]);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <ShimmerText className="text-4xl md:text-5xl" as="h2">
            Seasonal travel intelligence
          </ShimmerText>
          <p className="mt-2 text-sm text-ivory/55">
            Best destinations, festivals, and weather notes—updated by month.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-widest text-gold-primary/80">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
          >
            {MONTH_NAMES.map((n, i) => (
              <option key={n} value={i + 1}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <GlassCard className="border-t-4" style={{ borderColor: season.color }}>
          <p className="text-xs uppercase tracking-widest text-ivory/45">Season</p>
          <p className="font-display text-2xl text-ivory">{season.label}</p>
          <p className="mt-2 text-sm text-ivory/65">{season.description}</p>
        </GlassCard>
        <GlassCard className="lg:col-span-2">
          <p className="text-xs uppercase tracking-widest text-gold-primary/80">This month</p>
          <p className="mt-2 text-sm text-ivory/75">{data.weatherNote}</p>
          <p className="mt-4 text-sm text-ivory/60">{data.tip}</p>
          {data.festivals.length > 0 && (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gold-light/90">
              {data.festivals.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.topDestinations.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <p className="text-xs text-ivory/45">Best now</p>
            <p className="font-display text-xl text-ivory">{d}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <GoldButton
          href={`/planner?month=${month}`}
          className="justify-center"
        >
          Plan a trip for {MONTH_NAMES[month - 1]}
        </GoldButton>
        <Link href="/seasonal" className="text-sm text-gold-primary hover:underline">
          Full seasonal guide →
        </Link>
      </div>
    </section>
  );
}
