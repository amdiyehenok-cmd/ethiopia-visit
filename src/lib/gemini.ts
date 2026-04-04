// Gemini has been replaced with Groq for better free tier limits.
// This file is kept only to avoid import errors in any legacy references.
// All AI calls now go through src/lib/ai.ts
export { askAI as chatWithAI, AI_FALLBACK } from "./ai";

// Stub to satisfy any old code that called getGeminiModel()
export function getGeminiModel() {
  throw new Error("Gemini removed — use askAI() from @/lib/ai instead");
}
