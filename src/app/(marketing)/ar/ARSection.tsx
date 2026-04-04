"use client";

import dynamic from "next/dynamic";

const ARMode = dynamic(() => import("@/components/ar/ARMode").then((m) => ({ default: m.ARMode })), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-2xl bg-white/5" />,
});

export function ARSection() {
  return <ARMode />;
}
