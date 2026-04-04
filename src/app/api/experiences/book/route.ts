import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const stripe = process.env.STRIPE_SECRET_KEY;
  if (!stripe) {
    return NextResponse.json({
      ok: true,
      demo: true,
      message:
        "Booking recorded in demo mode. Add STRIPE_SECRET_KEY for live Checkout sessions.",
      body,
    });
  }
  return NextResponse.json({
    ok: true,
    message: "Configure Stripe Checkout with GuideBooking model for production.",
    body,
  });
}
