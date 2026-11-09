import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProductBySlug } from "@/db/queries";
import { getSettings } from "@/lib/settings";
import { formatRupiah } from "@/lib/format";
import { CheckoutForm } from "@/components/public/CheckoutForm";
import { Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout pesanan",
  description: "Periksa pesanan dan isi data pemesan sebelum mengirim bill ke WhatsApp.",
};

type CheckoutSearchParams = Promise<{
  product?: string | string[];
  variant?: string | string[];
  quantity?: string | string[];
}>;

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: CheckoutSearchParams;
}) {
  const params = await searchParams;
  const slug = getSingleParam(params.product);
  if (!slug) redirect("/menu");

  const product = getProductBySlug(slug);
  if (!product) notFound();
  if (product.status === "soldout") redirect(`/menu/${product.slug}`);

  const requestedVariantId = getSingleParam(params.variant);
  const requestedVariantNumber = requestedVariantId ? Number(requestedVariantId) : undefined;
  const selectedVariant = product.variants.length
    ? requestedVariantNumber === undefined
      ? product.variants[0]
      : product.variants.find((variant) => variant.id === requestedVariantNumber)
    : undefined;

  // Pilihan varian yang tidak lagi valid dikembalikan ke detail agar harga terbaru dipilih ulang.
  if (product.variants.length && !selectedVariant) redirect(`/menu/${product.slug}`);

  const requestedQuantity = Number(getSingleParam(params.quantity) ?? "1");
  const quantity = Number.isInteger(requestedQuantity) && requestedQuantity >= 1 && requestedQuantity <= 99
    ? requestedQuantity
    : 1;
  const unitPrice = selectedVariant?.price ?? product.basePrice;
  const subtotal = unitPrice * quantity;
  const settings = getSettings();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-9 sm:px-6 sm:py-12">
      <header className="space-y-3">
        <Link href={`/menu/${product.slug}`} className="inline-flex min-h-11 items-center font-bold underline underline-offset-4">
          ← Kembali ke detail kue
        </Link>
        <div>
          <p className="text-sm font-bold text-ink/70">Pesananmu, tinggal selangkah lagi</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">Checkout pesanan</h1>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-8">
        <section
          aria-labelledby="order-summary-heading"
          className="order-1 rounded-[14px] border-3 border-ink bg-white p-4 shadow-[var(--shadow-brutal)] sm:p-6"
        >
          <h2 id="order-summary-heading" className="text-xl font-extrabold sm:text-2xl">Ringkasan pesanan</h2>
          <div className="mt-5 flex justify-between gap-4 border-b-2 border-ink/15 pb-4">
            <div className="min-w-0">
              <p className="font-extrabold">{product.name}</p>
              {selectedVariant && <p className="mt-1 text-sm text-ink/75">Varian: {selectedVariant.label}</p>}
              <p className="mt-1 text-sm text-ink/75">{quantity} pcs × {formatRupiah(unitPrice)}</p>
            </div>
            <p className="shrink-0 font-extrabold tabular-nums">{formatRupiah(subtotal)}</p>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt>Subtotal produk</dt>
              <dd className="font-bold tabular-nums">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Ongkir (jika dikirim)</dt>
              <dd className="text-right font-semibold">Dikonfirmasi via WhatsApp</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between gap-4 border-t-2 border-ink pt-4">
            <span className="font-extrabold">Total sementara</span>
            <span className="text-2xl font-black tabular-nums">{formatRupiah(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink/70">
            Ongkir belum masuk total dan akan dikonfirmasi toko sebelum pesanan disepakati.
          </p>
        </section>

        <section
          aria-labelledby="buyer-details-heading"
          className="order-2 rounded-[14px] border-3 border-ink bg-cream p-4 sm:p-6"
        >
          <h2 id="buyer-details-heading" className="mb-5 text-xl font-extrabold sm:text-2xl">Data pemesan</h2>
          <CheckoutForm
            productId={product.id}
            productName={product.name}
            variantLabel={selectedVariant?.label}
            quantity={quantity}
            unitPrice={unitPrice}
            subtotal={subtotal}
            whatsappNumber={settings.whatsapp_number}
            pickupAddress={settings.address}
          />
        </section>
      </div>

      <div className="text-center">
        <Button href={`/menu/${product.slug}`} variant="ghost" size="sm" className="bg-white">
          Ubah produk atau jumlah
        </Button>
      </div>
    </div>
  );
}
