import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export function SafetyAlert() {
  return (
    <GlassCard className="border-ethiopia-red/30 bg-ethiopia-red/5">
      <p className="text-xs font-semibold uppercase tracking-widest text-ethiopia-red/90">
        Travel advisory
      </p>
      <p className="mt-2 text-sm text-ivory/75">
        Check regional guidance before travel. Register with your embassy and keep emergency contacts
        offline.
      </p>
      <Link
        href="/emergency"
        className="mt-3 inline-block text-sm font-medium text-gold-light hover:underline"
      >
        SOS & embassies →
      </Link>
    </GlassCard>
  );
}
