import Link from "next/link";
import Image from "next/image";
import { getAnalyticsSummary } from "@/db/queries/events";
import { Card, Button } from "@/components/ui";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import {
  IconParty,
  IconClipboard,
  IconCheck,
  IconCake,
  IconMegaphone,
  IconSettings,
  IconFolder,
} from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ringkasan & Analitik | Admin Niken Bakery",
};

export default function AdminOverviewPage() {
  const { stats, topViewedProducts, topWaClickProducts, chart14Days, checklist } =
    getAnalyticsSummary();

  const completedChecklistCount = checklist.filter((item) => item.isComplete).length;
  const isAllChecklistComplete = completedChecklistCount === checklist.length;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ─── Header Sambutan ─── */}
      <div className="border-b-3 border-ink pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-ink/60 block">
            Panel Pemilik Toko
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-black uppercase text-ink">
            Ringkasan Dashboard
          </h1>
          <p className="mt-1 font-body text-sm text-ink/70">
            Pantau aktivitas pelanggan, performa katalog kue, dan kelengkapan profil tokomu.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button href="/admin/products/new" variant="primary" size="sm">
            + Tambah Produk
          </Button>
        </div>
      </div>

      {/* ─── Checklist Kelengkapan Konten Toko ─── */}
      <Card
        className={`p-5 border-3 border-ink shadow-hard space-y-4 ${
          isAllChecklistComplete ? "bg-mint/30" : "bg-butter/30"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              {isAllChecklistComplete ? (
                <IconParty className="w-5 h-5 text-ink" />
              ) : (
                <IconClipboard className="w-5 h-5 text-ink" />
              )}
              <h2 className="font-heading text-base font-black uppercase text-ink">
                Checklist Kelengkapan Toko
              </h2>
            </div>
            <p className="text-xs text-ink/70 mt-0.5">
              {isAllChecklistComplete
                ? "Semua informasi penting toko sudah lengkap dan siap menyambut pelanggan!"
                : "Lengkapi data toko berikut agar pelanggan mudah menemukan dan memesan kue."}
            </p>
          </div>

          <div className="text-xs font-black text-ink shrink-0">
            {completedChecklistCount} dari {checklist.length} Lengkap
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white rounded-[8px] border-2 border-ink flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black shrink-0 ${
                      item.isComplete ? "bg-mint text-ink" : "bg-danger text-white"
                    }`}
                  >
                    {item.isComplete ? <IconCheck className="w-3 h-3 text-ink" /> : "!"}
                  </span>
                  <span className="font-heading font-black text-xs text-ink truncate">
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-ink/70 mt-1 line-clamp-1">
                  {item.hint}
                </p>
              </div>

              {!item.isComplete && (
                <Link
                  href={item.actionUrl}
                  className="shrink-0 px-2.5 py-1 text-[11px] font-black uppercase rounded-[6px] border border-ink bg-butter text-ink hover:bg-butter/80 transition-colors"
                >
                  {item.actionLabel} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ─── 4 Kartu Metrik Ringkas ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kunjungan Produk 7 Hari */}
        <Card className="p-4 bg-white border-3 border-ink shadow-hard space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-ink/60 block">
            Kunjungan Produk (7 Hari)
          </span>
          <div className="font-heading text-3xl font-black text-ink tabular-nums">
            {stats.productViews7d}
          </div>
          <span className="text-[11px] font-bold text-ink/60 block">
            {stats.productViews30d} views dalam 30 hari
          </span>
        </Card>

        {/* Klik WhatsApp 7 Hari */}
        <Card className="p-4 bg-white border-3 border-ink shadow-hard space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-ink/60 block">
            Klik WhatsApp (7 Hari)
          </span>
          <div className="font-heading text-3xl font-black text-mint tabular-nums">
            {stats.waClicks7d}
          </div>
          <span className="text-[11px] font-bold text-ink/60 block">
            {stats.waClicks30d} klik dalam 30 hari
          </span>
        </Card>

        {/* Produk Aktif */}
        <Card className="p-4 bg-white border-3 border-ink shadow-hard space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-ink/60 block">
            Produk Aktif
          </span>
          <div className="font-heading text-3xl font-black text-ink tabular-nums">
            {stats.activeProducts}
          </div>
          <span className="text-[11px] font-bold text-ink/60 block">
            Tayang di katalog publik
          </span>
        </Card>

        {/* Produk Habis */}
        <Card className="p-4 bg-white border-3 border-ink shadow-hard space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-ink/60 block">
            Stok Habis
          </span>
          <div className="font-heading text-3xl font-black text-danger tabular-nums">
            {stats.soldOutProducts}
          </div>
          <span className="text-[11px] font-bold text-ink/60 block">
            Perlu restock / update status
          </span>
        </Card>
      </div>

      {/* ─── Grafik Tren Aktivitas 14 Hari ─── */}
      <Card className="p-6 bg-white border-3 border-ink shadow-hard">
        <AnalyticsChart data={chart14Days} />
      </Card>

      {/* ─── Top 5 Produk (Views & Klik WA) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Produk Dilihat */}
        <Card className="p-5 bg-white border-3 border-ink shadow-hard space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <h2 className="font-heading text-base font-black uppercase text-ink">
              Top 5 Produk Sering Dilihat
            </h2>
            <span className="text-[11px] font-bold text-ink/60">30 Hari</span>
          </div>

          {topViewedProducts.length === 0 ? (
            <p className="text-xs text-ink/60 italic py-4 text-center">
              Belum ada data kunjungan produk.
            </p>
          ) : (
            <div className="divide-y divide-ink/10">
              {topViewedProducts.map((p, idx) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-heading font-black text-xs text-ink/40 w-4 text-center">
                      #{idx + 1}
                    </span>

                    <div className="relative w-9 h-9 rounded-[6px] border border-ink overflow-hidden bg-cream shrink-0 flex items-center justify-center">
                      {p.coverUrl ? (
                        <Image
                          src={p.coverUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <IconCake className="w-4 h-4 text-ink/40" />
                      )}
                    </div>

                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-xs font-bold text-ink hover:underline truncate"
                    >
                      {p.name}
                    </Link>
                  </div>

                  <span className="text-xs font-black text-ink shrink-0 tabular-nums">
                    {p.count} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top 5 Produk Klik WA */}
        <Card className="p-5 bg-white border-3 border-ink shadow-hard space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <h2 className="font-heading text-base font-black uppercase text-ink">
              Top 5 Produk Paling Diminati
            </h2>
            <span className="text-[11px] font-bold text-ink/60">Klik WA (30 Hari)</span>
          </div>

          {topWaClickProducts.length === 0 ? (
            <p className="text-xs text-ink/60 italic py-4 text-center">
              Belum ada data klik pemesanan WhatsApp.
            </p>
          ) : (
            <div className="divide-y divide-ink/10">
              {topWaClickProducts.map((p, idx) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-heading font-black text-xs text-ink/40 w-4 text-center">
                      #{idx + 1}
                    </span>

                    <div className="relative w-9 h-9 rounded-[6px] border border-ink overflow-hidden bg-cream shrink-0 flex items-center justify-center">
                      {p.coverUrl ? (
                        <Image
                          src={p.coverUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <IconCake className="w-4 h-4 text-ink/40" />
                      )}
                    </div>

                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-xs font-bold text-ink hover:underline truncate"
                    >
                      {p.name}
                    </Link>
                  </div>

                  <span className="text-xs font-black text-mint shrink-0 tabular-nums">
                    {p.count} klik WA
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ─── Pintasan Aksi Cepat ─── */}
      <div className="space-y-3">
        <h2 className="font-heading text-base font-black uppercase text-ink">
          Pintasan Aksi Cepat
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/products/new"
            className="p-4 rounded-[10px] border-3 border-ink bg-white shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex flex-col justify-between"
          >
            <IconCake className="w-7 h-7 text-ink mb-2 block" />
            <span className="text-xs font-black uppercase text-ink">
              + Tambah Produk Baru
            </span>
          </Link>

          <Link
            href="/admin/banners"
            className="p-4 rounded-[10px] border-3 border-ink bg-white shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex flex-col justify-between"
          >
            <IconMegaphone className="w-7 h-7 text-ink mb-2 block" />
            <span className="text-xs font-black uppercase text-ink">
              Atur Promo Banner
            </span>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 rounded-[10px] border-3 border-ink bg-white shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex flex-col justify-between"
          >
            <IconSettings className="w-7 h-7 text-ink mb-2 block" />
            <span className="text-xs font-black uppercase text-ink">
              Edit Pengaturan Toko
            </span>
          </Link>

          <Link
            href="/admin/categories"
            className="p-4 rounded-[10px] border-3 border-ink bg-white shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex flex-col justify-between"
          >
            <IconFolder className="w-7 h-7 text-ink mb-2 block" />
            <span className="text-xs font-black uppercase text-ink">
              Kelola Kategori
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
