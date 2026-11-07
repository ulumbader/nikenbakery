import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Login Admin",
  description: "Masuk ke panel manajemen Niken Bakery.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-cream text-ink">
      <div className="w-full max-w-md">
        {/* Navigasi Balik */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/80 hover:text-ink hover:underline bg-white px-3 py-1.5 rounded-[6px] border-2 border-ink shadow-[var(--shadow-brutal-sm)]"
          >
            <span>←</span>
            <span>Kembali ke Website</span>
          </Link>
        </div>

        {/* Kartu Login */}
        <div className="bg-white border-3 border-ink rounded-[14px] p-6 md:p-8 shadow-[var(--shadow-brutal-lg)] space-y-6">
          <div className="space-y-2 text-center">
            <span className="inline-block bg-butter text-ink text-xs font-extrabold uppercase px-3 py-1 rounded-[6px] border-2 border-ink shadow-[var(--shadow-brutal-sm)] -rotate-1 mb-2">
              🧁 Niken Bakery Admin
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Masuk Dashboard
            </h1>
            <p className="text-sm text-ink/70">
              Kelola katalog kue, promo, testimoni, dan pengaturan toko.
            </p>
          </div>

          <LoginForm />

          <div className="pt-4 border-t-2 border-ink/10 text-center">
            <p className="text-xs text-ink/60">
              🔒 Akses khusus pengelola Niken Bakery. Lupa password? Hubungi
              administrator server.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
