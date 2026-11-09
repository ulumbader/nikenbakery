"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { IconWhatsApp } from "@/components/ui/Icons";
import { formatRupiah } from "@/lib/format";
import { buildWhatsAppLink, checkoutOrderMessage } from "@/lib/whatsapp";

interface CheckoutFormProps {
  productId: number;
  productName: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  whatsappNumber: string;
  pickupAddress: string;
}

export function CheckoutForm({
  productId,
  productName,
  variantLabel,
  quantity,
  unitPrice,
  subtotal,
  whatsappNumber,
  pickupAddress,
}: CheckoutFormProps) {
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const buyerName = String(formData.get("buyerName") ?? "").trim();
    const buyerPhone = String(formData.get("buyerPhone") ?? "").trim();
    const pickupDate = String(formData.get("pickupDate") ?? "");
    const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    const message = checkoutOrderMessage({
      productName,
      variantLabel,
      quantity,
      unitPrice,
      buyerName,
      buyerPhone,
      fulfillment,
      pickupDate,
      deliveryAddress,
      note,
    });

    // Pertahankan hitungan klik WhatsApp seperti CTA produk sebelumnya.
    try {
      const payload = JSON.stringify({ type: "wa_click", productId });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => undefined);
      }
    } catch {
      // Kegagalan analitik tidak boleh menahan pelanggan.
    }

    window.location.assign(buildWhatsAppLink(whatsappNumber, message));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nama lengkap"
          name="buyerName"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="Nama pemesan"
        />
        <Input
          label="Nomor WhatsApp"
          name="buyerPhone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          minLength={9}
          maxLength={20}
          placeholder="Contoh: 0812 3456 7890"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Pesanan diambil atau dikirim?"
          name="fulfillment"
          value={fulfillment}
          onChange={(event) => setFulfillment(event.target.value as "pickup" | "delivery")}
          options={[
            { value: "pickup", label: "Ambil di toko" },
            { value: "delivery", label: "Dikirim ke alamat" },
          ]}
        />
        <Input
          label="Tanggal ambil / kirim"
          name="pickupDate"
          type="date"
          required
        />
      </div>

      {fulfillment === "pickup" ? (
        <div className="rounded-[8px] border-2 border-ink/25 bg-cream p-3 text-sm">
          <span className="block font-bold">Lokasi pengambilan</span>
          <span>{pickupAddress}</span>
        </div>
      ) : (
        <Input
          label="Alamat pengiriman"
          name="deliveryAddress"
          autoComplete="street-address"
          required
          minLength={8}
          maxLength={250}
          placeholder="Nama jalan, nomor rumah, kecamatan, kota"
        />
      )}

      <Textarea
        label="Catatan untuk toko (opsional)"
        name="note"
        maxLength={500}
        placeholder="Contoh: tulis ucapan di kartu, patokan alamat, atau detail lain"
      />

      <div className="rounded-[10px] border-2 border-ink bg-butter/35 p-3 text-sm leading-relaxed">
        {fulfillment === "delivery"
          ? "Ongkir belum termasuk dalam total. Admin akan mengonfirmasi biaya pengiriman lewat WhatsApp."
          : "Total sementara adalah harga produk. Kami akan mengonfirmasi ketersediaan dan jadwal lewat WhatsApp."}
      </div>

      <Button type="submit" variant="wa" size="lg" className="w-full font-extrabold">
        <IconWhatsApp className="h-5 w-5" />
        Beli sekarang · {formatRupiah(subtotal)}
      </Button>
      <p className="text-center text-xs text-ink/70">
        Pesanan belum tersimpan di website. Tombol ini membuka WhatsApp dengan ringkasan bill.
      </p>
    </form>
  );
}
