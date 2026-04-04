import { NextResponse } from "next/server";

async function logClick(hotelId: string, source: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.affiliateClick.create({
      data: { hotelId, source },
    });
  } catch {
    /* DB optional */
  }
}

export async function POST(req: Request) {
  const { hotelId, source } = (await req.json()) as {
    hotelId?: string;
    source?: string;
  };

  await logClick(hotelId ?? "unknown", source ?? "web");

  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");
  const hotelId = url.searchParams.get("hotelId") ?? "unknown";

  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  await logClick(hotelId, "redirect");

  return NextResponse.redirect(target, 302);
}
