import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "gold" | "outline";
  type?: "button" | "submit";
};

export function GoldButton({
  children,
  href,
  onClick,
  className,
  variant = "gold",
  type = "button",
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-wide transition-all duration-300";
  const styles =
    variant === "gold"
      ? "btn-gold text-obsidian shadow-lg shadow-gold-primary/20"
      : "border border-gold-primary/50 bg-white/5 text-ivory backdrop-blur-xl hover:border-gold-primary hover:bg-white/10";

  if (href) {
    return (
      <Link href={href} className={cn(base, styles, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cn(base, styles, className)}>
      {children}
    </button>
  );
}
