import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for Cloudflare Pages / any static host.
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
