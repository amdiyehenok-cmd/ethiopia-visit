import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = "ETB",
      email,
      firstName,
      lastName,
      phone,
      description,
      returnUrl,
      callbackUrl,
      customization = {},
    } = body;

    const chapaKey = process.env.CHAPA_SECRET_KEY;
    if (!chapaKey) {
      return NextResponse.json({ error: "Chapa not configured" }, { status: 503 });
    }

    const txRef = `ET-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    const payload = {
      amount: String(amount),
      currency,
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      tx_ref: txRef,
      callback_url: callbackUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify?provider=chapa`,
      return_url: returnUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?tx_ref=${txRef}`,
      description: description ?? "Ethiopia Visit Booking",
      customization: {
        title: customization.title ?? "Ethiopia Visit",
        description: customization.description ?? description,
        logo: customization.logo ?? `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
      },
    };

    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chapaKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      console.error("Chapa error:", data);
      return NextResponse.json({ error: data.message ?? "Chapa payment failed" }, { status: 400 });
    }

    return NextResponse.json({
      checkoutUrl: data.data.checkout_url,
      txRef,
      status: "pending",
    });
  } catch (err) {
    console.error("Chapa route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const txRef = searchParams.get("tx_ref");

  if (!txRef) {
    return NextResponse.json({ error: "tx_ref required" }, { status: 400 });
  }

  const chapaKey = process.env.CHAPA_SECRET_KEY;
  if (!chapaKey) {
    return NextResponse.json({ error: "Chapa not configured" }, { status: 503 });
  }

  const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
    headers: { Authorization: `Bearer ${chapaKey}` },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
