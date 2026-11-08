import Link from "next/link";
import { Button } from "@/components/ui";

interface HeroSectionProps {
  generalWaLink: string;
  address: string;
  todayHour?: {
    day: string;
    open: string;
    close: string;
    closed: boolean;
  };
}

export function HeroSection({
  generalWaLink,
  address,
  todayHour,
}: HeroSectionProps) {
  const shortAddress = address.split(",")[0] || address;
  const hoursText = todayHour
    ? todayHour.closed
      ? "Tutup"
      : `${todayHour.open} - ${todayHour.close}`
    : "08:00 - 20:00";

  return (
    <section className="relative w-full overflow-hidden bg-cream pt-6 sm:pt-10 md:pt-14 pb-14 sm:pb-20 md:pb-28">
      {/* ─── LATAR BELAKANG DEKORATIF (ORGANIC WAVES & SPARKLES) ─── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* 1. Ombak Kiri Atas (Kuning & Pink Berlapis Organik) */}
        <svg
          className="absolute -top-1 -left-1 w-[180px] sm:w-[260px] md:w-[340px] lg:w-[400px] h-auto z-0"
          viewBox="0 0 400 280"
          fill="none"
        >
          {/* Lapisan kuning mentega di belakang */}
          <path
            d="M0 0 H280 C240 100, 160 170, 50 190 C15 195, 0 200, 0 200 Z"
            fill="#FFE899"
            fillOpacity="0.85"
          />
          {/* Lapisan pink lembut melengkung di depan */}
          <path
            d="M0 0 H180 C170 90, 110 160, 25 245 C5 260, 0 270, 0 270 Z"
            fill="#FFAEC8"
            fillOpacity="0.9"
          />
        </svg>

        {/* 2. Ombak Kanan Atas (Kuning Mentega Organik) */}
        <svg
          className="absolute -top-1 -right-1 w-[220px] sm:w-[320px] md:w-[420px] lg:w-[500px] h-auto z-0"
          viewBox="0 0 500 240"
          fill="none"
        >
          <path
            d="M500 0 H160 C230 85, 320 135, 440 160 C470 165, 500 170, 500 170 Z"
            fill="#FFE37D"
            fillOpacity="0.85"
          />
        </svg>

        {/* 3. Ombak Kiri Bawah (Kuning Mentega Lembut) */}
        <svg
          className="absolute -bottom-1 -left-1 w-[160px] sm:w-[220px] md:w-[280px] h-auto z-0"
          viewBox="0 0 280 220"
          fill="none"
        >
          <path
            d="M0 220 V80 C40 115, 95 145, 160 175 C210 198, 240 220, 240 220 Z"
            fill="#FFE37D"
            fillOpacity="0.85"
          />
        </svg>

        {/* 4. Ombak Kanan Bawah (Signature Double-Layer Pink Waves) */}
        <svg
          className="absolute -bottom-1 -right-1 w-[320px] sm:w-[480px] md:w-[620px] lg:w-[750px] xl:w-[840px] h-auto z-0"
          viewBox="0 0 840 400"
          fill="none"
        >
          {/* Lapisan bawah: soft pastel pink/peach */}
          <path
            d="M840 40 C750 110, 670 170, 550 215 C410 268, 290 285, 140 350 C70 375, 20 395, 0 400 H840 Z"
            fill="#FFBAC9"
            fillOpacity="0.8"
          />
          {/* Lapisan atas: vibrant strawberry rose-pink */}
          <path
            d="M840 140 C740 195, 640 248, 510 280 C390 310, 280 330, 160 380 C110 395, 60 400, 30 400 H840 Z"
            fill="#FA4D75"
            fillOpacity="0.95"
          />
        </svg>

        {/* 5. Aksen Sparkle & Dekorasi Mengambang */}
        {/* Sparkle Pink Kiri Tengah */}
        <div className="absolute left-[3%] sm:left-[5%] top-[50%] sm:top-[54%] z-0">
          <svg className="w-5 sm:w-6 h-5 sm:h-6" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z"
              fill="#FA4D75"
            />
          </svg>
        </div>

        {/* Titik & Sparkle Kuning Kiri Bawah */}
        <div className="absolute left-[6%] sm:left-[8%] bottom-[16%] sm:bottom-[20%] z-0 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBF00] inline-block" />
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z"
              fill="#FFBF00"
            />
          </svg>
        </div>

        {/* Sparkle Kuning & Aksen Pink Kanan Atas */}
        <div className="absolute right-[8%] sm:right-[12%] top-[16%] sm:top-[20%] z-0 flex items-start gap-2">
          <svg className="w-6 sm:w-7 h-6 sm:h-7" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z"
              fill="#FFBF00"
            />
          </svg>
          <svg className="w-4 sm:w-5 h-4 sm:h-5 -mt-1" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 18 L11 6"
              stroke="#FA4D75"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M15 20 L21 8"
              stroke="#FA4D75"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Garis Aksen Melengkung Kanan Bawah (di atas ombak pink) */}
        <div className="absolute right-[12%] sm:right-[15%] bottom-[26%] sm:bottom-[30%] z-0 hidden sm:block">
          <svg className="w-12 h-9" viewBox="0 0 48 36" fill="none">
            <path
              d="M10 26 C20 20, 32 14, 42 6"
              stroke="#FA4D75"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M2 34 C12 29, 20 24, 28 18"
              stroke="#FA4D75"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* ─── KONTEN UTAMA HERO ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6 text-left">
          {/* Badge: Dipanggang Segar Setiap Pagi! */}
          <div className="inline-block relative">
            {/* 3 Garis Sinar Kuning di Kanan Atas Badge */}
            <svg
              className="absolute -top-3.5 sm:-top-4 -right-2 sm:-right-3 w-6 sm:w-7 h-5 sm:h-6 pointer-events-none"
              viewBox="0 0 28 22"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 18 L1 12" stroke="#FFBF00" strokeWidth="3" strokeLinecap="round" />
              <path d="M14 15 L14 3" stroke="#FFBF00" strokeWidth="3" strokeLinecap="round" />
              <path d="M24 18 L27 12" stroke="#FFBF00" strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[10px] sm:rounded-[12px] bg-[#FFAEC8] border-2 sm:border-3 border-ink shadow-[2px_2px_0px_#2B1B17] sm:shadow-[3px_3px_0px_#2B1B17]">
              <span className="text-white text-xs sm:text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">✦</span>
              <span className="font-heading font-black text-xs sm:text-sm text-ink tracking-wide">
                Dipanggang Segar Setiap Pagi!
              </span>
            </div>
          </div>

          {/* Judul Besar (Heading 1) */}
          <h1 className="font-heading font-black text-ink text-[38px] sm:text-[54px] md:text-[68px] lg:text-[78px] xl:text-[84px] leading-[1.06] tracking-tight">
            Kue Lezat,
            <br />
            Momen Lebih
            <br />
            <span className="relative inline-block pb-2 sm:pb-3">
              Manis.
              {/* Garis Bawah Lengkung Pink Tebal & Ceria */}
              <svg
                className="absolute left-0 bottom-0 sm:bottom-0.5 w-full h-3.5 sm:h-5 pointer-events-none overflow-visible z-10"
                viewBox="0 0 200 20"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 12 C55 18, 130 18, 196 6"
                  stroke="#FA4D75"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
              {/* Dua Garis Aksen Pink Melengkung di Samping Kanan */}
              <span
                className="absolute -right-8 sm:-right-11 top-1 sm:top-2 pointer-events-none"
                aria-hidden="true"
              >
                <svg
                  className="w-7 sm:w-9 h-7 sm:h-9"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M6 18 C14 13, 20 8, 26 2"
                    stroke="#FA4D75"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 28 C18 23, 24 18, 30 12"
                    stroke="#FA4D75"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Deskripsi */}
          <p className="text-sm sm:text-base md:text-lg text-ink/80 font-medium max-w-xl leading-relaxed">
            Kue lezat untuk setiap momen spesialmu. Pilihan cake, brownies, dan
            pastry istimewa yang siap memeriahkan harimu. Pesan langsung tanpa
            ribet!
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <Button
              href={generalWaLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="wa"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base font-extrabold shadow-[var(--shadow-brutal)]"
            >
              <span>💬</span>
              <span>Pesan via WhatsApp</span>
            </Button>
            <Link href="/menu" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base font-extrabold shadow-[var(--shadow-brutal)]"
              >
                <span>🍰</span>
                <span>Lihat Koleksi Menu</span>
              </Button>
            </Link>
          </div>

          {/* Info Cepat Toko */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-ink/80">
            <div className="flex items-center gap-1.5">
              <span>📍</span>
              <span>Toko di {shortAddress}</span>
            </div>
            <span
              className="hidden sm:inline text-ink/40 font-bold"
              aria-hidden="true"
            >
              |
            </span>
            <div className="flex items-center gap-1.5">
              <span>⏰</span>
              <span>Hari ini: {hoursText}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
