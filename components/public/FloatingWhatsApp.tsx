import { buildWhatsAppLink, generalMessage } from "@/lib/whatsapp";
import { IconWhatsApp } from "@/components/ui/Icons";

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  defaultMessage?: string;
}

export function FloatingWhatsApp({
  whatsappNumber,
  defaultMessage,
}: FloatingWhatsAppProps) {
  const waLink = buildWhatsAppLink(
    whatsappNumber,
    generalMessage(defaultMessage)
  );

  return (
    <aside
      className="fixed z-30 right-4 sm:right-6 pointer-events-auto"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))" }}
      aria-label="Pesan cepat WhatsApp"
    >
      <div className="glass rounded-full p-1.5 shadow-[var(--shadow-brutal)]">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pesan via WA"
          className="inline-flex items-center gap-2 bg-wa text-ink font-extrabold text-sm sm:text-base px-4 py-2.5 rounded-full border-2 border-ink hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer shadow-[var(--shadow-brutal-sm)]"
        >
          <IconWhatsApp className="w-5 h-5 text-ink shrink-0" />
          <span>Pesan via WA</span>
        </a>
      </div>
    </aside>
  );
}
