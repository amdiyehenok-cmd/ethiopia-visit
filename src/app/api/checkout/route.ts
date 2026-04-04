import { NextResponse } from "next/server";
import Stripe from "stripe";

// Legacy premium subscription endpoint — kept for backwards compatibility
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = new Stripe(key);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Ethiopia Visit Premium",
              description: "Unlimited AI planning, priority guide booking & exclusive deals",
              images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80"],
            },
            recurring: { interval: "month" },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/payment/success?provider=stripe&type=premium&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
      allow_promotion_codes: true,
      metadata: { type: "premium", source: body.source ?? "home" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
