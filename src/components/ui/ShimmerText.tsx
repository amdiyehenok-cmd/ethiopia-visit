import { cn } from "@/lib/utils";

export function ShimmerText({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  return <Tag className={cn("shimmer-gold font-display", className)}>{children}</Tag>;
}
