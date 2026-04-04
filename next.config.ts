import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com",          pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com",            pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com",            pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org",         pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com",           pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com",    pathname: "/**" },
      { protocol: "https", hostname: "*.cloudfront.net",             pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos",                pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  turbopack: {
    // Silences the "workspace root" warning when there's a package-lock.json higher up
    root: __dirname,
  },
};

export default nextConfig;
