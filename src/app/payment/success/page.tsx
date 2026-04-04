"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GoldButton } from "@/components/ui/GoldButton";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const txRef = searchParams.get("tx_ref") ?? searchParams.get("session_id");
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider || !txRef) { setLoading(false); return; }
    const refParam = provider === "stripe" ? "session_id" : "tx_ref";
    fetch(`/api/payment/verify?provider=${provider}&${refParam}=${txRef}`)
      .then((r) => r.json())
      .then((d) => { setVerified(d.verified ?? false); setLoading(false); })
      .catch(() => { setVerified(false); setLoading(false); });
  }, [provider, txRef]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl"
      >
        {loading ? (
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gold-primary/30 border-t-gold-primary" />
            <p className="text-ivory/60">Verifying your payment…</p>
          </div>
        ) : verified ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ethiopia-green/20 text-5xl ring-4 ring-ethiopia-green/30"
            >
              ✓
            </motion.div>
            <h1 className="font-display text-4xl text-gold-light">Payment confirmed!</h1>
            <p className="mt-3 text-ivory/65">
              Your booking is secured. Check your email for confirmation details and next steps.
            </p>
            <p className="mt-2 text-xs text-ivory/40">
              Ref: {txRef} · via {provider}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <GoldButton href="/guides">View your guide</GoldButton>
              <GoldButton href="/" variant="outline">Back to home</GoldButton>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ethiopia-red/20 text-5xl ring-4 ring-ethiopia-red/30">
              ✗
            </div>
            <h1 className="font-display text-4xl text-ivory">Payment not verified</h1>
            <p className="mt-3 text-ivory/65">
              We couldn&apos;t confirm your payment. If you were charged, please contact support with ref: <strong className="text-gold-light">{txRef}</strong>
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <GoldButton href="/guides">Try again</GoldButton>
              <Link href="/" className="text-sm text-ivory/50 hover:text-ivory">Return home</Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
