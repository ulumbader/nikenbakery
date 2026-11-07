import { SectionHeading } from "@/components/ui";

export const metadata = {
  title: "Menu",
  description: "Daftar koleksi kue lezat dari Niken Bakery.",
};

export default function MenuPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading
        title="Koleksi Menu Kue"
        description="Pilihan cake, brownies, cookies, dan pastry segar setiap hari."
      />
      <div className="bg-white border-3 border-ink rounded-[14px] p-8 text-center shadow-[var(--shadow-brutal)]">
        <p className="text-lg font-bold">Katalog lengkap sedang dipersiapkan ✨</p>
        <p className="text-sm text-ink/70 mt-2">
          Halaman ini akan terisi penuh di Tahap 04.
        </p>
      </div>
    </main>
  );
}
