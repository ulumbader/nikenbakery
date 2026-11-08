"use client";

import { useState, useTransition, useActionState } from "react";
import {
  createFaqAction,
  updateFaqAction,
  toggleFaqPublishAction,
  reorderFaqAction,
  deleteFaqAction,
} from "@/actions/faqs";
import { Button, Card, IconClose, IconPlus } from "@/components/ui";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isPublished: boolean;
  sortOrder: number;
}

interface FaqManagerProps {
  initialFaqs: FaqItem[];
}

export function FaqManager({ initialFaqs }: FaqManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleOpenCreate() {
    setEditingFaq(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(f: FaqItem) {
    setEditingFaq(f);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingFaq(null);
  }

  function handleTogglePublish(id: number, current: boolean) {
    startTransition(async () => {
      const res = await toggleFaqPublishAction(id, !current);
      if (res?.success) {
        showToast("Status publish FAQ diperbarui!");
      }
    });
  }

  function handleReorder(id: number, direction: "up" | "down") {
    startTransition(async () => {
      await reorderFaqAction(id, direction);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      const res = await deleteFaqAction(id);
      if (res?.success) {
        showToast("FAQ berhasil dihapus!");
        setDeleteId(null);
      }
    });
  }

  const [, formAction, isSubmitting] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const action = editingFaq ? updateFaqAction : createFaqAction;
      const res = await action(null, formData);
      if (res?.error) {
        return res;
      }
      showToast(editingFaq ? "FAQ berhasil diperbarui!" : "FAQ baru berhasil dibuat!");
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
            Tanya Jawab (FAQ)
          </h1>
          <p className="mt-1 font-body text-sm text-ink/70">
            Kelola daftar pertanyaan yang sering diajukan pelanggan di halaman Tentang Kami.
          </p>
        </div>
        {!isFormOpen && (
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            aria-label="+ Tambah FAQ"
            className="inline-flex items-center gap-1.5"
          >
            <IconPlus className="w-4 h-4" />
            <span>Tambah FAQ</span>
          </Button>
        )}
      </div>

      {/* Form Tambah/Edit */}
      {isFormOpen && (
        <Card className="p-6 bg-cream border-3 border-ink shadow-hard space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <h2 className="font-heading text-lg font-black uppercase text-ink">
              {editingFaq ? "Edit Pertanyaan FAQ" : "Tambah FAQ Baru"}
            </h2>
            <button
              type="button"
              onClick={handleCloseForm}
              className="text-sm font-bold text-ink/70 hover:text-ink cursor-pointer inline-flex items-center gap-1"
            >
              <IconClose className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>
          </div>

          <form action={formAction} className="space-y-4">
            {editingFaq && <input type="hidden" name="id" value={editingFaq.id} />}

            {/* Pertanyaan */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-ink">
                Pertanyaan <span className="text-danger">*</span>
              </label>
              <input
                name="question"
                defaultValue={editingFaq?.question ?? ""}
                placeholder="Contoh: Bagaimana cara memesan kue di Niken Bakery?"
                required
                className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
              />
            </div>

            {/* Jawaban */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-ink">
                Jawaban <span className="text-danger">*</span>
              </label>
              <textarea
                name="answer"
                defaultValue={editingFaq?.answer ?? ""}
                placeholder="Tulis jawaban lengkap di sini (baris baru akan dipertahankan)..."
                rows={4}
                required
                className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
              />
            </div>

            {/* Status Publish */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="faq-publish"
                name="isPublished"
                value="true"
                defaultChecked={editingFaq?.isPublished ?? true}
                className="h-5 w-5 rounded border-2 border-ink accent-pink cursor-pointer"
              />
              <label
                htmlFor="faq-publish"
                className="text-sm font-bold text-ink cursor-pointer"
              >
                Tampilkan FAQ ini di halaman publik
              </label>
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
                  : editingFaq
                  ? "Simpan Perubahan"
                  : "Buat FAQ"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Daftar FAQ */}
      <div className="space-y-3">
        {initialFaqs.length === 0 ? (
          <Card className="p-8 text-center bg-white border-3 border-ink">
            <p className="font-heading font-bold text-ink">Belum ada daftar FAQ.</p>
            <p className="text-xs text-ink/70 mt-1">
              Klik &quot;Tambah FAQ&quot; untuk menambahkan pertanyaan umum dan jawabannya.
            </p>
          </Card>
        ) : (
          initialFaqs.map((f, idx) => (
            <Card
              key={f.id}
              className="p-4 bg-white border-3 border-ink shadow-hard flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-black text-base text-ink">
                    {f.question}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-ink ${
                      f.isPublished ? "bg-mint text-ink" : "bg-danger text-white"
                    }`}
                  >
                    {f.isPublished ? "Tampil" : "Draft"}
                  </span>
                </div>

                <p className="text-xs text-ink/80 whitespace-pre-line line-clamp-2">
                  {f.answer}
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(f.id, f.isPublished)}
                  disabled={isPending}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[8px] border-2 border-ink cursor-pointer ${
                    f.isPublished
                      ? "bg-mint text-ink hover:bg-mint/80"
                      : "bg-cream text-ink/70 hover:bg-white"
                  }`}
                >
                  {f.isPublished ? "Tampil" : "Draft"}
                </button>

                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleReorder(f.id, "up")}
                    disabled={idx === 0 || isPending}
                    className="px-2 py-0.5 text-[10px] font-black border border-ink rounded bg-white hover:bg-cream disabled:opacity-30 cursor-pointer"
                    title="Geser ke atas"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(f.id, "down")}
                    disabled={idx === initialFaqs.length - 1 || isPending}
                    className="px-2 py-0.5 text-[10px] font-black border border-ink rounded bg-white hover:bg-cream disabled:opacity-30 cursor-pointer"
                    title="Geser ke bawah"
                  >
                    ▼
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(f)}
                  disabled={isPending}
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteId(f.id)}
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
              Konfirmasi Hapus FAQ
            </h3>
            <p className="text-xs text-ink/80">
              Apakah Anda yakin ingin menghapus pertanyaan FAQ ini?
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
