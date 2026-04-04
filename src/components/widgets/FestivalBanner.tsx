"use client";

import Image from "next/image";
import Link from "next/link";
import { festivals } from "@/data/festivals";

export function FestivalBanner() {
  const next = festivals[0];
  return (
    <Link
      href="/festivals"
      className="group flex items-center gap-4 rounded-2xl border border-gold-primary/25 bg-white/5 p-4 backdrop-blur-xl transition hover:border-gold-primary/50"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-xl">
        <Image src={next.image} alt="" fill className="object-cover" sizes="64px" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-gold-primary/90">Upcoming</p>
        <p className="font-display text-lg text-ivory group-hover:text-gold-light">{next.name}</p>
        <p className="text-xs text-ivory/55">See calendar & travel tips →</p>
      </div>
    </Link>
  );
}
