"use client";

import { useState } from "react";
import type { PlannerResult } from "@/types";

export function AISearchBar({
  onResult,
}: {
  onResult?: (r: PlannerResult) => void;
}) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: 7,
          budget: "mid",
          interests: [],
          homeCountry: "United States",
          startDate: "",
          prompt: q.trim(),
        }),
      });
      const json = await res.json();
      if (res.ok && json.title) {
        onResult?.(json as PlannerResult);
        document.getElementById("planner-results-home")?.scrollIntoView({ behavior: "smooth" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto -mt-16 max-w-3xl px-4 relative z-20"
    >
      <div className="rounded-2xl border border-white/10 bg-[#0a0a0b]/80 p-2 shadow-2xl backdrop-blur-xl">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='Ask our AI — "Plan me 7 days in Ethiopia under $2000"'
          className="w-full rounded-xl border border-transparent bg-transparent px-4 py-4 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-gold-primary/40 focus:shadow-[0_0_24px_rgba(201,168,76,0.15)]"
        />
        <div className="flex justify-end px-2 pb-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold rounded-full px-6 py-2 text-xs font-semibold disabled:opacity-50"
          >
            {loading ? "Planning…" : "Plan with AI"}
          </button>
        </div>
      </div>
    </form>
  );
}
