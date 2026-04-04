"use client";

import { useEffect, useRef, useState } from "react";
import { locationNarrations } from "@/data/location-narrations";

const KEYS = Object.keys(locationNarrations);

export function VoiceTourGuide() {
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(KEYS[0]);
  const [speaking, setSpeaking] = useState(false);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  function speakKey(key: string) {
    const n = locationNarrations[key];
    if (!n || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${n.title}. ${n.narration}`);
    u.rate = 0.92;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }

  function startGps() {
    if (!navigator.geolocation) return;
    watchId.current = navigator.geolocation.watchPosition(() => {
      /* Demo: enable background watch; pair with on-device narration rules in production */
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 z-[9990] flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/40 bg-[#0a0a0b]/90 text-xl text-gold-light shadow-lg backdrop-blur md:bottom-24"
        aria-label="Voice guide"
      >
        {speaking ? "〰️" : "🎧"}
      </button>
      {open && (
        <div className="fixed bottom-24 left-6 z-[9990] w-[min(100vw-3rem,320px)] rounded-2xl border border-white/10 bg-[#0a0a0b]/95 p-4 text-sm text-ivory shadow-2xl backdrop-blur">
          <p className="font-display text-lg text-gold-light">Voice guide</p>
          <p className="mt-1 text-xs text-ivory/55">
            Uses Web Speech API (free). GPS matching is approximate in demo mode.
          </p>
          <select
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            className="mt-3 w-full rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-xs"
          >
            {KEYS.map((k) => (
              <option key={k} value={k}>
                {locationNarrations[k].title}
              </option>
            ))}
          </select>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => speakKey(manual)}
              className="btn-gold rounded-full px-4 py-2 text-xs font-semibold"
            >
              Play narration
            </button>
            <button
              type="button"
              onClick={startGps}
              className="rounded-full border border-white/15 px-4 py-2 text-xs text-ivory/80"
            >
              Watch GPS
            </button>
          </div>
        </div>
      )}
    </>
  );
}
