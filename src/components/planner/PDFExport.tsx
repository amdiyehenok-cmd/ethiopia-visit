"use client";

import { jsPDF } from "jspdf";
import type { PlannerResult } from "@/types";

export function PDFExport({ data }: { data: PlannerResult }) {
  function exportPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 48;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(data.title, 48, y);
    y += 28;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(data.summary, 500);
    doc.text(summaryLines, 48, y);
    y += summaryLines.length * 14 + 20;

    doc.setFontSize(10);
    doc.text(`Total est.: $${data.totalEstimatedCost}`, 48, y);
    y += 16;
    doc.text(data.bestTimeToVisit, 48, y);
    y += 16;
    doc.text(data.visaNote, 48, y);
    y += 28;

    for (const d of data.days) {
      if (y > 720) {
        doc.addPage();
        y = 48;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${d.day} — ${d.title}`, 48, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.text(d.location, 48, y);
      y += 14;
      const block = [
        `Morning: ${d.morning}`,
        `Afternoon: ${d.afternoon}`,
        `Evening: ${d.evening}`,
        `Stay: ${d.accommodation.name} (${d.accommodation.priceRange})`,
        `Tips: ${d.tips}`,
      ].join("\n");
      const lines = doc.splitTextToSize(block, 500);
      doc.text(lines, 48, y);
      y += lines.length * 12 + 20;
    }

    doc.save(`${data.title.replace(/\s+/g, "_")}.pdf`);
  }

  return (
    <button
      type="button"
      onClick={exportPdf}
      className="btn-gold rounded-full px-6 py-2 text-sm font-semibold text-obsidian"
    >
      Export PDF
    </button>
  );
}
