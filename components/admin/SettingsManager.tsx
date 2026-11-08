"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import { updateSettingsAction } from "@/actions/settings";
import { Button, Card, IconWhatsApp, IconClose, IconSave } from "@/components/ui";
import { normalizePhone, buildWhatsAppLink } from "@/lib/whatsapp";
import type { OpeningHour } from "@/lib/settings";

interface SettingsManagerProps {
  initialSettings: Record<string, string>;
}

const DAYS_OF_WEEK = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [activeTab, setActiveTab] = useState<
    "identity" | "hours" | "location" | "content" | "social"
  >("identity");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [waNumber, setWaNumber] = useState(
    initialSettings.whatsapp_number ?? "6281234567890"
  );
  const [waMessage, setWaMessage] = useState(
    initialSettings.wa_default_message ?? ""
  );

  // Parse jam buka
  const defaultHours: OpeningHour[] = DAYS_OF_WEEK.map((d) => ({
    day: d,
    open: "08:00",
    close: "20:00",
    closed: false,
  }));

  const [openingHours, setOpeningHours] = useState<OpeningHour[]>(() => {
    try {
      if (initialSettings.opening_hours) {
        const parsed = JSON.parse(initialSettings.opening_hours);
        if (Array.isArray(parsed) && parsed.length === 7) return parsed;
      }
    } catch {
      // fallback
    }
    return defaultHours;
  });

  // Parse values
  const defaultValues = ["", "", ""];
  try {
    if (initialSettings.about_values) {
      const parsed = JSON.parse(initialSettings.about_values);
      if (Array.isArray(parsed)) {
        defaultValues[0] = parsed[0] || "";
        defaultValues[1] = parsed[1] || "";
        defaultValues[2] = parsed[2] || "";
      }
    }
  } catch {
    // fallback
  }

  const [aboutValues, setAboutValues] = useState<string[]>(defaultValues);

  // Foto Profil About
  const [aboutImagePreview, setAboutImagePreview] = useState<string | null>(
    initialSettings.about_image || null
  );
  const [selectedAboutFile, setSelectedAboutFile] = useState<File | null>(null);
  const [removeAboutImage, setRemoveAboutImage] = useState(false);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleHourChange(
    index: number,
    field: keyof OpeningHour,
    val: string | boolean
  ) {
    setOpeningHours((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  }

  const normalizedWa = normalizePhone(waNumber);
  const testWaUrl = buildWhatsAppLink(
    normalizedWa,
    waMessage || "Halo Niken Bakery!"
  );

  const [, formAction, isSubmitting] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      // Tambahkan opening_hours_json
      formData.set("opening_hours_json", JSON.stringify(openingHours));
      if (removeAboutImage) {
        formData.set("remove_about_image", "true");
      }
      if (selectedAboutFile) {
        formData.set("about_image", selectedAboutFile);
      }

      const res = await updateSettingsAction(null, formData);
      if (res?.error) {
        showToast(`Gagal: ${res.error}`);
        return res;
      }
      showToast("Pengaturan toko berhasil disimpan!");
      return null;
    },
    null
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[10px] border-3 border-ink bg-mint px-4 py-3 font-heading font-black text-ink shadow-hard transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b-3 border-ink pb-4">
        <h1 className="font-heading text-2xl font-black uppercase text-ink md:text-3xl">
          Pengaturan Toko
        </h1>
        <p className="mt-1 font-body text-sm text-ink/70">
          Atur informasi kontak, jam operasional, lokasi Google Maps, dan profil brand Niken Bakery.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b-2 border-ink pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("identity")}
          className={`px-3 py-2 text-xs font-black uppercase rounded-[8px] border-2 border-ink transition-all cursor-pointer ${
            activeTab === "identity"
              ? "bg-butter text-ink shadow-[2px_2px_0px_#1B1817]"
              : "bg-white text-ink/70 hover:bg-cream"
          }`}
        >
          1. Identitas & Kontak
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hours")}
          className={`px-3 py-2 text-xs font-black uppercase rounded-[8px] border-2 border-ink transition-all cursor-pointer ${
            activeTab === "hours"
              ? "bg-butter text-ink shadow-[2px_2px_0px_#1B1817]"
              : "bg-white text-ink/70 hover:bg-cream"
          }`}
        >
          2. Jam Operasional
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("location")}
          className={`px-3 py-2 text-xs font-black uppercase rounded-[8px] border-2 border-ink transition-all cursor-pointer ${
            activeTab === "location"
              ? "bg-butter text-ink shadow-[2px_2px_0px_#1B1817]"
              : "bg-white text-ink/70 hover:bg-cream"
          }`}
        >
          3. Lokasi & Peta
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`px-3 py-2 text-xs font-black uppercase rounded-[8px] border-2 border-ink transition-all cursor-pointer ${
            activeTab === "content"
              ? "bg-butter text-ink shadow-[2px_2px_0px_#1B1817]"
              : "bg-white text-ink/70 hover:bg-cream"
          }`}
        >
          4. Konten Profil Toko
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`px-3 py-2 text-xs font-black uppercase rounded-[8px] border-2 border-ink transition-all cursor-pointer ${
            activeTab === "social"
              ? "bg-butter text-ink shadow-[2px_2px_0px_#1B1817]"
              : "bg-white text-ink/70 hover:bg-cream"
          }`}
        >
          5. Sosmed & Custom Order
        </button>
      </div>

      {/* Main Form */}
      <form action={formAction} className="space-y-6">
        {/* TAB 1: IDENTITAS & KONTAK */}
        <div className={activeTab === "identity" ? "space-y-5 block" : "hidden"}>
          <Card className="p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h2 className="font-heading text-lg font-black uppercase text-ink border-b-2 border-ink pb-2">
              Identitas Usaha
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Nama Usaha / Toko <span className="text-danger">*</span>
                </label>
                <input
                  name="business_name"
                  defaultValue={initialSettings.business_name ?? "Niken Bakery"}
                  placeholder="Contoh: Niken Bakery"
                  required
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Tagline / Slogan
                </label>
                <input
                  name="tagline"
                  defaultValue={initialSettings.tagline ?? ""}
                  placeholder="Contoh: Kue lezat untuk setiap momen spesialmu"
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black uppercase text-ink">
                  Email Kontak Toko
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={initialSettings.email ?? ""}
                  placeholder="Contoh: halo@nikenbakery.id"
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h2 className="font-heading text-lg font-black uppercase text-ink border-b-2 border-ink pb-2">
              Pengaturan WhatsApp Utama
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Nomor WhatsApp Toko <span className="text-danger">*</span>
                </label>
                <input
                  name="whatsapp_number"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  placeholder="Contoh: 081234567890 atau 6281234567890"
                  required
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-ink/70">
                  <span>
                    Format tersimpan: <strong className="text-ink font-bold">{normalizedWa}</strong>
                  </span>
                  <a
                    href={testWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-ink underline hover:text-pink"
                  >
                    <IconWhatsApp className="w-3.5 h-3.5 text-whatsapp" />
                    <span>Tes Link WhatsApp Toko ↗</span>
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Pesan Pembuka Default WhatsApp
                </label>
                <textarea
                  name="wa_default_message"
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  placeholder="Contoh: Halo Niken Bakery! Aku mau tanya-tanya soal katalog kue."
                  rows={2}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
                />
                <span className="text-[11px] text-ink/60">
                  Teks ini otomatis terisi ketika pelanggan mengeklik tombol Floating WhatsApp atau tombol bantuan umum.
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* TAB 2: JAM OPERASIONAL */}
        <div className={activeTab === "hours" ? "space-y-5 block" : "hidden"}>
          <Card className="p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <div className="flex items-center justify-between border-b-2 border-ink pb-2">
              <div>
                <h2 className="font-heading text-lg font-black uppercase text-ink">
                  Jam Operasional Toko
                </h2>
                <p className="text-xs text-ink/70">
                  Tentukan jam buka dan tutup untuk tiap hari. Sistem akan otomatis menampilkan status &quot;Buka Sekarang&quot; atau &quot;Tutup&quot; di halaman Tentang Kami.
                </p>
              </div>
            </div>

            <div className="divide-y divide-ink/20">
              {openingHours.map((item, idx) => (
                <div
                  key={item.day}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="w-28 font-heading font-black text-sm text-ink">
                    {item.day}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink/70">Buka:</span>
                      <input
                        type="time"
                        value={item.open}
                        disabled={item.closed}
                        onChange={(e) => handleHourChange(idx, "open", e.target.value)}
                        className="rounded border-2 border-ink bg-white px-2 py-1 text-xs font-bold text-ink disabled:opacity-30"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink/70">Tutup:</span>
                      <input
                        type="time"
                        value={item.close}
                        disabled={item.closed}
                        onChange={(e) => handleHourChange(idx, "close", e.target.value)}
                        className="rounded border-2 border-ink bg-white px-2 py-1 text-xs font-bold text-ink disabled:opacity-30"
                      />
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        type="checkbox"
                        id={`closed-${item.day}`}
                        checked={item.closed}
                        onChange={(e) => handleHourChange(idx, "closed", e.target.checked)}
                        className="h-4 w-4 rounded border-2 border-ink accent-danger cursor-pointer"
                      />
                      <label
                        htmlFor={`closed-${item.day}`}
                        className={`text-xs font-bold cursor-pointer ${
                          item.closed ? "text-danger" : "text-ink/80"
                        }`}
                      >
                        {item.closed ? "Toko Libur / Tutup" : "Hari Kerja"}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* TAB 3: LOKASI & PETA */}
        <div className={activeTab === "location" ? "space-y-5 block" : "hidden"}>
          <Card className="p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h2 className="font-heading text-lg font-black uppercase text-ink border-b-2 border-ink pb-2">
              Lokasi & Alamat Toko
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Alamat Lengkap Toko
                </label>
                <textarea
                  name="address"
                  defaultValue={initialSettings.address ?? ""}
                  placeholder="Tuliskan nama jalan, nomor, kelurahan, kecamatan, dan kota..."
                  rows={3}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Link Google Maps (Tombol Arahkan)
                </label>
                <input
                  name="maps_url"
                  defaultValue={initialSettings.maps_url ?? ""}
                  placeholder="Contoh: https://maps.app.goo.gl/..."
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
                <span className="text-[11px] text-ink/60">
                  Tautan langsung ke aplikasi Google Maps saat tombol &quot;Buka di Google Maps&quot; diklik pelanggan.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  URL Embed Google Maps (Opsional)
                </label>
                <input
                  name="maps_embed_url"
                  defaultValue={initialSettings.maps_embed_url ?? ""}
                  placeholder="Contoh: https://www.google.com/maps/embed?pb=..."
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
                <span className="text-[11px] text-ink/60">
                  Hanya masukkan nilai atribut src dari kode iframe embed Google Maps.
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* TAB 4: KONTEN PROFIL TOKO */}
        <div className={activeTab === "content" ? "space-y-5 block" : "hidden"}>
          <Card className="p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h2 className="font-heading text-lg font-black uppercase text-ink border-b-2 border-ink pb-2">
              Cerita & Filosofi Toko
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Cerita Brand (Halaman Tentang Kami)
                </label>
                <textarea
                  name="about_story"
                  defaultValue={initialSettings.about_story ?? ""}
                  placeholder="Ceritakan awal mula toko, dedikasi pembuat kue, dan visi Niken Bakery..."
                  rows={4}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-black uppercase text-ink">
                  3 Nilai Utama Filosofi Toko
                </label>
                <div className="space-y-2">
                  <input
                    name="about_value_1"
                    value={aboutValues[0]}
                    onChange={(e) => {
                      const v = [...aboutValues];
                      v[0] = e.target.value;
                      setAboutValues(v);
                    }}
                    placeholder="Nilai 1: Contoh: Bahan berkualitas premium tanpa pengawet"
                    className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                  />
                  <input
                    name="about_value_2"
                    value={aboutValues[1]}
                    onChange={(e) => {
                      const v = [...aboutValues];
                      v[1] = e.target.value;
                      setAboutValues(v);
                    }}
                    placeholder="Nilai 2: Contoh: Dibuat fresh setiap hari dengan cinta"
                    className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                  />
                  <input
                    name="about_value_3"
                    value={aboutValues[2]}
                    onChange={(e) => {
                      const v = [...aboutValues];
                      v[2] = e.target.value;
                      setAboutValues(v);
                    }}
                    placeholder="Nilai 3: Contoh: Harga ramah untuk semua kalangan"
                    className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                  />
                </div>
              </div>

              {/* Upload Foto Profil Toko / Kitchen */}
              <div className="space-y-2 pt-2 border-t border-ink/20">
                <label className="text-xs font-black uppercase text-ink">
                  Foto Profil / Dapur Toko (Halaman About)
                </label>

                {aboutImagePreview && !removeAboutImage ? (
                  <div className="relative w-48 h-32 rounded-[8px] border-2 border-ink overflow-hidden bg-white">
                    <Image
                      src={aboutImagePreview}
                      alt="Preview foto about"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRemoveAboutImage(true);
                        setAboutImagePreview(null);
                        setSelectedAboutFile(null);
                      }}
                      className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 text-xs font-bold shadow cursor-pointer flex items-center justify-center"
                      title="Hapus foto ini"
                      aria-label="Hapus foto ini"
                    >
                      <IconClose className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      name="about_image"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedAboutFile(file);
                          setAboutImagePreview(URL.createObjectURL(file));
                          setRemoveAboutImage(false);
                        }
                      }}
                      className="block w-full text-xs text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-[6px] file:border-2 file:border-ink file:text-xs file:font-black file:bg-butter file:cursor-pointer hover:file:bg-butter/80"
                    />
                    <span className="text-[11px] text-ink/60">
                      Foto suasana dapur atau kue andalan untuk menghias halaman Tentang Kami.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h2 className="font-heading text-lg font-black uppercase text-ink border-b-2 border-ink pb-2">
              Kebijakan Toko & Pengiriman
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Informasi Pengiriman & Area Antar
                </label>
                <textarea
                  name="delivery_info"
                  defaultValue={initialSettings.delivery_info ?? ""}
                  placeholder="Informasi area pengiriman, kurir instan, dan perhitungan ongkir..."
                  rows={2}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Kebijakan Pemesanan & Pembatalan
                </label>
                <textarea
                  name="order_policy"
                  defaultValue={initialSettings.order_policy ?? ""}
                  placeholder="Informasi pembayaran DP, pelunasan, batas pembatalan..."
                  rows={2}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Informasi Kehalalan Bahan
                </label>
                <textarea
                  name="halal_info"
                  defaultValue={initialSettings.halal_info ?? ""}
                  placeholder="Contoh: Seluruh produk Niken Bakery menggunakan bahan 100% halal tanpa alkohol."
                  rows={2}
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* TAB 5: SOSIAL MEDIA & CUSTOM ORDER */}
        <div className={activeTab === "social" ? "space-y-5 block" : "hidden"}>
          <Card className="p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h2 className="font-heading text-lg font-black uppercase text-ink border-b-2 border-ink pb-2">
              Akun Media Sosial Resmi
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  URL Instagram Toko
                </label>
                <input
                  name="instagram_url"
                  defaultValue={initialSettings.instagram_url ?? ""}
                  placeholder="Contoh: https://instagram.com/nikenbakery"
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  URL TikTok Toko
                </label>
                <input
                  name="tiktok_url"
                  defaultValue={initialSettings.tiktok_url ?? ""}
                  placeholder="Contoh: https://tiktok.com/@nikenbakery"
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-3 border-ink shadow-hard space-y-4">
            <h2 className="font-heading text-lg font-black uppercase text-ink border-b-2 border-ink pb-2">
              Opsi Pemesanan Custom Cake
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="custom-order-toggle"
                  name="custom_order_enabled"
                  value="true"
                  defaultChecked={initialSettings.custom_order_enabled === "true"}
                  className="h-5 w-5 rounded border-2 border-ink accent-pink cursor-pointer"
                />
                <label
                  htmlFor="custom-order-toggle"
                  className="text-sm font-bold text-ink cursor-pointer"
                >
                  Buka layanan Custom Cake / Kue Sesuai Permintaan
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-ink">
                  Minimal Hari Pemesanan (H-Hari)
                </label>
                <input
                  name="custom_order_min_days"
                  type="number"
                  min={1}
                  max={30}
                  defaultValue={initialSettings.custom_order_min_days ?? "3"}
                  placeholder="3"
                  className="w-full rounded-[8px] border-2 border-ink bg-white px-3 py-2 text-sm font-bold text-ink"
                />
                <span className="text-[11px] text-ink/60">
                  Jumlah hari minimal sebelum acara untuk pesanan kue khusus.
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Button Sticky Footer */}
        <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-sm p-4 rounded-[12px] border-3 border-ink shadow-hard flex items-center justify-between gap-4">
          <p className="text-xs text-ink/70 hidden sm:block">
            Pastikan perubahan telah sesuai sebelum menekan tombol simpan.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center gap-1.5"
          >
            {isSubmitting ? (
              "Menyimpan Pengaturan..."
            ) : (
              <>
                <IconSave className="w-4 h-4" />
                <span>Simpan Semua Pengaturan</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
