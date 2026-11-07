import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Niken Bakery — Katalog Kue UMKM & Order via WhatsApp",
    template: "%s | Niken Bakery",
  },
  description:
    "Katalog kue lezat Niken Bakery. Pilihan cake, brownies, dan pastry istimewa yang siap memeriahkan momenmu. Pesan langsung via WhatsApp tanpa ribet!",
  keywords: [
    "kue ulang tahun",
    "brownies",
    "cheesecake",
    "niken bakery",
    "bakery umkm",
    "pesan kue whatsapp",
    "kue segar",
  ],
  authors: [{ name: "Niken Bakery" }],
  creator: "Niken Bakery",
  publisher: "Niken Bakery",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Niken Bakery",
    title: "Niken Bakery — Katalog Kue UMKM & Order via WhatsApp",
    description:
      "Koleksi kue lezat dari Niken Bakery. Pilih kue favoritmu dan pesan langsung via WhatsApp tanpa ribet!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niken Bakery — Katalog Kue UMKM & Order via WhatsApp",
    description:
      "Koleksi kue lezat dari Niken Bakery. Pilih kue favoritmu dan pesan langsung via WhatsApp!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
