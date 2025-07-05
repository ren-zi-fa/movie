import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rebahinxxi.b-cdn.net",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;