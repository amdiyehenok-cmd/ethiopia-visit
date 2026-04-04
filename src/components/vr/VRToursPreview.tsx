"use client";

import Image from "next/image";
import Link from "next/link";
import { vrTours } from "@/data/vr-tours";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { GoldButton } from "@/components/ui/GoldButton";

export function VRToursPreview() {
  const preview = vrTours.slice(0, 3);

  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
      <ShimmerText className="text-4xl md:text-5xl" as="h2">
        Experience Before You Arrive
      </ShimmerText>
      <p className="mt-2 max-w-2xl text-sm text-ivory/60">
        360° virtual tours of Ethiopia&apos;s most iconic sites—drag, zoom, and listen to the audio guide.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {preview.map((t) => (
          <Link
            key={t.id}
            href="/virtual-tours"
            className="group relative overflow-hidden rounded-2xl border border-white/10"
          >
            <div className="relative aspect-[4/3]">
              {/* FIXED: Prevent null/undefined src */}
              {t.panoramaUrl ? (
                <Image
                  src={t.panoramaUrl}
                  alt={t.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              ) : (
                <div className="h-full w-full bg-zinc-900 flex items-center justify-center text-ivory/30 text-sm">
                  No image available
                </div>
              )}

              <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-gold-light">
                360°
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-xl text-ivory">{t.title}</p>
                <p className="text-xs text-gold-light/90">{t.destination}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <GoldButton href="/virtual-tours">Explore All VR Tours →</GoldButton>
      </div>
    </section>
  );
}