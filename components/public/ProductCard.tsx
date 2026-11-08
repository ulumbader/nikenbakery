import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/format";
import { Button, StatusBadge, PlaceholderCake, IconShoppingBag } from "@/components/ui";

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
  whatsappNumber?: string;
}

export function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = product.status === "soldout";

  const categoryColor =
    product.category?.color &&
    ["pink", "butter", "mint", "lavender"].includes(product.category.color)
      ? (product.category.color as "pink" | "butter" | "mint" | "lavender")
      : "butter";

  return (
    <div
      data-testid="product-card"
      className="bg-white border-2 sm:border-3 border-ink rounded-[10px] sm:rounded-[14px] shadow-[var(--shadow-brutal-sm)] sm:shadow-[var(--shadow-brutal)] flex flex-col h-full overflow-hidden transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
    >
      {/* Gambar / Placeholder */}
      <div className="relative aspect-[4/3] border-b-2 sm:border-b-3 border-ink bg-cream overflow-hidden group">
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
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <PlaceholderCake
              color={categoryColor}
              className="w-full h-full rounded-none border-0 group-hover:scale-105 transition-transform duration-200"
            />
          )}
        </Link>
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10 pointer-events-none">
          <StatusBadge
            status={product.status}
            preorderNote={product.preorderNote ?? undefined}
            className="text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0 sm:py-0.5 rounded-[5px] sm:rounded-[8px] border-[1.5px] sm:border-2"
          />
        </div>
      </div>

      {/* Konten Produk */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-3">
        <div>
          {product.category && (
            <span className="text-[10px] sm:text-xs font-semibold text-ink/70 uppercase tracking-wide block truncate">
              {product.category.name}
            </span>
          )}
          <h3 className="text-xs sm:text-lg font-bold mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-1 hover:text-ink/80 leading-snug">
            <Link href={`/menu/${product.slug}`}>{product.name}</Link>
          </h3>
          {product.description && (
            <p className="hidden sm:block text-sm text-ink/80 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Harga & Tombol Beli */}
        <div className="pt-1.5 sm:pt-2 border-t sm:border-t-2 border-ink/10 flex flex-col gap-1.5 sm:gap-3">
          <div className="tabular-nums font-bold text-xs sm:text-lg text-ink leading-tight">
            {product.hasVariants ? (
              <span className="text-[10px] sm:text-xs font-normal text-ink/70 block">
                Mulai dari
              </span>
            ) : null}
            <span>{formatRupiah(product.displayPrice)}</span>
          </div>

          <Button
            href={`/menu/${product.slug}`}
            variant={isSoldOut ? "ghost" : "primary"}
            size="default"
            className="w-full text-xs sm:text-sm font-extrabold shadow-[var(--shadow-brutal-sm)] hover:shadow-none min-h-[36px] sm:min-h-[42px] py-1.5 sm:py-2 px-3 flex items-center justify-center gap-1.5"
            aria-label={isSoldOut ? `Lihat detail ${product.name}` : `Beli ${product.name}`}
          >
            <IconShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{isSoldOut ? "Lihat Detail" : "Beli"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
