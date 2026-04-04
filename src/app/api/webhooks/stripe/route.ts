import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    const stripe = new Stripe(key);
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe webhook] Invalid signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const type = session.metadata?.type;
        console.log(`[Stripe] Payment completed: ${session.id} type=${type} amount=${session.amount_total}`);
        // TODO: Update Prisma DB — mark booking as paid, send confirmation email
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[Stripe] Subscription ${event.type}: ${sub.id} status=${sub.status}`);
        // TODO: Update user premium status in DB
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[Stripe] Subscription cancelled: ${sub.id}`);
        // TODO: Revoke premium access in DB
        break;
      }
      default:
        console.log(`[Stripe webhook] Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error("[Stripe webhook] Handler error:", err);
  }

  return NextResponse.json({ received: true });
}
