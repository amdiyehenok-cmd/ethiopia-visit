import type { PlannerResult } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";

export function ItineraryDisplay({ data }: { data: PlannerResult }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-4xl text-gold-light">{data.title}</h2>
        <p className="mt-3 max-w-3xl text-ivory/75">{data.summary}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-ivory/60">
          <span>
            Est. total:{" "}
            <strong className="text-gold-primary">${data.totalEstimatedCost}</strong>
          </span>
          <span>|</span>
          <span>{data.bestTimeToVisit}</span>
        </div>
        <p className="mt-2 text-sm text-ivory/55">{data.visaNote}</p>
      </div>

      <div className="relative space-y-6 border-l border-gold-primary/30 pl-8">
        {data.days.map((d) => (
          <GlassCard key={d.day} className="relative">
            <span className="absolute -left-[41px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-gold-primary text-xs font-bold text-obsidian">
              {d.day}
            </span>
            <h3 className="font-display text-2xl text-ivory">{d.title}</h3>
            <p className="text-sm text-gold-light/90">{d.location}</p>
            <div className="mt-4 grid gap-3 text-sm text-ivory/80 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-ivory/40">Morning</p>
                <p>{d.morning}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ivory/40">Afternoon</p>
                <p>{d.afternoon}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ivory/40">Evening</p>
                <p>{d.evening}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-sm">
              <span>
                Stay: <strong className="text-gold-primary">{d.accommodation.name}</strong> (
                {d.accommodation.priceRange})
              </span>
              <span className="text-gold-light">~${d.estimatedCost} / day est.</span>
            </div>
            <p className="mt-2 text-xs text-ivory/55">{d.tips}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
