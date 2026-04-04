"use client";

import dynamic from "next/dynamic";

const SmartMap = dynamic(
  () => import("@/components/maps/SmartMap").then((m) => ({ default: m.SmartMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[min(80vh,720px)] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
    ),
  },
);

export function ExploreMap() {
  return <SmartMap />;
}
