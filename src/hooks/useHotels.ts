"use client";

import { useQuery } from "@tanstack/react-query";
import type { Hotel } from "@/types";

async function fetchHotels(): Promise<Hotel[]> {
  const res = await fetch("/api/hotels");
  if (!res.ok) throw new Error("Failed to load hotels");
  return res.json();
}

export function useHotels() {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: fetchHotels,
  });
}
