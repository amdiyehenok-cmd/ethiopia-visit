"use client";

import { useEffect, useRef, useState } from "react";
import { pois } from "@/data/map-pois";

function getBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function ARMode() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  const [heading, setHeading] = useState(0);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!on) return;
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setOn(false);
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [on]);

  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition((p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
      });
    }, 4000);
    return () => clearInterval(id);
  }, [on]);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      if (e.alpha != null) setHeading(e.alpha);
    };
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, []);

  const landmarks =
    pos == null
      ? []
      : pois.slice(0, 6).map((p) => {
          const bearing = getBearing(pos.lat, pos.lng, p.latitude, p.longitude);
          const diff = (bearing - heading + 360) % 360;
          return { ...p, diff };
        });

  return (
    <div className="relative min-h-[70vh] overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video ref={videoRef} className="h-full min-h-[420px] w-full object-cover" playsInline muted />
      {!on && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-6 text-center">
          <p className="font-display text-3xl text-gold-light">AR landmark overlay</p>
          <p className="mt-2 max-w-md text-sm text-ivory/65">
            Camera + compass demo. Works best on mobile Chrome/Safari with permissions. Desktop shows
            orientation at 0°.
          </p>
          <button
            type="button"
            onClick={() => setOn(true)}
            className="btn-gold mt-6 rounded-full px-8 py-3 text-sm font-semibold"
          >
            Enable camera
          </button>
        </div>
      )}
      {on &&
        landmarks.map((l) => (
          <div
            key={l.id}
            className="absolute rounded-xl border border-white/20 bg-black/50 px-3 py-2 text-xs text-ivory backdrop-blur"
            style={{
              top: `${20 + (l.diff % 60)}%`,
              left: `${10 + (l.diff % 40)}%`,
            }}
          >
            <strong>{l.name}</strong>
            <br />
            bearing {Math.round(l.diff)}°
          </div>
        ))}
    </div>
  );
}
