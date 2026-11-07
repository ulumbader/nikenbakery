"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";

interface AdminNavProps {
  username: string;
}

const navItems = [
  { href: "/admin", label: "Ringkasan", icon: "📊" },
  { href: "/admin/products", label: "Produk", icon: "🍰" },
  { href: "/admin/categories", label: "Kategori", icon: "🏷️" },
  { href: "/admin/banners", label: "Banner Promo", icon: "📢" },
  { href: "/admin/testimonials", label: "Testimoni", icon: "⭐" },
  { href: "/admin/social", label: "Media Sosial", icon: "📸" },
  { href: "/admin/faqs", label: "FAQ", icon: "❓" },
  { href: "/admin/settings", label: "Pengaturan Toko", icon: "⚙️" },
];

export function AdminNav({ username }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isItemActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 md:p-6">
      <div className="space-y-6">
        {/* Brand */}
        <div className="pb-4 border-b-2 border-ink/10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-extrabold text-xl bg-butter text-ink px-3 py-1 border-2 border-ink rounded-[8px] shadow-[var(--shadow-brutal-sm)] -rotate-1"
          >
            <span>🧁</span>
            <span>Niken Admin</span>
          </Link>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink/70">
            <span className="w-2 h-2 rounded-full bg-mint border border-ink" />
            <span>Login sebagai: </span>
            <span className="font-extrabold text-ink">{username}</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1.5" aria-label="Menu Admin">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] border-2 text-sm font-bold transition-all ${
                  active
                    ? "bg-butter text-ink border-ink shadow-[var(--shadow-brutal-sm)] translate-x-[1px]"
                    : "bg-white text-ink border-transparent hover:border-ink hover:bg-cream"
                }`}
              >
                <span className="text-base" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Nav: Kembali ke Web & Logout */}
      <div className="pt-4 border-t-2 border-ink/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-ink hover:underline bg-cream border border-ink rounded-[6px]"
        >
          <span>🌐</span>
          <span>Buka Website Publik ↗</span>
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-danger border-2 border-ink rounded-[6px] shadow-[var(--shadow-brutal-sm)] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
          >
            <span>🚪</span>
            <span>Keluar (Logout)</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:block w-64 bg-white border-r-3 border-ink min-h-screen fixed top-0 left-0 z-30 overflow-y-auto">
        {navContent}
      </aside>

      {/* ─── Mobile Header Bar ─── */}
      <header className="md:hidden sticky top-0 z-30 w-full bg-white border-b-3 border-ink p-4 flex items-center justify-between">
        <Link
          href="/admin"
          className="font-extrabold text-lg bg-butter px-2.5 py-1 border-2 border-ink rounded-[6px] shadow-[var(--shadow-brutal-sm)]"
        >
          🧁 Niken Admin
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Tutup menu admin" : "Buka menu admin"}
          className="p-2 border-2 border-ink rounded-[8px] bg-butter text-ink shadow-[var(--shadow-brutal-sm)] cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-ink/60 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="bg-white border-t-3 border-ink rounded-t-[16px] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
