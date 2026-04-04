"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

export function HeroCard({
  slide,
  active,
}: {
  slide: HeroSlide;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <div ref={ref} className="relative h-[min(100vh,900px)] min-h-[560px] w-full shrink-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 pt-32 md:px-16 md:pb-32">
        {active && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.12, delayChildren: 0.05 },
              },
            }}
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl leading-[0.95] tracking-tight text-transparent md:text-7xl lg:text-[80px]"
              style={{
                background:
                  "linear-gradient(105deg, #B8972E, #F5D083, #fff8e7, #E8C96A, #C9A84C)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                animation: "shimmer 3s linear infinite",
              }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="mt-4 max-w-xl font-sans text-lg text-ivory/85 md:text-xl"
            >
              {slide.subtitle}
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <GoldButton href="/explore">Explore</GoldButton>
              <GoldButton href="/hotels" variant="outline">
                Book a Hotel
              </GoldButton>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
