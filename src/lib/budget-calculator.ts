import type { BudgetBreakdown, BudgetInput } from "@/types/budget";

const STYLE_MULTIPLIERS = { budget: 1, mid: 2.5, luxury: 6 } as const;

const BASE_COSTS = {
  accommodation: { budget: 15, mid: 60, luxury: 180 },
  food: { budget: 8, mid: 25, luxury: 70 },
  localTransport: { budget: 5, mid: 20, luxury: 60 },
};

const ACTIVITY_COSTS: Record<string, number> = {
  "Lalibela Churches": 50,
  "Simien Trek (3 days)": 200,
  "Danakil Expedition": 450,
  "Omo Valley Tour": 180,
  "Coffee Ceremony": 15,
  "National Museum Addis": 5,
  "Fasil Ghebbi Gondar": 15,
  "Lake Tana Monasteries": 30,
  "Blue Nile Falls": 10,
  "Axum Stelae": 10,
};

function generateTips(style: BudgetInput["travelStyle"], input: BudgetInput): string[] {
  const tips: string[] = [];
  if (style === "budget") {
    tips.push("Use local guesthouses and eat where Ethiopians eat—injera feasts are delicious and affordable.");
    tips.push("Book long-distance buses a day ahead during peak season.");
  } else if (style === "mid") {
    tips.push("Mix domestic flights on Ethiopian Airlines with private drivers for flexibility.");
    tips.push("Reserve popular sites (Lalibela, Danakil) through reputable operators.");
  } else {
    tips.push("Private guides unlock after-hours access and smoother logistics at heritage sites.");
    tips.push("Consider charter flights between the north and the south to save days on the road.");
  }
  if (input.groupSize > 4) tips.push("Larger groups can negotiate better rates for vehicles and guides.");
  if (input.includeFlights) tips.push("International flights vary widely—track fares 2–3 months out.");
  if (input.cities.length > 3) tips.push("More cities means more internal transport—pad buffer days between regions.");
  return tips;
}

export function calculateBudget(input: BudgetInput): BudgetBreakdown {
  const style = input.travelStyle;
  const mult = STYLE_MULTIPLIERS[style];
  const accPerNight = BASE_COSTS.accommodation[style];
  const rooms = Math.ceil(input.groupSize / 2);
  const accommodationTotal = accPerNight * input.days * rooms;
  const foodTotal = BASE_COSTS.food[style] * input.days * input.groupSize;
  const localTransport = BASE_COSTS.localTransport[style] * input.days * input.groupSize;
  const cityHops =
    Math.max(0, input.cities.length - 1) * (style === "luxury" ? 120 : style === "mid" ? 60 : 25);
  const activityTotal = input.activities.reduce(
    (sum, act) => sum + (ACTIVITY_COSTS[act] ?? 20) * input.groupSize,
    0,
  );
  const sub =
    accommodationTotal + foodTotal + localTransport + cityHops + activityTotal;
  const misc = sub * 0.1;
  const grandTotal = sub + misc;
  const etbRate = 57.5;

  return {
    accommodation: {
      perNight: accPerNight,
      total: Math.round(accommodationTotal),
      notes:
        style === "budget"
          ? "Guesthouses, hostels"
          : style === "mid"
            ? "3-star hotels"
            : "4–5 star hotels",
    },
    food: {
      perDay: BASE_COSTS.food[style],
      total: Math.round(foodTotal),
      notes:
        style === "budget"
          ? "Local injera restaurants"
          : style === "mid"
            ? "Mix of local and international"
            : "Fine dining",
    },
    transport: {
      internal: Math.round(localTransport + cityHops),
      international: input.includeFlights ? Math.round(800 * mult * input.groupSize) : undefined,
      notes:
        style === "budget"
          ? "Buses and shared minibuses"
          : style === "mid"
            ? "Private car hire"
            : "Domestic flights + private driver",
    },
    activities: {
      total: Math.round(activityTotal),
      items: input.activities.map((a) => ({
        name: a,
        cost: Math.round((ACTIVITY_COSTS[a] ?? 20) * input.groupSize),
      })),
    },
    miscellaneous: {
      total: Math.round(misc),
      notes: "Tips, souvenirs, visas, travel insurance",
    },
    grandTotal: Math.round(grandTotal + (input.includeFlights ? 800 * mult * input.groupSize : 0)),
    grandTotalETB: Math.round(
      (grandTotal + (input.includeFlights ? 800 * mult * input.groupSize : 0)) * etbRate,
    ),
    perPersonTotal: Math.round(
      (grandTotal + (input.includeFlights ? 800 * mult * input.groupSize : 0)) / input.groupSize,
    ),
    tips: generateTips(style, input),
  };
}
