import { NextResponse } from "next/server";

const ADDIS = { lat: 9.145, lon: 38.7613, name: "Addis Ababa" };

const DEMO = {
  city: "Addis Ababa",
  temp: 22,
  feelsLike: 21,
  humidity: 48,
  wind: 3.2,
  description: "Partly cloudy",
  icon: "02d",
  forecast: [
    { date: "Mon", tempMin: 18, tempMax: 25, description: "Sunny" },
    { date: "Tue", tempMin: 17, tempMax: 24, description: "Few clouds" },
    { date: "Wed", tempMin: 16, tempMax: 22, description: "Light rain" },
    { date: "Thu", tempMin: 17, tempMax: 24, description: "Clear" },
    { date: "Fri", tempMin: 18, tempMax: 25, description: "Sunny" },
  ],
};

export const revalidate = 900; // cache 15 min

export async function GET() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key.length < 10) return NextResponse.json(DEMO);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const curRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${ADDIS.lat}&lon=${ADDIS.lon}&appid=${key}&units=metric`,
      { signal: controller.signal },
    );
    clearTimeout(timer);

    // Key invalid or quota exceeded → return demo silently
    if (!curRes.ok) {
      console.warn(`[Weather] upstream ${curRes.status} — serving demo data`);
      return NextResponse.json(DEMO);
    }

    const cur = await curRes.json() as {
      name?: string;
      main: { temp: number; feels_like: number; humidity: number };
      wind?: { speed: number };
      weather: { description: string; icon: string }[];
    };

    // Forecast (non-critical — ignore failures)
    const daily: { date: string; tempMin: number; tempMax: number; description: string }[] = [];
    try {
      const fcRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${ADDIS.lat}&lon=${ADDIS.lon}&appid=${key}&units=metric`,
      );
      if (fcRes.ok) {
        const fc = await fcRes.json() as { list: { dt_txt: string; main: { temp_min: number; temp_max: number }; weather: { description: string }[] }[] };
        const byDay = new Map<string, { min: number; max: number; desc: string }>();
        for (const item of fc.list) {
          const day = item.dt_txt.split(" ")[0];
          const existing = byDay.get(day);
          if (!existing) {
            byDay.set(day, { min: item.main.temp_min, max: item.main.temp_max, desc: item.weather[0]?.description ?? "" });
          } else {
            byDay.set(day, { min: Math.min(existing.min, item.main.temp_min), max: Math.max(existing.max, item.main.temp_max), desc: existing.desc });
          }
        }
        for (const [date, v] of byDay) {
          if (daily.length >= 5) break;
          const d = new Date(date);
          daily.push({ date: d.toLocaleDateString("en", { weekday: "short" }), tempMin: Math.round(v.min), tempMax: Math.round(v.max), description: v.desc });
        }
      }
    } catch { /* ignore forecast errors */ }

    return NextResponse.json({
      city: cur.name ?? ADDIS.name,
      temp: Math.round(cur.main.temp),
      feelsLike: Math.round(cur.main.feels_like),
      humidity: cur.main.humidity,
      wind: cur.wind?.speed ?? 0,
      description: cur.weather[0]?.description ?? "",
      icon: cur.weather[0]?.icon ?? "01d",
      forecast: daily.length > 0 ? daily : DEMO.forecast,
    });
  } catch (err) {
    console.warn("[Weather] fetch failed:", err);
    return NextResponse.json(DEMO);
  }
}
