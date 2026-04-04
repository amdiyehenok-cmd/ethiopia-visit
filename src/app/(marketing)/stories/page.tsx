"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { culturalStories } from "@/data/stories";
import { StoryPlayer } from "@/components/storytelling/StoryPlayer";
import { Badge } from "@/components/ui/Badge";

const cats = ["all", "history", "food", "religion"] as const;

export default function StoriesPage() {
  const [cat, setCat] = useState<(typeof cats)[number]>("all");
  const [open, setOpen] = useState<string | null>(null);

  const list =
    cat === "all" ? culturalStories : culturalStories.filter((s) => s.category === cat);

  const featured = culturalStories[0];

  if (open) {
    const story = culturalStories.find((s) => s.id === open);
    if (!story) return null;
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <button
          type="button"
          onClick={() => setOpen(null)}
          className="mb-6 text-sm text-gold-primary hover:underline"
        >
          ← All stories
        </button>
        <StoryPlayer story={story} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl text-gold-light md:text-6xl">Cultural stories</h1>
      <p className="mt-4 max-w-2xl text-ivory/65">
        Listen & read with Web Speech API—free, on-device narration in your browser.
      </p>

      <button
        type="button"
        onClick={() => setOpen(featured.id)}
        className="mt-10 block w-full overflow-hidden rounded-2xl border border-gold-primary/30 bg-white/5 text-left"
      >
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px]">
            <Image src={featured.coverImage} alt="" fill className="object-cover" sizes="800px" />
          </div>
          <div className="flex flex-col justify-center p-8">
            <Badge>Featured</Badge>
            <h2 className="mt-3 font-display text-4xl text-ivory">{featured.title}</h2>
            <p className="mt-2 text-ivory/60">{featured.subtitle}</p>
            <p className="mt-4 text-sm text-gold-primary">Listen & Read →</p>
          </div>
        </div>
      </button>

      <div className="mt-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${
              cat === c ? "bg-gold-primary/20 text-gold-light" : "bg-white/5 text-ivory/60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <article
            key={s.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-gold-primary/40"
          >
            <div className="relative aspect-[16/10]">
              <Image src={s.coverImage} alt="" fill className="object-cover" sizes="400px" />
            </div>
            <div className="p-5">
              <Badge className="capitalize">{s.category}</Badge>
              <h3 className="mt-2 font-display text-2xl text-ivory">{s.title}</h3>
              <p className="text-xs text-ivory/45">{s.duration} min read</p>
              <button
                type="button"
                onClick={() => setOpen(s.id)}
                className="mt-4 text-sm font-medium text-gold-primary hover:underline"
              >
                Listen & Read
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
