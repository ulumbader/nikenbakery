import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { listCategories, listProducts } from "@/db/queries";
import { ProductCard } from "@/components/public/ProductCard";
import { SearchInput } from "@/components/public/SearchInput";
import { CategoryPills } from "@/components/public/CategoryPills";
import { SectionHeading, EmptyState, IconClose } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menu Koleksi Kue",
  description:
    "Jelajahi pilihan kue lezat, brownies, cookies, dan pastry dari Niken Bakery. Pesan langsung via WhatsApp!",
};

interface MenuPageProps {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
  }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedParams = await searchParams;
  const currentCategorySlug = resolvedParams.kategori;
  const currentQuery = resolvedParams.q;

  const settings = getSettings();
  const categories = listCategories();
  const products = listProducts({
    categorySlug: currentCategorySlug,
    q: currentQuery,
  });

  const activeCategory = categories.find((c) => c.slug === currentCategorySlug);
  const hasActiveFilters = Boolean(currentCategorySlug || currentQuery);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 sm:py-10 md:py-16 space-y-4 sm:space-y-8">
      {/* ─── Header Menu ─── */}
      <div className="space-y-3 sm:space-y-4">
        <SectionHeading
          title="Koleksi Menu Niken Bakery"
          description="Semua kue dibuat fresh setiap hari dari bahan pilihan premium. Pilih kue favoritmu dan pesan langsung via WhatsApp!"
          className="mb-0"
        />

        {/* ─── Pencarian & Filter Kategori ─── */}
        <div className="pt-2 sm:pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          <SearchInput initialValue={currentQuery} />
          <CategoryPills
            categories={categories}
            currentCategorySlug={currentCategorySlug}
            currentQuery={currentQuery}
          />
        </div>

        {/* ─── Bar Status Hasil & Reset ─── */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-1 sm:pt-2 text-xs sm:text-sm border-b-2 border-ink/10 pb-3 sm:pb-4">
          <p className="font-semibold text-ink/80">
            Menampilkan <span className="text-ink font-bold">{products.length}</span>{" "}
            kue
            {activeCategory && (
              <span>
                {" "}
                dalam kategori{" "}
                <span className="font-bold underline text-ink">
                  {activeCategory.name}
                </span>
              </span>
            )}
            {currentQuery && (
              <span>
                {" "}
                untuk kata kunci &ldquo;
                <span className="font-bold text-ink">{currentQuery}</span>&rdquo;
              </span>
            )}
          </p>

          {hasActiveFilters && (
            <Link
              href="/menu"
              className="text-[11px] sm:text-xs font-bold text-danger hover:underline inline-flex items-center gap-1 bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 border-2 border-ink rounded-[6px] shadow-[var(--shadow-brutal-sm)]"
            >
              <IconClose className="w-3 h-3" />
              <span>Reset filter</span>
            </Link>
          )}
        </div>
      </div>

      {/* ─── Grid Produk ─── */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 pt-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings.whatsapp_number}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal)]">
          <EmptyState
            title="Yah, belum ada kue yang cocok"
            description="Coba kata kunci pencarian lain atau pilih kategori kue lainnya, yuk!"
            actionLabel="Lihat Semua Menu"
            actionHref="/menu"
          />
        </div>
      )}
    </main>
  );
}
