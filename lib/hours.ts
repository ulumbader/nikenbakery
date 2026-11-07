import type { OpeningHour } from "./settings";

export interface StoreHoursStatus {
  isOpen: boolean;
  todayHour?: OpeningHour;
  todayDayName: string;
  nextStatusText: string;
}

const DAY_MAP: Record<number, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

/**
 * Konversi string waktu "HH:MM" menjadi total menit sejak tengah malam.
 * Contoh: "08:30" -> 510
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

/**
 * Cek apakah toko sedang buka berdasarkan jadwal jam buka dan zona waktu.
 * Menerima `testDate` opsional untuk kemudahan unit testing/verifikasi murni.
 */
export function isOpenNow(
  openingHours: OpeningHour[],
  timezone = "Asia/Jakarta",
  testDate?: Date
): StoreHoursStatus {
  const now = testDate ?? new Date();

  // Dapatkan hari dan jam di zona waktu yang ditentukan
  let dayName = "Senin";
  let currentMinutes = 0;

  try {
    const formatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: timezone,
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const weekdayPart = parts.find((p) => p.type === "weekday")?.value;
    const hourPart = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
    const minutePart = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

    if (weekdayPart) {
      // Normalisasi huruf kapital di awal, mis. "senin" -> "Senin"
      dayName =
        weekdayPart.charAt(0).toUpperCase() + weekdayPart.slice(1).toLowerCase();
    }
    currentMinutes = hourPart * 60 + minutePart;
  } catch {
    // Fallback jika timezone invalid
    dayName = DAY_MAP[now.getDay()] ?? "Senin";
    currentMinutes = now.getHours() * 60 + now.getMinutes();
  }

  // Cari jadwal untuk hari ini
  const todayHour = openingHours.find(
    (h) => h.day.toLowerCase() === dayName.toLowerCase()
  );

  if (!todayHour || todayHour.closed) {
    return {
      isOpen: false,
      todayHour,
      todayDayName: dayName,
      nextStatusText: "Tutup hari ini",
    };
  }

  const openMinutes = timeToMinutes(todayHour.open);
  const closeMinutes = timeToMinutes(todayHour.close);

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      todayHour,
      todayDayName: dayName,
      nextStatusText: `Buka sampai pukul ${todayHour.close}`,
    };
  }

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      todayHour,
      todayDayName: dayName,
      nextStatusText: `Buka pukul ${todayHour.open}`,
    };
  }

  return {
    isOpen: false,
    todayHour,
    todayDayName: dayName,
    nextStatusText: "Sudah tutup",
  };
}
