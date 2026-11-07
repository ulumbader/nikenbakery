import { SectionHeading } from "@/components/ui";

export const metadata = {
  title: "Social",
  description: "Aktivitas seru dan kreasi kue di dapur Niken Bakery.",
};

export default function SocialPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading
        title="Dapur & Media Sosial"
        description="Ikuti proses pembuatan kue dan update menu terbaru dari kami."
      />
      <div className="bg-white border-3 border-ink rounded-[14px] p-8 text-center shadow-[var(--shadow-brutal)]">
        <p className="text-lg font-bold">Galeri kurasi media sosial segera hadir ✨</p>
        <p className="text-sm text-ink/70 mt-2">
          Halaman ini akan terisi penuh di Tahap 05.
        </p>
      </div>
    </main>
  );
}
