import { SectionHeading, Card } from "@/components/ui";

export const metadata = {
  title: "Kelola Kategori",
};

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <SectionHeading
        title="Kategori Produk"
        description="Kelola kategori dan urutan penataan kue di katalog."
      />
      <Card className="p-8 text-center bg-white">
        <span className="text-3xl block mb-2" aria-hidden="true">
          🏷️
        </span>
        <h3 className="font-bold text-lg">Modul Kategori Segera Hadir</h3>
        <p className="text-sm text-ink/70 mt-1">
          Fitur manajemen kategori dan pemilihan token warna akan dibangun di Tahap 07.
        </p>
      </Card>
    </div>
  );
}
