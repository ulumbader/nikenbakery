import { SectionHeading, Card } from "@/components/ui";

export const metadata = {
  title: "Testimoni Pelanggan",
};

export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <SectionHeading
        title="Testimoni Pelanggan"
        description="Kelola ulasan dan apresiasi dari pembeli kue."
      />
      <Card className="p-8 text-center bg-white">
        <span className="text-3xl block mb-2" aria-hidden="true">
          ⭐
        </span>
        <h3 className="font-bold text-lg">Modul Testimoni Segera Hadir</h3>
        <p className="text-sm text-ink/70 mt-1">
          Fitur moderasi testimoni dan rating bintang akan dibangun di Tahap 08.
        </p>
      </Card>
    </div>
  );
}
