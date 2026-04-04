import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sampleGuides } from "@/data/guides";
import { BookExperienceButton } from "@/components/guides/BookExperienceButton";

type Props = { params: Promise<{ id: string }> };

function findExperience(id: string) {
  for (const g of sampleGuides) {
    for (let i = 0; i < g.experiences.length; i++) {
      if (`${g.id}-exp-${i}` === id) {
        return { guide: g, exp: g.experiences[i], index: i };
      }
    }
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hit = findExperience(id);
  if (!hit) return { title: "Experience" };
  return { title: `${hit.exp.title} | Experiences` };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { id } = await params;
  const hit = findExperience(id);
  if (!hit) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-white/10">
        <Image src={hit.guide.coverPhoto} alt="" fill className="object-cover" sizes="960px" />
      </div>
      <p className="mt-6 text-xs uppercase tracking-widest text-gold-primary/90">{hit.exp.category}</p>
      <h1 className="font-display text-4xl text-ivory md:text-5xl">{hit.exp.title}</h1>
      <p className="mt-2 text-ivory/65">
        With {hit.guide.name} · {hit.guide.city}
      </p>
      <p className="mt-6 text-ivory/80">
        {hit.guide.bio.slice(0, 280)}
        …
      </p>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div>
          <p className="text-sm text-ivory/50">From</p>
          <p className="font-display text-4xl text-gold-light">${hit.exp.price}</p>
          <p className="text-xs text-ivory/45">per person · ~{hit.exp.duration} hours</p>
        </div>
        <BookExperienceButton id={id} />
      </div>
      <p className="mt-4 text-xs text-ivory/40">
        Demo endpoint returns JSON. Connect Stripe Checkout + <code>GuideBooking</code> for production.
      </p>
      <Link href={`/guides/${hit.guide.id}`} className="mt-8 inline-block text-gold-primary hover:underline">
        ← Guide profile
      </Link>
    </div>
  );
}
