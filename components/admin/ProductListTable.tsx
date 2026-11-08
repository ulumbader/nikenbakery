"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/format";
import {
  toggleProductStatusAction,
  toggleProductPublishAction,
  toggleProductFeaturedAction,
  deleteProductAction,
} from "@/actions/products";
import {
  Button,
  Badge,
  PlaceholderCake,
  IconCheck,
  IconAlert,
  IconSearch,
  IconPlus,
  IconClose,
  IconStar,
} from "@/components/ui";

export interface AdminProductRow {
  id: number;
  name: string;
  slug: string;
  basePrice: number;
  displayPrice: number;
  hasVariants: boolean;
  status: "ready" | "preorder" | "soldout";
  preorderNote?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  categoryId?: number | null;
  categoryName?: string;
  categoryColor?: string;
  coverImage?: string | null;
}

interface ProductListTableProps {
  initialProducts: AdminProductRow[];
  categories: Array<{ id: number; name: string }>;
}

export function ProductListTable({
  initialProducts,
  categories,
}: ProductListTableProps) {
  const [productsList, setProductsList] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }

  // Filter items
  const filteredProducts = productsList.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedCat !== "all") {
      if (p.categoryId?.toString() !== selectedCat) return false;
    }
    if (selectedStatus !== "all") {
      if (p.status !== selectedStatus) return false;
    }
    return true;
  });

  function handleStatusChange(productId: number, newStatus: "ready" | "preorder" | "soldout") {
    // Optimistic UI update
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
    );

    startTransition(async () => {
      await toggleProductStatusAction(productId, newStatus);
      showToast("success", "Status produk berhasil diubah!");
    });
  }

  function handlePublishToggle(productId: number, current: boolean) {
    const nextVal = !current;
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isPublished: nextVal } : p))
    );

    startTransition(async () => {
      await toggleProductPublishAction(productId, nextVal);
      showToast(
        "success",
        nextVal ? "Produk dipublikasikan ke katalog!" : "Produk disembunyikan dari katalog."
      );
    });
  }

  function handleFeaturedToggle(productId: number, current: boolean) {
    const nextVal = !current;
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isFeatured: nextVal } : p))
    );

    startTransition(async () => {
      await toggleProductFeaturedAction(productId, nextVal);
      showToast(
        "success",
        nextVal ? "Produk ditandai sebagai Unggulan Beranda!" : "Produk dihapus dari Unggulan Beranda."
      );
    });
  }

  function handleDelete(productId: number) {
    startTransition(async () => {
      const res = await deleteProductAction(productId);
      if (res.success) {
        setProductsList((prev) => prev.filter((p) => p.id !== productId));
        setDeleteTarget(null);
        showToast("success", "Produk beserta fotonya berhasil dihapus!");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          className={`p-3 rounded-[8px] border-2 border-ink text-sm font-bold shadow-[var(--shadow-brutal-sm)] flex items-center gap-2 ${
            toast.type === "success" ? "bg-mint text-ink" : "bg-danger text-white"
          }`}
        >
          {toast.type === "success" ? (
            <IconCheck className="w-4 h-4 text-ink flex-shrink-0" />
          ) : (
            <IconAlert className="w-4 h-4 text-white flex-shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* ─── Bar Filter & Tombol Tambah ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] p-4 md:p-6 shadow-[var(--shadow-brutal)] space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="w-4 h-4 text-ink/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              placeholder="Cari nama kue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-[8px] border-2 border-ink text-sm bg-white font-medium"
            />
          </div>

          <Link href="/admin/products/new">
            <Button
              variant="primary"
              size="default"
              className="w-full sm:w-auto font-extrabold text-sm shadow-[var(--shadow-brutal-sm)] inline-flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </Button>
          </Link>
        </div>

        {/* Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t-2 border-ink/10 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-ink/70">Kategori:</span>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="p-1.5 rounded-[6px] border-2 border-ink bg-white font-semibold"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-ink/70">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 rounded-[6px] border-2 border-ink bg-white font-semibold"
            >
              <option value="all">Semua Status</option>
              <option value="ready">Ready</option>
              <option value="preorder">Pre-order</option>
              <option value="soldout">Habis</option>
            </select>
          </div>

          <span className="ml-auto font-bold text-ink/70">
            Total: {filteredProducts.length} produk
          </span>
        </div>
      </div>

      {/* ─── Desktop Table View (≥ 768px) ─── */}
      <div className="hidden md:block bg-white border-3 border-ink rounded-[14px] overflow-hidden shadow-[var(--shadow-brutal)]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b-3 border-ink bg-cream font-extrabold text-xs uppercase tracking-wider text-ink">
              <th className="p-3 w-16">Foto</th>
              <th className="p-3">Nama Produk</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Status Stok</th>
              <th className="p-3 text-center">Publik</th>
              <th className="p-3 text-center">Featured</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink/10">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-cream/20 transition-colors">
                {/* Foto Thumbnail */}
                <td className="p-3">
                  <div className="relative w-12 h-12 rounded-[6px] border-2 border-ink overflow-hidden bg-cream flex-shrink-0">
                    {p.coverImage ? (
                      <Image
                        src={p.coverImage}
                        alt={p.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <PlaceholderCake
                        color={
                          p.categoryColor &&
                          ["pink", "butter", "mint", "lavender"].includes(p.categoryColor)
                            ? (p.categoryColor as "pink" | "butter" | "mint" | "lavender")
                            : "butter"
                        }
                        className="w-full h-full rounded-none border-0"
                      />
                    )}
                  </div>
                </td>

                {/* Nama Produk */}
                <td className="p-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-extrabold hover:underline block text-base"
                  >
                    {p.name}
                  </Link>
                  <span className="text-xs text-ink/50 font-mono">
                    /{p.slug}
                  </span>
                </td>

                {/* Kategori */}
                <td className="p-3">
                  {p.categoryName ? (
                    <Badge
                      color={
                        p.categoryColor &&
                        ["pink", "butter", "mint", "lavender"].includes(p.categoryColor)
                          ? (p.categoryColor as "pink" | "butter" | "mint" | "lavender")
                          : "butter"
                      }
                      className="text-xs font-bold uppercase"
                    >
                      {p.categoryName}
                    </Badge>
                  ) : (
                    <span className="text-xs text-ink/40 font-semibold">—</span>
                  )}
                </td>

                {/* Harga */}
                <td className="p-3 tabular-nums font-bold">
                  {formatRupiah(p.displayPrice)}
                  {p.hasVariants && (
                    <span className="text-[10px] text-ink/60 block font-normal">
                      (Varian)
                    </span>
                  )}
                </td>

                {/* Inline Toggle: Status Stok */}
                <td className="p-3">
                  <select
                    value={p.status}
                    onChange={(e) =>
                      handleStatusChange(
                        p.id,
                        e.target.value as "ready" | "preorder" | "soldout"
                      )
                    }
                    disabled={isPending}
                    className={`text-xs font-extrabold px-2 py-1 rounded-[6px] border-2 border-ink cursor-pointer ${
                      p.status === "ready"
                        ? "bg-mint text-ink"
                        : p.status === "preorder"
                        ? "bg-butter text-ink"
                        : "bg-danger text-white"
                    }`}
                  >
                    <option value="ready">Ready</option>
                    <option value="preorder">Pre-order</option>
                    <option value="soldout">Habis</option>
                  </select>
                </td>

                {/* Inline Toggle: Published */}
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => handlePublishToggle(p.id, p.isPublished)}
                    disabled={isPending}
                    aria-label={`Toggle status tayang ${p.name}`}
                    className={`w-7 h-7 rounded-[6px] border-2 border-ink inline-flex items-center justify-center font-bold text-xs cursor-pointer ${
                      p.isPublished
                        ? "bg-mint text-ink shadow-[var(--shadow-brutal-sm)]"
                        : "bg-white text-ink/30 border-ink/40"
                    }`}
                  >
                    {p.isPublished ? (
                      <IconCheck className="w-3.5 h-3.5" />
                    ) : (
                      <IconClose className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>

                {/* Inline Toggle: Featured */}
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleFeaturedToggle(p.id, p.isFeatured)}
                    disabled={isPending}
                    aria-label={`Toggle produk unggulan ${p.name}`}
                    className={`w-7 h-7 rounded-[6px] border-2 border-ink inline-flex items-center justify-center font-bold text-xs cursor-pointer ${
                      p.isFeatured
                        ? "bg-butter text-ink shadow-[var(--shadow-brutal-sm)]"
                        : "bg-white text-ink/30 border-ink/40"
                    }`}
                  >
                    <IconStar
                      className={`w-3.5 h-3.5 ${
                        p.isFeatured ? "fill-current" : "opacity-30"
                      }`}
                    />
                  </button>
                </td>

                {/* Aksi */}
                <td className="p-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="px-2.5 py-1 text-xs font-bold bg-white border-2 border-ink rounded-[6px] hover:bg-cream shadow-[var(--shadow-brutal-sm)]"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(p)}
                      className="px-2 py-1 text-xs font-bold text-danger bg-danger/10 border-2 border-danger rounded-[6px] hover:bg-danger hover:text-white transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Mobile Card View (< 768px) ─── */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white border-3 border-ink rounded-[14px] p-4 shadow-[var(--shadow-brutal)] space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 rounded-[8px] border-2 border-ink overflow-hidden bg-cream flex-shrink-0">
                {p.coverImage ? (
                  <Image
                    src={p.coverImage}
                    alt={p.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <PlaceholderCake
                    color="butter"
                    className="w-full h-full rounded-none border-0"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {p.categoryName && (
                    <Badge color="butter" className="text-[10px] px-1.5 py-0 uppercase">
                      {p.categoryName}
                    </Badge>
                  )}
                  {p.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-butter px-1.5 py-0.5 rounded border border-ink font-bold">
                      <IconStar className="w-3 h-3 fill-current" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-base truncate mt-0.5">
                  <Link href={`/admin/products/${p.id}`}>{p.name}</Link>
                </h3>
                <span className="tabular-nums font-bold text-sm text-ink block">
                  {formatRupiah(p.displayPrice)}
                </span>
              </div>
            </div>

            {/* Toggles di Mobile */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-ink/10 text-xs">
              <div className="flex items-center justify-between p-2 bg-cream/40 border border-ink/30 rounded-[6px]">
                <span className="font-bold">Status:</span>
                <select
                  value={p.status}
                  onChange={(e) =>
                    handleStatusChange(
                      p.id,
                      e.target.value as "ready" | "preorder" | "soldout"
                    )
                  }
                  className="font-extrabold rounded p-1 border border-ink"
                >
                  <option value="ready">Ready</option>
                  <option value="preorder">Pre-order</option>
                  <option value="soldout">Habis</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2 bg-cream/40 border border-ink/30 rounded-[6px]">
                <span className="font-bold">Katalog:</span>
                <button
                  type="button"
                  onClick={() => handlePublishToggle(p.id, p.isPublished)}
                  className={`px-2 py-0.5 rounded font-extrabold border border-ink text-xs ${
                    p.isPublished ? "bg-mint text-ink" : "bg-white text-ink/40"
                  }`}
                >
                  {p.isPublished ? "Tayang" : "Sembunyi"}
                </button>
              </div>
            </div>

            {/* Aksi Mobile */}
            <div className="flex items-center gap-2 pt-1">
              <Link href={`/admin/products/${p.id}`} className="flex-1">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs font-bold"
                >
                  Edit Produk
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(p)}
                className="px-3 py-1.5 text-xs font-bold text-danger bg-danger/10 border-2 border-danger rounded-full hover:bg-danger hover:text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Modal Konfirmasi Hapus Produk ─── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border-3 border-ink rounded-[14px] p-6 max-w-sm w-full shadow-[var(--shadow-brutal-lg)] space-y-4">
            <h3 className="text-lg font-extrabold text-danger flex items-center gap-2">
              <IconAlert className="w-5 h-5 flex-shrink-0" />
              <span>Hapus Produk?</span>
            </h3>
            <p className="text-sm text-ink/80 leading-relaxed">
              Kamu yakin ingin menghapus &ldquo;
              <strong className="text-ink">{deleteTarget.name}</strong>&rdquo;?
              Semua varian dan foto gambar fisik di server juga akan dihapus permanen.
            </p>

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
                disabled={isPending}
                onClick={() => handleDelete(deleteTarget.id)}
                className="text-xs font-bold"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus Permanen"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
