import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel builds its own serverless output; retain standalone for self-hosted Docker.
  output: process.env.VERCEL === "1" ? undefined : "standalone",
  // Development assets can be requested from devices on the same 192.168.x.x LAN.
  allowedDevOrigins: ["192.168.*.*"],
  experimental: {
    agentFeedback: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
