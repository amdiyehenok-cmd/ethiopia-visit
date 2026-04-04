"use client";

import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  function submit() {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  }

  return (
    <div className="flex gap-2 border-t border-white/10 p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ask Habesha AI…"
        disabled={disabled}
        className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-gold-primary/50"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-gold-primary px-4 py-2 text-sm font-semibold text-obsidian disabled:opacity-40"
      >
        Send
      </button>
    </div>
  );
}
