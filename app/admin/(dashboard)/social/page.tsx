import { SectionHeading, Card } from "@/components/ui";

export const metadata = {
  title: "Media Sosial",
};

export default function AdminSocialPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <SectionHeading
        title="Kurasi Media Sosial"
        description="Kelola postingan Instagram dan TikTok yang tampil di website."
      />
      <Card className="p-8 text-center bg-white">
        <span className="text-3xl block mb-2" aria-hidden="true">
          📸
        </span>
        <h3 className="font-bold text-lg">Modul Media Sosial Segera Hadir</h3>
        <p className="text-sm text-ink/70 mt-1">
          Fitur input post Instagram & TikTok kurasi akan dibangun di Tahap 08.
        </p>
      </Card>
    </div>
  );
}
