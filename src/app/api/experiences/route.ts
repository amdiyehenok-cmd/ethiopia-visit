import { NextResponse } from "next/server";
import { sampleGuides } from "@/data/guides";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const experiences = sampleGuides.flatMap((g) =>
    g.experiences.map((e, i) => ({
      id: `${g.id}-exp-${i}`,
      guideId: g.id,
      guideName: g.name,
      guidePhoto: g.profilePhoto,
      city: g.city,
      ...e,
    })),
  );
  const filtered = category
    ? experiences.filter((x) =>
        x.category.toLowerCase().includes(category.toLowerCase()),
      )
    : experiences;
  return NextResponse.json(filtered);
}
