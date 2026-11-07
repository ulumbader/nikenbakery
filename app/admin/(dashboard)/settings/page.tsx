import { SectionHeading, Card } from "@/components/ui";

export const metadata = {
  title: "Pengaturan Toko",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <SectionHeading
        title="Pengaturan Toko & Informasi Brand"
        description="Atur nama toko, kontak WhatsApp, jam operasional, dan info pengiriman."
      />
      <Card className="p-8 text-center bg-white">
        <span className="text-3xl block mb-2" aria-hidden="true">
          ⚙️
        </span>
        <h3 className="font-bold text-lg">Modul Pengaturan Segera Hadir</h3>
        <p className="text-sm text-ink/70 mt-1">
          Fitur form pengaturan toko dan jam operasional akan dibangun di Tahap 08.
        </p>
      </Card>
    </div>
  );
}
