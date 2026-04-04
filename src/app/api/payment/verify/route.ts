import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");
  const ref = searchParams.get("tx_ref") ?? searchParams.get("trx_ref") ?? searchParams.get("session_id");

  if (!provider || !ref) {
    return NextResponse.json({ error: "provider and ref required" }, { status: 400 });
  }

  try {
    if (provider === "chapa") {
      const chapaKey = process.env.CHAPA_SECRET_KEY;
      if (!chapaKey) return NextResponse.json({ error: "Chapa not configured" }, { status: 503 });
      const res = await fetch(`https://api.chapa.co/v1/transaction/verify/${ref}`, {
        headers: { Authorization: `Bearer ${chapaKey}` },
      });
      const data = await res.json();
      return NextResponse.json({
        verified: data.status === "success" && data.data?.status === "success",
        provider: "chapa",
        data: data.data,
      });
    }

    if (provider === "stripe") {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.retrieve(ref);
      return NextResponse.json({
        verified: session.payment_status === "paid",
        provider: "stripe",
        data: { amount: session.amount_total, currency: session.currency, email: session.customer_details?.email },
      });
    }

    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// Webhook handler for Chapa
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider");

    if (provider === "chapa") {
      const { trx_ref, status } = body;
      console.log(`[Chapa Webhook] ${trx_ref}: ${status}`);
      // TODO: Update booking status in DB via Prisma
      return NextResponse.json({ ok: true });
    }

    if (provider === "telebirr") {
      const { outTradeNo, tradeStatus } = body;
      console.log(`[Telebirr Webhook] ${outTradeNo}: ${tradeStatus}`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
