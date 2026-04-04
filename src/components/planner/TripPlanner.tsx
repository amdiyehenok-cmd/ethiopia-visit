"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PlannerResult } from "@/types";
import { ItineraryDisplay } from "./ItineraryDisplay";
import { PDFExport } from "./PDFExport";

const interestsList = ["History", "Nature", "Culture", "Adventure", "Relaxation", "Food"];

export function TripPlanner({ embedded }: { embedded?: boolean }) {
  const [duration, setDuration] = useState(7);
  const [budget, setBudget] = useState("mid");
  const [interests, setInterests] = useState<string[]>([]);
  const [country, setCountry] = useState("United States");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function toggleInterest(i: string) {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          budget,
          interests,
          homeCountry: country,
          startDate,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Planner failed");
      setResult(json as PlannerResult);
      if (!embedded && typeof document !== "undefined") {
        document.getElementById("planner-results")?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <GlassCard>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
              Duration: {duration} days
            </label>
            <input
              type="range"
              min={3}
              max={21}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-2 w-full accent-gold-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
              Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
            >
              <option value="budget">Budget (&lt;$500)</option>
              <option value="mid">Mid ($500–2000)</option>
              <option value="luxury">Luxury ($2000+)</option>
            </select>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
              Interests
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {interestsList.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleInterest(i)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    interests.includes(i)
                      ? "border border-gold-primary bg-gold-primary/15 text-gold-light"
                      : "border border-white/10 bg-white/5 text-ivory/70"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
                Home country
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {err && <p className="text-sm text-red-300">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full rounded-full py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Crafting your journey…" : "Generate itinerary"}
          </button>
        </form>
      </GlassCard>

      {result && (
        <div id="planner-results" className="space-y-6">
          <div className="flex justify-end">
            <PDFExport data={result} />
          </div>
          <ItineraryDisplay data={result} />
        </div>
      )}
    </div>
  );
}
