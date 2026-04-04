"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  {
    label: "Explore",
    items: [
      { href: "/explore", label: "Smart map & destinations" },
      { href: "/seasonal", label: "Seasonal guide" },
    ],
  },
  {
    label: "Experience",
    items: [
      { href: "/virtual-tours", label: "VR Tours", badge: "NEW" },
      { href: "/stories", label: "Cultural stories" },
      { href: "/ar", label: "AR mode", badge: "BETA" },
    ],
  },
  {
    label: "Hotels & guides",
    items: [
      { href: "/hotels", label: "Hotels" },
      { href: "/guides", label: "Local guides", badge: "NEW" },
      { href: "/experiences", label: "Experiences" },
    ],
  },
  {
    label: "Plan",
    items: [
      { href: "/planner", label: "AI planner" },
      { href: "/budget", label: "Budget estimator" },
      { href: "/culture", label: "Culture" },
      { href: "/cuisine", label: "Cuisine" },
      { href: "/festivals", label: "Festivals" },
    ],
  },
];

const flat = [
  { href: "/community", label: "Community" },
  { href: "/visa", label: "Visa" },
  { href: "/emergency", label: "Emergency" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("ev-nav-highlight");
    if (!seen) {
      localStorage.setItem("ev-nav-highlight", "1");
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0b]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="font-display text-2xl font-semibold tracking-tight md:text-3xl"
            style={{
              background: "linear-gradient(105deg, #B8972E, #F5D083, #E8C96A, #C9A84C)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Ethiopia Visit
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((g) => (
            <div
              key={g.label}
              className="relative"
              onMouseEnter={() => setOpenGroup(g.label)}
              onMouseLeave={() => setOpenGroup(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-ivory/80 transition hover:bg-white/5 hover:text-gold-light"
              >
                {g.label}
                <span className="text-[10px] text-ivory/40">▾</span>
              </button>
              <AnimatePresence>
                {openGroup === g.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-white/10 bg-[#0a0a0b]/95 py-2 shadow-2xl backdrop-blur-xl"
                  >
                    {g.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between gap-4 px-4 py-2 text-sm text-ivory/85 hover:bg-white/5 hover:text-gold-light"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-gold-primary/20 px-2 py-0.5 text-[10px] font-semibold text-gold-light">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {flat.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-ivory/80 transition hover:text-gold-light"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-lg border border-white/15 p-2 text-ivory lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-ivory" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ivory" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-dark-1/98 lg:hidden"
          >
            <div className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto px-4 py-4">
              {nav.map((g) => (
                <div key={g.label}>
                  <p className="text-xs uppercase tracking-widest text-gold-primary/70">{g.label}</p>
                  <div className="mt-2 flex flex-col gap-2 pl-2">
                    {g.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-ivory/90"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                        {item.badge ? ` · ${item.badge}` : ""}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {flat.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-ivory/90"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
