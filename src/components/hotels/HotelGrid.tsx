import type { Hotel } from "@/types";
import { HotelCard } from "./HotelCard";

type Props = {
  hotels: Hotel[];
  onOpen?: (h: Hotel) => void;
};

export function HotelGrid({ hotels, onOpen }: Props) {
  return (
    <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
      {hotels.map((h) => (
        <div key={h.id} className="break-inside-avoid">
          <HotelCard hotel={h} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}
