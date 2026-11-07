import { describe, it, expect } from "vitest";
import {
  normalizePhone,
  buildWhatsAppLink,
  orderMessage,
  inquiryMessage,
  generalMessage,
} from "@/lib/whatsapp";

describe("lib/whatsapp", () => {
  describe("normalizePhone", () => {
    it("mengubah awalan 08... menjadi 628...", () => {
      expect(normalizePhone("081234567890")).toBe("6281234567890");
    });

    it("menghapus tanda plus pada format internasional +62...", () => {
      expect(normalizePhone("+6281234567890")).toBe("6281234567890");
    });

    it("mempertahankan nomor yang sudah diawali 62...", () => {
      expect(normalizePhone("6281234567890")).toBe("6281234567890");
    });

    it("membersihkan spasi, tanda strip, dan tanda kurung", () => {
      expect(normalizePhone("0812-3456-7890")).toBe("6281234567890");
      expect(normalizePhone("+62 (812) 3456 7890")).toBe("6281234567890");
    });
  });

  describe("buildWhatsAppLink", () => {
    it("membuat URL wa.me dengan teks ter-encode URI", () => {
      const link = buildWhatsAppLink("081234567890", "Halo! Kue enak ✨");
      expect(link).toContain("https://wa.me/6281234567890?text=");
      expect(link).toContain(encodeURIComponent("Halo! Kue enak ✨"));
    });
  });

  describe("orderMessage", () => {
    it("menghasilkan template pesanan dengan nama produk dan varian", () => {
      const msg = orderMessage({
        productName: "Strawberry Shortcake",
        variantLabel: "Diameter 16cm",
      });
      expect(msg).toContain("Strawberry Shortcake (Diameter 16cm)");
      expect(msg).toContain("Jumlah: 1");
      expect(msg).toContain("Tanggal ambil/kirim:");
    });

    it("menghasilkan template pesanan tanpa varian jika tidak diberikan", () => {
      const msg = orderMessage({
        productName: "Fudgy Brownies",
      });
      expect(msg).toContain("• Fudgy Brownies");
      expect(msg).not.toContain("undefined");
    });
  });

  describe("inquiryMessage & generalMessage", () => {
    it("inquiryMessage memuat nama produk yang habis", () => {
      const msg = inquiryMessage({ productName: "Basque Cheesecake" });
      expect(msg).toContain("Basque Cheesecake");
      expect(msg).toContain("ketersediaan atau jadwal restock");
    });

    it("generalMessage menggunakan pesan default bila kustom kosong", () => {
      const msg = generalMessage();
      expect(msg).toContain("Halo Niken Bakery!");
    });
  });
});

