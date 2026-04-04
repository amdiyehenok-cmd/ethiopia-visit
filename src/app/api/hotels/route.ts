import { NextResponse } from "next/server";
import { hotels } from "@/data/hotels";

export async function GET() {
  return NextResponse.json(hotels);
}
