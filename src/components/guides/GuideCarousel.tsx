"use client";

import useEmblaCarousel from "embla-carousel-react";
import { sampleGuides } from "@/data/guides";
import { GuideCard } from "./GuideCard";

export function GuideCarousel() {
  const [ref] = useEmblaCarousel({ align: "start", dragFree: true });
  const list = sampleGuides.slice(0, 4);

  return (
    <div className="overflow-hidden" ref={ref}>
      <div className="flex gap-6">
        {list.map((g) => (
          <GuideCard key={g.id} guide={g} />
        ))}
      </div>
    </div>
  );
}
