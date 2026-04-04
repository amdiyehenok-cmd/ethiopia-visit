import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Visa Information",
  description: "Ethiopia e-Visa overview—verify requirements for your nationality before travel.",
};

export default function VisaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl text-gold-light">Visa checker</h1>
      <p className="mt-4 text-ivory/70">
        Most visitors use the official{" "}
        <a
          href="https://www.evisa.gov.et/"
          className="text-gold-primary hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Ethiopia e-Visa
        </a>{" "}
        portal. Processing times and eligibility vary by nationality.
      </p>

      <div className="mt-10 space-y-6">
        <GlassCard>
          <h2 className="font-display text-2xl text-ivory">Before you apply</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ivory/75">
            <li>Passport valid at least six months beyond arrival</li>
            <li>Digital passport photo and itinerary details</li>
            <li>Yellow fever certificate if arriving from endemic countries</li>
          </ul>
        </GlassCard>
        <GlassCard>
          <h2 className="font-display text-2xl text-ivory">Ask Habesha AI</h2>
          <p className="mt-2 text-sm text-ivory/70">
            For nuanced questions—extensions, land borders, or multi-entry—open the floating chat and
            mention your nationality.
          </p>
          <Link href="/planner" className="mt-4 inline-block text-gold-primary hover:underline">
            Go to planner →
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
