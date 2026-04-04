"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { pois, type POI, type POICategory } from "@/data/map-pois";
import { MapFlyTo } from "./MapFlyTo";
import "leaflet/dist/leaflet.css";

// Dynamic imports — no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer     = dynamic(() => import("react-leaflet").then((m) => m.TileLayer),     { ssr: false });
const Marker        = dynamic(() => import("react-leaflet").then((m) => m.Marker),        { ssr: false });
const Popup         = dynamic(() => import("react-leaflet").then((m) => m.Popup),         { ssr: false });
const Polyline      = dynamic(() => import("react-leaflet").then((m) => m.Polyline),      { ssr: false });

const CATEGORY_CONFIG: Record<POICategory, { emoji: string; color: string; label: string }> = {
  attraction:    { emoji: "⭐", color: "#C9A84C", label: "Attractions" },
  hotel:         { emoji: "🏨", color: "#1A6B3A", label: "Hotels" },
  restaurant:    { emoji: "🍽️", color: "#BF1B2C", label: "Food" },
  airport:       { emoji: "✈️", color: "#2563EB", label: "Airports" },
  hospital:      { emoji: "🏥", color: "#DC2626", label: "Health" },
  market:        { emoji: "🛒", color: "#7C3AED", label: "Markets" },
  church:        { emoji: "⛪", color: "#D97706", label: "Religious" },
  "national-park": { emoji: "🌿", color: "#059669", label: "Nature" },
};

const ALL_CATS = Object.keys(CATEGORY_CONFIG) as POICategory[];
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ETHIOPIA_CENTER: [number, number] = [9.145, 40.489];

// ── Build Leaflet DivIcon per category ───────────────────
async function buildIcons() {
  const L = (await import("leaflet")).default;
  const icons: Record<string, import("leaflet").DivIcon> = {};
  for (const [cat, cfg] of Object.entries(CATEGORY_CONFIG)) {
    icons[cat] = L.divIcon({
      className: "",
      html: `<div style="
        background:${cfg.color};
        width:30px;height:30px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:2px solid rgba(255,255,255,0.8);
        box-shadow:0 2px 8px rgba(0,0,0,0.5);
        display:flex;align-items:center;justify-content:center;
      "><span style="transform:rotate(45deg);font-size:13px">${cfg.emoji}</span></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -32],
    });
  }
  return icons;
}

// ── OSRM route (driving) ─────────────────────────────────
async function getOSRMRoute(
  from: [number, number],
  to:   [number, number],
): Promise<[number, number][]> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
  const res  = await fetch(url);
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.[0]) throw new Error("Route not found");
  return (data.routes[0].geometry.coordinates as [number, number][]).map(([lng, lat]) => [lat, lng]);
}

export function SmartMap() {
  const [cats, setCats]             = useState<POICategory[]>(ALL_CATS);
  const [month, setMonth]           = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<POI | null>(null);
  const [userLoc, setUserLoc]       = useState<[number, number] | null>(null);
  const [routeTo, setRouteTo]       = useState<string>("");
  const [routeLine, setRouteLine]   = useState<[number, number][] | null>(null);
  const [routeInfo, setRouteInfo]   = useState<{ km: string; time: string } | null>(null);
  const [routing, setRouting]       = useState(false);
  const [icons, setIcons]           = useState<Record<string, import("leaflet").DivIcon> | null>(null);
  const [mapCenter, setMapCenter]   = useState<[number, number]>(ETHIOPIA_CENTER);
  const [tileStyle, setTileStyle]   = useState<"dark" | "satellite" | "streets">("dark");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { buildIcons().then(setIcons); }, []);

  const TILES = {
    dark:      { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attr: "© OpenStreetMap © CARTO" },
    satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: "© Esri" },
    streets:   { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attr: "© OpenStreetMap contributors" },
  };

  const filtered = useMemo(() => {
    return pois.filter((p) => {
      if (!cats.includes(p.category)) return false;
      if (month && p.bestSeason && !p.bestSeason.includes(month)) return false;
      if (difficulty && p.difficulty && p.difficulty !== difficulty) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !(p.description ?? "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [cats, month, difficulty, search]);

  const nearby = useMemo(() => {
    if (!userLoc) return [];
    return pois
      .map((p) => {
        const d = Math.sqrt(((p.latitude - userLoc[0]) * 111) ** 2 + ((p.longitude - userLoc[1]) * 111) ** 2);
        return { p, d };
      })
      .sort((a, b) => a.d - b.d)
      .slice(0, 6)
      .map(({ p }) => p);
  }, [userLoc]);

  function toggleCat(c: POICategory) {
    setCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }

  function handleLocate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLoc(loc);
        setMapCenter(loc);
      },
      () => alert("Geolocation denied or unavailable."),
    );
  }

  async function planRoute() {
    if (!selected || !routeTo) return;
    const dest = pois.find((p) => p.id === routeTo);
    if (!dest) return;
    setRouting(true);
    setRouteLine(null);
    setRouteInfo(null);
    try {
      const from: [number, number] = [selected.latitude, selected.longitude];
      const to:   [number, number] = [dest.latitude,     dest.longitude];
      const line = await getOSRMRoute(from, to);
      setRouteLine(line);

      // Distance estimate
      const R = 6371;
      const dLat = ((dest.latitude  - selected.latitude)  * Math.PI) / 180;
      const dLon = ((dest.longitude - selected.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((selected.latitude * Math.PI) / 180) *
        Math.cos((dest.latitude    * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
      const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      setRouteInfo({ km: km.toFixed(0), time: `~${Math.round(km / 70)} h drive` });
    } catch (e) {
      console.error("[Route]", e);
      alert("Route unavailable between these points. Try closer destinations.");
    } finally {
      setRouting(false);
    }
  }

  if (!icons) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-dark-2">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold-primary/30 border-t-gold-primary" />
          <p className="mt-3 text-sm text-ivory/40">Loading smart map…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-full shrink-0 space-y-4 lg:w-72">

        {/* Search */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search destinations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ivory placeholder-ivory/30 focus:border-gold-primary/50 focus:outline-none"
          />
          {search && filtered.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-dark-1">
              {filtered.slice(0, 8).map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(p);
                      setMapCenter([p.latitude, p.longitude]);
                      setSearch("");
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ivory/80 hover:bg-white/5"
                  >
                    <span>{CATEGORY_CONFIG[p.category].emoji}</span>
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-ivory/30">{p.city}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-ivory/40">Filter by type</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CATS.map((c) => {
              const cfg = CATEGORY_CONFIG[c];
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCat(c)}
                  className={`rounded-full px-2.5 py-1 text-xs transition ${
                    cats.includes(c)
                      ? "font-semibold text-obsidian"
                      : "border border-white/10 bg-white/5 text-ivory/50"
                  }`}
                  style={cats.includes(c) ? { background: cfg.color } : {}}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Month filter */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="mb-2 text-xs uppercase tracking-widest text-ivory/40">Best season</p>
          <div className="flex flex-wrap gap-1">
            {MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonth(month === m ? null : m)}
                className={`rounded-lg px-2 py-1 text-xs transition ${
                  month === m
                    ? "bg-gold-primary font-semibold text-obsidian"
                    : "border border-white/10 bg-white/5 text-ivory/50 hover:border-white/20"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Map style */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="mb-2 text-xs uppercase tracking-widest text-ivory/40">Map style</p>
          <div className="flex gap-2">
            {(["dark","satellite","streets"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTileStyle(s)}
                className={`flex-1 rounded-lg py-1.5 text-xs capitalize transition ${
                  tileStyle === s
                    ? "bg-gold-primary font-semibold text-obsidian"
                    : "border border-white/10 bg-white/5 text-ivory/50"
                }`}
              >
                {s === "dark" ? "🌙" : s === "satellite" ? "🛰️" : "🗺️"} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Locate me */}
        <button
          type="button"
          onClick={handleLocate}
          className="w-full rounded-xl border border-gold-primary/30 bg-gold-primary/10 py-2.5 text-sm text-gold-light hover:bg-gold-primary/20 transition"
        >
          📍 Locate me — nearby spots
        </button>

        {/* Nearby results */}
        {userLoc && nearby.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-xs font-semibold text-gold-light">Nearby you</p>
            <ul className="space-y-1">
              {nearby.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => { setSelected(p); setMapCenter([p.latitude, p.longitude]); }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-ivory/70 hover:bg-white/5 transition"
                  >
                    <span>{CATEGORY_CONFIG[p.category].emoji}</span>
                    <span>{p.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-center text-xs text-ivory/20">
          {filtered.length} of {pois.length} places shown
        </p>
      </aside>

      {/* ── Map ──────────────────────────────────────────── */}
      <div className="relative min-h-[500px] flex-1 overflow-hidden rounded-2xl border border-white/10 lg:min-h-[700px]">
        <MapContainer
          center={mapCenter}
          zoom={6}
          className="h-full min-h-[500px] w-full"
          scrollWheelZoom
          zoomControl={false}
        >
          <MapFlyTo center={mapCenter} />
          <TileLayer
            key={tileStyle}
            attribution={TILES[tileStyle].attr}
            url={TILES[tileStyle].url}
            maxZoom={19}
          />
          {filtered.map((p) => (
            <Marker
              key={p.id}
              position={[p.latitude, p.longitude]}
              icon={icons[p.category]}
              eventHandlers={{ click: () => { setSelected(p); setMapCenter([p.latitude, p.longitude]); } }}
            >
              <Popup>
                <strong className="text-sm">{p.name}</strong>
                <br />
                <span className="text-xs text-gray-600">{p.city}</span>
                {p.rating ? <><br /><span className="text-xs">★ {p.rating}</span></> : null}
              </Popup>
            </Marker>
          ))}
          {userLoc && icons.hotel && (
            <Marker
              position={userLoc}
              icon={(() => {
                const L = require("leaflet");
                return L.divIcon({
                  className: "",
                  html: `<div style="width:14px;height:14px;background:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>`,
                  iconSize: [14, 14],
                  iconAnchor: [7, 7],
                });
              })()}
            />
          )}
          {routeLine && <Polyline positions={routeLine} pathOptions={{ color: "#C9A84C", weight: 4, dashArray: "8 4" }} />}
        </MapContainer>

        {/* Zoom controls */}
        <div className="absolute right-3 top-12 z-[500] flex flex-col gap-1">
          {["+", "−"].map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => {
                /* zoom handled by Leaflet natively */
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-1/80 text-ivory backdrop-blur-sm hover:bg-dark-2 border border-white/10"
            >
              {z}
            </button>
          ))}
        </div>

        {/* POI detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 z-[500] max-h-[55%] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0b]/95 p-4 shadow-2xl backdrop-blur-xl md:left-auto md:right-4 md:max-w-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gold-primary">
                    {CATEGORY_CONFIG[selected.category].emoji} {CATEGORY_CONFIG[selected.category].label}
                  </p>
                  <h3 className="mt-0.5 font-display text-2xl text-ivory">{selected.name}</h3>
                  <p className="text-sm text-gold-light/80">{selected.city}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelected(null); setRouteLine(null); setRouteInfo(null); }}
                  className="mt-1 shrink-0 rounded-full bg-white/5 p-1 text-ivory/40 hover:text-ivory"
                >
                  ✕
                </button>
              </div>

              {selected.description && (
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{selected.description}</p>
              )}

              {selected.rating && (
                <p className="mt-1.5 text-sm text-ivory/50">★ {selected.rating} rating</p>
              )}

              {selected.bestSeason?.length ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selected.bestSeason.map((s) => (
                    <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-ivory/50">{s}</span>
                  ))}
                </div>
              ) : null}

              {/* Route planner */}
              <div className="mt-3 flex gap-2">
                <select
                  value={routeTo}
                  onChange={(e) => setRouteTo(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-ivory"
                >
                  <option value="">Route to…</option>
                  {filtered
                    .filter((x) => x.id !== selected.id)
                    .map((x) => (
                      <option key={x.id} value={x.id}>{CATEGORY_CONFIG[x.category].emoji} {x.name}</option>
                    ))}
                </select>
                <button
                  type="button"
                  disabled={!routeTo || routing}
                  onClick={planRoute}
                  className="btn-gold shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
                >
                  {routing ? "…" : "🗺 Route"}
                </button>
              </div>

              {routeInfo && (
                <p className="mt-2 rounded-lg bg-gold-primary/10 px-3 py-1.5 text-xs text-gold-light">
                  📍 {routeInfo.km} km · {routeInfo.time}
                </p>
              )}

              {selected.affiliateUrl && (
                <Link
                  href={`/api/affiliate?url=${encodeURIComponent(selected.affiliateUrl)}&hotelId=${selected.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-gold-primary hover:underline"
                >
                  Book / learn more →
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
