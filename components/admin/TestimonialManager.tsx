"use client";

import { useState, useTransition, useActionState } from "react";
import {
  createTestimonialAction,
  updateTestimonialAction,
  toggleTestimonialPublishAction,
  reorderTestimonialAction,
  deleteTestimonialAction,
} from "@/actions/testimonials";
import { Button, Card } from "@/components/ui";

export interface TestimonialItem {
  id: number;
  name: string;
  handle: string | null;
  content: string;
  rating: number;
  isPublished: boolean;
  sortOrder: number;
}

interface TestimonialManagerProps {
  initialTestimonials: TestimonialItem[];
}

export function TestimonialManager({
  initialTestimonials,
}: TestimonialManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(5);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleOpenCreate() {
    setEditingItem(null);
    setRating(5);
    setIsFormOpen(true);
  }

  function handleOpenEdit(t: TestimonialItem) {
    setEditingItem(t);
    setRating(t.rating);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingItem(null);
  }

  function handleTogglePublish(id: number, current: boolean) {
    startTransition(async () => {
      const res = await toggleTestimonialPublishAction(id, !current);
      if (res?.success) {
        showToast("Status publish testimoni diperbarui!");
      }
    });
  }

  function handleReorder(id: number, direction: "up" | "down") {
    startTransition(async () => {
      await reorderTestimonialAction(id, direction);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      const res = await deleteTestimonialAction(id);
      if (res?.success) {
        showToast("Testimoni berhasil dihapus!");
        setDeleteId(null);
      }
    });
  }

  const [, formAction, isSubmitting] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set("rating", rating.toString());
      const action = editingItem ? updateTestimonialAction : createTestimonialAction;
      const res = await action(null, formData);
      if (res?.error) {
        return res;
      }
      showToast(editingItem ? "Testimoni diperbarui!" : "Testimoni baru ditambahkan!");
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
            Testimoni Pelanggan
          </h1>
          <p className="mt-1 font-body text-sm text-ink/70">
            Kelola ulasan dan kata pelanggan yang ditampilkan di beranda.
          </p>
        </div>
        {!isFormOpen && (
          <Button variant="primary" onClick={handleOpenCreate}>
            + Tambah Testimoni
          </Button>
        )}
      </div>

      {/* Form Tambah/Edit */}
      {isFormOpen && (
        <Card className="p-6 bg-cream border-3 border-ink shadow-hard space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <h2 className="font-heading text-lg font-black uppercase text-ink">
              {editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}
            </h2>
            <button
              type="button"
              onClick={handleCloseForm}
              className="text-sm font-bold text-ink/70 hover:text-ink cursor-pointer"
            >
              ✕ Batal
            </button>
          </div>

          <form action={formAction} className="space-y-4">
            {editingItem && <input type="hidden" name="id" value={editingItem.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Nama Pelanggan <span className="text-danger">*</span>
                </label>
                <input
                  name="name"
                  defaultValue={editingItem?.name ?? ""}
                  placeholder="Contoh: Rina Aulia"
                  required
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              {/* Handle Sosmed */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Username / Handle Sosmed (Opsional)
                </label>
                <input
                  name="handle"
                  defaultValue={editingItem?.handle ?? ""}
                  placeholder="Contoh: @rina_foodie"
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
                <span className="text-[11px] text-ink/60">
                  Tanda @ akan otomatis ditambahkan jika tidak disertakan.
                </span>
              </div>

              {/* Rating Bintang */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Rating Bintang
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                        star <= rating ? "text-[#E5A910]" : "text-ink/20"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm font-black text-ink ml-2">
                    {rating} dari 5 Bintang
                  </span>
                </div>
              </div>

              {/* Status Publish */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Publikasi
                </label>
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="testi-publish"
                    name="isPublished"
                    value="true"
                    defaultChecked={editingItem?.isPublished ?? true}
                    className="h-5 w-5 rounded border-2 border-ink accent-pink cursor-pointer"
                  />
                  <label
                    htmlFor="testi-publish"
                    className="text-sm font-bold text-ink cursor-pointer"
                  >
                    Tampilkan di halaman publik
                  </label>
                </div>
              </div>
            </div>

            {/* Isi Testimoni */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-ink">
                Isi Testimoni / Ulasan <span className="text-danger">*</span>
              </label>
              <textarea
                name="content"
                defaultValue={editingItem?.content ?? ""}
                placeholder="Tulis ulasan pelanggan di sini..."
                rows={3}
                required
                className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
              />
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
                {isSubmitting
                  ? "Menyimpan..."
                  : editingItem
                  ? "Simpan Perubahan"
                  : "Tambah Testimoni"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Daftar Testimoni */}
      <div className="space-y-3">
        {initialTestimonials.length === 0 ? (
          <Card className="p-8 text-center bg-white border-3 border-ink">
            <p className="font-heading font-bold text-ink">Belum ada ulasan testimoni.</p>
            <p className="text-xs text-ink/70 mt-1">
              Klik &quot;Tambah Testimoni&quot; untuk menambahkan ulasan dari pelanggan.
            </p>
          </Card>
        ) : (
          initialTestimonials.map((t, idx) => (
            <Card
              key={t.id}
              className="p-4 bg-white border-3 border-ink shadow-hard flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-black text-base text-ink">
                    {t.name}
                  </span>
                  {t.handle && (
                    <span className="text-xs font-bold text-ink/60">
                      {t.handle}
                    </span>
                  )}
                  <span className="text-sm tracking-wider text-[#E5A910]">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-ink ${
                      t.isPublished ? "bg-mint text-ink" : "bg-danger text-white"
                    }`}
                  >
                    {t.isPublished ? "Tampil" : "Disembunyikan"}
                  </span>
                </div>

                <p className="text-xs text-ink/80 italic whitespace-pre-line line-clamp-2">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {/* Toggle Publish */}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(t.id, t.isPublished)}
                  disabled={isPending}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[8px] border-2 border-ink cursor-pointer ${
                    t.isPublished
                      ? "bg-mint text-ink hover:bg-mint/80"
                      : "bg-cream text-ink/70 hover:bg-white"
                  }`}
                >
                  {t.isPublished ? "Tampil" : "Draft"}
                </button>

                {/* Urutan */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleReorder(t.id, "up")}
                    disabled={idx === 0 || isPending}
                    className="px-2 py-0.5 text-[10px] font-black border border-ink rounded bg-white hover:bg-cream disabled:opacity-30 cursor-pointer"
                    title="Geser ke atas"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(t.id, "down")}
                    disabled={idx === initialTestimonials.length - 1 || isPending}
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
                  onClick={() => handleOpenEdit(t)}
                  disabled={isPending}
                >
                  Edit
                </Button>

                {/* Hapus */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteId(t.id)}
                  disabled={isPending}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialog Konfirmasi Hapus */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <Card className="w-full max-w-sm p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h3 className="font-heading text-lg font-black uppercase text-ink">
              Konfirmasi Hapus Testimoni
            </h3>
            <p className="text-xs text-ink/80">
              Apakah Anda yakin ingin menghapus ulasan testimoni ini?
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
