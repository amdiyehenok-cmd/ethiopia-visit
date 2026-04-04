"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { ChatMessageBubble } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const quickPrompts = [
  "Plan 7-day trip",
  "Best hotels under $100",
  "Visa requirements",
  "Ethiopian festivals",
];

export function ChatBot() {
  const { messages, send, loading, error } = useChat();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        id="habesha-chat"
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-dark via-gold-primary to-gold-light text-2xl shadow-[0_8px_40px_rgba(201,168,76,0.45)] transition hover:scale-105"
        aria-label="Open AI chat"
      >
        🇪🇹
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="fixed bottom-24 right-6 z-[9999] flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0b]/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-display text-lg text-gold-light">Habesha AI</p>
                <p className="text-xs text-ivory/50">Gemini-powered guide</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-sm text-ivory/60 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-white/5 px-3 py-2">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-gold-primary/30 bg-gold-primary/10 px-3 py-1 text-xs text-gold-light hover:bg-gold-primary/20"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {messages.length === 0 && (
                <p className="text-center text-sm text-ivory/50">
                  Ask anything about Ethiopia—culture, hotels, visas, or festivals.
                </p>
              )}
              {messages.map((m) => (
                <ChatMessageBubble key={m.id} message={m} />
              ))}
              {loading && (
                <p className="text-xs text-ivory/40">Habesha is thinking…</p>
              )}
              {error && <p className="text-xs text-red-300">{error}</p>}
            </div>

            <ChatInput onSend={send} disabled={loading} />

            <p className="border-t border-white/5 px-3 py-2 text-center text-[10px] text-ivory/35">
              Powered by Google Gemini
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
