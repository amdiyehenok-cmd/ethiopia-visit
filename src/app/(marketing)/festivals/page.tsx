import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { festivals } from "@/data/festivals";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { FestivalCountdown } from "./FestivalCountdown";

export const metadata: Metadata = {
  title: "Ethiopian Festivals",
  description: "Timkat, Meskel, Enkutatash, Irreecha — Ethiopia's most spectacular celebrations with dates, photo tips, and travel advice.",
};

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function FestivalsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-dark-1 to-obsidian py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #c9a84c 0%, transparent 60%)" }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <ShimmerText className="text-5xl md:text-7xl" as="h1">Festivals</ShimmerText>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/60">
            Ethiopia celebrates with fire, water, flowers, and music. Here are the dates you need to plan around.
          </p>
          <FestivalCountdown festivals={festivals} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <div className="space-y-16">
          {festivals.map((f, i) => (
            <article key={f.id} className="group grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Image — alternate left/right */}
              <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 50vw"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full bg-gold-primary px-3 py-1 text-sm font-bold text-obsidian">
                    {MONTH_NAMES[f.month]} {f.day}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <p className="text-xs uppercase tracking-widest text-gold-primary">{f.shortName}</p>
                <h2 className="mt-2 font-display text-4xl text-ivory">{f.name}</h2>
                <p className="mt-3 text-ivory/70 leading-relaxed">{f.description}</p>
                <p className="mt-2 text-sm text-ivory/50">{f.significance}</p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold-light">Best places to go</p>
                    <p className="mt-1 text-sm text-ivory/70">{f.bestPlaces.join(" · ")}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold-light">📸 Photo tip</p>
                    <p className="mt-1 text-sm text-ivory/70">{f.photoTips}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold-light">👗 What to wear</p>
                    <p className="mt-1 text-sm text-ivory/70">{f.whatToWear}</p>
                  </div>
                </div>

                <Link
                  href="/guides"
                  className="mt-5 inline-flex items-center gap-1 text-sm text-gold-primary hover:underline"
                >
                  Find a guide for this festival →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
