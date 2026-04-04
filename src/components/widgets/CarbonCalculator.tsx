"use client";

import { useMemo, useState } from "react";
import { calculateTripCarbon } from "@/lib/carbon-calculator";
import { GlassCard } from "@/components/ui/GlassCard";

const cities = [
  "London",
  "New York",
  "Dubai",
  "Nairobi",
  "Cairo",
  "Paris",
  "Frankfurt",
];

export function CarbonCalculator() {
  const [origin, setOrigin] = useState("London");
  const [days, setDays] = useState(10);
  const [bus, setBus] = useState(false);
  const [car, setCar] = useState(true);
  const [train, setTrain] = useState(false);

  const result = useMemo(() => {
    const t: string[] = [];
    if (bus) t.push("bus");
    if (car) t.push("car");
    if (train) t.push("train");
    return calculateTripCarbon(origin, days, t);
  }, [origin, days, bus, car, train]);

  const arc = Math.min(100, (result.totalKg / 2000) * 100);

  return (
    <GlassCard className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold-primary/80">Origin city</p>
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-gold-primary/80">Trip length (days)</p>
        <input
          type="range"
          min={3}
          max={30}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="mt-2 w-full accent-gold-primary"
        />
        <p className="text-sm text-ivory/55">{days} days</p>
      </div>
      <div className="flex flex-wrap gap-3 text-sm text-ivory/70">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={bus} onChange={(e) => setBus(e.target.checked)} />
          Bus
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={car} onChange={(e) => setCar(e.target.checked)} />
          Car
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={train} onChange={(e) => setTrain(e.target.checked)} />
          Train
        </label>
      </div>
      <div className="flex items-center gap-6">
        <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="10"
            strokeDasharray={`${(arc / 100) * 326.7} 326.7`}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div>
          <p className="text-xs uppercase tracking-widest text-ivory/45">Total CO₂e</p>
          <p className="font-display text-4xl text-gold-light">{result.totalKg} kg</p>
          <p className="text-xs text-ivory/50">
            Flight ~{result.flightKg} kg · in-country ~{result.inCountryKg} kg
          </p>
          <p className="mt-2 text-xs text-ivory/50">
            ≈ {result.treesEquivalent} trees · offset ~${result.offsetCost}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gold-primary/90">
            {result.rating === "low" ? "🌿 Low" : result.rating === "medium" ? "🟡 Medium" : "🔴 High"}
          </p>
        </div>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ivory/60">
        {result.ecoTips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <a
        href="https://goldstandard.org/"
        target="_blank"
        rel="noreferrer"
        className="text-sm text-gold-primary hover:underline"
      >
        Explore high-quality offsets →
      </a>
    </GlassCard>
  );
}
