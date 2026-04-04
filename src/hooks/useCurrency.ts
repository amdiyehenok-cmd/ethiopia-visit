import { useQuery } from "@tanstack/react-query";

interface CurrencyData {
  base: string;
  etb: number;
  updated: string;
  rates: Record<string, number>;
}

export function useCurrency(base = "USD") {
  return useQuery<CurrencyData>({
    queryKey: ["currency", base],
    queryFn: async () => {
      const res = await fetch(`/api/currency?base=${base}`);
      if (!res.ok) throw new Error("Currency fetch failed");
      return res.json();
    },
    staleTime: 1000 * 60 * 60,      // 1 hour
    gcTime:    1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}
