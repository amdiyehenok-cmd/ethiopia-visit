import type { Metadata } from "next";
import { ARSection } from "./ARSection";

export const metadata: Metadata = {
  title: "AR Mode (Beta)",
  description: "Camera overlay demo with compass-aware landmark hints—best on mobile.",
};

export default function ARPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold-primary/90">Beta</p>
      <h1 className="font-display text-5xl text-gold-light md:text-6xl">Web AR overlay</h1>
      <p className="mt-4 max-w-2xl text-ivory/65">
        Practical web AR uses camera + orientation APIs—no app install. This is a lightweight demo, not
        marker-based AR.js tracking.
      </p>
      <div className="mt-10">
        <ARSection />
      </div>
    </div>
  );
}
