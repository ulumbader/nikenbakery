import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/format";
import { buildWhatsAppLink, orderMessage, inquiryMessage } from "@/lib/whatsapp";
import { StatusBadge, PlaceholderCake } from "@/components/ui";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";

export type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  displayPrice: number;
  hasVariants: boolean;
  status: "ready" | "preorder" | "soldout";
  preorderNote?: string | null;
  coverImage?: {
    fileName: string;
    thumbName: string;
    alt: string;
  } | null;
  category?: {
    id: number;
    name: string;
    slug: string;
    color: string;
  } | null;
};

interface ProductCardProps {
  product: ProductCardData;
  whatsappNumber: string;
}

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const isSoldOut = product.status === "soldout";
  const waLink = isSoldOut
    ? buildWhatsAppLink(
        whatsappNumber,
        inquiryMessage({ productName: product.name })
      )
    : buildWhatsAppLink(
        whatsappNumber,
        orderMessage({ productName: product.name })
      );

  const categoryColor =
    product.category?.color &&
    ["pink", "butter", "mint", "lavender"].includes(product.category.color)
      ? (product.category.color as "pink" | "butter" | "mint" | "lavender")
      : "butter";

  return (
    <div
      data-testid="product-card"
      className="bg-white border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal)] flex flex-col h-full overflow-hidden transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutal-sm)]"
    >
      {/* Gambar / Placeholder */}
      <div className="relative aspect-[4/3] border-b-3 border-ink bg-cream overflow-hidden group">
        <Link
          href={`/menu/${product.slug}`}
          className="block w-full h-full focus-visible:outline-none"
          aria-label={`Lihat detail ${product.name}`}
        >
          {product.coverImage ? (
            <Image
              src={product.coverImage.thumbName || product.coverImage.fileName}
              alt={product.coverImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <PlaceholderCake
              color={categoryColor}
              className="w-full h-full rounded-none border-0 group-hover:scale-105 transition-transform duration-200"
            />
          )}
        </Link>
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <StatusBadge
            status={product.status}
            preorderNote={product.preorderNote ?? undefined}
          />
        </div>
      </div>

      {/* Konten Produk */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {product.category && (
            <span className="text-xs font-semibold text-ink/70 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}
          <h3 className="text-lg font-bold mt-1 line-clamp-1 hover:text-ink/80">
            <Link href={`/menu/${product.slug}`}>{product.name}</Link>
          </h3>
          {product.description && (
            <p className="text-sm text-ink/80 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Harga & Tombol Pesan */}
        <div className="pt-2 border-t-2 border-ink/10 flex flex-col gap-3">
          <div className="tabular-nums font-bold text-lg text-ink">
            {product.hasVariants ? (
              <span className="text-xs font-normal text-ink/70 block">
                Mulai dari
              </span>
            ) : null}
            <span>{formatRupiah(product.displayPrice)}</span>
          </div>

          <WhatsAppButton
            href={waLink}
            productId={product.id}
            variant={isSoldOut ? "ghost" : "wa"}
            size="default"
            className="w-full text-sm font-bold shadow-none hover:shadow-none"
            label={isSoldOut ? "Tanya via WhatsApp" : "Pesan via WhatsApp"}
          />
        </div>
      </div>
    </div>
  );
}
