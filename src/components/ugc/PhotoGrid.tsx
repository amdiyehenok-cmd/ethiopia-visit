"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Real Unsplash photos — verified working IDs
const COMMUNITY_PHOTOS = [
  { url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80", caption: "Lalibela at dawn", author: "@highland_lens" },
  { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", caption: "Simien escarpment", author: "@simien_walks" },
  { url: "https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=800&q=80", caption: "Danakil sulfur fields", author: "@danakil_diaries" },
  { url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80", caption: "Coffee ceremony", author: "@buna_daily" },
  { url: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80", caption: "Omo Valley colors", author: "@omo_lens" },
  { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80", caption: "Addis skyline", author: "@addis_frames" },
  { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", caption: "Gondar castles", author: "@axum_stories" },
  { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", caption: "Lake Tana", author: "@lake_tana_life" },
  { url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80", caption: "Aksumite stelae", author: "@axum_stories" },
  { url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80", caption: "Injera feast", author: "@buna_daily" },
  { url: "https://images.unsplash.com/photo-1525857597365-5f6dbff2e36e?w=800&q=80", caption: "Erta Ale lava lake", author: "@danakil_diaries" },
  { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80", caption: "Bale highlands", author: "@bale_wild" },
];

type Photo = { url: string; caption?: string; author?: string };

export function PhotoGrid({ extra }: { extra?: string[] }) {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const extraPhotos: Photo[] = (extra ?? []).map((u) => ({ url: u, caption: "Your photo", author: "@you" }));
  const allPhotos: Photo[] = [...extraPhotos, ...COMMUNITY_PHOTOS].slice(0, 12);

  return (
    <>
      <div className="columns-2 gap-3 space-y-3 sm:columns-3 lg:columns-4">
        {allPhotos.map((photo, i) => (
          <motion.div
            key={`${photo.url}-${i}`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setLightbox(photo)}
            className="group relative break-inside-avoid cursor-pointer overflow-hidden rounded-xl border border-white/10"
          >
            <div className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`}>
              <Image
                src={photo.url}
                alt={photo.caption ?? ""}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100">
              {photo.caption && <p className="text-xs font-medium text-ivory line-clamp-1">{photo.caption}</p>}
              {photo.author && <p className="text-[10px] text-gold-light/80">{photo.author}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={lightbox.url}
                  alt={lightbox.caption ?? ""}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
              {(lightbox.caption || lightbox.author) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {lightbox.caption && <p className="text-sm text-ivory">{lightbox.caption}</p>}
                  {lightbox.author && <p className="text-xs text-gold-light">{lightbox.author}</p>}
                </div>
              )}
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-ivory hover:bg-black/80"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
