"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { GoldButton } from "@/components/ui/GoldButton";

const STEPS = ["Profile", "Experience", "Documents", "Review"];
const LANGUAGES = ["English", "Amharic", "French", "German", "Italian", "Spanish", "Arabic", "Chinese", "Japanese", "Oromo", "Tigrinya", "Somali", "Afar"];
const SPECIALTIES = ["Lalibela Rock Churches", "Simien Mountains Trekking", "Omo Valley Culture", "Danakil Expedition", "Gondar Castles", "Axum History", "Coffee Ceremonies", "Ethiopian Cuisine", "Wildlife & Birding", "Photography Tours", "Festival Guidance", "Addis City Tours", "Lake Tana Monasteries", "Bale Mountains Hiking"];

export default function BecomeAGuidePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", city: "", bio: "", phone: "", whatsapp: "", email: "",
    languages: [] as string[], specialties: [] as string[],
    yearsExp: "1", hasCertificate: false, hasInsurance: false,
    photoUrl: "", coverUrl: "",
    exp1Title: "", exp1Duration: "3", exp1Price: "40",
    exp2Title: "", exp2Duration: "", exp2Price: "",
    agreeTerms: false,
  });

  function set(k: keyof typeof form, v: unknown) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function toggleArr(k: "languages" | "specialties", v: string) {
    setForm((p) => {
      const arr = p[k] as string[];
      return { ...p, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });
  }

  async function submit() {
    const res = await fetch("/api/guides/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ethiopia-green/20 text-5xl ring-4 ring-ethiopia-green/30">🎉</div>
          <h1 className="font-display text-4xl text-gold-light">Application received!</h1>
          <p className="mt-4 text-ivory/65">
            We&apos;ll review your profile and respond within 48 hours. You&apos;ll receive a confirmation email at <strong className="text-ivory">{form.email}</strong>.
          </p>
          <GoldButton href="/guides" className="mt-8 w-full justify-center">See current guides</GoldButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-dark-1 to-obsidian py-16">
        <div className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
          <p className="text-xs uppercase tracking-widest text-gold-primary">Join the platform</p>
          <ShimmerText className="mt-3 text-4xl md:text-6xl" as="h1">Become a guide</ShimmerText>
          <p className="mx-auto mt-4 max-w-xl text-ivory/60">
            Share your Ethiopia with the world. Set your own prices, manage bookings, get paid globally.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-ivory/50">
            {["Zero upfront cost", "Global payments (Stripe, Chapa, Telebirr)", "Full profile + booking page", "48h approval"].map((b) => (
              <span key={b} className="flex items-center gap-1.5"><span className="text-ethiopia-green">✓</span> {b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 md:px-8">
        {/* Step indicators */}
        <div className="mb-10 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                i < step ? "bg-ethiopia-green text-ivory" : i === step ? "bg-gold-primary text-obsidian" : "border border-white/20 text-ivory/30"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <p className={`mt-1.5 text-xs hidden sm:block ${i === step ? "text-gold-light" : "text-ivory/30"}`}>{s}</p>
              {i < STEPS.length - 1 && (
                <div className="absolute top-4 left-full h-px w-full bg-white/10" />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-ivory">Your profile</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs text-ivory/50">Full name *</label>
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Dawit Tadesse" className="input-field w-full" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-ivory/50">Primary city *</label>
                  <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Addis Ababa" className="input-field w-full" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-ivory/50">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className="input-field w-full" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-ivory/50">WhatsApp number</label>
                  <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+251911..." className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-ivory/50">Bio (tell tourists about yourself) *</label>
                <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={4} placeholder="Born in Lalibela, I've guided travelers through Ethiopia's wonders for 8 years…" className="input-field w-full resize-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-ivory/50">Languages spoken *</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LANGUAGES.map((l) => (
                    <button key={l} type="button" onClick={() => toggleArr("languages", l)}
                      className={`rounded-full px-3 py-1 text-xs transition ${form.languages.includes(l) ? "bg-gold-primary text-obsidian font-semibold" : "border border-white/10 bg-white/5 text-ivory/60"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl text-ivory">Your experiences</h2>
              <div>
                <label className="mb-2 block text-xs text-ivory/50">Specialties (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map((s) => (
                    <button key={s} type="button" onClick={() => toggleArr("specialties", s)}
                      className={`rounded-full px-3 py-1 text-xs transition ${form.specialties.includes(s) ? "bg-gold-primary text-obsidian font-semibold" : "border border-white/10 bg-white/5 text-ivory/60"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-ivory">Experience #1 *</p>
                <input value={form.exp1Title} onChange={(e) => set("exp1Title", e.target.value)} placeholder="Sunrise at Bete Giyorgis Church" className="input-field w-full" />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-ivory/40">Duration (hours)</label>
                    <input type="number" value={form.exp1Duration} onChange={(e) => set("exp1Duration", e.target.value)} className="input-field w-full" />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-ivory/40">Price per person ($USD)</label>
                    <input type="number" value={form.exp1Price} onChange={(e) => set("exp1Price", e.target.value)} className="input-field w-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-ivory">Experience #2 (optional)</p>
                <input value={form.exp2Title} onChange={(e) => set("exp2Title", e.target.value)} placeholder="Multi-day Simien Trek" className="input-field w-full" />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-ivory/40">Duration (hours)</label>
                    <input type="number" value={form.exp2Duration} onChange={(e) => set("exp2Duration", e.target.value)} className="input-field w-full" />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-ivory/40">Price per person ($USD)</label>
                    <input type="number" value={form.exp2Price} onChange={(e) => set("exp2Price", e.target.value)} className="input-field w-full" />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-ivory/50">Years of guiding experience</label>
                <input type="number" min="0" max="50" value={form.yearsExp} onChange={(e) => set("yearsExp", e.target.value)} className="input-field w-32" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl text-ivory">Documents & compliance</h2>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-gold-primary/30 transition">
                  <input type="checkbox" checked={form.hasCertificate} onChange={(e) => set("hasCertificate", e.target.checked)} className="mt-0.5 accent-gold-primary" />
                  <div>
                    <p className="text-sm font-medium text-ivory">I hold a valid guide license / tourism certificate</p>
                    <p className="text-xs text-ivory/40">Issued by Ethiopian Ministry of Tourism or regional tourism bureau</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-gold-primary/30 transition">
                  <input type="checkbox" checked={form.hasInsurance} onChange={(e) => set("hasInsurance", e.target.checked)} className="mt-0.5 accent-gold-primary" />
                  <div>
                    <p className="text-sm font-medium text-ivory">I have or will obtain liability insurance</p>
                    <p className="text-xs text-ivory/40">We can connect you with providers if needed after approval</p>
                  </div>
                </label>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-ivory/60 leading-relaxed">
                  After approval, you&apos;ll be asked to upload: 📄 National ID or passport · 📜 Guide certificate · 🤳 Profile photo<br /><br />
                  We review all applications within <strong className="text-ivory">48 hours</strong>.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl text-ivory">Review your application</h2>
              <div className="space-y-2 text-sm">
                {[
                  { l: "Name", v: form.name },
                  { l: "City", v: form.city },
                  { l: "Email", v: form.email },
                  { l: "Languages", v: form.languages.join(", ") || "—" },
                  { l: "Specialties", v: form.specialties.slice(0, 3).join(", ") + (form.specialties.length > 3 ? "…" : "") || "—" },
                  { l: "Main experience", v: form.exp1Title || "—" },
                ].map((r) => (
                  <div key={r.l} className="flex justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                    <span className="text-ivory/50">{r.l}</span>
                    <span className="text-ivory font-medium">{r.v || "—"}</span>
                  </div>
                ))}
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={form.agreeTerms} onChange={(e) => set("agreeTerms", e.target.checked)} className="mt-0.5 accent-gold-primary" />
                <p className="text-xs text-ivory/60">
                  I agree to Ethiopia Visit&apos;s{" "}
                  <span className="text-gold-primary cursor-pointer hover:underline">Terms of Service</span>{" "}
                  and{" "}
                  <span className="text-gold-primary cursor-pointer hover:underline">Guide Code of Conduct</span>.
                  Ethiopia Visit takes a 15% platform fee on each booking.
                </p>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-ivory/60 hover:text-ivory transition">
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && (!form.name || !form.city || !form.email || !form.bio || form.languages.length === 0)}
                className="btn-gold flex-1 rounded-full py-2.5 text-sm disabled:opacity-40"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!form.agreeTerms}
                className="btn-gold flex-1 rounded-full py-2.5 text-sm disabled:opacity-40"
              >
                Submit application 🚀
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Inline styles for input fields */}
      <style jsx global>{`
        .input-field {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: var(--ivory);
          transition: border-color 0.2s;
        }
        .input-field::placeholder { color: rgba(245,240,232,0.3); }
        .input-field:focus { outline: none; border-color: rgba(201,168,76,0.5); }
      `}</style>
    </div>
  );
}
