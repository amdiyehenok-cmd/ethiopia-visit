"use client";

import { motion } from "framer-motion";

const events = [
  { y: "300 BCE", t: "Aksumite trade networks expand across the Red Sea." },
  { y: "331 AD", t: "Christianity deepens its roots in the Ethiopian highlands." },
  { y: "12th C", t: "Lalibela’s rock churches are carved—a new Jerusalem in stone." },
  { y: "1896", t: "Adwa—Ethiopian forces defeat colonial invasion; sovereignty endures." },
  { y: "Today", t: "A living tapestry of languages, faiths, and landscapes." },
];

export function HistoricalTimeline() {
  return (
    <div className="relative border-l border-gold-primary/30 pl-8">
      {events.map((e, i) => (
        <motion.div
          key={e.y}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-gold-primary/90">{e.y}</p>
          <p className="mt-1 text-ivory/80">{e.t}</p>
        </motion.div>
      ))}
    </div>
  );
}
