"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { CulturalStory, StoryChapter } from "@/data/stories";
import { GoldButton } from "@/components/ui/GoldButton";

export function StoryPlayer({ story }: { story: CulturalStory }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const chapter = story.chapters[idx];

  const speak = (c: StoryChapter) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(c.audioSegment);
    u.rate = 0.85;
    u.pitch = 0.95;
    u.onend = () => {
      setPlaying(false);
      if (idx < story.chapters.length - 1) setIdx((i) => i + 1);
    };
    window.speechSynthesis.speak(u);
    setPlaying(true);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="relative min-h-[70vh] overflow-hidden rounded-2xl border border-white/10 bg-[#050506]">
      <div className="absolute inset-0 opacity-40">
        <Image src={story.coverImage} alt="" fill className="object-cover blur-sm" sizes="100vw" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 md:px-8">
        <p className="text-xs uppercase tracking-widest text-gold-primary/80">{story.category}</p>
        <h1 className="font-display text-4xl text-ivory md:text-5xl">{story.title}</h1>
        <p className="mt-2 text-ivory/60">{story.subtitle}</p>
        <div className="mt-8 flex gap-2">
          {story.chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-2 flex-1 rounded-full ${i === idx ? "bg-gold-primary" : "bg-white/15"}`}
              aria-label={`Chapter ${i + 1}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-10 rounded-2xl border border-white/10 bg-black/50 p-8 backdrop-blur-xl"
          >
            {chapter.timeline && (
              <p className="text-xs uppercase tracking-widest text-gold-light/80">{chapter.timeline}</p>
            )}
            <h2 className="mt-2 font-display text-3xl text-ivory">{chapter.heading}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ivory/80">{chapter.content}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex flex-wrap gap-3">
          <GoldButton
            type="button"
            onClick={() => speak(chapter)}
            className="justify-center"
          >
            {playing ? "⏸ Narrating…" : "🎧 Play narration"}
          </GoldButton>
          <button
            type="button"
            onClick={() => window.speechSynthesis.cancel()}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-ivory/70"
          >
            Stop
          </button>
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            className="rounded-full border border-white/15 px-4 py-2 text-sm disabled:opacity-30"
          >
            ← Prev
          </button>
          <button
            type="button"
            disabled={idx >= story.chapters.length - 1}
            onClick={() => setIdx((i) => Math.min(story.chapters.length - 1, i + 1))}
            className="rounded-full border border-white/15 px-4 py-2 text-sm disabled:opacity-30"
          >
            Next →
          </button>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <GoldButton href="/virtual-tours" variant="outline">
            Explore VR tours
          </GoldButton>
          <Link href="/planner" className="text-sm text-gold-primary hover:underline">
            Build an itinerary →
          </Link>
        </div>
      </div>
    </div>
  );
}
