import type { NextConfig } from "next";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.test" });
const supabaseUrls = [process.env.SUPABASE_URL, process.env.E2E_SUPABASE_URL].filter(
  (url): url is string => Boolean(url)
);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: supabaseUrls.map((url) =>
      new URL("/storage/v1/object/public/nikenbakery-media/**", url)
    ),
  },
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
