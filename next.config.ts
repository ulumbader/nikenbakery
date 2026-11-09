import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Development assets can be requested from devices on the same 192.168.x.x LAN.
  allowedDevOrigins: ["192.168.*.*"],
  experimental: {
    agentFeedback: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
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
