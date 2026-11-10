import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah Produk Baru | Admin Niken Bakery",
};

export default async function NewProductPage() {
  const categoryList = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));

  return (
    <div className="space-y-6">
      <div className="border-b-3 border-ink pb-4">
        <h1 className="font-heading text-2xl font-black uppercase text-ink md:text-3xl">
          Tambah Produk Baru
        </h1>
        <p className="mt-1 font-body text-sm text-ink/70">
          Isi informasi produk, varian harga, serta unggah foto katalog.
        </p>
      </div>

      <ProductForm categories={categoryList} />
    </div>
  );
}
