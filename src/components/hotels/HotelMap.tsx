"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { DivIcon } from "leaflet";
import type { Hotel } from "@/types";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

type Props = {
  hotels: Hotel[];
  className?: string;
};

export function HotelMap({ hotels, className }: Props) {
  const [icon, setIcon] = useState<DivIcon | null>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      setIcon(
        L.divIcon({
          className: "",
          html: `<div style="width:36px;height:36px;background:linear-gradient(135deg,#F5D083,#C9A84C);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #0A0A0B;box-shadow:0 4px 12px rgba(201,168,76,0.5)">
    <span style="transform:rotate(45deg);display:block;text-align:center;line-height:32px;font-size:14px">🏨</span>
  </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        }),
      );
    });
  }, []);

  if (!icon) {
    return (
      <div
        className={className}
        style={{ minHeight: 420 }}
        aria-hidden
      />
    );
  }

  return (
    <div className={className} style={{ minHeight: 420 }}>
      <MapContainer
        center={[9.145, 40.489]}
        zoom={6}
        style={{ height: "100%", width: "100%", minHeight: 420 }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hotels.map((h) => (
          <Marker key={h.id} position={[h.latitude, h.longitude]} icon={icon}>
            <Popup>
              <strong>{h.name}</strong>
              <br />
              {h.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
