"use client";

import { useState, useTransition } from "react";
import {
  createCategoryAction,
  updateCategoryAction,
  reorderCategoryAction,
  deleteCategoryAction,
} from "@/actions/categories";
import { Input, Button, Badge } from "@/components/ui";
import { IconCheck, IconAlert, IconPlus } from "@/components/ui/Icons";
import { COLORS, type TokenColor } from "@/db/schema";

export interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  color: TokenColor;
  sortOrder: number;
  productCount: number;
}

interface CategoryManagerProps {
  categories: CategoryWithCount[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(null);
  const [replacementId, setReplacementId] = useState<number | "">("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Category Form State
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<TokenColor>("butter");

  // Edit Category Form State
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState<TokenColor>("butter");

  function showMessage(type: "success" | "error", text: string) {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3000);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", newName);
      formData.set("color", newColor);

      const res = await createCategoryAction(null, formData);
      if (res.error) {
        showMessage("error", res.error);
      } else {
        setNewName("");
        showMessage("success", "Kategori baru berhasil ditambahkan!");
      }
    });
  }

  function startEdit(cat: CategoryWithCount) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editName.trim()) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", editingId.toString());
      formData.set("name", editName);
      formData.set("color", editColor);

      const res = await updateCategoryAction(null, formData);
      if (res.error) {
        showMessage("error", res.error);
      } else {
        setEditingId(null);
        showMessage("success", "Kategori berhasil diperbarui!");
      }
    });
  }

  function handleReorder(id: number, direction: "up" | "down") {
    startTransition(async () => {
      await reorderCategoryAction(id, direction);
    });
  }

  function confirmDelete(cat: CategoryWithCount) {
    setDeleteTarget(cat);
    // Cari kategori lain yang valid sebagai default pengganti
    const other = categories.find((c) => c.id !== cat.id);
    setReplacementId(other ? other.id : "");
  }

  function executeDelete() {
    if (!deleteTarget) return;

    startTransition(async () => {
      const repl = replacementId ? Number(replacementId) : undefined;
      const res = await deleteCategoryAction(deleteTarget.id, repl);

      if (res.error) {
        showMessage("error", res.error);
      } else {
        setDeleteTarget(null);
        showMessage("success", "Kategori berhasil dihapus!");
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Toast Feedback */}
      {feedback && (
        <div
          role="status"
          className={`p-3 rounded-[8px] border-2 border-ink text-sm font-bold shadow-[var(--shadow-brutal-sm)] flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-mint text-ink"
              : "bg-danger text-white"
          }`}
        >
          {feedback.type === "success" ? (
            <IconCheck className="w-4 h-4 text-ink shrink-0" />
          ) : (
            <IconAlert className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* ─── Form Tambah Kategori Baru ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] p-5 md:p-6 shadow-[var(--shadow-brutal)]">
        <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
          <IconPlus className="w-5 h-5 text-ink shrink-0" />
          <span>Tambah Kategori Baru</span>
        </h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6">
            <Input
              id="new-cat-name"
              label="Nama Kategori"
              placeholder="Contoh: Choux & Pastry"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-sm font-semibold block">Warna Token</label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className={`px-2.5 py-1.5 rounded-[6px] border-2 text-xs font-bold capitalize transition-all cursor-pointer ${
                    newColor === c
                      ? "border-ink ring-2 ring-ink scale-105"
                      : "border-ink/40 opacity-70 hover:opacity-100"
                  } ${
                    c === "pink"
                      ? "bg-pink text-ink"
                      : c === "butter"
                      ? "bg-butter text-ink"
                      : c === "mint"
                      ? "bg-mint text-ink"
                      : "bg-lavender text-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isPending || !newName.trim()}
              className="w-full text-sm font-bold shadow-[var(--shadow-brutal-sm)]"
            >
              {isPending ? "Menyimpan..." : "Tambah"}
            </Button>
          </div>
        </form>
      </div>

      {/* ─── Daftar Kategori ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] overflow-hidden shadow-[var(--shadow-brutal)]">
        <div className="p-4 md:p-5 border-b-2 border-ink/10 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Daftar Kategori ({categories.length})</h2>
          <span className="text-xs text-ink/60 font-semibold">
            Gunakan tombol ⬆ / ⬇ untuk mengatur urutan
          </span>
        </div>

        <div className="divide-y-2 divide-ink/10">
          {categories.map((cat, idx) => {
            const isEditing = editingId === cat.id;

            if (isEditing) {
              return (
                <div key={cat.id} className="p-4 bg-cream/40 space-y-3">
                  <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5">
                      <Input
                        id={`edit-cat-${cat.id}`}
                        label="Ubah Nama"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-sm font-semibold block">Warna Token</label>
                      <div className="flex items-center gap-2">
                        {COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditColor(c)}
                            className={`px-2 py-1 rounded-[6px] border-2 text-xs font-bold capitalize cursor-pointer ${
                              editColor === c
                                ? "border-ink ring-2 ring-ink scale-105"
                                : "border-ink/40 opacity-70"
                            } ${
                              c === "pink"
                                ? "bg-pink text-ink"
                                : c === "butter"
                                ? "bg-butter text-ink"
                                : c === "mint"
                                ? "bg-mint text-ink"
                                : "bg-lavender text-ink"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={isPending}
                        className="text-xs font-bold"
                      >
                        Simpan
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="text-xs border-2 bg-white"
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
                </div>
              );
            }

            return (
              <div
                key={cat.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Urutan */}
                  <span className="tabular-nums font-mono text-xs font-bold text-ink/40 w-6">
                    #{idx + 1}
                  </span>

                  {/* Badge Token */}
                  <Badge color={cat.color} className="uppercase text-xs font-extrabold">
                    {cat.name}
                  </Badge>

                  <div className="text-xs text-ink/60 font-mono">
                    /{cat.slug} · <span className="font-bold text-ink">{cat.productCount}</span> produk
                  </div>
                </div>

                {/* Aksi */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Tombol Reorder */}
                  <div className="flex items-center border-2 border-ink rounded-[6px] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => handleReorder(cat.id, "up")}
                      disabled={isPending || idx === 0}
                      aria-label="Pindahkan ke atas"
                      className="px-2 py-1 text-xs font-bold hover:bg-butter disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer border-r border-ink"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(cat.id, "down")}
                      disabled={isPending || idx === categories.length - 1}
                      aria-label="Pindahkan ke bawah"
                      className="px-2 py-1 text-xs font-bold hover:bg-butter disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      ▼
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    disabled={isPending}
                    className="px-2.5 py-1 text-xs font-bold bg-white border-2 border-ink rounded-[6px] hover:bg-cream shadow-[var(--shadow-brutal-sm)] cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => confirmDelete(cat)}
                    disabled={isPending}
                    className="px-2.5 py-1 text-xs font-bold bg-danger/10 text-danger border-2 border-danger rounded-[6px] hover:bg-danger hover:text-white transition-colors cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Modal Konfirmasi Hapus Kategori ─── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border-3 border-ink rounded-[14px] p-6 max-w-md w-full shadow-[var(--shadow-brutal-lg)] space-y-4">
            <h3 className="text-lg font-extrabold text-danger flex items-center gap-2">
              <IconAlert className="w-5 h-5 text-danger shrink-0" />
              <span>Hapus Kategori &ldquo;{deleteTarget.name}&rdquo;?</span>
            </h3>

            {deleteTarget.productCount > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-ink/80 leading-relaxed">
                  Kategori ini saat ini digunakan oleh{" "}
                  <strong className="text-ink">{deleteTarget.productCount} produk</strong>.
                  Pilih kategori baru untuk memindahkan produk-produk tersebut sebelum dihapus:
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold">Pindahkan produk ke:</label>
                  <select
                    value={replacementId}
                    onChange={(e) => setReplacementId(Number(e.target.value))}
                    className="w-full p-2.5 rounded-[8px] border-2 border-ink text-sm bg-white font-semibold"
                  >
                    {categories
                      .filter((c) => c.id !== deleteTarget.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink/80">
                Kategori ini tidak memiliki produk. Apakah kamu yakin ingin menghapusnya?
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-ink/10">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                className="text-xs border-2 bg-white"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={isPending || (deleteTarget.productCount > 0 && !replacementId)}
                onClick={executeDelete}
                className="text-xs font-bold"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus Kategori"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
