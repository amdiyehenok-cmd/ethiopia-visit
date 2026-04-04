"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-3xl text-gold-light">Something went wrong</h1>
      <p className="mt-4 text-sm text-ivory/60">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="btn-gold mt-8 rounded-full px-8 py-3 text-sm font-semibold"
      >
        Try again
      </button>
    </div>
  );
}
