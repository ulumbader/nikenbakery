import { getSettings } from "@/lib/settings";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengaturan Toko | Admin Niken Bakery",
};

export default function AdminSettingsPage() {
  const settings = getSettings();

  return (
    <div>
      <SettingsManager initialSettings={settings} />
    </div>
  );
}
