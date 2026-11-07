import { SectionHeading, Card } from "@/components/ui";

export const metadata = {
  title: "Kelola Produk",
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <SectionHeading
        title="Manajemen Produk"
        description="Kelola katalog kue, varian harga, foto, dan status stok."
      />
      <Card className="p-8 text-center bg-white">
        <span className="text-3xl block mb-2" aria-hidden="true">
          🍰
        </span>
        <h3 className="font-bold text-lg">Modul Produk Segera Hadir</h3>
        <p className="text-sm text-ink/70 mt-1">
          Fitur lengkap CRUD produk, varian, dan upload foto akan dibangun di Tahap 07.
        </p>
      </Card>
    </div>
  );
}
