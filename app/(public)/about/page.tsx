import Image from "next/image";
import { getSettings, getOpeningHours, getAboutValues } from "@/lib/settings";
import { listFaqs } from "@/db/queries";
import { isOpenNow } from "@/lib/hours";
import { buildWhatsAppLink, generalMessage } from "@/lib/whatsapp";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import {
  SectionHeading,
  Card,
  Badge,
  Sticker,
  Button,
  PlaceholderCake,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = getSettings();
  return {
    title: `Tentang Kami | ${settings.business_name}`,
    description: `Cerita, nilai, lokasi, dan jam buka ${settings.business_name}. Semua kue dipanggang fresh setiap hari!`,
  };
}

export default function AboutPage() {
  const settings = getSettings();
  const openingHours = getOpeningHours();
  const aboutValues = getAboutValues();
  const faqs = listFaqs();
  const hoursStatus = isOpenNow(openingHours, settings.timezone);

  const waLink = buildWhatsAppLink(
    settings.whatsapp_number,
    generalMessage(settings.wa_default_message)
  );

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-16 md:space-y-24">
      {/* ─── 1. CERITA BRAND ─── */}
      <section className="space-y-8">
        <SectionHeading
          title={`Tentang ${settings.business_name}`}
          description={settings.tagline}
          className="mb-0"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Kolom Teks Cerita */}
          <div className="lg:col-span-7 space-y-4">
            <Sticker color="butter" className="inline-block mb-2">
              Dibuat Dengan Cinta Sejak 2020 💕
            </Sticker>
            <div className="prose prose-lg text-ink/90 leading-relaxed space-y-4">
              <p className="text-base md:text-lg">
                {settings.about_story}
              </p>
              <p className="text-sm md:text-base text-ink/80">
                Bagi kami, membuat kue bukan sekadar mencampur bahan-bahan di atas
                loyang. Ini tentang menciptakan momen manis saat kue dipotong
                bersama keluarga, kehangatan senyum teman yang merayakan ulang
                tahun, dan kebahagiaan sederhana di setiap gigitan.
              </p>
            </div>

            {/* Info Halal / Komitmen (bila ada) */}
            {settings.halal_info && (
              <div className="inline-flex items-center gap-2 p-3 bg-mint/30 border-2 border-ink rounded-[10px] text-sm font-bold text-ink">
                <span>🍃</span>
                <span>{settings.halal_info}</span>
              </div>
            )}
          </div>

          {/* Kolom Foto Cerita */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-pink rounded-[14px] border-3 border-ink translate-x-3 translate-y-3" />
              <div className="relative bg-white rounded-[14px] border-3 border-ink overflow-hidden shadow-[var(--shadow-brutal)]">
                {settings.about_image ? (
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={settings.about_image}
                      alt={`Suasana dapur ${settings.business_name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <PlaceholderCake
                    color="butter"
                    className="w-full rounded-none border-0 aspect-[4/3]"
                  />
                )}
                <div className="p-4 bg-white border-t-2 border-ink text-center">
                  <span className="font-extrabold text-sm block">
                    Dapur Niken Bakery
                  </span>
                  <span className="text-xs text-ink/70">
                    Setiap resep dikembangkan dan dipanggang langsung oleh kami.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. NILAI-NILAI KAMI (3 POIN) ─── */}
      {aboutValues.length > 0 && (
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-4xl font-extrabold">
              Nilai yang Selalu Kami Jaga
            </h2>
            <p className="text-sm md:text-base text-ink/80">
              Komitmen kami dalam setiap kue yang keluar dari oven dapur Niken Bakery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutValues.map((val, idx) => {
              const colors = ["bg-pink", "bg-butter", "bg-mint"];
              const icons = ["✨", "🧁", "🤝"];
              const cardColor = colors[idx % colors.length];

              return (
                <div
                  key={idx}
                  className={`${cardColor} border-3 border-ink rounded-[14px] p-6 shadow-[var(--shadow-brutal)] flex flex-col justify-between gap-4`}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {icons[idx % icons.length]}
                  </span>
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-ink/70 block mb-1">
                      Poin 0{idx + 1}
                    </span>
                    <h3 className="text-lg font-extrabold leading-snug">
                      {val}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── 3. LOKASI & JAM BUKA ─── */}
      <section className="space-y-6">
        <SectionHeading
          title="Lokasi & Jam Operasional"
          description="Kamu bisa datang langsung untuk mengambil pesanan atau menikmati aroma kue yang baru matang."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Lokasi */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase text-ink/70 tracking-wider">
                  Alamat Toko
                </span>
                <p className="text-base md:text-lg font-bold text-ink mt-1">
                  📍 {settings.address}
                </p>
              </div>

              {settings.maps_url && (
                <div>
                  <Button
                    href={settings.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="shadow-[var(--shadow-brutal-sm)] text-sm"
                  >
                    🗺 Buka di Google Maps ↗
                  </Button>
                </div>
              )}

              {/* Iframe embed (hanya jika terisi) */}
              {settings.maps_embed_url && (
                <div className="aspect-[16/9] w-full rounded-[10px] border-2 border-ink overflow-hidden shadow-[var(--shadow-brutal-sm)] mt-4">
                  <iframe
                    src={settings.maps_embed_url}
                    title="Peta Lokasi Niken Bakery"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    className="border-0 w-full h-full"
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Kolom Jam Buka */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-ink/10">
                <h3 className="font-extrabold text-lg">Jadwal Jam Buka</h3>
                {/* Penanda Buka / Tutup Sekarang */}
                <Badge
                  color={hoursStatus.isOpen ? "mint" : "danger"}
                  className="text-xs font-bold px-3 py-1"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-current mr-1.5 animate-pulse" />
                  {hoursStatus.isOpen ? "Buka Sekarang" : "Tutup"} ·{" "}
                  {hoursStatus.nextStatusText}
                </Badge>
              </div>

              <div className="space-y-1.5 text-sm">
                {openingHours.map((h) => {
                  const isToday =
                    h.day.toLowerCase() === hoursStatus.todayDayName.toLowerCase();

                  return (
                    <div
                      key={h.day}
                      className={`flex items-center justify-between py-2 px-3 rounded-[8px] transition-colors ${
                        isToday
                          ? "bg-butter border-2 border-ink font-bold shadow-[var(--shadow-brutal-sm)]"
                          : "border border-transparent hover:bg-cream"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isToday && <span>👉</span>}
                        <span>{h.day}</span>
                      </span>
                      <span>
                        {h.closed ? (
                          <span className="text-danger font-semibold">Tutup</span>
                        ) : (
                          `${h.open} - ${h.close}`
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── 4. PENGIRIMAN & KEBIJAKAN PESANAN ─── */}
      {(settings.delivery_info || settings.order_policy) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings.delivery_info && (
            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-mint border-2 border-ink flex items-center justify-center text-xl shadow-[var(--shadow-brutal-sm)]">
                🛵
              </div>
              <h3 className="text-xl font-bold">Informasi Pengiriman</h3>
              <p className="text-sm text-ink/85 leading-relaxed">
                {settings.delivery_info}
              </p>
            </Card>
          )}

          {settings.order_policy && (
            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-lavender border-2 border-ink flex items-center justify-center text-xl shadow-[var(--shadow-brutal-sm)]">
                📋
              </div>
              <h3 className="text-xl font-bold">Kebijakan Pemesanan</h3>
              <p className="text-sm text-ink/85 leading-relaxed">
                {settings.order_policy}
              </p>
            </Card>
          )}
        </section>
      )}

      {/* ─── 5. FAQ (PERTANYAAN UMUM) ─── */}
      {faqs.length > 0 && (
        <section className="space-y-6">
          <SectionHeading
            title="Pertanyaan yang Sering Diajukan"
            description="Ada hal yang ingin kamu tanyakan? Cek jawaban pertanyaan umum seputar pesanan di bawah ini."
          />
          <FaqAccordion faqs={faqs} />
        </section>
      )}

      {/* ─── 6. KONTAK LANGSUNG (CTA) ─── */}
      <section>
        <div className="bg-pink border-3 border-ink rounded-[14px] p-8 md:p-12 shadow-[var(--shadow-brutal-lg)] text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-4xl font-extrabold text-ink">
              Masih Ada Pertanyaan?
            </h2>
            <p className="text-base text-ink/80 font-medium">
              Tim kami selalu siap membantu menjawab pertanyaan seputar kue,
              custom order, atau jadwal pengiriman.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WhatsAppButton
              href={waLink}
              size="lg"
              className="w-full sm:w-auto shadow-[var(--shadow-brutal)]"
            >
              Tanya via WhatsApp
            </WhatsAppButton>
            {settings.email && (
              <Button
                href={`mailto:${settings.email}`}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto bg-white hover:bg-cream border-2 shadow-[var(--shadow-brutal)] font-bold"
              >
                ✉️ Email: {settings.email}
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
