import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getProductBySlug, listRelatedProducts } from "@/db/queries";
import { recordProductViewServer } from "@/lib/events";
import { ProductDetailClient } from "@/components/public/ProductDetailClient";
import { ProductCard } from "@/components/public/ProductCard";
import { SectionHeading } from "@/components/ui";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const settings = getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const description =
    product.description ||
    `Pesan ${product.name} lezat dari ${settings.business_name} via WhatsApp.`;

  const coverImage = product.images[0]?.fileName || `${siteUrl}/opengraph-image`;
  const fullImageUrl = coverImage.startsWith("http")
    ? coverImage
    : `${siteUrl}${coverImage}`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/menu/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | ${settings.business_name}`,
      description,
      url: `${siteUrl}/menu/${product.slug}`,
      type: "website",
      images: [
        {
          url: fullImageUrl,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${settings.business_name}`,
      description,
      images: [fullImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const settings = getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const relatedProducts = listRelatedProducts(product.id, 3);
  const { cookieHeaderValue } = await recordProductViewServer(product.id);

  // Structured Data (JSON-LD) Product Schema
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) =>
      img.fileName.startsWith("http") ? img.fileName : `${siteUrl}${img.fileName}`
    ),
    offers: {
      "@type": "Offer",
      price: product.basePrice,
      priceCurrency: "IDR",
      availability:
        product.status === "ready"
          ? "https://schema.org/InStock"
          : product.status === "preorder"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/OutOfStock",
      url: `${siteUrl}/menu/${product.slug}`,
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-16">
      {/* JSON-LD Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* ─── Detail Produk Interaktif ─── */}
      <ProductDetailClient
        product={product}
        whatsappNumber={settings.whatsapp_number}
        newViewCookie={cookieHeaderValue}
      />

      {/* ─── Produk Terkait (Rekomendasi) ─── */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t-3 border-ink space-y-8">
          <SectionHeading
            title="Kamu Mungkin Juga Suka"
            description="Pilihan kue lain yang sering dinikmati bersama oleh pelanggan kami."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard
                key={related.id}
                product={related}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
