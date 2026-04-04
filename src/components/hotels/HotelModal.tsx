"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "@/components/ui/StarRating";
import { HotelMap } from "@/components/hotels/HotelMap";
import { PaymentModal, type PaymentItem } from "@/components/payment/PaymentModal";
import type { Hotel } from "@/types";

type Props = {
  hotel: Hotel | null;
  onClose: () => void;
};

export function HotelModal({ hotel, onClose }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const [nights, setNights] = useState(3);
  const [payItem, setPayItem] = useState<PaymentItem | null>(null);

  if (!hotel) return null;

  const totalUSD = hotel.pricePerNight * nights;
  const img = hotel.images[imgIdx] ?? hotel.images[0];

  function handleBook() {
    setPayItem({
      name: `${hotel!.name} — ${nights} night${nights > 1 ? "s" : ""}`,
      description: `${hotel!.location} · ${hotel!.stars}★ hotel`,
      amountUSD: totalUSD,
      type: "hotel",
      metadata: { hotelId: hotel!.id, nights: String(nights) },
    });
  }

  return (
    <>
      <AnimatePresence>
        {hotel && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0b] shadow-2xl"
            >
              {/* Image gallery */}
              <div className="relative aspect-[21/9] w-full overflow-hidden">
                <Image src={img} alt={hotel.name} fill className="object-cover" sizes="960px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Thumbnail strip */}
                {hotel.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    {hotel.images.map((u, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImgIdx(i)}
                        className={`relative h-12 w-16 overflow-hidden rounded-lg border-2 transition ${
                          imgIdx === i ? "border-gold-primary" : "border-white/20"
                        }`}
                      >
                        <Image src={u} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-ivory hover:bg-black/80"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-4xl text-ivory">{hotel.name}</h2>
                    <p className="mt-1 text-sm text-ivory/60">📍 {hotel.location}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <StarRating stars={hotel.stars} />
                      <span className="text-xs text-ivory/40">{hotel.stars}-star hotel</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-3xl text-gold-light">${hotel.pricePerNight}</p>
                    <p className="text-xs text-ivory/40">per night</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-5 text-sm leading-relaxed text-ivory/75">{hotel.description}</p>

                {/* Amenities */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {hotel.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ivory/75"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                {/* Booking widget */}
                <div className="mt-6 rounded-2xl border border-gold-primary/20 bg-gold-primary/5 p-5">
                  <p className="text-xs uppercase tracking-widest text-gold-primary">Book direct</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-ivory/60">Nights:</label>
                      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => setNights((n) => Math.max(1, n - 1))}
                          className="h-6 w-6 rounded text-ivory/60 hover:text-ivory"
                        >
                          –
                        </button>
                        <span className="min-w-[2ch] text-center text-sm font-semibold text-ivory">{nights}</span>
                        <button
                          type="button"
                          onClick={() => setNights((n) => Math.min(30, n + 1))}
                          className="h-6 w-6 rounded text-ivory/60 hover:text-ivory"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-ivory">
                        Total: <span className="text-gold-light">${totalUSD}</span>
                        <span className="ml-2 text-xs font-normal text-ivory/40">
                          ≈ {(totalUSD * 57).toLocaleString()} ETB
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleBook}
                      className="btn-gold shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold"
                    >
                      Book now
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-ivory/30">
                    Choose card, Chapa, Telebirr, or PayPal on the next step
                  </p>
                </div>

                {/* Also book on Booking.com */}
                <a
                  href={`/api/affiliate?url=${encodeURIComponent(hotel.affiliateUrl)}&hotelId=${hotel.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm text-ivory/50 hover:border-white/20 hover:text-ivory/70 transition"
                >
                  Also available on Booking.com ↗
                </a>

                {/* Map */}
                <div className="mt-6 h-56 overflow-hidden rounded-xl border border-white/10">
                  <HotelMap hotels={[hotel]} className="h-full w-full" />
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 w-full rounded-xl border border-white/10 py-2.5 text-sm text-ivory/50 hover:text-ivory transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {payItem && <PaymentModal item={payItem} onClose={() => setPayItem(null)} />}
    </>
  );
}
