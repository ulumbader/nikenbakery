import Link from "next/link";
import { db } from "@/db";
import { products, categories, banners, testimonials } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { SectionHeading, Card } from "@/components/ui";

export const metadata = {
  title: "Ringkasan",
};

export default function AdminOverviewPage() {
  const totalProducts = db.select({ value: count() }).from(products).get()?.value ?? 0;
  const readyProducts = db
    .select({ value: count() })
    .from(products)
    .where(eq(products.status, "ready"))
    .get()?.value ?? 0;
  const totalCategories = db.select({ value: count() }).from(categories).get()?.value ?? 0;
  const activeBanners = db
    .select({ value: count() })
    .from(banners)
    .where(eq(banners.isActive, true))
    .get()?.value ?? 0;
  const totalTestimonials = db
    .select({ value: count() })
    .from(testimonials)
    .get()?.value ?? 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
          Panel Manajemen
        </span>
        <SectionHeading
          title="Ringkasan Dashboard"
          description="Pantau status katalog, promosi, dan konten toko Niken Bakery secara langsung."
          className="mb-0"
        />
      </div>

      {/* ─── Grid Statistik Cepat ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 space-y-2">
          <span className="text-xs font-bold uppercase text-ink/70">
            Total Produk
          </span>
          <div className="text-3xl md:text-4xl font-extrabold text-ink tabular-nums">
            {totalProducts}
          </div>
          <span className="text-xs text-mint font-bold block">
            {readyProducts} produk status Ready
          </span>
        </Card>

        <Card className="p-4 md:p-6 space-y-2">
          <span className="text-xs font-bold uppercase text-ink/70">
            Kategori
          </span>
          <div className="text-3xl md:text-4xl font-extrabold text-ink tabular-nums">
            {totalCategories}
          </div>
          <span className="text-xs text-ink/60 font-semibold block">
            Koleksi aktif
          </span>
        </Card>

        <Card className="p-4 md:p-6 space-y-2">
          <span className="text-xs font-bold uppercase text-ink/70">
            Banner Promo
          </span>
          <div className="text-3xl md:text-4xl font-extrabold text-ink tabular-nums">
            {activeBanners}
          </div>
          <span className="text-xs text-pink font-bold block">
            Sedang tayang
          </span>
        </Card>

        <Card className="p-4 md:p-6 space-y-2">
          <span className="text-xs font-bold uppercase text-ink/70">
            Testimoni
          </span>
          <div className="text-3xl md:text-4xl font-extrabold text-ink tabular-nums">
            {totalTestimonials}
          </div>
          <span className="text-xs text-ink/60 font-semibold block">
            Ulasan pelanggan
          </span>
        </Card>
      </div>

      {/* ─── Akses Cepat Modul ─── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/admin/products">
            <Card interactive className="p-5 flex flex-col justify-between h-full bg-white">
              <div>
                <span className="text-2xl" aria-hidden="true">
                  🍰
                </span>
                <h3 className="font-extrabold text-base mt-2">Kelola Produk</h3>
                <p className="text-xs text-ink/70 mt-1">
                  Tambah kue baru, ubah harga, atau tandai stok habis.
                </p>
              </div>
              <span className="text-xs font-bold text-ink underline mt-4 block">
                Buka Produk →
              </span>
            </Card>
          </Link>

          <Link href="/admin/banners">
            <Card interactive className="p-5 flex flex-col justify-between h-full bg-white">
              <div>
                <span className="text-2xl" aria-hidden="true">
                  📢
                </span>
                <h3 className="font-extrabold text-base mt-2">Banner Promo</h3>
                <p className="text-xs text-ink/70 mt-1">
                  Atur pengumuman diskon dan banner spesial di beranda.
                </p>
              </div>
              <span className="text-xs font-bold text-ink underline mt-4 block">
                Buka Banner →
              </span>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card interactive className="p-5 flex flex-col justify-between h-full bg-white">
              <div>
                <span className="text-2xl" aria-hidden="true">
                  ⚙️
                </span>
                <h3 className="font-extrabold text-base mt-2">Pengaturan Toko</h3>
                <p className="text-xs text-ink/70 mt-1">
                  Ubah nomor WhatsApp, jam buka toko, dan alamat.
                </p>
              </div>
              <span className="text-xs font-bold text-ink underline mt-4 block">
                Buka Pengaturan →
              </span>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
