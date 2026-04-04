import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Replace placeholder in booking URLs with env affiliate ID (client-safe). */
export function bookingAffiliateUrl(url: string) {
  const aid =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_BOOKING_COM_AFFILIATE_ID ||
        process.env.BOOKING_COM_AFFILIATE_ID ||
        "YOUR_AFFILIATE_ID"
      : "YOUR_AFFILIATE_ID";
  return url.replace(/YOUR_AFFILIATE_ID/g, aid);
}
