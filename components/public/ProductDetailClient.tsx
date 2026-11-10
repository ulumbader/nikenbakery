"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/format";
import { buildWhatsAppLink, inquiryMessage } from "@/lib/whatsapp";
import { StatusBadge, PlaceholderCake, Badge, Button } from "@/components/ui";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { IconLink, IconCheck, IconWheat, IconAlert } from "@/components/ui/Icons";

export type ProductDetailData = {
  id: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  status: "ready" | "preorder" | "soldout";
  preorderNote?: string | null;
  ingredients?: string | null;
  allergens?: string | null;
  shopeeUrl?: string | null;
  shopeeEnabled: boolean;
  tokopediaUrl?: string | null;
  tokopediaEnabled: boolean;
  tiktokShopUrl?: string | null;
  tiktokShopEnabled: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
    color: string;
  } | null;
  variants: Array<{
    id: number;
    label: string;
    price: number;
    sortOrder: number;
  }>;
  images: Array<{
    id: number;
    fileName: string;
    thumbName: string;
    alt: string;
    isCover: boolean;
    sortOrder: number;
  }>;
};

interface ProductDetailClientProps {
  product: ProductDetailData;
  whatsappNumber: string;
  newViewCookie?: string;
}

function isSecureMarketplaceUrl(url: string | null | undefined): url is string {
  if (!url) return false;

  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export function ProductDetailClient({
  product,
  whatsappNumber,
  newViewCookie,
}: ProductDetailClientProps) {
  // State for selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants.length > 0 ? product.variants[0].id : null
  );

  // State for selected image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Jumlah pcs untuk satu produk yang dipilih.
  const [quantity, setQuantity] = useState(1);

  // State for share toast feedback
  const [shareToast, setShareToast] = useState(false);

  // Set dedupe cookie untuk view produk jika ada pembaruan
  useEffect(() => {
    if (newViewCookie && typeof document !== "undefined") {
      document.cookie = `nb_pv=${newViewCookie}; path=/; max-age=86400; SameSite=Lax`;
    }
  }, [newViewCookie]);

  // Active variant & price
  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );
  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.basePrice;

  // Produk habis tetap membuka WhatsApp untuk pertanyaan ketersediaan.
  const isSoldOut = product.status === "soldout";
  const waLink = isSoldOut
    ? buildWhatsAppLink(
        whatsappNumber,
        inquiryMessage({ productName: product.name })
      )
    : undefined;

  const checkoutParams = new URLSearchParams({
    product: product.slug,
    quantity: String(quantity),
  });
  if (selectedVariant) checkoutParams.set("variant", String(selectedVariant.id));
  const checkoutHref = `/checkout?${checkoutParams.toString()}`;

  const buttonLabel = isSoldOut ? "Tanya via WhatsApp" : "Pesan via WhatsApp";
  const buttonVariant = isSoldOut ? "ghost" : "wa";

  const marketplaceCandidates: Array<{
    name: string;
    url: string | null | undefined;
    enabled: boolean;
    accent: string;
  }> = [
    {
      name: "Shopee",
      url: product.shopeeUrl,
      enabled: product.shopeeEnabled,
      accent: "bg-[#EE4D2D] text-white",
    },
    {
      name: "Tokopedia",
      url: product.tokopediaUrl,
      enabled: product.tokopediaEnabled,
      accent: "bg-[#B7F3C8] text-ink",
    },
    {
      name: "TikTok Shop",
      url: product.tiktokShopUrl,
      enabled: product.tiktokShopEnabled,
      accent: "bg-ink text-white",
    },
  ];
  const marketplaceLinks = marketplaceCandidates.filter(
    (marketplace): marketplace is typeof marketplace & { url: string } =>
      marketplace.enabled && isSecureMarketplaceUrl(marketplace.url)
  );

  // Share handler
  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Niken Bakery`,
          text: `Lihat ${product.name} yang lezat ini di Niken Bakery!`,
          url,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        if ((err as Error).name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    } catch {
      // Fallback prompt if clipboard fails
      prompt("Salin tautan kue ini:", url);
    }
  }

  const categoryColor =
    product.category?.color &&
    ["pink", "butter", "mint", "lavender"].includes(product.category.color)
      ? (product.category.color as "pink" | "butter" | "mint" | "lavender")
      : "butter";

  const activeImage =
    product.images.length > 0 ? product.images[selectedImageIndex] : null;

  return (
    <div className="space-y-6 sm:space-y-12">
      {/* ─── Breadcrumb / Navigasi Balik ─── */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink hover:underline bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[8px] border-2 border-ink shadow-[var(--shadow-brutal-sm)]"
        >
          <span>←</span>
          <span>Kembali ke semua menu</span>
        </Link>
      </nav>

      {/* ─── Konten Utama: 2 Kolom ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12">
        {/* Kolom Kiri: Galeri Foto */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-[10px] sm:rounded-[14px] border-2 sm:border-3 border-ink bg-cream overflow-hidden shadow-[var(--shadow-brutal-sm)] sm:shadow-[var(--shadow-brutal)]">
            {activeImage ? (
              <Image
                src={activeImage.fileName}
                alt={activeImage.alt || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <PlaceholderCake
                color={categoryColor}
                className="w-full h-full rounded-none border-0"
              />
            )}
            <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10">
              <StatusBadge
                status={product.status}
                preorderNote={product.preorderNote ?? undefined}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Strip Thumbnail (jika lebih dari 1 gambar) */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-[8px] border-2 overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                    selectedImageIndex === idx
                      ? "border-ink ring-2 sm:ring-3 ring-ink scale-105"
                      : "border-ink/50 hover:border-ink opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Lihat foto ${idx + 1}`}
                >
                  <Image
                    src={img.thumbName || img.fileName}
                    alt={img.alt || `${product.name} foto ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Informasi & Pemesanan */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          {/* Header Produk */}
          <div className="space-y-1 sm:space-y-2">
            {product.category && (
              <Badge color={categoryColor} className="text-[10px] sm:text-xs uppercase">
                {product.category.name}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Harga Produk */}
          <div className="p-3 sm:p-4 bg-white border-2 sm:border-3 border-ink rounded-[10px] sm:rounded-[12px] shadow-[var(--shadow-brutal-sm)] flex items-baseline justify-between">
            <span className="text-xs sm:text-sm font-semibold text-ink/70">
              {selectedVariant ? "Harga varian:" : "Harga:"}
            </span>
            <span className="tabular-nums font-extrabold text-xl sm:text-2xl md:text-3xl text-ink">
              {formatRupiah(currentPrice)}
            </span>
          </div>

          {/* Pemilih Varian (bila ada) */}
          {product.variants.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-extrabold text-ink">
                Pilih Ukuran / Varian:
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-2 sm:p-3 rounded-[8px] sm:rounded-[10px] border-2 text-left flex flex-col justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-butter border-ink shadow-[var(--shadow-brutal-sm)] translate-x-[1px] translate-y-[1px]"
                          : "bg-white border-ink/40 hover:border-ink"
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm text-ink line-clamp-1">
                        {v.label}
                      </span>
                      <span className="tabular-nums text-[10px] sm:text-xs font-semibold text-ink/80 mt-0.5 sm:mt-1">
                        {formatRupiah(v.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!isSoldOut && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border-2 border-ink bg-white p-3 sm:p-4 shadow-[var(--shadow-brutal-sm)]">
              <div>
                <label className="block text-sm font-extrabold" id="quantity-label">
                  Jumlah (pcs)
                </label>
                <span className="text-xs text-ink/70">Maksimal 99 pcs per pesanan</span>
              </div>
              <div className="flex items-center gap-2" aria-labelledby="quantity-label">
                <button
                  type="button"
                  aria-label="Kurangi jumlah"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  className="min-h-11 min-w-11 rounded-full border-2 border-ink bg-cream text-xl font-black shadow-[var(--shadow-brutal-sm)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:cursor-not-allowed disabled:opacity-45"
                >
                  −
                </button>
                <output className="min-w-10 text-center text-lg font-extrabold tabular-nums" aria-live="polite">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label="Tambah jumlah"
                  onClick={() => setQuantity((current) => Math.min(99, current + 1))}
                  disabled={quantity >= 99}
                  className="min-h-11 min-w-11 rounded-full border-2 border-ink bg-butter text-xl font-black shadow-[var(--shadow-brutal-sm)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:cursor-not-allowed disabled:opacity-45"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {!isSoldOut && (
            <div className="flex items-baseline justify-between gap-3 px-1" aria-live="polite">
              <span className="text-sm font-semibold text-ink/75">Subtotal produk</span>
              <span className="text-xl font-extrabold tabular-nums">{formatRupiah(currentPrice * quantity)}</span>
            </div>
          )}

          {/* Tombol Pesan (Desktop) & Bagikan */}
          <div className="hidden md:flex flex-col gap-3 pt-2">
            {isSoldOut && waLink ? (
              <WhatsAppButton
                href={waLink}
                productId={product.id}
                label={buttonLabel}
                variant={buttonVariant}
                size="lg"
                className="w-full text-base font-extrabold shadow-[var(--shadow-brutal)]"
              />
            ) : (
              <Button
                href={checkoutHref}
                variant="wa"
                size="lg"
                className="w-full text-base font-extrabold shadow-[var(--shadow-brutal)]"
              >
                {buttonLabel}
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={handleShare}
              className="w-full text-sm font-bold border-2 bg-white hover:bg-cream"
            >
              <IconLink className="w-4 h-4 text-ink" />
              <span>Bagikan Kue Ini</span>
            </Button>
          </div>

          {/* Toast feedback saat tautan disalin */}
          {shareToast && (
            <div
              role="status"
              className="p-3 bg-mint text-ink font-bold text-sm border-2 border-ink rounded-[8px] shadow-[var(--shadow-brutal-sm)] text-center animate-fade-in flex items-center justify-center gap-2"
            >
              <IconCheck className="w-4 h-4 text-ink" />
              <span>Tautan kue berhasil disalin ke clipboard!</span>
            </div>
          )}

          {marketplaceLinks.length > 0 && (
            <section aria-labelledby="marketplace-heading" className="space-y-2">
              <h2 id="marketplace-heading" className="text-sm font-extrabold">
                Beli lewat marketplace
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {marketplaceLinks.map((marketplace) => (
                  <a
                    key={marketplace.name}
                    href={marketplace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Beli ${product.name} di ${marketplace.name} (buka tab baru)`}
                    className="min-h-11 flex items-center justify-between gap-2 rounded-[8px] border-3 border-ink bg-white px-3 py-2 text-sm font-extrabold shadow-[var(--shadow-brutal-sm)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink focus-visible:ring-offset-2"
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className={`grid h-7 w-7 place-items-center rounded-full border-2 border-ink text-[10px] ${marketplace.accent}`}>
                        {marketplace.name === "TikTok Shop" ? "T" : marketplace.name[0]}
                      </span>
                      Beli di {marketplace.name}
                    </span>
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
                      <path d="M11 3h6v6M17 3l-8 8M15 11v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Deskripsi & Keterangan Bahan */}
          <div className="space-y-4 pt-4 border-t-2 border-ink/10">
            {product.description && (
              <div>
                <h3 className="font-bold text-base mb-1">Deskripsi</h3>
                <p className="text-sm md:text-base text-ink/85 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.ingredients && (
              <div className="bg-white border-2 border-ink rounded-[10px] p-4 shadow-[var(--shadow-brutal-sm)]">
                <h3 className="font-bold text-sm mb-1 text-ink flex items-center gap-1.5">
                  <IconWheat className="w-4 h-4 text-ink" />
                  <span>Komposisi & Bahan:</span>
                </h3>
                <p className="text-xs md:text-sm text-ink/80 leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}

            {product.allergens && (
              <div className="bg-pink/20 border-2 border-ink rounded-[10px] p-4">
                <h3 className="font-bold text-sm mb-1 text-danger flex items-center gap-1.5">
                  <IconAlert className="w-4 h-4 text-danger" />
                  <span>Informasi Alergen:</span>
                </h3>
                <p className="text-xs text-ink/90 leading-relaxed">
                  {product.allergens}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile Sticky Action Bar (Hanya di mobile, Frosted Glass) ─── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass !border-x-0 !border-b-0 border-t-3 border-ink !rounded-none !shadow-[0_-4px_0_#2B1B17]"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))",
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-ink/70 block truncate">
              {product.name}
              {selectedVariant ? ` (${selectedVariant.label})` : ""}
            </span>
            <span className="tabular-nums font-extrabold text-lg text-ink leading-tight block">
              {formatRupiah(currentPrice * (isSoldOut ? 1 : quantity))}
            </span>
          </div>

          {isSoldOut && waLink ? (
            <WhatsAppButton
              href={waLink}
              productId={product.id}
              label={buttonLabel}
              variant={buttonVariant}
              size="default"
              className="flex-shrink-0 text-sm font-bold shadow-none py-2 px-4"
            />
          ) : (
            <Button
              href={checkoutHref}
              variant="wa"
              size="default"
              className="flex-shrink-0 text-sm font-bold shadow-none py-2 px-4"
            >
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
