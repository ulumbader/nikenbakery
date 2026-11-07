import { SectionHeading, Card } from "@/components/ui";

export const metadata = {
  title: "Kelola FAQ",
};

export default function AdminFaqsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <SectionHeading
        title="Daftar Pertanyaan Umum (FAQ)"
        description="Kelola pertanyaan dan jawaban yang tampil di halaman About Us."
      />
      <Card className="p-8 text-center bg-white">
        <span className="text-3xl block mb-2" aria-hidden="true">
          ❓
        </span>
        <h3 className="font-bold text-lg">Modul FAQ Segera Hadir</h3>
        <p className="text-sm text-ink/70 mt-1">
          Fitur tambah, edit, dan urutkan FAQ akan dibangun di Tahap 08.
        </p>
      </Card>
    </div>
  );
}
