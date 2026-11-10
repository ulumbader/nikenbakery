"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { generateSlug } from "@/lib/slug";
import { saveProductAction } from "@/actions/products";
import {
  Input,
  Textarea,
  Button,
  IconAlert,
  IconCupcake,
  IconRuler,
  IconClose,
  IconCamera,
  IconStar,
  IconEdit,
  IconEye,
  IconSave,
  IconPlus,
  IconArrowLeft,
} from "@/components/ui";

export interface ExistingImage {
  id: number;
  fileName: string;
  thumbName: string;
  alt: string;
  isCover: boolean;
  sortOrder: number;
}

export interface ProductVariantItem {
  id?: number;
  label: string;
  price: number;
  sortOrder: number;
}

export interface ProductFormData {
  id?: number;
  name: string;
  slug: string;
  categoryId?: number | null;
  basePrice: number;
  status: "ready" | "preorder" | "soldout";
  preorderNote?: string | null;
  description: string;
  ingredients?: string | null;
  allergens?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  shopeeUrl?: string | null;
  shopeeEnabled?: boolean;
  tokopediaUrl?: string | null;
  tokopediaEnabled?: boolean;
  tiktokShopUrl?: string | null;
  tiktokShopEnabled?: boolean;
  variants: ProductVariantItem[];
  images: ExistingImage[];
}

interface ProductFormProps {
  initialProduct?: ProductFormData;
  categories: Array<{ id: number; name: string }>;
}

export function ProductForm({ initialProduct, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialProduct)
  );
  const [categoryId, setCategoryId] = useState<number | "">(
    initialProduct?.categoryId ?? (categories[0]?.id ?? "")
  );
  const [basePrice, setBasePrice] = useState<number>(
    initialProduct?.basePrice ?? 50000
  );
  const [status, setStatus] = useState<"ready" | "preorder" | "soldout">(
    initialProduct?.status ?? "ready"
  );
  const [preorderNote, setPreorderNote] = useState(
    initialProduct?.preorderNote ?? ""
  );
  const [description, setDescription] = useState(
    initialProduct?.description ?? ""
  );
  const [ingredients, setIngredients] = useState(
    initialProduct?.ingredients ?? ""
  );
  const [allergens, setAllergens] = useState(initialProduct?.allergens ?? "");
  const [isFeatured, setIsFeatured] = useState(
    initialProduct?.isFeatured ?? false
  );
  const [isPublished, setIsPublished] = useState(
    initialProduct?.isPublished ?? true
  );
  const [shopeeUrl, setShopeeUrl] = useState(initialProduct?.shopeeUrl ?? "");
  const [shopeeEnabled, setShopeeEnabled] = useState(
    initialProduct?.shopeeEnabled ?? false
  );
  const [tokopediaUrl, setTokopediaUrl] = useState(
    initialProduct?.tokopediaUrl ?? ""
  );
  const [tokopediaEnabled, setTokopediaEnabled] = useState(
    initialProduct?.tokopediaEnabled ?? false
  );
  const [tiktokShopUrl, setTiktokShopUrl] = useState(
    initialProduct?.tiktokShopUrl ?? ""
  );
  const [tiktokShopEnabled, setTiktokShopEnabled] = useState(
    initialProduct?.tiktokShopEnabled ?? false
  );

  // Variants state
  const [variants, setVariants] = useState<ProductVariantItem[]>(
    initialProduct?.variants ?? []
  );

  // Images state
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    initialProduct?.images ?? []
  );
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<Array<{ id: string; file: File; preview: string }>>([]);

  // Auto-slug handling
  function handleNameChange(val: string) {
    setName(val);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  }

  // Variant operations
  function addVariant() {
    setVariants((prev) => [
      ...prev,
      {
        label: "",
        price: basePrice,
        sortOrder: prev.length + 1,
      },
    ]);
  }

  function updateVariant(idx: number, field: "label" | "price", val: string | number) {
    setVariants((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        [field]: field === "price" ? Number(val) || 0 : val,
      };
      return copy;
    });
  }

  function removeVariant(idx: number) {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  }

  // Existing images operations
  function setCoverImage(imageId: number) {
    setExistingImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === imageId,
      }))
    );
  }

  function updateImageAlt(imageId: number, newAlt: string) {
    setExistingImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, alt: newAlt } : img))
    );
  }

  function removeExistingImage(imageId: number) {
    setDeletedImageIds((prev) => [...prev, imageId]);
    setExistingImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId);
      // Jika yang dihapus adalah cover dan masih ada gambar lain, jadikan gambar pertama sebagai cover
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  }

  function moveExistingImage(idx: number, direction: "up" | "down") {
    setExistingImages((prev) => {
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      // Perbarui sortOrder
      return copy.map((img, i) => ({ ...img, sortOrder: i + 1 }));
    });
  }

  // New file uploads
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    const items = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewFiles((prev) => [...prev, ...items]);
    e.target.value = ""; // reset input file
  }

  function removeNewFile(id: string) {
    setNewFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Nama produk wajib diisi.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      if (initialProduct?.id) {
        formData.set("id", initialProduct.id.toString());
      }
      formData.set("name", name);
      formData.set("slug", slug);
      if (categoryId) formData.set("categoryId", categoryId.toString());
      formData.set("basePrice", basePrice.toString());
      formData.set("status", status);
      formData.set("preorderNote", preorderNote);
      formData.set("description", description);
      formData.set("ingredients", ingredients);
      formData.set("allergens", allergens);
      formData.set("isFeatured", isFeatured ? "true" : "false");
      formData.set("isPublished", isPublished ? "true" : "false");
      formData.set("shopeeUrl", shopeeUrl);
      formData.set("shopeeEnabled", shopeeEnabled ? "true" : "false");
      formData.set("tokopediaUrl", tokopediaUrl);
      formData.set("tokopediaEnabled", tokopediaEnabled ? "true" : "false");
      formData.set("tiktokShopUrl", tiktokShopUrl);
      formData.set("tiktokShopEnabled", tiktokShopEnabled ? "true" : "false");

      // Varian JSON
      formData.set("variants", JSON.stringify(variants));

      // Existing images meta JSON
      formData.set("existingImagesMeta", JSON.stringify(existingImages));

      // Deleted images IDs JSON
      formData.set("deletedImageIds", JSON.stringify(deletedImageIds));

      // New Image Files
      for (const item of newFiles) {
        formData.append("newImages", item.file);
      }

      const res = await saveProductAction(formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        router.push("/admin/products");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {errorMessage && (
        <div
          role="alert"
          className="p-4 bg-danger/15 border-3 border-danger rounded-[10px] text-danger font-bold text-sm flex items-center gap-2"
        >
          <IconAlert className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ─── 1. INFORMASI DASAR ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] p-5 md:p-6 shadow-[var(--shadow-brutal)] space-y-4">
        <h2 className="text-lg font-extrabold pb-3 border-b-2 border-ink/10 flex items-center gap-2">
          <IconCupcake className="w-5 h-5 text-ink flex-shrink-0" />
          <span>Informasi Dasar Produk</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="prod-name"
            label="Nama Produk *"
            placeholder="Contoh: Strawberry Shortcake"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <div>
            <label htmlFor="prod-slug" className="text-sm font-semibold block mb-1">
              Slug URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-ink/40 font-mono">
                /menu/
              </span>
              <input
                id="prod-slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                className="w-full pl-16 pr-3 py-2 text-sm font-mono rounded-[8px] border-3 border-ink bg-white min-h-[44px]"
                placeholder="strawberry-shortcake"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prod-category" className="text-sm font-semibold block mb-1">
              Kategori
            </label>
            <select
              id="prod-category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full p-2.5 rounded-[8px] border-3 border-ink bg-white text-sm font-bold min-h-[44px]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            id="prod-base-price"
            type="number"
            label="Harga Dasar (Rp) *"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
            min={0}
            step={1000}
            required
          />
        </div>

        {/* Status Stok */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label htmlFor="prod-status" className="text-sm font-semibold block mb-1">
              Status Stok
            </label>
            <select
              id="prod-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "ready" | "preorder" | "soldout")
              }
              className="w-full p-2.5 rounded-[8px] border-3 border-ink bg-white text-sm font-bold min-h-[44px]"
            >
              <option value="ready">Ready (Tersedia langsung)</option>
              <option value="preorder">Pre-order (Perlu waktu pembuatan)</option>
              <option value="soldout">Habis (Tidak dapat dipesan)</option>
            </select>
          </div>

          {status === "preorder" && (
            <Input
              id="prod-preorder-note"
              label="Catatan Pre-order"
              placeholder="Contoh: Pre-order H-2"
              value={preorderNote}
              onChange={(e) => setPreorderNote(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* ─── 2. VARIAN PRODUK ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] p-5 md:p-6 shadow-[var(--shadow-brutal)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <IconRuler className="w-5 h-5 text-ink flex-shrink-0" />
              <span>Pilihan Ukuran & Varian</span>
            </h2>
            <p className="text-xs text-ink/70">
              Opsional. Jika diisi, harga di katalog akan bertuliskan &ldquo;Mulai dari&rdquo;.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={addVariant}
            aria-label="+ Tambah Varian"
            className="text-xs font-bold inline-flex items-center gap-1"
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>Tambah Varian</span>
          </Button>
        </div>

        {variants.length > 0 ? (
          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="p-3 bg-cream/40 border-2 border-ink rounded-[8px] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nama varian (misal: Diameter 18 cm / Toples 400g)"
                    value={v.label}
                    onChange={(e) => updateVariant(idx, "label", e.target.value)}
                    className="w-full p-2 border-2 border-ink rounded-[6px] bg-white text-sm font-semibold"
                    required
                  />
                </div>

                <div className="w-full sm:w-44">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-bold text-ink/50">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Harga"
                      value={v.price}
                      onChange={(e) => updateVariant(idx, "price", e.target.value)}
                      className="w-full pl-8 pr-2 py-2 border-2 border-ink rounded-[6px] bg-white text-sm font-bold tabular-nums"
                      min={0}
                      step={1000}
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  className="px-2.5 py-2 text-xs font-bold text-danger bg-danger/10 border-2 border-danger rounded-[6px] hover:bg-danger hover:text-white inline-flex items-center gap-1 cursor-pointer"
                >
                  <IconClose className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink/50 italic py-2">
            Belum ada varian. Produk ini menggunakan harga dasar tunggal.
          </p>
        )}
      </div>

      {/* ─── 3. GALERI FOTO PRODUK ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] p-5 md:p-6 shadow-[var(--shadow-brutal)] space-y-4">
        <div className="pb-3 border-b-2 border-ink/10">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <IconCamera className="w-5 h-5 text-ink flex-shrink-0" />
            <span>Galeri Foto Produk</span>
          </h2>
          <p className="text-xs text-ink/70">
            Unggah foto kue (JPEG, PNG, WebP, AVIF maksimal 5 MB). Foto otomatis dioptimasi ke WebP 1200px & 480px.
          </p>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-ink/70">Foto Tersimpan:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {existingImages.map((img, idx) => (
                <div
                  key={img.id}
                  className={`p-3 rounded-[10px] border-2 flex items-center gap-3 bg-white ${
                    img.isCover ? "border-ink ring-2 ring-ink bg-cream/30" : "border-ink/30"
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-[6px] border border-ink overflow-hidden flex-shrink-0 bg-cream">
                    <Image
                      src={img.thumbName || img.fileName}
                      alt={img.alt || "Foto kue"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Alt teks foto (aksesibilitas)"
                      value={img.alt}
                      onChange={(e) => updateImageAlt(img.id, e.target.value)}
                      className="w-full text-xs p-1.5 border border-ink rounded bg-white"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCoverImage(img.id)}
                        className={`px-2 py-0.5 text-[10px] font-extrabold rounded border inline-flex items-center gap-1 ${
                          img.isCover
                            ? "bg-mint text-ink border-ink"
                            : "bg-white text-ink/60 border-ink/30 hover:border-ink"
                        }`}
                      >
                        {img.isCover ? (
                          <>
                            <IconStar className="w-3 h-3 fill-current" />
                            <span>Foto Utama (Cover)</span>
                          </>
                        ) : (
                          "Jadikan Cover"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => moveExistingImage(idx, "up")}
                        disabled={idx === 0}
                        className="px-1.5 py-0.5 text-[10px] font-bold border border-ink rounded disabled:opacity-30"
                      >
                        ▲
                      </button>

                      <button
                        type="button"
                        onClick={() => moveExistingImage(idx, "down")}
                        disabled={idx === existingImages.length - 1}
                        className="px-1.5 py-0.5 text-[10px] font-bold border border-ink rounded disabled:opacity-30"
                      >
                        ▼
                      </button>

                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="ml-auto text-[10px] font-bold text-danger hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Files Preview */}
        {newFiles.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase text-ink/70">Foto Baru yang Akan Diunggah:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {newFiles.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-[4/3] rounded-[8px] border-2 border-ink overflow-hidden group bg-cream"
                >
                  <Image
                    src={item.preview}
                    alt="Preview baru"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(item.id)}
                    className="absolute top-1 right-1 p-1 bg-danger text-white rounded-full text-xs font-bold shadow flex items-center justify-center cursor-pointer"
                    aria-label="Batalkan foto ini"
                  >
                    <IconClose className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input File Box */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Tambah Foto Baru
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleFileSelect}
            className="w-full p-3 border-2 border-dashed border-ink rounded-[10px] bg-cream/30 text-xs font-bold cursor-pointer hover:bg-cream"
          />
        </div>
      </div>

      {/* ─── 4. DESKRIPSI & BAHAN ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] p-5 md:p-6 shadow-[var(--shadow-brutal)] space-y-4">
        <h2 className="text-lg font-extrabold pb-3 border-b-2 border-ink/10 flex items-center gap-2">
          <IconEdit className="w-5 h-5 text-ink flex-shrink-0" />
          <span>Deskripsi & Informasi Bahan</span>
        </h2>

        <Textarea
          id="prod-desc"
          label="Deskripsi Produk"
          placeholder="Ceritakan kelezatan, rasa, dan tekstur kue ini..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Textarea
            id="prod-ingredients"
            label="Komposisi & Bahan"
            placeholder="Contoh: Tepung terigu, mentega premium, telur, cream cheese..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />

          <Textarea
            id="prod-allergens"
            label="Informasi Alergen"
            placeholder="Contoh: Mengandung gluten, susu, dan telur..."
            value={allergens}
            onChange={(e) => setAllergens(e.target.value)}
          />
        </div>
      </div>

      {/* ─── 5. TAUTAN MARKETPLACE ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] p-5 md:p-6 shadow-[var(--shadow-brutal)] space-y-4">
        <div className="pb-3 border-b-2 border-ink/10">
          <h2 className="text-lg font-extrabold">Tautan Marketplace</h2>
          <p className="text-xs text-ink/70 mt-1">
            Isi tautan produk lalu aktifkan kanal yang ingin ditampilkan di halaman detail. Tautan wajib menggunakan HTTPS.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-end gap-3 rounded-[10px] border-2 border-ink/15 p-3">
            <Input
              id="prod-shopee-url"
              type="url"
              label="Link Shopee"
              placeholder="https://shopee.co.id/..."
              value={shopeeUrl}
              onChange={(event) => setShopeeUrl(event.target.value)}
            />
            <label htmlFor="prod-shopee-enabled" className="flex min-h-11 items-center gap-2 font-bold text-sm cursor-pointer">
              <input
                id="prod-shopee-enabled"
                type="checkbox"
                checked={shopeeEnabled}
                onChange={(event) => setShopeeEnabled(event.target.checked)}
                className="w-5 h-5 rounded border-2 border-ink text-mint focus:ring-ink"
              />
              Tampilkan tombol Shopee
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-end gap-3 rounded-[10px] border-2 border-ink/15 p-3">
            <Input
              id="prod-tokopedia-url"
              type="url"
              label="Link Tokopedia"
              placeholder="https://www.tokopedia.com/..."
              value={tokopediaUrl}
              onChange={(event) => setTokopediaUrl(event.target.value)}
            />
            <label htmlFor="prod-tokopedia-enabled" className="flex min-h-11 items-center gap-2 font-bold text-sm cursor-pointer">
              <input
                id="prod-tokopedia-enabled"
                type="checkbox"
                checked={tokopediaEnabled}
                onChange={(event) => setTokopediaEnabled(event.target.checked)}
                className="w-5 h-5 rounded border-2 border-ink text-mint focus:ring-ink"
              />
              Tampilkan tombol Tokopedia
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-end gap-3 rounded-[10px] border-2 border-ink/15 p-3">
            <Input
              id="prod-tiktok-shop-url"
              type="url"
              label="Link TikTok Shop"
              placeholder="https://www.tiktok.com/..."
              value={tiktokShopUrl}
              onChange={(event) => setTiktokShopUrl(event.target.value)}
            />
            <label htmlFor="prod-tiktok-shop-enabled" className="flex min-h-11 items-center gap-2 font-bold text-sm cursor-pointer">
              <input
                id="prod-tiktok-shop-enabled"
                type="checkbox"
                checked={tiktokShopEnabled}
                onChange={(event) => setTiktokShopEnabled(event.target.checked)}
                className="w-5 h-5 rounded border-2 border-ink text-mint focus:ring-ink"
              />
              Tampilkan tombol TikTok Shop
            </label>
          </div>
        </div>
      </div>

      {/* ─── 6. PENGATURAN VISIBILITAS ─── */}
      <div className="bg-white border-3 border-ink rounded-[14px] p-5 md:p-6 shadow-[var(--shadow-brutal)] space-y-4">
        <h2 className="text-lg font-extrabold pb-3 border-b-2 border-ink/10 flex items-center gap-2">
          <IconEye className="w-5 h-5 text-ink flex-shrink-0" />
          <span>Visibilitas Produk</span>
        </h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-ink text-mint focus:ring-ink"
            />
            <div>
              <span className="font-extrabold text-sm block">
                Publikasikan ke Katalog Menu Publik
              </span>
              <span className="text-xs text-ink/60">
                Jika dimatikan, produk hanya tersimpan di admin dan tidak muncul bagi pengunjung website.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-ink text-butter focus:ring-ink"
            />
            <div>
              <span className="font-extrabold text-sm block">
                Tampilkan di Produk Andalan Beranda (Featured)
              </span>
              <span className="text-xs text-ink/60">
                Produk akan dipajang pada grid utama di halaman depan website.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* ─── STICKY SUBMIT FOOTER BAR ─── */}
      <div className="sticky bottom-4 z-20 bg-white border-3 border-ink rounded-[14px] p-4 shadow-[var(--shadow-brutal-lg)] flex items-center justify-between gap-4">
        <Link href="/admin/products">
          <Button type="button" variant="ghost" className="text-sm font-bold border-2 inline-flex items-center gap-1.5">
            <IconArrowLeft className="w-4 h-4" />
            <span>Batal</span>
          </Button>
        </Link>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending}
          className="text-sm md:text-base font-extrabold shadow-[var(--shadow-brutal-sm)] inline-flex items-center gap-2"
        >
          {isPending ? (
            "Menyimpan & Memproses Gambar..."
          ) : (
            <>
              <IconSave className="w-5 h-5" />
              <span>Simpan Produk</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
