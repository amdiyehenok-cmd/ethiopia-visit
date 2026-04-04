"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { HeroCard, type HeroSlide } from "./HeroCard";

const slides: HeroSlide[] = [
  {
    id: "lalibela",
    title: "Lalibela",
    subtitle: "Rock-hewn churches carved from faith—where stone becomes scripture.",
    image: "https://res.cloudinary.com/dgyqslg9f/image/upload/q_auto/f_auto/v1775332628/lalibela_jcidpg.jpg",
  },
  {
    id: "simien",
    title: "Simien Mountains",
    subtitle: "Geladas, escarpments, and silence above the clouds.",
    image: "https://res.cloudinary.com/dgyqslg9f/image/upload/q_auto/f_auto/v1775250524/Simien_Mountains_nmm4cl.jpg",
  },
  {
    id: "danakil",
    title: "Danakil Depression",
    subtitle: "Sulfur, salt, and fire—Earth at its most cinematic.",
    image: "https://res.cloudinary.com/dgyqslg9f/image/upload/q_auto/f_auto/v1775250524/Danakil_Depression_uheppw.jpg",
  },
  {
    id: "omo",
    title: "Omo Valley",
    subtitle: "Living traditions along the river—color, rhythm, and timeless stories.",
    image: "https://res.cloudinary.com/dgyqslg9f/image/upload/q_auto/f_auto/v1775250524/Omo_Valley_asimea.jpg",
  },
  {
    id: "addis",
    title: "Addis Ababa",
    subtitle: "The highland capital—coffee, jazz, and the pulse of modern Ethiopia.",
    image: "https://res.cloudinary.com/dgyqslg9f/image/upload/q_auto/f_auto/v1775250575/addis-2_m8q0hq.jpg",
  },
  {
    id: "bale",
    title: "Bale Mountains",
    subtitle: "Ethiopian wolves, afro-alpine meadows, and the silence of the highlands.",
    image: "https://res.cloudinary.com/dgyqslg9f/image/upload/q_auto/f_auto/v1775335219/Ethio-Target-Tours-and-Travel-Trekking-in-Simien-Mountains-Ethiopia_st11gh.jpg",
  },
];

function Dust() {
  return (
    <div className="dust-particles">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 10) * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 35 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <HeroCard key={slide.id} slide={slide} active={selected === i} />
          ))}
        </div>
      </div>
      <Dust />

      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-3 md:bottom-10">
        <button
          type="button"
          onClick={scrollPrev}
          className="pointer-events-auto rounded-full border border-white/20 bg-black/40 p-3 text-gold-light backdrop-blur-md transition hover:border-gold-primary"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to ${s.title}`}
              onClick={() => scrollTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                selected === i ? "bg-gold-primary shadow-[0_0_12px_rgba(201,168,76,0.8)]" : "bg-white/30"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          className="pointer-events-auto rounded-full border border-white/20 bg-black/40 p-3 text-gold-light backdrop-blur-md transition hover:border-gold-primary"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </section>
  );
}
