"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PaymentItem = {
  name: string;
  description?: string;
  amountUSD: number;   // always pass USD; ETB shown = amountUSD * 57 (approx)
  type: "guide" | "experience" | "hotel" | "premium";
  metadata?: Record<string, string>;
};

type Props = {
  item: PaymentItem;
  onClose: () => void;
};

const ETB_RATE = 57; // approximate ETB per USD — replace with live rate if needed

const METHODS = [
  {
    id: "stripe",
    label: "Credit / Debit Card",
    sub: "Visa, Mastercard, Amex — worldwide",
    icon: "💳",
    currency: "USD",
  },
  {
    id: "chapa",
    label: "Chapa",
    sub: "Bank transfer & mobile money (Ethiopia)",
    icon: "🏦",
    currency: "ETB",
  },
  {
    id: "telebirr",
    label: "Telebirr",
    sub: "Ethio Telecom mobile money",
    icon: "📱",
    currency: "ETB",
  },
  {
    id: "paypal",
    label: "PayPal",
    sub: "International — redirects to PayPal",
    icon: "🅿️",
    currency: "USD",
  },
] as const;

type MethodId = (typeof METHODS)[number]["id"];

export function PaymentModal({ item, onClose }: Props) {
  const [method, setMethod] = useState<MethodId>("stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const etbAmount = Math.round(item.amountUSD * ETB_RATE);

  async function handlePay() {
    setLoading(true);
    setError("");

    try {
      if (method === "stripe") {
        const res = await fetch("/api/payment/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "payment",
            type: item.type,
            amount: item.amountUSD * 100,
            name: item.name,
            description: item.description,
            metadata: item.metadata,
          }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else throw new Error(data.error ?? "Stripe error");

      } else if (method === "chapa") {
        const res = await fetch("/api/payment/chapa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: etbAmount,
            currency: "ETB",
            email: "guest@ethiopiavisit.com",
            firstName: "Guest",
            lastName: "Traveler",
            description: item.name,
          }),
        });
        const data = await res.json();
        if (data.checkoutUrl) window.location.href = data.checkoutUrl;
        else throw new Error(data.error ?? "Chapa error");

      } else if (method === "telebirr") {
        const res = await fetch("/api/payment/telebirr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: etbAmount,
            subject: item.name,
          }),
        });
        const data = await res.json();
        if (data.checkoutUrl) window.location.href = data.checkoutUrl;
        else throw new Error(data.error ?? "Telebirr error");

      } else if (method === "paypal") {
        // PayPal standard redirect
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(process.env.NEXT_PUBLIC_PAYPAL_EMAIL ?? "pay@ethiopiavisit.com")}&amount=${item.amountUSD}&currency_code=USD&item_name=${encodeURIComponent(item.name)}&return=${encodeURIComponent(window.location.origin + "/payment/success?provider=paypal")}&cancel_return=${encodeURIComponent(window.location.href)}`;
        window.location.href = paypalUrl;
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-md rounded-t-3xl border border-white/10 bg-[#111114] p-6 shadow-2xl sm:rounded-3xl"
        >
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl text-ivory">{item.name}</h2>
              {item.description && <p className="mt-1 text-sm text-ivory/55">{item.description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 mt-1 shrink-0 rounded-full bg-white/5 p-1.5 text-ivory/50 hover:text-ivory"
            >
              ✕
            </button>
          </div>

          {/* Amount display */}
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-ivory/40">Total</p>
            <p className="mt-1 font-display text-4xl text-gold-light">${item.amountUSD} <span className="text-xl text-ivory/40">USD</span></p>
            <p className="mt-0.5 text-sm text-ivory/40">≈ {etbAmount.toLocaleString()} ETB</p>
          </div>

          {/* Payment methods */}
          <p className="mb-3 text-xs uppercase tracking-widest text-ivory/40">Choose payment method</p>
          <div className="space-y-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  method === m.id
                    ? "border-gold-primary bg-gold-primary/10 text-ivory"
                    : "border-white/10 bg-white/5 text-ivory/70 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-xs text-ivory/40">{m.sub}</p>
                </div>
                <span className="text-xs text-ivory/30">{m.currency}</span>
                {method === m.id && (
                  <span className="ml-auto h-4 w-4 rounded-full bg-gold-primary text-[10px] text-obsidian flex items-center justify-center">✓</span>
                )}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-ethiopia-red/10 px-3 py-2 text-sm text-ethiopia-red">
              {error}
            </p>
          )}

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="btn-gold mt-6 flex w-full items-center justify-center rounded-full py-3.5 text-base font-semibold disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-obsidian/30 border-t-obsidian" />
                Processing…
              </span>
            ) : (
              `Pay ${method === "stripe" || method === "paypal" ? `$${item.amountUSD}` : `${etbAmount.toLocaleString()} ETB`}`
            )}
          </button>

          <p className="mt-3 text-center text-xs text-ivory/30">
            Secured by 256-bit encryption · No card details stored
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
