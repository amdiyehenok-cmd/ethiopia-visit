import type { Metadata } from "next";
import { AdBanner } from "@/components/Ads/AdBanner";

export const metadata: Metadata = {
  title: "Culture & Heritage",
  description: "Orthodox traditions, coffee ceremony, music, and living heritage across Ethiopia.",
};

export default function CulturePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl text-gold-light">Culture</h1>
      <p className="mt-6 text-lg leading-relaxed text-ivory/75">
        Ethiopia is a mosaic of languages, faiths, and kingdoms. From the rock-hewn spirituality of
        the north to the diverse communities of the south, travelers encounter living traditions—coffee
        poured with grace, timkat processions, meskel fires, and jazz that never sleeps in Addis.
      </p>
      <div className="my-10">
        <AdBanner slot="culture-inline" />
      </div>
      <p className="text-ivory/70">
        Respectful photography, covering shoulders in churches, and learning a few Amharic greetings open
        doors. Pair cultural exploration with our{" "}
        <a href="/festivals" className="text-gold-primary hover:underline">
          festival calendar
        </a>{" "}
        and{" "}
        <a href="/hotels" className="text-gold-primary hover:underline">
          hand-picked hotels
        </a>
        .
      </p>
    </div>
  );
}
