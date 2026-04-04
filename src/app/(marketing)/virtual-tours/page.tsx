import type { Metadata } from "next";
import { VRToursSection } from "@/components/vr/VRToursSection";
import { GoldButton } from "@/components/ui/GoldButton";

export const metadata: Metadata = {
  title: "360° Virtual Tours of Ethiopia",
  description:
    "Experience Lalibela, Simien Mountains, Danakil Depression, and Addis Ababa in immersive 360° virtual reality—free online tours.",
  openGraph: {
    title: "Ethiopia 360° Virtual Tours | Ethiopia Visit",
    description: "Immersive 360° tours of Lalibela, Simien, Danakil, and more.",
  },
};

export default function VirtualToursPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="text-center">
        <p className="text-5xl">🥽</p>
        <h1 className="mt-4 font-display text-5xl text-gold-light md:text-6xl">
          Experience Ethiopia Before You Arrive
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-ivory/65">
          Pannellum-powered equirectangular panoramas with hotspots and optional browser narration—no headset
          required.
        </p>
      </div>
      <div className="mt-14">
        <VRToursSection />
      </div>
      <div className="mt-20 rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
        <h2 className="font-display text-3xl text-ivory">Ready to visit for real?</h2>
        <p className="mt-2 text-sm text-ivory/55">Curated stays across Ethiopia—with tracked Booking affiliate links.</p>
        <GoldButton href="/hotels" className="mt-6">
          Book a hotel →
        </GoldButton>
      </div>
      <p className="mt-8 text-center text-xs text-ivory/40">
        Panorama sources: Wikimedia Commons (CC / public domain where noted). Attribution on individual assets.
      </p>
    </div>
  );
}
