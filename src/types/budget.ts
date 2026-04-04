export interface BudgetInput {
  days: number;
  travelStyle: "budget" | "mid" | "luxury";
  cities: string[];
  groupSize: number;
  includeFlights: boolean;
  fromCity: string;
  fromCountry: string;
  activities: string[];
}

export interface BudgetBreakdown {
  accommodation: { perNight: number; total: number; notes: string };
  food: { perDay: number; total: number; notes: string };
  transport: { internal: number; international?: number; notes: string };
  activities: { total: number; items: { name: string; cost: number }[] };
  miscellaneous: { total: number; notes: string };
  grandTotal: number;
  grandTotalETB: number;
  perPersonTotal: number;
  tips: string[];
}
