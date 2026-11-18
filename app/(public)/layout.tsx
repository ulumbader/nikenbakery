import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Structured Data (JSON-LD) Bakery / LocalBusiness
  const bakeryJsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: settings.business_name,
    description: settings.tagline,
    url: siteUrl,
    telephone: settings.whatsapp_number,
    email: settings.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "ID",
    },
    priceRange: "$$",
    image: `${siteUrl}/opengraph-image`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      {/* Skip Link untuk Aksesibilitas Keyboard */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-butter focus:text-ink focus:border-3 focus:border-ink focus:rounded-[8px] focus:shadow-hard font-heading font-black text-sm"
      >
        Loncat ke konten utama
      </a>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bakeryJsonLd) }}
      />

      <Navbar
        businessName={settings.business_name}
        whatsappNumber={settings.whatsapp_number}
        defaultMessage={settings.wa_default_message}
      />

      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
