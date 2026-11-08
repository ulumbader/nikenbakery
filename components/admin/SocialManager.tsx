"use client";

import { useState, useTransition, useActionState, useRef } from "react";
import Image from "next/image";
import {
  createSocialPostAction,
  updateSocialPostAction,
  toggleSocialPublishAction,
  reorderSocialPostAction,
  deleteSocialPostAction,
} from "@/actions/social";
import { Button, Card, Badge } from "@/components/ui";

export interface SocialPostItem {
  id: number;
  platform: "instagram" | "tiktok" | "other";
  imageFile: string | null;
  caption: string;
  postUrl: string;
  isPublished: boolean;
  sortOrder: number;
}

interface SocialManagerProps {
  initialPosts: SocialPostItem[];
}

export function SocialManager({ initialPosts }: SocialManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingPost, setEditingPost] = useState<SocialPostItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleOpenCreate() {
    setEditingPost(null);
    setImagePreview(null);
    setSelectedFile(null);
    setRemoveCurrentImage(false);
    setIsFormOpen(true);
  }

  function handleOpenEdit(p: SocialPostItem) {
    setEditingPost(p);
    setImagePreview(p.imageFile);
    setSelectedFile(null);
    setRemoveCurrentImage(false);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingPost(null);
    setImagePreview(null);
    setSelectedFile(null);
    setRemoveCurrentImage(false);
  }

  function handleTogglePublish(id: number, current: boolean) {
    startTransition(async () => {
      const res = await toggleSocialPublishAction(id, !current);
      if (res?.success) {
        showToast("Status publish postingan diperbarui!");
      }
    });
  }

  function handleReorder(id: number, direction: "up" | "down") {
    startTransition(async () => {
      await reorderSocialPostAction(id, direction);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      const res = await deleteSocialPostAction(id);
      if (res?.success) {
        showToast("Postingan sosial berhasil dihapus!");
        setDeleteId(null);
      }
    });
  }

  const [, formAction, isSubmitting] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      if (removeCurrentImage) {
        formData.set("removeImage", "true");
      }
      if (selectedFile) {
        formData.set("image", selectedFile);
      }
      const action = editingPost ? updateSocialPostAction : createSocialPostAction;
      const res = await action(null, formData);
      if (res?.error) {
        return res;
      }
      showToast(editingPost ? "Postingan berhasil diperbarui!" : "Postingan baru berhasil ditambahkan!");
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
            Postingan Sosial
          </h1>
          <p className="mt-1 font-body text-sm text-ink/70">
            Kelola kurasi postingan Instagram dan TikTok untuk halaman /social dan preview di beranda.
          </p>
        </div>
        {!isFormOpen && (
          <Button variant="primary" onClick={handleOpenCreate}>
            + Tambah Postingan
          </Button>
        )}
      </div>

      {/* Form Tambah/Edit */}
      {isFormOpen && (
        <Card className="p-6 bg-cream border-3 border-ink shadow-hard space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <h2 className="font-heading text-lg font-black uppercase text-ink">
              {editingPost ? "Edit Postingan Sosial" : "Tambah Postingan Baru"}
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
            {editingPost && <input type="hidden" name="id" value={editingPost.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Platform */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Platform Media Sosial
                </label>
                <select
                  name="platform"
                  defaultValue={editingPost?.platform ?? "instagram"}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="other">Platform Lainnya</option>
                </select>
              </div>

              {/* Status Publish */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Publikasi
                </label>
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="social-publish"
                    name="isPublished"
                    value="true"
                    defaultChecked={editingPost?.isPublished ?? true}
                    className="h-5 w-5 rounded border-2 border-ink accent-pink cursor-pointer"
                  />
                  <label
                    htmlFor="social-publish"
                    className="text-sm font-bold text-ink cursor-pointer"
                  >
                    Tampilkan di galeri publik
                  </label>
                </div>
              </div>

              {/* Link Postingan */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black uppercase text-ink">
                  Link / URL Postingan Asli <span className="text-danger">*</span>
                </label>
                <input
                  name="postUrl"
                  defaultValue={editingPost?.postUrl ?? ""}
                  placeholder="Contoh: https://www.instagram.com/p/..."
                  required
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
                <span className="text-[11px] text-ink/60">
                  Wajib menyertakan https:// agar pengunjung dapat membuka postingan langsung di aplikasi sosmed mereka.
                </span>
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-ink">
                Caption / Kutipan Teks
              </label>
              <textarea
                name="caption"
                defaultValue={editingPost?.caption ?? ""}
                placeholder="Tulis ringkasan caption postingan..."
                rows={2}
                className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
              />
            </div>

            {/* Upload Gambar */}
            <div className="space-y-2 pt-2 border-t border-ink/20">
              <label className="text-xs font-black uppercase text-ink">
                Foto Postingan (Opsional)
              </label>

              {imagePreview && !removeCurrentImage ? (
                <div className="relative w-32 h-32 rounded-[8px] border-2 border-ink overflow-hidden bg-white">
                  <Image
                    src={imagePreview}
                    alt="Preview foto sosmed"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setRemoveCurrentImage(true);
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 text-xs font-bold shadow cursor-pointer"
                    title="Hapus gambar"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        setImagePreview(URL.createObjectURL(file));
                        setRemoveCurrentImage(false);
                      }
                    }}
                    className="block w-full text-xs text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-[6px] file:border-2 file:border-ink file:text-xs file:font-black file:bg-butter file:cursor-pointer hover:file:bg-butter/80"
                  />
                  <span className="text-[11px] text-ink/60">
                    Format: JPEG, PNG, WebP (maks. 5 MB). Gambar akan di-resize dan dikompres otomatis.
                  </span>
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
                {isSubmitting
                  ? "Menyimpan..."
                  : editingPost
                  ? "Simpan Perubahan"
                  : "Tambah Postingan"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Daftar Postingan */}
      <div className="space-y-3">
        {initialPosts.length === 0 ? (
          <Card className="p-8 text-center bg-white border-3 border-ink">
            <p className="font-heading font-bold text-ink">Belum ada postingan sosial.</p>
            <p className="text-xs text-ink/70 mt-1">
              Klik &quot;Tambah Postingan&quot; untuk mengurasi konten Instagram atau TikTok ke galeri.
            </p>
          </Card>
        ) : (
          initialPosts.map((p, idx) => (
            <Card
              key={p.id}
              className="p-4 bg-white border-3 border-ink shadow-hard flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="relative w-16 h-16 shrink-0 rounded-[8px] border-2 border-ink overflow-hidden bg-cream flex items-center justify-center font-bold text-xs text-ink">
                  {p.imageFile ? (
                    <Image
                      src={p.imageFile}
                      alt={p.caption || "Foto sosmed"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{p.platform === "instagram" ? "📸 IG" : "🎵 TT"}</span>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color={p.platform === "instagram" ? "pink" : "mint"}>
                      {p.platform.toUpperCase()}
                    </Badge>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-ink ${
                        p.isPublished ? "bg-mint text-ink" : "bg-danger text-white"
                      }`}
                    >
                      {p.isPublished ? "Tampil" : "Draft"}
                    </span>
                  </div>

                  {p.caption && (
                    <p className="text-xs text-ink font-medium line-clamp-1">
                      {p.caption}
                    </p>
                  )}

                  <a
                    href={p.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-ink/70 underline hover:text-ink block truncate"
                  >
                    {p.postUrl} ↗
                  </a>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(p.id, p.isPublished)}
                  disabled={isPending}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[8px] border-2 border-ink cursor-pointer ${
                    p.isPublished
                      ? "bg-mint text-ink hover:bg-mint/80"
                      : "bg-cream text-ink/70 hover:bg-white"
                  }`}
                >
                  {p.isPublished ? "Tampil" : "Draft"}
                </button>

                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleReorder(p.id, "up")}
                    disabled={idx === 0 || isPending}
                    className="px-2 py-0.5 text-[10px] font-black border border-ink rounded bg-white hover:bg-cream disabled:opacity-30 cursor-pointer"
                    title="Geser ke atas"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(p.id, "down")}
                    disabled={idx === initialPosts.length - 1 || isPending}
                    className="px-2 py-0.5 text-[10px] font-black border border-ink rounded bg-white hover:bg-cream disabled:opacity-30 cursor-pointer"
                    title="Geser ke bawah"
                  >
                    ▼
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(p)}
                  disabled={isPending}
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteId(p.id)}
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
              Konfirmasi Hapus Postingan
            </h3>
            <p className="text-xs text-ink/80">
              Apakah Anda yakin ingin menghapus postingan sosial ini dari kurasi?
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
