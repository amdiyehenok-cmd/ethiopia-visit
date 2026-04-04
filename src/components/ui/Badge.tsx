import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gold-primary/30 bg-gold-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold-light",
        className,
      )}
    >
      {children}
    </span>
  );
}
