import type { MetadataRoute } from "next";

// Use a public environment variable for your site URL
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethiopia-visit.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}