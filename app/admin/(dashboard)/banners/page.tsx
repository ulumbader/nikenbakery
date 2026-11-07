import { SectionHeading, Card } from "@/components/ui";

export const metadata = {
  title: "Banner Promo",
};

export default function AdminBannersPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <SectionHeading
        title="Banner Promo"
        description="Atur pengumuman promo spesial di halaman beranda."
      />
      <Card className="p-8 text-center bg-white">
        <span className="text-3xl block mb-2" aria-hidden="true">
          📢
        </span>
        <h3 className="font-bold text-lg">Modul Banner Promo Segera Hadir</h3>
        <p className="text-sm text-ink/70 mt-1">
          Fitur pengaturan banner dan jadwal tayang akan dibangun di Tahap 08.
        </p>
      </Card>
    </div>
  );
}
