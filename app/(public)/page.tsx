import Link from "next/link";
import Image from "next/image";
import { getSettings, getOpeningHours } from "@/lib/settings";
import {
  listFeaturedProducts,
  listActiveBanners,
  listTestimonials,
  listSocialPosts,
} from "@/db/queries";
import { buildWhatsAppLink, generalMessage } from "@/lib/whatsapp";
import { ProductCard, HeroSection } from "@/components/public";
import {
  Button,
  Card,
  Marquee,
  SectionHeading,
  PlaceholderCake,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = getSettings();
  return {
    title: `Home | ${settings.business_name}`,
    description: settings.tagline,
  };
}

export default function HomePage() {
  const settings = getSettings();
  const featuredProducts = listFeaturedProducts(6);
  const activeBanners = listActiveBanners();
  const testimonials = listTestimonials();
  const socialPosts = listSocialPosts(6);
  const openingHours = getOpeningHours();

  // Find today's opening hours
  const todayName = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
  }).format(new Date());
  const todayHour = openingHours.find(
    (h) => h.day.toLowerCase() === todayName.toLowerCase()
  );

  const generalWaLink = buildWhatsAppLink(
    settings.whatsapp_number,
    generalMessage(settings.wa_default_message)
  );

  return (
    <div className="space-y-10 sm:space-y-14 md:space-y-20 pb-12 sm:pb-16 overflow-hidden">
      {/* ─── 1. HERO SECTION ─── */}
      <HeroSection
        generalWaLink={generalWaLink}
        address={settings.address}
        todayHour={todayHour}
      />

      {/* ─── 2. STRIP MARQUEE ─── */}
      <section aria-label="Sorotan keunggulan">
        <Marquee speed={45}>
          <span className="font-extrabold text-base md:text-lg">
            🎂 Dipanggang segar setiap pagi
          </span>
          <span className="font-extrabold text-base md:text-lg">
            ✨ Bahan premium pilihan tanpa pengawet
          </span>
          <span className="font-extrabold text-base md:text-lg">
            🍰 Terima pesanan kue custom
          </span>
          <span className="font-extrabold text-base md:text-lg">
            📦 Pre-order praktis via WhatsApp
          </span>
          <span className="font-extrabold text-base md:text-lg">
            🧁 100% Halal & higienis
          </span>
        </Marquee>
      </section>

      {/* ─── 3. PRODUK ANDALAN (FEATURED) ─── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-3 sm:gap-4">
          <SectionHeading
            title="Kue Andalan Kami"
            description="Deretan kue paling disukai oleh pelanggan setia Niken Bakery. Fresh, lembut, dan bikin nagih."
            className="mb-0"
          />
          <Link href="/menu" className="self-start sm:self-auto shrink-0">
            <Button
              variant="ghost"
              className="text-xs sm:text-sm font-bold border-2 hover:bg-butter"
            >
              Lihat semua menu →
            </Button>
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border-3 border-ink rounded-[14px] p-6 sm:p-8 text-center shadow-[var(--shadow-brutal)]">
            <p className="text-sm sm:text-base font-semibold">
              Kue andalan sedang dipersiapkan di dapur! 🧁
            </p>
          </div>
        )}
      </section>

      {/* ─── 4. BANNER PROMO AKTIF ─── */}
      {activeBanners.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="space-y-4 sm:space-y-6">
            {activeBanners.map((banner) => {
              const bannerBg =
                banner.color === "butter"
                  ? "bg-butter"
                  : banner.color === "mint"
                  ? "bg-mint"
                  : banner.color === "lavender"
                  ? "bg-lavender"
                  : "bg-pink";

              return (
                <div
                  key={banner.id}
                  className={`${bannerBg} border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal)] p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6`}
                >
                  <div className="space-y-1.5 sm:space-y-2 max-w-xl">
                    <span className="inline-block bg-white text-ink text-[10px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[6px] border-2 border-ink">
                      Promo Spesial 🎉
                    </span>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-ink leading-tight">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-xs sm:text-base font-medium text-ink/80">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>

                  {banner.ctaLabel && (
                    <Button
                      href={banner.ctaUrl || generalWaLink}
                      variant="primary"
                      className="bg-white text-ink hover:bg-cream whitespace-nowrap font-bold text-xs sm:text-sm py-2 px-4"
                    >
                      {banner.ctaLabel}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── 5. CARA PESAN (4 LANGKAH BERNOMOR) ─── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionHeading
          title="Cara Pesan di Niken Bakery"
          description="Pesan kue favoritmu semudah mengirim chat santai. Tanpa ribet akun atau form rumit!"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            {
              step: "01",
              title: "Pilih Kue",
              desc: "Telusuri katalog menu kami dan pilih kue yang cocok untuk momen spesialmu.",
              color: "bg-pink",
            },
            {
              step: "02",
              title: "Klik Pesan via WA",
              desc: "Tekan tombol WhatsApp pada kue yang kamu mau. Format pesanan langsung terisi otomatis.",
              color: "bg-butter",
            },
            {
              step: "03",
              title: "Konfirmasi Pesanan",
              desc: "Diskusikan tanggal ambil/kirim dan selesaikan pembayaran DP dengan tim kami.",
              color: "bg-mint",
            },
            {
              step: "04",
              title: "Kue Siap Dinikmati",
              desc: "Kue lezatmu siap diambil di toko atau kami antarkan aman sampai tujuan!",
              color: "bg-lavender",
            },
          ].map((item) => (
            <Card key={item.step} className="p-3 sm:p-6 flex flex-col justify-between">
              <div>
                <div
                  className={`w-8 h-8 sm:w-12 sm:h-12 rounded-[8px] sm:rounded-[10px] border-2 border-ink ${item.color} flex items-center justify-center font-extrabold text-xs sm:text-lg shadow-[var(--shadow-brutal-sm)] mb-2 sm:mb-4`}
                >
                  {item.step}
                </div>
                <h3 className="text-xs sm:text-xl font-bold mb-1 sm:mb-2 leading-snug">{item.title}</h3>
                <p className="text-[11px] sm:text-sm text-ink/80 leading-snug sm:leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 6. TESTIMONI ─── */}
      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-6">
          <SectionHeading
            title="Kata Mereka yang Sudah Coba"
            description="Kebahagiaan pelanggan adalah alasan utama kami terus memanggang setiap hari."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testi, idx) => {
              // Rotasi kecil berselang-seling untuk karakter neo-brutal
              const rotations = [
                "-rotate-1",
                "rotate-1",
                "rotate-0",
                "rotate-1",
                "-rotate-1",
              ];
              const cardRotation = rotations[idx % rotations.length];
              const bgColors = ["bg-white", "bg-cream", "bg-white"];
              const cardBg = bgColors[idx % bgColors.length];

              return (
                <div
                  key={testi.id}
                  className={`${cardBg} ${cardRotation} border-3 border-ink rounded-[14px] p-4 sm:p-6 shadow-[var(--shadow-brutal)] flex flex-col justify-between gap-3 sm:gap-4 transition-transform hover:rotate-0`}
                >
                  <div className="space-y-2 sm:space-y-3">
                    {/* Bintang */}
                    <div className="flex items-center gap-1 text-butter text-base sm:text-lg">
                      {Array.from({ length: testi.rating }).map((_, i) => (
                        <span key={i} aria-hidden="true">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm md:text-base font-medium text-ink italic leading-relaxed">
                      &ldquo;{testi.content}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t-2 border-ink/10 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm block">
                        {testi.name}
                      </span>
                      {testi.handle && (
                        <span className="text-[10px] sm:text-xs text-ink/80 font-mono">
                          {testi.handle}
                        </span>
                      )}
                    </div>
                    <span className="text-lg sm:text-xl" aria-hidden="true">
                      🧁
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── 7. PREVIEW SOCIAL ─── */}
      {socialPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-3 sm:gap-4">
            <SectionHeading
              title="Dapur & Cerita Kami"
              description="Ikuti momen seru memanggang dan behind-the-scenes kreasi kue di media sosial."
              className="mb-0"
            />
            <Link href="/social" className="self-start sm:self-auto shrink-0">
              <Button
                variant="ghost"
                className="text-xs sm:text-sm font-bold border-2 hover:bg-pink"
              >
                Lihat semua cerita →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {socialPosts.map((post) => (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-2 sm:border-3 border-ink rounded-[10px] sm:rounded-[14px] p-2.5 sm:p-4 shadow-[var(--shadow-brutal-sm)] sm:shadow-[var(--shadow-brutal)] flex flex-col justify-between gap-2 sm:gap-3 hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
              >
                <div className="relative aspect-[4/3] w-full rounded-[6px] sm:rounded-[8px] border-2 border-ink overflow-hidden bg-cream">
                  {post.imageFile ? (
                    <Image
                      src={post.imageFile}
                      alt={post.caption || "Postingan media sosial Niken Bakery"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <PlaceholderCake
                      color="lavender"
                      className="w-full h-full rounded-none border-0 group-hover:scale-105 transition-transform duration-200"
                    />
                  )}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-ink/70">
                    <span className="uppercase truncate">
                      {post.platform === "instagram"
                        ? "📸 Instagram"
                        : "🎵 TikTok"}
                    </span>
                    <span className="text-ink group-hover:underline shrink-0 ml-1">Buka ↗</span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink font-medium line-clamp-2">
                    {post.caption}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ─── 8. PENUTUP (CLOSING CTA & LOKASI) ─── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-butter border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal-lg)] p-6 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
          <div className="max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-ink leading-tight">
              Siap Bikin Momenmu Lebih Manis?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-ink/80 font-medium">
              Kue ulang tahun, hampers spesial, atau sekadar cemilan santai sore
              hari—semua ada di Niken Bakery. Chat kami sekarang!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <Button
              href={generalWaLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="wa"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base font-extrabold shadow-[var(--shadow-brutal)]"
            >
              💬 Hubungi via WhatsApp
            </Button>
            <Link href="/about" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto bg-white hover:bg-cream text-sm sm:text-base font-extrabold shadow-[var(--shadow-brutal)]"
              >
                📍 Lokasi & Info Toko
              </Button>
            </Link>
          </div>

          <p className="text-xs text-ink/70 font-semibold pt-1 sm:pt-2">
            📍 {settings.address} · Melayani pesanan harian dan pre-order
          </p>
        </div>
      </section>
    </div>
  );
}
