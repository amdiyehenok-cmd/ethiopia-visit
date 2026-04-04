import type { Metadata } from "next";
import { BudgetEstimator } from "@/components/widgets/BudgetEstimator";
import { CarbonCalculator } from "@/components/widgets/CarbonCalculator";

export const metadata: Metadata = {
  title: "Budget Estimator",
  description: "Plan trip costs in USD and ETB—illustrative ranges for accommodation, food, transport, and activities.",
};

export default function BudgetPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl text-gold-light md:text-6xl">Budget planner</h1>
      <p className="mt-4 max-w-2xl text-ivory/65">
        Transparent, illustrative math—pair with the AI planner for routing and pacing.
      </p>
      <div className="mt-12">
        <BudgetEstimator />
      </div>
      <div className="mt-16">
        <h2 className="font-display text-3xl text-ivory">Carbon footprint</h2>
        <p className="mt-2 text-sm text-ivory/55">Rough ICAO-style flight estimates + in-country usage.</p>
        <div className="mt-8 max-w-xl">
          <CarbonCalculator />
        </div>
      </div>
    </div>
  );
}
