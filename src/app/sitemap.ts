import { NextResponse } from "next/server";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethiopia-visit.vercel.app";

const paths = [
  "",
  "/hotels",
  "/explore",
  "/planner",
  "/culture",
  "/cuisine",
  "/festivals",
  "/visa",
  "/emergency",
  "/virtual-tours",
  "/seasonal",
  "/stories",
  "/ar",
  "/budget",
  "/community",
  "/guides",
  "/guides/become-a-guide",
  "/experiences",
];

export async function GET() {
  const urls = paths
    .map(
      (p) => `
  <url>
    <loc>${base}${p}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === "" ? 1 : 0.8}</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}