import { describe, it, expect } from "vitest";
import { timeToMinutes, isOpenNow } from "@/lib/hours";
import type { OpeningHour } from "@/lib/settings";

const sampleSchedule: OpeningHour[] = [
  { day: "Senin", open: "09:00", close: "20:00", closed: false },
  { day: "Selasa", open: "09:00", close: "20:00", closed: false },
  { day: "Rabu", open: "09:00", close: "20:00", closed: false },
  { day: "Kamis", open: "09:00", close: "20:00", closed: false },
  { day: "Jumat", open: "09:00", close: "21:00", closed: false },
  { day: "Sabtu", open: "08:00", close: "21:00", closed: false },
  { day: "Minggu", open: "08:00", close: "20:00", closed: true }, // Libur Minggu
];

describe("lib/hours", () => {
  describe("timeToMinutes", () => {
    it("mengonversi format jam:menit ke total menit sejak tengah malam", () => {
      expect(timeToMinutes("00:00")).toBe(0);
      expect(timeToMinutes("09:00")).toBe(540);
      expect(timeToMinutes("20:30")).toBe(1230);
    });

    it("mengembalikan 0 jika format tidak valid", () => {
      expect(timeToMinutes("invalid")).toBe(0);
    });
  });

  describe("isOpenNow", () => {
    it("mengembalikan isOpen: true jika waktu saat ini berada di dalam jam operasional", () => {
      // Senin, jam 14:00 WIB (07:00 UTC)
      const testDate = new Date("2026-11-02T07:00:00Z");
      const status = isOpenNow(sampleSchedule, "Asia/Jakarta", testDate);
      expect(status.isOpen).toBe(true);
      expect(status.todayDayName).toBe("Senin");
      expect(status.nextStatusText).toContain("Buka sampai pukul 20:00");
    });

    it("mengembalikan isOpen: false jika waktu saat ini sebelum jam buka", () => {
      // Senin, jam 07:00 WIB (00:00 UTC)
      const testDate = new Date("2026-11-02T00:00:00Z");
      const status = isOpenNow(sampleSchedule, "Asia/Jakarta", testDate);
      expect(status.isOpen).toBe(false);
      expect(status.nextStatusText).toContain("Buka pukul 09:00");
    });

    it("mengembalikan isOpen: false jika waktu saat ini setelah jam tutup", () => {
      // Senin, jam 22:00 WIB (15:00 UTC)
      const testDate = new Date("2026-11-02T15:00:00Z");
      const status = isOpenNow(sampleSchedule, "Asia/Jakarta", testDate);
      expect(status.isOpen).toBe(false);
      expect(status.nextStatusText).toBe("Sudah tutup");
    });

    it("mengembalikan isOpen: false dengan status Tutup hari ini jika hari libur", () => {
      // Minggu, jam 12:00 WIB (05:00 UTC)
      const testDate = new Date("2026-11-08T05:00:00Z");
      const status = isOpenNow(sampleSchedule, "Asia/Jakarta", testDate);
      expect(status.isOpen).toBe(false);
      expect(status.nextStatusText).toBe("Tutup hari ini");
    });
  });
});

