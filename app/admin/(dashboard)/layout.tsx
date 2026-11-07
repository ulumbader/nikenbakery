import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "Dashboard Admin",
    template: "%s | Admin Niken Bakery",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AdminNav username={session.username} />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
