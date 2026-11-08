import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconCakeSlice, IconHome } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream text-ink text-center">
      <div className="w-24 h-24 bg-butter border-3 border-ink rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-brutal)]">
        <IconCakeSlice className="w-12 h-12 text-ink" />
      </div>

      <span className="inline-block bg-pink text-ink font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-[6px] border-2 border-ink mb-3 shadow-[var(--shadow-brutal-sm)] -rotate-1">
        404 — Error
      </span>

      <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
        Kue Tidak Ditemukan
      </h1>

      <p className="text-base text-ink/80 max-w-md mb-8 leading-relaxed">
        Yah, kue atau halaman yang kamu cari tidak ada atau mungkin sudah habis.
        Yuk, cek koleksi kue lezat lainnya di menu kami!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/menu">
          <Button variant="primary" size="lg" className="shadow-[var(--shadow-brutal)] inline-flex items-center gap-1.5">
            <IconCakeSlice className="w-5 h-5 text-ink" />
            <span>Lihat Menu Kue</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="lg" className="border-2 bg-white hover:bg-cream inline-flex items-center gap-1.5">
            <IconHome className="w-5 h-5 text-ink" />
            <span>Kembali ke Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
