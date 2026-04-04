"use client";

import { useQuery } from "@tanstack/react-query";

export type WeatherData = {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
  forecast: { date: string; tempMin: number; tempMax: number; description: string }[];
};

async function fetchWeather(): Promise<WeatherData> {
  const res = await fetch("/api/weather");
  if (!res.ok) throw new Error("Weather unavailable");
  return res.json();
}

export function useWeather() {
  return useQuery({
    queryKey: ["weather", "addis"],
    queryFn: fetchWeather,
  });
}
