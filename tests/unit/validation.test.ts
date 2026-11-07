import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Validasi Skema Zod Form & Action", () => {
  describe("Validasi URL External", () => {
    const urlSchema = z.string().url().refine(
      (val) => val.startsWith("http://") || val.startsWith("https://"),
      "URL harus diawali http:// atau https://"
    );

    it("menerima URL https valid", () => {
      expect(urlSchema.safeParse("https://instagram.com/nikenbakery").success).toBe(true);
    });

    it("menolak javascript: pseudo-protocol (anti-XSS)", () => {
      expect(urlSchema.safeParse("javascript:alert(1)").success).toBe(false);
    });

    it("menolak format URL tanpa protokol", () => {
      expect(urlSchema.safeParse("instagram.com/nikenbakery").success).toBe(false);
    });
  });

  describe("Validasi Rating Testimoni", () => {
    const ratingSchema = z.coerce.number().int().min(1).max(5);

    it("menerima rating antara 1 sampai 5", () => {
      expect(ratingSchema.safeParse(1).success).toBe(true);
      expect(ratingSchema.safeParse(5).success).toBe(true);
      expect(ratingSchema.safeParse("4").success).toBe(true);
    });

    it("menolak rating di luar 1-5 atau desimal", () => {
      expect(ratingSchema.safeParse(0).success).toBe(false);
      expect(ratingSchema.safeParse(6).success).toBe(false);
      expect(ratingSchema.safeParse(4.5).success).toBe(false);
    });
  });

  describe("Validasi Rentang Tanggal Banner", () => {
    const bannerDateSchema = z
      .object({
        startAt: z.number(),
        endAt: z.number().nullable().optional(),
      })
      .refine(
        (data) => !data.endAt || data.endAt > data.startAt,
        "Waktu selesai harus lebih besar dari waktu mulai"
      );

    it("menerima tanggal selesai yang lebih besar dari tanggal mulai", () => {
      const start = 1700000000;
      const end = 1700100000;
      expect(bannerDateSchema.safeParse({ startAt: start, endAt: end }).success).toBe(true);
    });

    it("menolak tanggal selesai yang lebih kecil dari tanggal mulai", () => {
      const start = 1700100000;
      const end = 1700000000;
      expect(bannerDateSchema.safeParse({ startAt: start, endAt: end }).success).toBe(false);
    });
  });

  describe("Validasi Status Produk", () => {
    const statusSchema = z.enum(["ready", "preorder", "soldout"]);

    it("menerima status ready, preorder, soldout", () => {
      expect(statusSchema.safeParse("ready").success).toBe(true);
      expect(statusSchema.safeParse("preorder").success).toBe(true);
      expect(statusSchema.safeParse("soldout").success).toBe(true);
    });

    it("menolak status yang tidak dikenal", () => {
      expect(statusSchema.safeParse("archived").success).toBe(false);
      expect(statusSchema.safeParse("in_stock").success).toBe(false);
    });
  });
});

