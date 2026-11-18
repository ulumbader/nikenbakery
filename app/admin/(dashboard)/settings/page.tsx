import { getSettings } from "@/lib/settings";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengaturan Toko | Admin Niken Bakery",
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <SettingsManager initialSettings={settings} />
    </div>
  );
}
