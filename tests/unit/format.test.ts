import { describe, it, expect } from "vitest";
import { formatRupiah, formatDate } from "@/lib/format";

describe("lib/format", () => {
  describe("formatRupiah", () => {
    it("memformat nominal positif ke format Rupiah standar", () => {
      const formatted = formatRupiah(165000);
      expect(formatted).toMatch(/Rp165\.000/);
    });

    it("memformat 0 ke Rp0", () => {
      const formatted = formatRupiah(0);
      expect(formatted).toMatch(/Rp0/);
    });

    it("memformat angka jutaan dengan pemisah ribuan titik", () => {
      const formatted = formatRupiah(1500000);
      expect(formatted).toMatch(/Rp1\.500\.000/);
    });
  });

  describe("formatDate", () => {
    it("memformat tanggal ke format bahasa Indonesia", () => {
      // 7 November 2026
      const d = new Date(2026, 10, 7);
      const formatted = formatDate(d);
      expect(formatted).toContain("7");
      expect(formatted).toContain("November");
      expect(formatted).toContain("2026");
    });
  });
});

