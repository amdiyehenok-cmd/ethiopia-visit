import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { dishes, restaurants } from "@/data/cuisine";
import { ShimmerText } from "@/components/ui/ShimmerText";

export const metadata: Metadata = {
  title: "Ethiopian Cuisine",
  description: "Injera, doro wat, kitfo, tej — discover Ethiopia's extraordinary culinary traditions.",
};

export default function CuisinePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-dark-1 to-obsidian py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 40% 50%, #c9a84c 0%, transparent 55%), radial-gradient(circle at 70% 60%, #bf1b2c 0%, transparent 45%)" }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <ShimmerText className="text-5xl md:text-7xl" as="h1">Ethiopian Cuisine</ShimmerText>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/60">
            Injera as edible plate. Berbere as poetry. Coffee as ceremony. Ethiopia invented flavour.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        {/* Featured hero dish */}
        <div className="relative mb-16 aspect-[21/7] w-full overflow-hidden rounded-3xl border border-white/10">
          <Image
            src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1400&q=85"
            alt="Ethiopian injera feast"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16">
            <p className="text-xs uppercase tracking-widest text-gold-primary">The foundation</p>
            <h2 className="mt-2 font-display text-5xl text-ivory md:text-7xl">Injera</h2>
            <p className="mt-3 max-w-sm text-ivory/70">
              Sour, spongy, and magnificent. Injera is not just bread — it&apos;s the communal plate, the utensil, and the canvas for every dish.
            </p>
          </div>
        </div>

        {/* Dish grid */}
        <h2 className="mb-8 font-display text-4xl text-gold-light">Essential dishes</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((d) => (
            <article key={d.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-2xl text-ivory">{d.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ivory/65">{d.description}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Coffee section */}
        <div className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=85"
              alt="Ethiopian coffee ceremony"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-primary">Origin story</p>
            <h2 className="mt-2 font-display text-5xl text-ivory">Coffee was born here</h2>
            <p className="mt-4 leading-relaxed text-ivory/70">
              Legend says a goat herder named Kaldi first discovered coffee&apos;s energizing properties in the Ethiopian highlands — around 850 AD. Ethiopia remains the genetic home of arabica coffee.
            </p>
            <p className="mt-3 leading-relaxed text-ivory/70">
              The coffee ceremony — <em className="text-gold-light">buna</em> — is a social ritual of three cups: abol (strong), tona (medium), baraka (the blessing). Each visit takes 45 minutes minimum. You will be late. You will not care.
            </p>
            <Link href="/guides" className="mt-6 inline-flex items-center gap-2 text-sm text-gold-primary hover:underline">
              Book a coffee ceremony tour →
            </Link>
          </div>
        </div>

        {/* Restaurants */}
        <div className="mt-20">
          <h2 className="font-display text-4xl text-gold-light">Recommended restaurants</h2>
          <p className="mt-2 text-sm text-ivory/50">Where to eat like a local</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-display text-2xl text-ivory">{r.name}</h3>
                <p className="text-sm text-gold-light">{r.city}</p>
                <p className="mt-1 text-sm text-ivory/60">{r.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
