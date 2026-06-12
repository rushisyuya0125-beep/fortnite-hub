import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fortnite-api.com",
      },
      {
        protocol: "https",
        hostname: "*.fortnite-api.com",
      },
      {
        protocol: "https",
        hostname: "cdn-live.prm.ol.epicgames.com",
      },
      {
        protocol: "https",
        hostname: "*.epicgames.com",
      },
      {
        protocol: "https",
        hostname: "cdn2.unrealengine.com",
      },
      {
        protocol: "https",
        hostname: "*.unrealengine.com",
      },
    ],
  },
};

export default nextConfig;
