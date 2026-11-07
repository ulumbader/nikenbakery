import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <Navbar
        businessName={settings.business_name}
        whatsappNumber={settings.whatsapp_number}
        defaultMessage={settings.wa_default_message}
      />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingWhatsApp
        whatsappNumber={settings.whatsapp_number}
        defaultMessage={settings.wa_default_message}
      />
    </div>
  );
}
