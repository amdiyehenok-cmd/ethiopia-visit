import { NextResponse } from "next/server";
import { sampleGuides } from "@/data/guides";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  let list = sampleGuides;
  if (city) {
    list = list.filter((g) => g.city.toLowerCase().includes(city.toLowerCase()));
  }
  return NextResponse.json(list);
}
