import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
