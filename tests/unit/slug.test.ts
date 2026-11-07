import { describe, it, expect } from "vitest";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

describe("lib/slug", () => {
  describe("generateSlug", () => {
    it("mengonversi teks huruf besar dan spasi menjadi slug lowercase dengan tanda hubung", () => {
      expect(generateSlug("Strawberry Shortcake Spesial")).toBe(
        "strawberry-shortcake-spesial"
      );
    });

    it("menghapus karakter khusus dan simbol", () => {
      expect(generateSlug("Kue Tart & Cookies @100% Halal!")).toBe(
        "kue-tart-cookies-100-halal"
      );
    });

    it("menghapus tanda hubung berulang", () => {
      expect(generateSlug("Kue --- Cokelat -- Lumer")).toBe("kue-cokelat-lumer");
    });
  });

  describe("ensureUniqueSlug", () => {
    it("mengembalikan slug asli jika belum digunakan", () => {
      const existing = ["kue-cokelat", "roti-manis"];
      expect(ensureUniqueSlug("kue-keju", existing)).toBe("kue-keju");
    });

    it("menambahkan -2 jika slug sudah ada", () => {
      const existing = ["kue-cokelat", "roti-manis"];
      expect(ensureUniqueSlug("kue-cokelat", existing)).toBe("kue-cokelat-2");
    });

    it("menambahkan -3 jika -2 juga sudah ada", () => {
      const existing = ["kue-cokelat", "kue-cokelat-2"];
      expect(ensureUniqueSlug("kue-cokelat", existing)).toBe("kue-cokelat-3");
    });
  });
});

