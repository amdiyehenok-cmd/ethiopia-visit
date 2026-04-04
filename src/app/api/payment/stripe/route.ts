import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const {
      mode = "payment",          // "payment" | "subscription"
      type = "guide",            // "guide" | "hotel" | "experience" | "premium"
      amount,                    // in USD cents (e.g. 5000 = $50)
      name,
      description,
      metadata = {},
      successPath = "/payment/success",
      cancelPath = "/",
    } = body;

    const stripe = new Stripe(key);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

    if (mode === "subscription") {
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Ethiopia Visit Premium", description: "Unlimited AI planning, priority booking & exclusive deals" },
            recurring: { interval: "month" },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ];
    } else {
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: { name: name ?? "Ethiopia Visit Booking", description },
            unit_amount: amount ?? 5000,
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      mode: mode === "subscription" ? "subscription" : "payment",
      line_items: lineItems,
      success_url: `${appUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}&provider=stripe&type=${type}`,
      cancel_url: `${appUrl}${cancelPath}`,
      metadata: { type, ...metadata },
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    console.error("Stripe route error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
