"use client";

import { useEffect, useState } from "react";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.body.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[9998] hidden mix-blend-screen md:block"
      style={{
        left: pos.x,
        top: pos.y,
        width: 180,
        height: 180,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 0.35 : 0,
        background:
          "radial-gradient(circle, rgba(201,168,76,0.45) 0%, rgba(201,168,76,0) 70%)",
        transition: "opacity 0.2s ease",
      }}
    />
  );
}
