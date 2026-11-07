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
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
