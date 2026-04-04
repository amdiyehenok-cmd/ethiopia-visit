"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { sampleGuides } from "@/data/guides";
import { GoldButton } from "@/components/ui/GoldButton";
import { Badge } from "@/components/ui/Badge";
import { PaymentModal, type PaymentItem } from "@/components/payment/PaymentModal";

export default function GuideProfilePage() {
  const { id } = useParams<{ id: string }>();
  const guide = sampleGuides.find((x) => x.id === id);
  if (!guide) notFound();

  const [payItem, setPayItem] = useState<PaymentItem | null>(null);
  const [activeTab, setActiveTab] = useState<"experiences" | "reviews" | "about">("experiences");

  const REVIEWS = [
    { name: "Lena H.", country: "🇩🇪", rating: 5, text: "Absolutely unforgettable. Knew every stone, every story.", date: "Mar 2025" },
    { name: "James O.", country: "🇳🇬", rating: 5, text: "Professional, warm, and incredibly knowledgeable. Will book again.", date: "Feb 2025" },
    { name: "Priya S.", country: "🇮🇳", rating: 4, text: "Exceptional guide — minor logistics hiccup but experience was 10/10.", date: "Jan 2025" },
  ];

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <div className="relative h-72 w-full md:h-96">
        <Image
          src={guide.coverPhoto}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-20 md:px-8">
        {/* Profile header */}
        <div className="-mt-20 flex flex-col items-start gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-gold-primary/50 bg-dark-2 shadow-2xl"
          >
            <Image src={guide.profilePhoto} alt={guide.name} fill className="object-cover" sizes="128px" />
          </motion.div>
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl text-ivory md:text-5xl">{guide.name}</h1>
              {guide.verified && (
                <span className="rounded-full bg-gold-primary px-3 py-0.5 text-xs font-bold text-obsidian">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-gold-light">{guide.city}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ivory/50">
              <span>⭐ {guide.rating} ({guide.reviewCount} reviews)</span>
              <span>⚡ {guide.responseTime}</span>
              {guide.whatsapp && (
                <a
                  href={`https://wa.me/${guide.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-0.5 text-xs text-green-400 hover:bg-green-500/20 transition"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Language + specialties */}
        <div className="mt-6 flex flex-wrap gap-2">
          {guide.languages.map((l) => (
            <Badge key={l} className="text-xs">🗣 {l}</Badge>
          ))}
          {guide.specialties.map((s) => (
            <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ivory/60">
              {s}
            </span>
          ))}
        </div>

        {/* Tab nav */}
        <div className="mt-8 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 w-fit">
          {(["experiences", "reviews", "about"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm capitalize transition ${
                activeTab === tab ? "bg-gold-primary text-obsidian font-semibold" : "text-ivory/50 hover:text-ivory"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Experiences tab */}
        {activeTab === "experiences" && (
          <div className="mt-6 space-y-4">
            {guide.experiences.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-gold-primary/30 transition"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs uppercase tracking-widest text-gold-primary/70">{e.category}</span>
                  <h3 className="mt-0.5 font-display text-xl text-ivory">{e.title}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-ivory/50">
                    <span>⏱ {e.duration < 24 ? `${e.duration}h` : `${Math.round(e.duration / 24)} days`}</span>
                    <span>👥 Private or group</span>
                    <span>📍 {guide.city}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="font-display text-2xl text-gold-light">${e.price}</p>
                    <p className="text-xs text-ivory/40">/ person</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPayItem({
                        name: e.title,
                        description: `${e.duration < 24 ? `${e.duration}h` : `${Math.round(e.duration / 24)} days`} with ${guide.name} in ${guide.city}`,
                        amountUSD: e.price,
                        type: "experience",
                        metadata: { guideId: guide.id, experienceIdx: String(i) },
                      })
                    }
                    className="btn-gold rounded-full px-5 py-2.5 text-sm font-semibold"
                  >
                    Book
                  </button>
                </div>
              </motion.div>
            ))}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-ivory/50 text-sm">Need a custom itinerary?</p>
              <p className="mt-1 text-ivory/70 text-sm font-medium">Message {guide.name} directly to discuss your trip.</p>
              {guide.whatsapp && (
                <a
                  href={`https://wa.me/${guide.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${guide.name}! I found you on Ethiopia Visit and would love to discuss a custom tour.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400 hover:bg-green-500/20 transition"
                >
                  💬 Message on WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === "reviews" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-center">
                <p className="font-display text-6xl text-gold-light">{guide.rating}</p>
                <div className="mt-1 text-xl">{"★".repeat(Math.round(guide.rating))}</div>
                <p className="text-xs text-ivory/40">{guide.reviewCount} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-ivory/40 w-3">{star}</span>
                    <div className="flex-1 rounded-full bg-white/10 h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gold-primary rounded-full"
                        style={{ width: star === 5 ? "78%" : star === 4 ? "15%" : star === 3 ? "5%" : "2%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ivory">{r.country} {r.name}</p>
                    <p className="text-xs text-ivory/40">{r.date}</p>
                  </div>
                  <span className="text-gold-primary text-sm">{"★".repeat(r.rating)}</span>
                </div>
                <p className="mt-3 text-sm text-ivory/75 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              </div>
            ))}
          </div>
        )}

        {/* About tab */}
        {activeTab === "about" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-display text-xl text-gold-light">About {guide.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/80">{guide.bio}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="font-display text-xl text-gold-light">Languages</h2>
                <ul className="mt-3 space-y-1.5">
                  {guide.languages.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-sm text-ivory/75">
                      <span className="text-gold-primary">✓</span> {l}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="font-display text-xl text-gold-light">Specialties</h2>
                <ul className="mt-3 space-y-1.5">
                  {guide.specialties.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-ivory/75">
                      <span className="text-gold-primary">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <GoldButton href="/guides" variant="outline">← All guides</GoldButton>
          <Link href="/experiences" className="text-sm text-gold-primary hover:underline self-center">
            Browse all experiences →
          </Link>
        </div>
      </div>

      {/* Payment modal */}
      {payItem && <PaymentModal item={payItem} onClose={() => setPayItem(null)} />}
    </div>
  );
}
