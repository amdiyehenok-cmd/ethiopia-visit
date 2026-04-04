"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

export function BookExperienceButton({ id }: { id: string }) {
  const [msg, setMsg] = useState<string | null>(null);

  async function book() {
    const res = await fetch("/api/experiences/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experienceId: id }),
    });
    const json = await res.json();
    setMsg(json.message ?? "OK");
  }

  return (
    <div>
      <GoldButton type="button" onClick={book} className="justify-center">
        Request booking (demo)
      </GoldButton>
      {msg && <p className="mt-2 text-xs text-ivory/55">{msg}</p>}
    </div>
  );
}
