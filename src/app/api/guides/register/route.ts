import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      name: string;
      email: string;
      phone?: string;
      whatsapp?: string;
      bio: string;
      city: string;
      languages: string[];
      specialties: string[];
      yearsExp?: string;
      hasCertificate?: boolean;
      hasInsurance?: boolean;
      exp1Title?: string;
      exp1Duration?: string;
      exp1Price?: string;
      exp2Title?: string;
      exp2Duration?: string;
      exp2Price?: string;
    };

    const { name, email, bio, city, languages, specialties } = body;

    // Validate required fields
    if (!name || !email || !bio || !city || !languages?.length) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, bio, city, languages" },
        { status: 400 },
      );
    }

    // Check if email already applied
    const existing = await prisma.guide.findFirst({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists." },
        { status: 409 },
      );
    }

    // Create or find a user record for this guide
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, role: "GUIDE" },
      create: { email, name, role: "GUIDE" },
    });

    // Create guide application
    const guide = await prisma.guide.create({
      data: {
        userId:         user.id,
        name,
        email,
        phone:          body.phone,
        whatsapp:       body.whatsapp,
        bio,
        city,
        languages,
        specialties,
        yearsExperience: parseInt(body.yearsExp ?? "1", 10),
        hasCertificate: body.hasCertificate ?? false,
        hasInsurance:   body.hasInsurance ?? false,
        status:         "PENDING",
        verified:       false,
        active:         false, // goes live only after admin approval
      },
    });

    // Create experiences if provided
    const experiencePromises = [];

    if (body.exp1Title?.trim()) {
      experiencePromises.push(
        prisma.experience.create({
          data: {
            guideId:       guide.id,
            title:         body.exp1Title,
            description:   `${body.exp1Title} — experience offered by ${name} in ${city}.`,
            category:      "Culture",
            durationHours: parseInt(body.exp1Duration ?? "3", 10),
            pricePerPerson: parseFloat(body.exp1Price ?? "40"),
            city,
            languages,
            active: false, // activated after guide approval
          },
        }),
      );
    }

    if (body.exp2Title?.trim()) {
      experiencePromises.push(
        prisma.experience.create({
          data: {
            guideId:       guide.id,
            title:         body.exp2Title,
            description:   `${body.exp2Title} — experience offered by ${name} in ${city}.`,
            category:      "Adventure",
            durationHours: parseInt(body.exp2Duration ?? "8", 10),
            pricePerPerson: parseFloat(body.exp2Price ?? "80"),
            city,
            languages,
            active: false,
          },
        }),
      );
    }

    await Promise.all(experiencePromises);

    return NextResponse.json({
      ok:      true,
      guideId: guide.id,
      message: `Application received for ${name}. We will review your profile and respond to ${email} within 48 hours.`,
    });
  } catch (err: unknown) {
    console.error("[Guide Register]", err);
    const msg = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
