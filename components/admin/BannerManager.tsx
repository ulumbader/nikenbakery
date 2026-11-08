"use client";

import { useState, useTransition, useActionState, useRef } from "react";
import Image from "next/image";
import {
  createBannerAction,
  updateBannerAction,
  toggleBannerActiveAction,
  reorderBannerAction,
  deleteBannerAction,
} from "@/actions/banners";
import { Button, Card, Badge } from "@/components/ui";
import { type TokenColor, COLORS } from "@/db/schema";

export interface BannerItem {
  id: number;
  title: string;
  subtitle: string | null;
  imageFile: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  color: TokenColor;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  sortOrder: number;
}

export interface BannerCategoryOption {
  id: number;
  name: string;
  slug: string;
}

interface BannerManagerProps {
  initialBanners: BannerItem[];
  categories?: BannerCategoryOption[];
}

function formatDateForInput(d?: Date | null): string {
  if (!d) return "";
  const date = new Date(d);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function BannerManager({
  initialBanners,
  categories = [],
}: BannerManagerProps) {
  const [currentTime] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  // State untuk pemilih Link Tujuan Tombol (Internal vs Eksternal)
  const [linkType, setLinkType] = useState<"internal" | "external">("internal");
  const [internalUrl, setInternalUrl] = useState<string>("/menu");
  const [externalUrl, setExternalUrl] = useState<string>("");

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleOpenCreate() {
    setEditingBanner(null);
    setImagePreview(null);
    setRemoveCurrentImage(false);
    setLinkType("internal");
    setInternalUrl("/menu");
    setExternalUrl("");
    setIsFormOpen(true);
  }

  function handleOpenEdit(b: BannerItem) {
    setEditingBanner(b);
    setImagePreview(b.imageFile);
    setRemoveCurrentImage(false);

    const rawUrl = b.ctaUrl?.trim() ?? "/menu";
    const isExternal =
      rawUrl.startsWith("http://") ||
      rawUrl.startsWith("https://") ||
      rawUrl.startsWith("//");

    if (isExternal) {
      setLinkType("external");
      setExternalUrl(rawUrl);
      setInternalUrl("/menu");
    } else {
      setLinkType("internal");
      setInternalUrl(rawUrl || "/menu");
      setExternalUrl("");
    }

    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingBanner(null);
    setImagePreview(null);
    setRemoveCurrentImage(false);
    setLinkType("internal");
    setInternalUrl("/menu");
    setExternalUrl("");
  }

  function handleToggleActive(id: number, current: boolean) {
    startTransition(async () => {
      const res = await toggleBannerActiveAction(id, !current);
      if (res?.success) {
        showToast("Status banner berhasil diperbarui!");
      }
    });
  }

  function handleReorder(id: number, direction: "up" | "down") {
    startTransition(async () => {
      await reorderBannerAction(id, direction);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      const res = await deleteBannerAction(id);
      if (res?.success) {
        showToast("Banner berhasil dihapus!");
        setDeleteId(null);
      }
    });
  }

  const [, formAction, isSubmitting] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      if (removeCurrentImage) {
        formData.set("removeImage", "true");
      }
      const action = editingBanner ? updateBannerAction : createBannerAction;
      const res = await action(null, formData);
      if (res?.error) {
        return res;
      }
      showToast(editingBanner ? "Banner berhasil diperbarui!" : "Banner baru berhasil dibuat!");
      handleCloseForm();
      return null;
    },
    null
  );

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[10px] border-3 border-ink bg-mint px-4 py-3 font-heading font-black text-ink shadow-hard transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-3 border-ink pb-4">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase text-ink md:text-3xl">
            Banner Promo
          </h1>
          <p className="mt-1 font-body text-sm text-ink/70">
            Kelola pengumuman promo spesial yang tampil di carousel beranda toko.
          </p>
        </div>
        {!isFormOpen && (
          <Button variant="primary" onClick={handleOpenCreate}>
            + Tambah Banner
          </Button>
        )}
      </div>

      {/* Modal / Inline Form */}
      {isFormOpen && (
        <Card className="p-6 bg-cream border-3 border-ink shadow-hard space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <h2 className="font-heading text-lg font-black uppercase text-ink">
              {editingBanner ? "Edit Banner Promo" : "Tambah Banner Baru"}
            </h2>
            <button
              type="button"
              onClick={handleCloseForm}
              className="text-sm font-bold text-ink/70 hover:text-ink cursor-pointer"
            >
              ✕ Batal
            </button>
          </div>

          <form ref={formRef} action={formAction} className="space-y-4">
            {editingBanner && (
              <input type="hidden" name="id" value={editingBanner.id} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Judul */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Judul Banner <span className="text-danger">*</span>
                </label>
                <input
                  name="title"
                  defaultValue={editingBanner?.title ?? ""}
                  placeholder="Contoh: Promo Akhir Pekan Manis!"
                  required
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              {/* Subjudul */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Subjudul / Keterangan
                </label>
                <input
                  name="subtitle"
                  defaultValue={editingBanner?.subtitle ?? ""}
                  placeholder="Contoh: Diskon 15% untuk semua varian brownies."
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              {/* Warna Token */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Warna Tema Banner
                </label>
                <select
                  name="color"
                  defaultValue={editingBanner?.color ?? "pink"}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                >
                  {COLORS.map((c) => (
                    <option key={c} value={c}>
                      Warna {c.toUpperCase()}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-ink/60">
                  Menentukan warna background aksen banner di beranda.
                </span>
              </div>

              {/* Status Aktif */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Status Publikasi
                </label>
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="banner-isActive"
                    name="isActive"
                    value="true"
                    defaultChecked={editingBanner?.isActive ?? true}
                    className="h-5 w-5 rounded border-2 border-ink accent-pink cursor-pointer"
                  />
                  <label
                    htmlFor="banner-isActive"
                    className="text-sm font-bold text-ink cursor-pointer"
                  >
                    Aktifkan banner sekarang
                  </label>
                </div>
              </div>

              {/* CTA Label */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Teks Tombol Aksi (CTA)
                </label>
                <input
                  name="ctaLabel"
                  defaultValue={editingBanner?.ctaLabel ?? "Lihat Menu"}
                  placeholder="Contoh: Pesan Sekarang"
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              {/* CTA URL (Pemilih Link Internal vs Eksternal) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-ink">
                    Link Tujuan Tombol
                  </label>
                  <span className="text-[11px] font-bold text-ink/60">
                    Arahkan ke internal atau eksternal
                  </span>
                </div>

                {/* Tab Pilihan Mode Link: Internal vs Eksternal */}
                <div className="grid grid-cols-2 gap-1 rounded-[8px] border-2 border-ink bg-butter/30 p-1">
                  <button
                    type="button"
                    onClick={() => setLinkType("internal")}
                    className={`py-1.5 px-2 rounded-[6px] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      linkType === "internal"
                        ? "bg-butter text-ink shadow-[var(--shadow-brutal-sm)] border-2 border-ink"
                        : "text-ink/70 hover:text-ink hover:bg-white/50"
                    }`}
                  >
                    <span>📋</span>
                    <span>Halaman Internal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkType("external")}
                    className={`py-1.5 px-2 rounded-[6px] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      linkType === "external"
                        ? "bg-butter text-ink shadow-[var(--shadow-brutal-sm)] border-2 border-ink"
                        : "text-ink/70 hover:text-ink hover:bg-white/50"
                    }`}
                  >
                    <span>🌐</span>
                    <span>Link Eksternal</span>
                  </button>
                </div>

                {/* Mode Halaman Internal: Dropdown Pilihan Siap Pakai */}
                {linkType === "internal" ? (
                  <div className="space-y-1">
                    <select
                      value={internalUrl}
                      onChange={(e) => setInternalUrl(e.target.value)}
                      className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink focus:outline-none focus:ring-2 focus:ring-pink"
                    >
                      <optgroup label="Halaman Utama Website">
                        <option value="/menu">🍰 Halaman Menu Katalog (/menu)</option>
                        <option value="/about">ℹ️ Halaman Tentang Kami & Kontak (/about)</option>
                        <option value="/social">📸 Halaman Media Sosial & Galeri (/social)</option>
                        <option value="/">🧁 Halaman Beranda Depan (/)</option>
                      </optgroup>
                      {categories.length > 0 && (
                        <optgroup label="Kategori Menu Spesifik">
                          {categories.map((c) => (
                            <option key={c.id} value={`/menu?kategori=${c.slug}`}>
                              🏷️ Kategori: {c.name} (/menu?kategori={c.slug})
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {!["/menu", "/about", "/social", "/"].includes(internalUrl) &&
                        !categories.some((c) => `/menu?kategori=${c.slug}` === internalUrl) &&
                        internalUrl.startsWith("/") && (
                          <optgroup label="Halaman Internal Kustom">
                            <option value={internalUrl}>🔗 Halaman: {internalUrl}</option>
                          </optgroup>
                        )}
                    </select>
                    <div className="flex items-center justify-between text-[11px] text-ink/70 pt-0.5">
                      <span>Pilih tujuan tombol tanpa perlu mengetik manual.</span>
                      <span className="font-mono bg-cream px-1.5 py-0.5 rounded border border-ink/30 font-bold">
                        {internalUrl}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Mode Link Eksternal: Input Teks Langsung Tulis / Tempel */
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://instagram.com/nikenbakery atau https://wa.me/..."
                      className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink focus:outline-none focus:ring-2 focus:ring-pink"
                    />
                    <span className="text-[11px] text-ink/70 block">
                      Tulis atau tempel URL lengkap (harus diawali <code className="font-mono font-bold">https://</code> atau <code className="font-mono font-bold">http://</code>).
                    </span>
                  </div>
                )}

                {/* Input tersembunyi yang dikirimkan ke server */}
                <input
                  type="hidden"
                  name="ctaUrl"
                  value={linkType === "internal" ? internalUrl : externalUrl.trim()}
                />
              </div>

              {/* Jadwal Mulai */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Mulai Tayang (Opsional)
                </label>
                <input
                  type="datetime-local"
                  name="startsAt"
                  defaultValue={formatDateForInput(editingBanner?.startsAt)}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
                <span className="text-[11px] text-ink/60">
                  Kosongkan jika ingin langsung tayang seketika.
                </span>
              </div>

              {/* Jadwal Selesai */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Selesai Tayang (Opsional)
                </label>
                <input
                  type="datetime-local"
                  name="endsAt"
                  defaultValue={formatDateForInput(editingBanner?.endsAt)}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
                <span className="text-[11px] text-ink/60">
                  Setelah waktu ini lewat, banner otomatis berhenti tampil di beranda.
                </span>
              </div>
            </div>

            {/* Upload Gambar Banner */}
            <div className="space-y-2 pt-2 border-t border-ink/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-ink">
                  Gambar / Foto Banner (Opsional)
                </label>
                <span className="text-[11px] font-bold text-ink/60">
                  Maks. 5 MB (WebP, JPG, PNG)
                </span>
              </div>

              {imagePreview && !removeCurrentImage ? (
                <div className="flex flex-col sm:flex-row items-start gap-4 p-3 bg-white border-2 border-ink rounded-[8px]">
                  <div className="relative w-40 h-24 rounded-[6px] border-2 border-ink overflow-hidden bg-cream shrink-0">
                    <Image
                      src={imagePreview}
                      alt="Preview banner"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-ink bg-mint px-2 py-0.5 rounded border border-ink">
                        ✓ Foto Terpasang
                      </span>
                    </div>
                    <p className="text-xs text-ink/70">
                      Foto ini akan tampil mendampingi teks banner di halaman beranda.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="inline-flex items-center gap-1.5 text-xs font-black text-ink bg-butter hover:bg-butter/80 px-2.5 py-1.5 rounded-[6px] border-2 border-ink shadow-[var(--shadow-brutal-sm)] cursor-pointer">
                        <span>🔄</span>
                        <span>Ganti Foto</span>
                        <input
                          type="file"
                          name="image"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setImagePreview(URL.createObjectURL(file));
                              setRemoveCurrentImage(false);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setRemoveCurrentImage(true);
                          setImagePreview(null);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-danger bg-danger/10 hover:bg-danger hover:text-white px-2.5 py-1.5 rounded-[6px] border border-danger transition-colors cursor-pointer"
                      >
                        <span>🗑️</span>
                        <span>Hapus Foto</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                        setRemoveCurrentImage(false);
                      }
                    }}
                    className="block w-full text-xs text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-[6px] file:border-2 file:border-ink file:text-xs file:font-black file:bg-butter file:cursor-pointer hover:file:bg-butter/80"
                  />
                  <div className="flex items-center justify-between text-[11px] text-ink/60">
                    <span>Pilih foto kue atau flyer diskon untuk ditampilkan di banner beranda.</span>
                    {removeCurrentImage && (
                      <span className="text-danger font-bold">
                        ⚠️ Foto lama ditandai akan dihapus saat disimpan.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Simpan */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-ink">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCloseForm}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : editingBanner ? "Simpan Perubahan" : "Buat Banner"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List Banner */}
      <div className="space-y-3">
        {initialBanners.length === 0 ? (
          <Card className="p-8 text-center bg-white border-3 border-ink">
            <p className="font-heading font-bold text-ink">Belum ada banner promo.</p>
            <p className="text-xs text-ink/70 mt-1">
              Klik &quot;Tambah Banner&quot; untuk membuat pengumuman promo baru di beranda.
            </p>
          </Card>
        ) : (
          initialBanners.map((b, idx) => {
            const now = currentTime;
            const startsTime = b.startsAt ? new Date(b.startsAt).getTime() : null;
            const endsTime = b.endsAt ? new Date(b.endsAt).getTime() : null;

            let scheduleStatus = "Selalu Aktif";
            let statusColor = "bg-mint";

            if (startsTime && startsTime > now) {
              scheduleStatus = "Masa Depan (Belum Tayang)";
              statusColor = "bg-butter";
            } else if (endsTime && endsTime < now) {
              scheduleStatus = "Sudah Berakhir";
              statusColor = "bg-cream";
            }

            return (
              <Card
                key={b.id}
                className="p-4 bg-white border-3 border-ink shadow-hard flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Info Utama */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Foto atau Kolor Avatar */}
                  <div className="relative w-20 h-16 shrink-0 rounded-[8px] border-2 border-ink overflow-hidden bg-cream flex items-center justify-center font-heading font-black text-xs">
                    {b.imageFile ? (
                      <Image
                        src={b.imageFile}
                        alt={b.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex flex-col items-center justify-center text-ink ${
                          b.color === "butter"
                            ? "bg-butter"
                            : b.color === "mint"
                            ? "bg-mint"
                            : b.color === "lavender"
                            ? "bg-lavender"
                            : "bg-pink"
                        }`}
                      >
                        <span className="text-base">📢</span>
                        <span className="text-[9px] font-black uppercase">Promo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading font-black text-base text-ink truncate">
                        {b.title}
                      </span>
                      <Badge color={b.color}>
                        {b.color.toUpperCase()}
                      </Badge>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-ink ${
                          b.isActive ? "bg-mint text-ink" : "bg-danger text-white"
                        }`}
                      >
                        {b.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-ink/40 text-ink/80 ${statusColor}`}
                      >
                        {scheduleStatus}
                      </span>
                      {/* Penanda Foto: Bergambar vs Teks Saja */}
                      {b.imageFile ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-ink bg-butter text-ink inline-flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                          <span>🖼️</span> Ada Foto
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-ink/40 bg-cream text-ink/70 inline-flex items-center gap-1">
                          <span>📝</span> Teks Saja
                        </span>
                      )}
                    </div>

                    {b.subtitle && (
                      <p className="text-xs text-ink/80 line-clamp-1">{b.subtitle}</p>
                    )}

                    <div className="text-[11px] text-ink/60 flex flex-wrap gap-x-3">
                      {b.ctaLabel && (
                        <span>
                          Tombol: <strong className="text-ink">{b.ctaLabel}</strong> ({b.ctaUrl || "#"})
                        </span>
                      )}
                      {b.startsAt && (
                        <span>Mulai: {new Date(b.startsAt).toLocaleDateString("id-ID")}</span>
                      )}
                      {b.endsAt && (
                        <span>Selesai: {new Date(b.endsAt).toLocaleDateString("id-ID")}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* Toggle Aktif */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(b.id, b.isActive)}
                    disabled={isPending}
                    className={`px-3 py-1.5 text-xs font-bold rounded-[8px] border-2 border-ink cursor-pointer ${
                      b.isActive
                        ? "bg-mint text-ink hover:bg-mint/80"
                        : "bg-cream text-ink/70 hover:bg-white"
                    }`}
                  >
                    {b.isActive ? "Aktif" : "Mati"}
                  </button>

                  {/* Urutan */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleReorder(b.id, "up")}
                      disabled={idx === 0 || isPending}
                      className="px-2 py-0.5 text-[10px] font-black border border-ink rounded bg-white hover:bg-cream disabled:opacity-30 cursor-pointer"
                      title="Geser ke atas"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(b.id, "down")}
                      disabled={idx === initialBanners.length - 1 || isPending}
                      className="px-2 py-0.5 text-[10px] font-black border border-ink rounded bg-white hover:bg-cream disabled:opacity-30 cursor-pointer"
                      title="Geser ke bawah"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(b)}
                    disabled={isPending}
                  >
                    Edit
                  </Button>

                  {/* Hapus */}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(b.id)}
                    disabled={isPending}
                  >
                    Hapus
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog Konfirmasi Hapus */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <Card className="w-full max-w-sm p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h3 className="font-heading text-lg font-black uppercase text-ink">
              Konfirmasi Hapus Banner
            </h3>
            <p className="text-xs text-ink/80">
              Apakah Anda yakin ingin menghapus banner ini? Jika memiliki berkas gambar, gambar fisik di server juga akan dihapus permanen.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteId(null)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(deleteId)}
                disabled={isPending}
              >
                {isPending ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
