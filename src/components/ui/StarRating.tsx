export function StarRating({ stars, className }: { stars: number; className?: string }) {
  return (
    <div className={className} aria-label={`${stars} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < stars ? "text-gold-primary" : "text-white/20"}>
          ★
        </span>
      ))}
    </div>
  );
}
