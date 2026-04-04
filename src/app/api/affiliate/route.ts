import { NextResponse } from "next/server";

async function logClick(
  hotelId: string,
  source: string,
  url: string = "https://ethiopia-visit.com"
) {
  try {
    const { prisma } = await import("@/lib/prisma");

    await prisma.affiliateClick.create({
      data: {
        hotelId,
        source,
        url,                    // ← This was the missing required field
      },
    });
  } catch {
    /* DB is optional - don't break the flow */
  }
}

export async function POST(req: Request) {
  const { hotelId, source } = (await req.json()) as {
    hotelId?: string;
    source?: string;
  };

  // Use the actual request URL as the click source
  await logClick(
    hotelId ?? "unknown",
    source ?? "web",
    req.url
  );

  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");
  const hotelId = url.searchParams.get("hotelId") ?? "unknown";

  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  await logClick(hotelId, "redirect", target);

  return NextResponse.redirect(target, 302);
}