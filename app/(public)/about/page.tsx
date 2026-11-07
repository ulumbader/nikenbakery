import { SectionHeading } from "@/components/ui";

export const metadata = {
  title: "About Us",
  description: "Cerita, nilai, dan lokasi toko Niken Bakery.",
};

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading
        title="Tentang Niken Bakery"
        description="Cerita manis di balik setiap resep dan kreasi kue kami."
      />
      <div className="bg-white border-3 border-ink rounded-[14px] p-8 text-center shadow-[var(--shadow-brutal)]">
        <p className="text-lg font-bold">Cerita lengkap sedang ditulis ✨</p>
        <p className="text-sm text-ink/70 mt-2">
          Halaman ini akan terisi penuh di Tahap 05.
        </p>
      </div>
    </main>
  );
}
