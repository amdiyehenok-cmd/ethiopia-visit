"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import Link from "next/link";
import { calculateBudget } from "@/lib/budget-calculator";
import type { BudgetInput } from "@/types/budget";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";

const CITIES = [
  "Addis Ababa",
  "Lalibela",
  "Gondar",
  "Axum",
  "Bahir Dar",
  "Harar",
  "Simien",
  "Bale",
  "Omo Valley",
];

const ACTIVITIES = Object.keys({
  "Lalibela Churches": 1,
  "Simien Trek (3 days)": 1,
  "Danakil Expedition": 1,
  "Omo Valley Tour": 1,
  "Coffee Ceremony": 1,
  "National Museum Addis": 1,
  "Fasil Ghebbi Gondar": 1,
  "Lake Tana Monasteries": 1,
  "Blue Nile Falls": 1,
  "Axum Stelae": 1,
});

export function BudgetEstimator({ compact }: { compact?: boolean }) {
  const [days, setDays] = useState(7);
  const [style, setStyle] = useState<BudgetInput["travelStyle"]>("mid");
  const [cities, setCities] = useState<string[]>(["Addis Ababa", "Lalibela"]);
  const [group, setGroup] = useState(2);
  const [flights, setFlights] = useState(true);
  const [activities, setActivities] = useState<string[]>(["Lalibela Churches", "Coffee Ceremony"]);

  const result = useMemo(
    () =>
      calculateBudget({
        days,
        travelStyle: style,
        cities,
        groupSize: group,
        includeFlights: flights,
        fromCity: "London",
        fromCountry: "UK",
        activities,
      }),
    [days, style, cities, group, flights, activities],
  );

  function exportPdf() {
    const doc = new jsPDF();
    doc.text("Ethiopia Visit — Budget Estimate", 14, 20);
    doc.text(`Total: $${result.grandTotal} (~ ${result.grandTotalETB} ETB)`, 14, 30);
    doc.save("ethiopia-budget.pdf");
  }

  function toggleCity(c: string) {
    setCities((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  function toggleAct(a: string) {
    setActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  }

  const pie = [
    { label: "Stay", v: result.accommodation.total, c: "#C9A84C" },
    { label: "Food", v: result.food.total, c: "#1A6B3A" },
    { label: "Transport", v: result.transport.internal + (result.transport.international ?? 0), c: "#BF1B2C" },
    { label: "Activities", v: result.activities.total, c: "#3B82F6" },
    { label: "Misc", v: result.miscellaneous.total, c: "#A78BFA" },
  ];
  const max = Math.max(...pie.map((p) => p.v), 1);

  if (compact) {
    return (
      <GlassCard className="max-w-xl">
        <p className="text-xs uppercase tracking-widest text-gold-primary/80">Quick budget</p>
        <p className="mt-2 font-display text-3xl text-gold-light">${result.grandTotal}</p>
        <p className="text-xs text-ivory/45">Illustrative total for {days} days · {style}</p>
        <Link href="/budget" className="mt-4 inline-block text-sm text-gold-primary hover:underline">
          Open full estimator →
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-primary/80">Duration</p>
            <input
              type="range"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-2 w-full accent-gold-primary"
            />
            <p className="text-sm text-ivory/60">{days} days</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-primary/80">Style</p>
            <div className="mt-2 flex gap-2">
              {(["budget", "mid", "luxury"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`rounded-full px-3 py-1 text-xs capitalize ${
                    style === s ? "bg-gold-primary text-obsidian" : "bg-white/5 text-ivory/70"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-primary/80">Group size</p>
            <input
              type="number"
              min={1}
              max={10}
              value={group}
              onChange={(e) => setGroup(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ivory/70">
            <input type="checkbox" checked={flights} onChange={(e) => setFlights(e.target.checked)} />
            Include rough international flight estimate
          </label>
        </GlassCard>
        <GlassCard className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-gold-primary/80">Cities</p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCity(c)}
                className={`rounded-full px-3 py-1 text-xs ${
                  cities.includes(c) ? "bg-gold-primary/20 text-gold-light" : "bg-white/5 text-ivory/55"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="text-xs uppercase tracking-widest text-gold-primary/80">Activities</p>
          <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {ACTIVITIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAct(a)}
                className={`rounded-full px-3 py-1 text-[10px] ${
                  activities.includes(a) ? "border border-gold-primary text-gold-light" : "border border-white/10 text-ivory/55"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-ivory/45">Estimated total</p>
            <p className="font-display text-5xl text-gold-light">${result.grandTotal}</p>
            <p className="text-sm text-ivory/55">≈ {result.grandTotalETB} ETB · ${result.perPersonTotal} / person</p>
          </div>
          <div className="flex gap-2">
            <GoldButton type="button" onClick={exportPdf} className="text-sm">
              Export PDF
            </GoldButton>
            <GoldButton href="/planner" variant="outline" className="text-sm">
              Build itinerary
            </GoldButton>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          {pie.map((p) => (
            <div key={p.label}>
              <div className="flex justify-between text-xs text-ivory/55">
                <span>{p.label}</span>
                <span>${p.v}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(p.v / max) * 100}%`, background: p.c }}
                />
              </div>
            </div>
          ))}
        </div>
        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-ivory/60">
          {result.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
