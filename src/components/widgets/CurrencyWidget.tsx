"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";

const CURRENCIES = [
  { code: "ETB", flag: "🇪🇹", name: "Ethiopian Birr" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "CNY", flag: "🇨🇳", name: "Chinese Yuan" },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "SAR", flag: "🇸🇦", name: "Saudi Riyal" },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar" },
];

export function CurrencyWidget() {
  const { data, isLoading } = useCurrency();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<"USD" | string>("USD");
  const [to, setTo]     = useState<"ETB" | string>("ETB");

  const result = useMemo(() => {
    if (!data?.rates) return null;
    const n = parseFloat(amount);
    if (!n || isNaN(n)) return null;
    const rates = data.rates as Record<string, number>;
    // Convert: amount FROM → USD → TO
    const inUsd = from === "USD" ? n : n / (rates[from] ?? 1);
    const out   = to   === "USD" ? inUsd : inUsd * (rates[to] ?? 1);
    return out;
  }, [amount, from, to, data]);

  if (isLoading || !data) {
    return <div className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/5" />;
  }

  const etbRate = data.etb;
  const updatedStr = typeof data.updated === "string"
    ? data.updated.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gold-dark/20 to-dark-2/90 p-6 backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-primary/90">Live Exchange</p>
          <p className="mt-1 font-display text-3xl text-gold-light">
            1 USD <span className="text-ivory/40 text-xl">=</span> {etbRate.toFixed(2)} ETB
          </p>
        </div>
        <span className="mt-1 rounded-full bg-ethiopia-green/20 px-2 py-0.5 text-[10px] font-semibold text-ethiopia-green/80 border border-ethiopia-green/20">
          LIVE
        </span>
      </div>
      <p className="mt-0.5 text-xs text-ivory/35">Updated {updatedStr}</p>

      {/* Quick rates row */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["EUR","GBP","CNY","AED"].map((c) => {
          const r = (data.rates as Record<string, number>)[c];
          const cc = CURRENCIES.find((x) => x.code === c);
          return r ? (
            <span key={c} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-ivory/60">
              {cc?.flag} {c} {r.toFixed(2)}
            </span>
          ) : null;
        })}
      </div>

      {/* Converter */}
      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-xs uppercase tracking-wider text-ivory/40">Converter</p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-24 rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm text-ivory focus:border-gold-primary/50 focus:outline-none"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-white/10 bg-dark-2 px-2 py-2 text-sm text-ivory"
          >
            <option value="USD">🇺🇸 USD</option>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => { const t = from; setFrom(to); setTo(t); }}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-2 text-xs text-ivory/50 hover:text-ivory transition"
          >
            ⇄
          </button>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-white/10 bg-dark-2 px-2 py-2 text-sm text-ivory"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
            <option value="USD">🇺🇸 USD</option>
          </select>
        </div>
        {result !== null && (
          <p className="mt-3 font-display text-2xl text-gold-light">
            {amount} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
          </p>
        )}
      </div>

      <p className="mt-3 text-xs text-ivory/25">
        Rates via open.er-api.com · For informational use only
      </p>
    </div>
  );
}
