import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Emergency & Embassies",
  description: "Emergency numbers, embassy contacts, and safety resources for travelers in Ethiopia.",
};

const embassies = [
  { country: "United States", phone: "+251 11 130-6000", note: "Addis Ababa" },
  { country: "United Kingdom", phone: "+251 11 617 0100", note: "Addis Ababa" },
  { country: "European Union Delegation", phone: "+251 11 123 2500", note: "Addis Ababa" },
];

export default function EmergencyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl text-ethiopia-red/90">Emergency</h1>
      <p className="mt-4 text-ivory/70">
        Save these offline. For life-threatening emergencies, contact local authorities first, then your
        embassy.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <GlassCard className="border-ethiopia-red/30">
          <h2 className="font-display text-2xl text-ivory">Ethiopia</h2>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>
              <strong className="text-ivory">Police:</strong> 991
            </li>
            <li>
              <strong className="text-ivory">Medical:</strong> 907 (verify locally)
            </li>
          </ul>
        </GlassCard>
        <GlassCard>
          <h2 className="font-display text-2xl text-ivory">Travel tips</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ivory/75">
            <li>Share your itinerary with someone you trust</li>
            <li>Carry copies of passport and visa separately from originals</li>
            <li>Check regional advisories before road trips</li>
          </ul>
        </GlassCard>
      </div>

      <h2 className="mt-14 font-display text-3xl text-gold-light">Embassy contacts</h2>
      <div className="mt-6 space-y-4">
        {embassies.map((e) => (
          <GlassCard key={e.country}>
            <p className="text-sm text-gold-primary/90">{e.country}</p>
            <p className="font-display text-xl text-ivory">{e.phone}</p>
            <p className="text-xs text-ivory/50">{e.note}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
