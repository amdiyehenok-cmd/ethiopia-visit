import { NextResponse } from "next/server";
import crypto from "crypto";

// Telebirr H5 Web Payment API
// Docs: https://developer.ethiotelecom.et/docs/telebirr

function generateSign(params: Record<string, string>, appKey: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const raw = sorted + "&key=" + appKey;
  return crypto.createHash("sha256").update(raw).digest("hex").toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, subject, nonce, returnUrl } = body;

    const appId = process.env.TELEBIRR_APP_ID;
    const appKey = process.env.TELEBIRR_APP_KEY;
    const publicKey = process.env.TELEBIRR_PUBLIC_KEY;
    const shortCode = process.env.TELEBIRR_SHORT_CODE;

    if (!appId || !appKey || !publicKey || !shortCode) {
      return NextResponse.json({ error: "Telebirr not configured" }, { status: 503 });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const outTradeNo = `ET-TB-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    const params: Record<string, string> = {
      appId,
      outTradeNo,
      shortCode,
      timeoutExpress: "30",
      timestamp,
      nonce: nonce ?? crypto.randomBytes(16).toString("hex"),
      subject: subject ?? "Ethiopia Visit Booking",
      totalAmount: String(Number(amount).toFixed(2)),
      returnUrl: returnUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify?provider=telebirr`,
    };

    params.sign = generateSign(params, appKey);

    // Encrypt payload with Telebirr public key
    // In production, encrypt with RSA public key provided by Ethio Telecom
    const ussd = JSON.stringify(params);

    const response = await fetch("https://api.ethiomobilemoney.et:2121/ammapi/payment/service/createOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId,
        sign: params.sign,
        ussd,
        timestamp,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Telebirr API error:", text);
      return NextResponse.json({ error: "Telebirr payment initialization failed" }, { status: 400 });
    }

    const data = await response.json();

    if (data.code !== "0") {
      return NextResponse.json({ error: data.msg ?? "Telebirr error" }, { status: 400 });
    }

    return NextResponse.json({
      checkoutUrl: data.data?.toPayUrl,
      outTradeNo,
      status: "pending",
    });
  } catch (err) {
    console.error("Telebirr route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
