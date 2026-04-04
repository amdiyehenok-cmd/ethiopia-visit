"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { sampleGuides } from "@/data/guides";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { Badge } from "@/components/ui/Badge";
import { PaymentModal, type PaymentItem } from "@/components/payment/PaymentModal";

const CATEGORIES = ["All", "History", "Culture", "Adventure", "Food", "Wildlife", "Photography", "Nightlife"];

const IMAGES: Record<string, string> = {
  History: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
  Culture: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80",
  Adventure: "https://images.unsplash.com/photo-1525857597365-5f6dbff2e36e?w=600&q=80",
  Food: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  Wildlife: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
  Photography: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80",
  Nightlife: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
};

// Flatten all experiences from all guides
const ALL_EXPERIENCES = sampleGuides.flatMap((guide) =>
  guide.experiences.map((exp, i) => ({
    ...exp,
    guide,
    uid: `${guide.id}-exp-${i}`,
    image: IMAGES[exp.category] ?? IMAGES.History,
  }))
);

export default function ExperiencesPage() {
  const [catFilter, setCatFilter] = useState("All");
  const [priceMax, setPriceMax] = useState(600);
  const [payItem, setPayItem] = useState<PaymentItem | null>(null);

  const filtered = ALL_EXPERIENCES.filter((e) => {
    if (catFilter !== "All" && e.category !== catFilter) return false;
    if (e.price > priceMax) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-dark-1 to-obsidian py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #bf1b2c 0%, transparent 50%), radial-gradient(circle at 70% 50%, #1a6b3a 0%, transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <p className="text-xs uppercase tracking-widest text-gold-primary">Curated by local experts</p>
          <ShimmerText className="mt-3 text-5xl md:text-7xl" as="h1">
            Experiences
          </ShimmerText>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/60">
            From sunrise at Lalibela to overnight lava lakes — hand-crafted moments with verified local guides.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCatFilter(c)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  catFilter === c
                    ? "bg-gold-primary font-semibold text-obsidian"
                    : "border border-white/10 bg-white/5 text-ivory/60 hover:border-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm text-ivory/50">Max: <span className="text-ivory">${priceMax}</span></label>
            <input
              type="range"
              min={20}
              max={600}
              step={10}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-28 accent-gold-primary"
            />
          </div>
        </div>

        <p className="mb-8 text-sm text-ivory/40">{filtered.length} experiences available</p>

        {/* Experience grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exp, i) => (
            <motion.article
              key={exp.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute left-3 top-3 text-[10px]">{exp.category}</Badge>
              </div>

              <div className="p-5">
                <h3 className="font-display text-xl text-ivory leading-snug">{exp.title}</h3>

                {/* Guide info */}
                <Link
                  href={`/guides/${exp.guide.id}`}
                  className="mt-2 flex items-center gap-2 hover:opacity-80 transition"
                >
                  <div className="relative h-6 w-6 overflow-hidden rounded-full border border-gold-primary/30">
                    <Image src={exp.guide.profilePhoto} alt={exp.guide.name} fill className="object-cover" sizes="24px" />
                  </div>
                  <span className="text-xs text-gold-light">{exp.guide.name}</span>
                  <span className="text-xs text-ivory/30">· {exp.guide.city}</span>
                  {exp.guide.verified && <span className="text-[10px] text-gold-primary">✓</span>}
                </Link>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-ivory/50">
                  <span>⏱ {exp.duration < 24 ? `${exp.duration}h` : `${Math.round(exp.duration / 24)} days`}</span>
                  <span>⭐ {exp.guide.rating} ({exp.guide.reviewCount})</span>
                  <span>🗣 {exp.guide.languages[0]}</span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl text-gold-light">${exp.price}</p>
                    <p className="text-xs text-ivory/40">per person</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPayItem({
                        name: exp.title,
                        description: `${exp.duration < 24 ? `${exp.duration}h` : `${Math.round(exp.duration / 24)} days`} with ${exp.guide.name}`,
                        amountUSD: exp.price,
                        type: "experience",
                        metadata: { guideId: exp.guide.id },
                      })
                    }
                    className="btn-gold rounded-full px-5 py-2 text-sm font-semibold"
                  >
                    Book
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
            <p className="text-4xl">🌍</p>
            <p className="mt-4 text-ivory/60">No experiences match your filters.</p>
            <button
              type="button"
              onClick={() => { setCatFilter("All"); setPriceMax(600); }}
              className="mt-3 text-sm text-gold-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {payItem && <PaymentModal item={payItem} onClose={() => setPayItem(null)} />}
    </div>
  );
}
