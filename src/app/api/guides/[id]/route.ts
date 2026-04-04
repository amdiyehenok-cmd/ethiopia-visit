import { NextResponse } from "next/server";
import { sampleGuides } from "@/data/guides";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const guide = sampleGuides.find((g) => g.id === id);
  if (!guide) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(guide);
}
