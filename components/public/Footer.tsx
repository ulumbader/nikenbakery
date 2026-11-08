import Link from "next/link";
import { getSettings, getOpeningHours } from "@/lib/settings";
import { buildWhatsAppLink, generalMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui";

export function Footer() {
  const settings = getSettings();
  const openingHours = getOpeningHours();
  const currentYear = new Date().getFullYear();

  const waLink = buildWhatsAppLink(
    settings.whatsapp_number,
    generalMessage(settings.wa_default_message)
  );

  return (
    <footer className="bg-ink text-cream border-t-3 border-ink pt-10 sm:pt-16 pb-8 sm:pb-12 mt-12 sm:mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 pb-8 sm:pb-12 border-b-2 border-cream/20">
          {/* Kolom 1: Brand */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 font-extrabold text-2xl bg-butter text-ink px-3 py-1 border-2 border-ink rounded-[8px] shadow-[3px_3px_0_#FFF4E0] -rotate-1">
              <span>🧁</span>
              <span>{settings.business_name}</span>
            </div>
            <p className="text-cream/80 text-sm max-w-xs leading-relaxed">
              {settings.tagline}
            </p>
            <p className="text-xs text-cream/60">
              📍 {settings.address}
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className="font-heading text-lg font-bold text-butter mb-4">
              Jelajahi
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-butter underline-offset-4 hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-butter underline-offset-4 hover:underline"
                >
                  Menu Koleksi Kue
                </Link>
              </li>
              <li>
                <Link
                  href="/social"
                  className="hover:text-butter underline-offset-4 hover:underline"
                >
                  Dapur & Media Sosial
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-butter underline-offset-4 hover:underline"
                >
                  Tentang Niken Bakery
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Jam Buka */}
          <div>
            <h3 className="font-heading text-lg font-bold text-mint mb-4">
              Jam Buka
            </h3>
            <ul className="space-y-1.5 text-xs text-cream/90">
              {openingHours.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between items-center py-0.5 border-b border-cream/10"
                >
                  <span className="font-semibold">{h.day}</span>
                  <span>
                    {h.closed ? (
                      <span className="text-danger">Tutup</span>
                    ) : (
                      `${h.open} - ${h.close}`
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Kontak & Pesan */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-pink mb-4">
              Hubungi Kami
            </h3>
            <p className="text-xs text-cream/80">
              Punya pertanyaan khusus atau ingin pesan kue untuk acara spesial?
            </p>

            <Button
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="wa"
              size="sm"
              className="w-full text-xs font-bold shadow-none"
            >
              💬 WhatsApp Langsung
            </Button>

            {/* Media Sosial */}
            <div className="flex items-center gap-3 pt-2">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-cream text-ink rounded-full border-2 border-cream font-bold text-xs hover:bg-pink transition-colors"
                  aria-label="Instagram Niken Bakery"
                >
                  📸 Instagram
                </a>
              )}
              {settings.tiktok_url && (
                <a
                  href={settings.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-cream text-ink rounded-full border-2 border-cream font-bold text-xs hover:bg-mint transition-colors"
                  aria-label="TikTok Niken Bakery"
                >
                  🎵 TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bar Bawah */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/60 gap-4">
          <p>
            © {currentYear} {settings.business_name}. Semua hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <span className="text-pink">♥</span>
            <span>untuk pecinta kue manis</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
