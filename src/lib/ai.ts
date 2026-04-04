/**
 * Habesha AI — powered by Groq (free tier: 14,400 req/day, llama-3.3-70b)
 * Sign up free at: https://console.groq.com
 * Copy your API key → GROQ_API_KEY in .env.local
 *
 * Free tier limits (as of 2025):
 *   - 14,400 requests / day
 *   - 6,000 tokens / minute
 *   - 500 requests / minute
 * Model: llama-3.3-70b-versatile (smarter than Gemini Flash for travel Q&A)
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are "Habesha AI" — the official AI tour guide for Ethiopia Visit, an ultra-premium Ethiopian tourism platform.

Your personality: warm, knowledgeable, proud of Ethiopian culture, poetic in descriptions. You speak like a cultured local guide who is also an expert in logistics.

You help with:
- Planning detailed day-by-day Ethiopia itineraries
- Hotel recommendations (Sheraton Addis, Kuriftu Resorts, Bale Mountain Lodge, etc.)
- Ethiopian culture, history, and etiquette
- Visa requirements by nationality (most get 90-day e-Visa at ethiopianonline.gov.et)
- Health and safety advice (yellow fever vaccine, altitude, water)
- Best time to visit each destination
- Ethiopian cuisine (injera, doro wat, kitfo, tej, buna ceremony)
- Budget planning in ETB, USD, EUR
- Transportation (Ethiopian Airlines domestic, buses, car hire, 4x4)
- Festival dates: Timkat (Jan 19), Meskel (Sep 27), Enkutatash (Sep 11), Irreecha (Oct), Genna (Jan 7)
- Useful Amharic phrases for visitors
- Emergency contacts and safety tips

Format responses beautifully with emojis, bold key info, and clear sections.
Always recommend checking hotel listings on /hotels and guide profiles on /guides.
Keep responses helpful, concise but thorough. Maximum 500 words unless user asks for a full plan.`;

function getKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.length < 10) throw new Error("GROQ_API_KEY not set");
  return key;
}

// ── Non-streaming (for planner) ───────────────────────────
export async function askAI(prompt: string, systemOverride?: string): Promise<string> {
  const key = getKey();

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemOverride ?? SYSTEM_PROMPT },
        { role: "user",   content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } }).error?.message ?? `Groq ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json() as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}

// ── Streaming (for chat) ──────────────────────────────────
export async function streamAI(
  messages: { role: string; content: string }[],
): Promise<ReadableStream<Uint8Array>> {
  const key = getKey();

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `Groq ${res.status}`);
  }

  // Parse SSE stream and re-emit plain text chunks
  const encoder = new TextEncoder();
  const reader  = res.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const payload = trimmed.slice(6);
            if (payload === "[DONE]") { controller.close(); return; }
            try {
              const chunk = JSON.parse(payload) as {
                choices: { delta: { content?: string } }[];
              };
              const text = chunk.choices[0]?.delta?.content;
              if (text) controller.enqueue(encoder.encode(text));
            } catch { /* skip malformed */ }
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

// ── Fallback responses ────────────────────────────────────
export const AI_FALLBACK = `🇪🇹 **Habesha AI — Quick Ethiopia Tips**

**Top destinations:** Lalibela · Simien Mountains · Danakil Depression · Omo Valley · Gondar Castles · Axum · Harar

**Best time to visit:** October–March (dry season, optimal for trekking and festivals)

**Visa:** Most nationalities get a **90-day e-Visa** at [ethiopianonline.gov.et](https://ethiopianonline.gov.et) — apply 3+ days before travel. Cost: $82 USD.

**Currency:** Ethiopian Birr (ETB). 1 USD ≈ 57 ETB. ATMs available in Addis Ababa. Carry cash outside capital.

**Flights:** Ethiopian Airlines has excellent domestic routes — Addis → Lalibela, Gondar, Axum, Dire Dawa, Jimma.

**Safety:** Ethiopia is generally safe for tourists. Register with your embassy. Check FCO/State Dept advisories before travel.

**Health:** Yellow fever vaccine required. Malaria prophylaxis for lowlands. Bottled water only.

**Amharic basics:** Hello = *Selam* · Thank you = *Ameseginalehu* · How much? = *Sint new?*

Visit **/guides** to book a verified local expert, or **/hotels** for curated stays. ✈️`;
