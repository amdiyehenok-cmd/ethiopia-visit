import type { MetadataRoute } from "next";

const base = process.env.NEXTAUTH_URL ?? "https://ethiopia-visit.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
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
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
}
