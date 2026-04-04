import { NextResponse } from "next/server";

// open.er-api.com — completely free, no API key, updates every 24h, includes ETB
const PRIMARY_URL = "https://open.er-api.com/v6/latest/USD";

// Fallback: api.exchangerate-api.com free tier
const FALLBACK_URL = "https://api.exchangerate-api.com/v4/latest/USD";

const STATIC_FALLBACK = {
  base: "USD",
  etb: 57.5,
  updated: new Date().toISOString().split("T")[0],
  rates: { USD: 1, ETB: 57.5, EUR: 0.92, GBP: 0.79, CNY: 7.24, JPY: 149.5, AED: 3.67, SAR: 3.75 },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const base = searchParams.get("base") ?? "USD";

  try {
    // Try primary source
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    let data: Record<string, unknown> | null = null;

    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
        signal: controller.signal,
        next: { revalidate: 3600 }, // cache 1 hour
      });
      clearTimeout(timer);
      if (res.ok) {
        const json = await res.json();
        if (json.result === "success") data = json;
      }
    } catch {
      clearTimeout(timer);
    }

    // Try fallback
    if (!data) {
      try {
        const res2 = await fetch(FALLBACK_URL, { next: { revalidate: 3600 } });
        if (res2.ok) data = await res2.json();
      } catch {
        /* use static */
      }
    }

    if (!data) return NextResponse.json(STATIC_FALLBACK);

    const rates = (data.rates ?? data.conversion_rates ?? {}) as Record<string, number>;

    return NextResponse.json({
      base,
      etb: rates.ETB ?? STATIC_FALLBACK.etb,
      updated: data.time_last_update_utc ?? data.date ?? new Date().toISOString(),
      rates: {
        USD: rates.USD ?? 1,
        ETB: rates.ETB ?? STATIC_FALLBACK.etb,
        EUR: rates.EUR ?? 0.92,
        GBP: rates.GBP ?? 0.79,
        CNY: rates.CNY ?? 7.24,
        JPY: rates.JPY ?? 149.5,
        AED: rates.AED ?? 3.67,
        SAR: rates.SAR ?? 3.75,
        CAD: rates.CAD ?? 1.36,
        AUD: rates.AUD ?? 1.53,
      },
    });
  } catch (err) {
    console.error("[Currency API]", err);
    return NextResponse.json(STATIC_FALLBACK);
  }
}
