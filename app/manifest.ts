import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Niken Bakery",
    short_name: "NikenBakery",
    description: "Katalog kue lezat Niken Bakery. Pesan langsung via WhatsApp tanpa ribet!",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF4E0",
    theme_color: "#FFD93D",
    icons: [
      {
        src: "/icons/pwa-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

