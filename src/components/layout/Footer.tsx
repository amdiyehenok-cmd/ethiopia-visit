import Link from "next/link";

const footerLinks = [
  { href: "/explore", label: "Destinations" },
  { href: "/hotels", label: "Hotels" },
  { href: "/planner", label: "AI Planner" },
  { href: "/visa", label: "Visa" },
  { href: "/emergency", label: "Emergency" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050506]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl text-gold-light">Ethiopia Visit</p>
          <p className="mt-2 max-w-sm text-sm text-ivory/60">
            Ultra-luxury Ethiopian tourism—crafted itineraries, curated stays, and Habesha AI at your side.
          </p>
        </div>
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-primary/80">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ivory/70">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-primary/80">
              Social
            </p>
            <ul className="mt-3 flex gap-4 text-sm text-ivory/70">
              <li>
                <a href="https://instagram.com" className="hover:text-gold-light" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" className="hover:text-gold-light" rel="noreferrer">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} Ethiopia Visit. All rights reserved.
      </div>
    </footer>
  );
}
