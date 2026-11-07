import { notFound } from "next/navigation";
import {
  Button,
  Card,
  Badge,
  Sticker,
  StatusBadge,
  Pill,
  GlassPanel,
  Marquee,
  SectionHeading,
  Input,
  Select,
  Textarea,
  PlaceholderCake,
  EmptyState,
} from "@/components/ui";
import { formatRupiah, formatDate } from "@/lib/format";

export const metadata = {
  title: "Styleguide",
};

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-[clamp(3rem,10vw,7rem)] mb-4">Styleguide</h1>
      <p className="text-lg mb-16 max-w-[70ch]">
        Referensi visual design system Niken Bakery. Halaman ini hanya muncul di development.
      </p>

      {/* ─── Palet ─── */}
      <Section title="Palet warna">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ColorSwatch name="cream" hex="#FFF4E0" className="bg-cream" />
          <ColorSwatch name="ink" hex="#2B1B17" className="bg-ink text-cream" />
          <ColorSwatch name="pink" hex="#FF8FAB" className="bg-pink" />
          <ColorSwatch name="butter" hex="#FFD93D" className="bg-butter" />
          <ColorSwatch name="mint" hex="#8EE3C8" className="bg-mint" />
          <ColorSwatch name="lavender" hex="#C9B6FF" className="bg-lavender" />
          <ColorSwatch name="wa" hex="#25D366" className="bg-wa" />
          <ColorSwatch name="danger" hex="#FF5A4E" className="bg-danger" />
        </div>
      </Section>

      {/* ─── Tipografi ─── */}
      <Section title="Tipografi">
        <div className="space-y-4">
          <h1 className="text-[clamp(3rem,10vw,7rem)]">Heading 1 — Hero</h1>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)]">Heading 2 — Section</h2>
          <h3 className="text-2xl">Heading 3 — Subsection</h3>
          <p className="text-base max-w-[70ch]">
            Body text — Niken Bakery menyajikan kue-kue lezat untuk setiap momen spesialmu.
            Font body: Figtree, 400–700. Panjang baris maksimal sekitar 70 karakter.
          </p>
          <p className="text-sm">Small text — keterangan, label, caption.</p>
          <p className="tabular-nums text-lg font-semibold">
            Harga: {formatRupiah(45000)} · {formatRupiah(125000)} · {formatRupiah(1500000)}
          </p>
          <p className="text-base">Tanggal: {formatDate(new Date())}</p>
        </div>
      </Section>

      {/* ─── Shadow ─── */}
      <Section title="Shadow brutal">
        <div className="flex flex-wrap gap-6">
          <div className="w-24 h-24 bg-white border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal-sm)] flex items-center justify-center text-sm font-semibold">
            sm
          </div>
          <div className="w-24 h-24 bg-white border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal)] flex items-center justify-center text-sm font-semibold">
            md
          </div>
          <div className="w-24 h-24 bg-white border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal-lg)] flex items-center justify-center text-sm font-semibold">
            lg
          </div>
        </div>
      </Section>

      {/* ─── Button ─── */}
      <Section title="Button">
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="wa">Pesan via WhatsApp</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Hapus</Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="default">Default</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
        <div className="mt-4">
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </Section>

      {/* ─── Card ─── */}
      <Section title="Card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          <Card>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2">Card biasa</h3>
              <p className="text-sm">Border 3px, radius 14px, shadow brutal.</p>
            </div>
          </Card>
          <Card interactive>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2">Card interaktif</h3>
              <p className="text-sm">Hover: geser + shadow mengecil.</p>
            </div>
          </Card>
        </div>
      </Section>

      {/* ─── Badge & Sticker ─── */}
      <Section title="Badge & Sticker">
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge color="pink">Pink</Badge>
          <Badge color="butter">Butter</Badge>
          <Badge color="mint">Mint</Badge>
          <Badge color="lavender">Lavender</Badge>
          <Badge color="danger">Danger</Badge>
          <Badge color="ink">Ink</Badge>
        </div>
        <div className="flex flex-wrap gap-4">
          <Sticker color="pink">Bestseller!</Sticker>
          <Sticker color="butter" rotate={false}>Baru</Sticker>
          <Sticker color="mint">Promo</Sticker>
        </div>
      </Section>

      {/* ─── StatusBadge ─── */}
      <Section title="StatusBadge">
        <div className="flex flex-wrap gap-3">
          <StatusBadge status="ready" />
          <StatusBadge status="preorder" preorderNote="H-2" />
          <StatusBadge status="soldout" />
        </div>
      </Section>

      {/* ─── Pill ─── */}
      <Section title="Pill (filter)">
        <div className="flex flex-wrap gap-3">
          <Pill color="butter" active>Semua</Pill>
          <Pill color="pink">Kue Ulang Tahun</Pill>
          <Pill color="mint">Kue Kering</Pill>
          <Pill color="lavender">Brownies</Pill>
        </div>
      </Section>

      {/* ─── GlassPanel ─── */}
      <Section title="GlassPanel">
        <div className="relative rounded-[14px] overflow-hidden">
          {/* Background color block for glass demo */}
          <div className="bg-gradient-to-br from-pink to-butter p-8 md:p-12 min-h-[200px] flex items-center justify-center">
            <GlassPanel className="max-w-md">
              <h3 className="text-lg font-bold mb-2">Panel frosted glass</h3>
              <p className="text-sm">
                Glass hanya untuk elemen melayang di atas konten berwarna/foto.
                Tetap memakai border tebal dan hard shadow.
              </p>
            </GlassPanel>
          </div>
        </div>
      </Section>

      {/* ─── Marquee ─── */}
      <Section title="Marquee">
        <Marquee>
          <span className="text-lg font-bold">🎂 Kue segar setiap hari</span>
          <span className="text-lg font-bold">🍰 Pesan sekarang!</span>
          <span className="text-lg font-bold">✨ Niken Bakery</span>
          <span className="text-lg font-bold">🧁 Dibuat dengan cinta</span>
        </Marquee>
      </Section>

      {/* ─── SectionHeading ─── */}
      <Section title="SectionHeading">
        <SectionHeading
          title="Kue andalan kami"
          description="Dipilih dari koleksi favorit pelanggan setia Niken Bakery."
        />
      </Section>

      {/* ─── Form Fields ─── */}
      <Section title="Form fields">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          <Input label="Nama produk" placeholder="Contoh: Red Velvet" />
          <Input label="Harga" type="number" placeholder="45000" />
          <Input label="Dengan error" error="Nama wajib diisi" />
          <Select
            label="Kategori"
            options={[
              { value: "", label: "Pilih kategori" },
              { value: "birthday", label: "Kue Ulang Tahun" },
              { value: "pastry", label: "Pastry" },
            ]}
          />
          <div className="sm:col-span-2">
            <Textarea label="Deskripsi" placeholder="Tulis deskripsi produk..." />
          </div>
        </div>
      </Section>

      {/* ─── PlaceholderCake ─── */}
      <Section title="PlaceholderCake">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
          <PlaceholderCake color="pink" />
          <PlaceholderCake color="butter" />
          <PlaceholderCake color="mint" />
          <PlaceholderCake color="lavender" />
        </div>
      </Section>

      {/* ─── EmptyState ─── */}
      <Section title="EmptyState">
        <EmptyState
          title="Belum ada kue"
          description="Yah, belum ada kue di kategori ini. Coba kategori lain, yuk."
          actionLabel="Lihat semua"
          actionHref="/menu"
        />
      </Section>
    </main>
  );
}

/* ─── Helper components ─── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b-3 border-ink">{title}</h2>
      {children}
    </section>
  );
}

function ColorSwatch({
  name,
  hex,
  className,
}: {
  name: string;
  hex: string;
  className: string;
}) {
  return (
    <div
      className={`border-3 border-ink rounded-[8px] p-4 flex flex-col justify-end min-h-[100px] ${className}`}
    >
      <span className="font-bold">{name}</span>
      <span className="text-sm font-mono">{hex}</span>
    </div>
  );
}

