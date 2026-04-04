import { NextResponse } from "next/server";
import { askAI, AI_FALLBACK } from "@/lib/ai";
import type { PlannerResult } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const PLANNER_SYSTEM = `You are Habesha AI trip planner for Ethiopia. Return ONLY valid JSON — no markdown fences, no explanation text, just the JSON object.

Schema:
{
  "title": string,
  "summary": string,
  "days": [{
    "day": number,
    "location": string,
    "title": string,
    "morning": string,
    "afternoon": string,
    "evening": string,
    "accommodation": { "name": string, "priceRange": string },
    "estimatedCost": number,
    "tips": string
  }],
  "totalEstimatedCost": number,
  "bestTimeToVisit": string,
  "visaNote": string
}

Rules:
- Use real Ethiopian cities: Addis Ababa, Lalibela, Gondar, Axum, Bahir Dar, Simien Mountains, Danakil, Omo Valley, Harar, etc.
- estimatedCost in USD per person per day
- visaNote: "90-day e-Visa available at ethiopianonline.gov.et for most nationalities. Cost: $82 USD."
- Include practical tips per day
- Return ONLY the JSON object, nothing else`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as {
    duration?: number;
    budget?: string;
    interests?: string[];
    homeCountry?: string;
    startDate?: string;
    prompt?: string;
  };

  const {
    duration    = 7,
    budget      = "mid-range",
    interests   = [],
    homeCountry = "Unknown",
    startDate,
    prompt,
  } = body;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "AI not configured — set GROQ_API_KEY in .env.local (free at console.groq.com)" },
      { status: 503 },
    );
  }

  const userPrompt = `Plan a ${duration}-day Ethiopia trip.
Budget: ${budget}
Interests: ${interests.join(", ") || "history, culture, nature"}
Traveller from: ${homeCountry}
Start date: ${startDate || "flexible"}
${prompt ? `Special request: ${prompt}` : ""}

Return the JSON itinerary now.`;

  try {
    const raw = await askAI(userPrompt, PLANNER_SYSTEM);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const parsed = JSON.parse(jsonMatch[0]) as PlannerResult;
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error";
    console.error("[Planner]", msg);
    if (msg.includes("rate_limit") || msg.includes("429")) {
      return NextResponse.json({ error: "AI is busy — please try again in 30 seconds." }, { status: 429 });
    }
    return NextResponse.json({ error: `Planner failed: ${msg}` }, { status: 500 });
  }
}
