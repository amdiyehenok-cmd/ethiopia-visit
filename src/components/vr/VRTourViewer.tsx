"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { VRTour } from "@/data/vr-tours";

declare global {
  interface Window {
    pannellum?: {
      viewer: (el: HTMLElement, cfg: Record<string, unknown>) => { destroy: () => void; on: (e: string, fn: () => void) => void };
    };
  }
}

let pannellumPromise: Promise<void> | null = null;
function loadPannellum(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.pannellum) return Promise.resolve();
  if (pannellumPromise) return pannellumPromise;
  pannellumPromise = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { pannellumPromise = null; reject(new Error("CDN fail")); };
    document.body.appendChild(script);
  });
  return pannellumPromise;
}

// ── Immersive parallax viewer (used when no 360° panorama) ─
function ImmersiveViewer({ tour }: { tour: VRTour }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  function start(cx: number, cy: number) { dragging.current = true; last.current = { x: cx, y: cy }; }
  function move(cx: number, cy: number) {
    if (!dragging.current) return;
    const dx = (cx - last.current.x) * 0.07;
    const dy = (cy - last.current.y) * 0.05;
    last.current = { x: cx, y: cy };
    setPos((p) => ({ x: Math.max(10, Math.min(90, p.x - dx)), y: Math.max(10, Math.min(90, p.y - dy)) }));
  }

  return (
    <div
      className="relative h-full w-full select-none overflow-hidden"
      style={{ cursor: dragging.current ? "grabbing" : "grab" }}
      onMouseDown={(e) => start(e.clientX, e.clientY)}
      onMouseMove={(e) => move(e.clientX, e.clientY)}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => start(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => move(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => { dragging.current = false; }}
    >
      <div
        className="absolute inset-0"
        style={{ transform: "scale(1.45)", transformOrigin: `${pos.x}% ${pos.y}%` }}
      >
        <Image src={tour.fallbackImage} alt={tour.title} fill className="object-cover" sizes="100vw" priority />
      </div>
      {tour.hotspots.slice(0, 3).map((h, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + i * 0.12 }}
          className="absolute z-10 flex items-center gap-2"
          style={{ left: `${18 + i * 28}%`, top: `${28 + (i % 2) * 30}%` }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gold-primary bg-black/60 text-xs text-gold-primary animate-pulse">ℹ</div>
          <div className="max-w-[140px] rounded-lg bg-black/75 px-2 py-1 text-[11px] text-ivory backdrop-blur-sm">{h.text}</div>
        </motion.div>
      ))}
      <div className="absolute bottom-14 left-0 right-0 text-center pointer-events-none">
        <span className="rounded-full bg-black/60 px-4 py-1.5 text-xs text-ivory/70 backdrop-blur-sm">
          🖱 Drag to explore · Upload real 360° photos for full VR
        </span>
      </div>
    </div>
  );
}

// ── Main viewer ─────────────────────────────────────────────
export function VRTourViewer({ tour, onClose }: { tour: VRTour; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef    = useRef<{ destroy: () => void } | null>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase]       = useState<"loading" | "vr" | "fallback">("loading");
  const [narrating, setNarrating] = useState(false);

  const goFallback = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    viewerRef.current?.destroy();
    viewerRef.current = null;
    setPhase("fallback");
  }, []);

  useEffect(() => {
    let cancelled = false;

    // If no panorama URL provided → skip straight to immersive mode instantly
    if (!tour.panoramaUrl) {
      setPhase("fallback");
      return;
    }

    // Hard 8-second timeout
    timerRef.current = setTimeout(() => { if (!cancelled) goFallback(); }, 8000);

    async function init() {
      try {
        await loadPannellum();
        if (cancelled || !containerRef.current || !window.pannellum) return;

        const viewer = window.pannellum.viewer(containerRef.current, {
          type: "equirectangular",
          panorama: tour.panoramaUrl!,
          autoLoad: true,
          autoRotate: -2,
          compass: false,
          showControls: true,
          hotSpots: tour.hotspots.map((h) => ({ pitch: h.pitch, yaw: h.yaw, type: "info", text: h.text })),
          crossOrigin: "anonymous",
        });

        viewer.on("load", () => {
          if (!cancelled) {
            if (timerRef.current) clearTimeout(timerRef.current);
            setPhase("vr");
          }
        });
        viewerRef.current = viewer;
      } catch {
        if (!cancelled) goFallback();
      }
    }

    void init();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      viewerRef.current?.destroy();
      viewerRef.current = null;
      window.speechSynthesis?.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.id]);

  function toggleNarrate() {
    if (!("speechSynthesis" in window)) return;
    if (narrating) { window.speechSynthesis.cancel(); setNarrating(false); return; }
    const u = new SpeechSynthesisUtterance(
      `Welcome to ${tour.title}. ${tour.description}. Drag to explore. Click the information pins to learn more.`,
    );
    u.rate = 0.88;
    u.onend = () => setNarrating(false);
    window.speechSynthesis.speak(u);
    setNarrating(true);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.85),transparent)" }}>
        <div>
          <h2 className="font-display text-xl text-white drop-shadow">{tour.title}</h2>
          <p className="text-sm text-gold-light">📍 {tour.destination}</p>
        </div>
        <div className="flex items-center gap-2">
          {phase !== "loading" && (
            <button type="button" onClick={toggleNarrate}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${narrating ? "bg-ethiopia-red text-white" : "bg-gold-primary/90 text-obsidian"}`}>
              {narrating ? "⏹ Stop" : "🎧 Audio"}
            </button>
          )}
          <span className="hidden rounded-full bg-white/10 px-2 py-1 text-[10px] text-ivory/50 backdrop-blur-sm sm:inline">
            {phase === "vr" ? "360° VR" : "Immersive"}
          </span>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" aria-label="Close">✕</button>
        </div>
      </div>

      {/* Loading overlay — only shown when panoramaUrl is set */}
      <AnimatePresence>
        {phase === "loading" && tour.panoramaUrl && (
          <motion.div key="loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-obsidian">
            <div className="absolute inset-0 opacity-20"><Image src={tour.fallbackImage} alt="" fill className="object-cover" sizes="100vw" /></div>
            <div className="relative z-10 text-center">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gold-primary/30 border-t-gold-primary" />
              <p className="font-display text-2xl text-gold-light">Loading 360° tour…</p>
              <button type="button" onClick={goFallback} className="mt-5 rounded-full border border-white/20 px-5 py-2 text-xs text-ivory/50 hover:text-ivory transition">Skip to preview</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pannellum container */}
      <div ref={containerRef} className="h-full w-full flex-1" style={{ visibility: phase === "vr" ? "visible" : "hidden", position: "absolute", inset: 0 }} />

      {/* Immersive fallback */}
      {phase === "fallback" && <div className="flex-1"><ImmersiveViewer tour={tour} /></div>}

      {/* Bottom hint */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-center pointer-events-none" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.8),transparent)" }}>
        <p className="text-xs text-ivory/40">🖱 Drag to look around · 📱 Tilt your phone · 🎧 Audio guide available</p>
      </div>
    </motion.div>
  );
}
