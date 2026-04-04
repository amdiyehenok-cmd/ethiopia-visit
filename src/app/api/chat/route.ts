import { streamAI, AI_FALLBACK } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  let messages: { role: string; content: string }[] = [];

  try {
    const body = await req.json();
    messages = body.messages ?? [];
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!messages.length) {
    return new Response("Missing messages", { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return new Response(AI_FALLBACK, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  try {
    const stream = await streamAI(messages);
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error";
    console.error("[Chat API]", msg);
    // Return fallback as stream so client handles it gracefully
    return new Response(
      msg.includes("rate_limit") || msg.includes("429")
        ? "⚠️ **AI is busy** — our guide is taking a quick break. Try again in 30 seconds, or visit **/guides** to chat with a real human expert!"
        : AI_FALLBACK,
      { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } },
    );
  }
}
