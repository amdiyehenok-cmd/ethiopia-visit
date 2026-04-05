import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://ethiopia-visit.vercel.app";

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

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));
}