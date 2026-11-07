import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getProductBySlug, listRelatedProducts } from "@/db/queries";
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
    return {
      title: "Kue Tidak Ditemukan",
    };
  }

  const settings = getSettings();
  const description =
    product.description ||
    `Pesan ${product.name} lezat dari ${settings.business_name} via WhatsApp.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | ${settings.business_name}`,
      description,
      type: "website",
      images: product.images[0] ? [product.images[0].fileName] : [],
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
  const relatedProducts = listRelatedProducts(product.id, 3);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-16">
      {/* ─── Detail Produk Interaktif ─── */}
      <ProductDetailClient
        product={product}
        whatsappNumber={settings.whatsapp_number}
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
    </main>
  );
}
