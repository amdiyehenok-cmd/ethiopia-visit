import type { Metadata } from "next";
import { TripPlanner } from "@/components/planner/TripPlanner";

export const metadata: Metadata = {
  title: "AI Trip Planner",
  description:
    "Generate a day-by-day Ethiopia itinerary with Gemini—budget, interests, visa hints, and PDF export.",
};

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl text-gold-light md:text-6xl">AI Trip Planner</h1>
      <p className="mt-4 max-w-2xl text-ivory/65">
        Tell us how long you will stay, your budget tier, and what moves you—we will craft a structured
        itinerary in seconds.
      </p>
      <div className="mt-12">
        <TripPlanner />
      </div>
    </div>
  );
}
