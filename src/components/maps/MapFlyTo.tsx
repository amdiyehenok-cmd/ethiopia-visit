"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 8);
  }, [center, map]);
  return null;
}
