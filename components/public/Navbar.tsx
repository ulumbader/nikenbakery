"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildWhatsAppLink, generalMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui";
import { IconCupcake, IconWhatsApp } from "@/components/ui/Icons";

interface NavbarProps {
  businessName: string;
  whatsappNumber: string;
  defaultMessage?: string;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/social", label: "Social" },
  { href: "/about", label: "About Us" },
];

export function Navbar({
  businessName,
  whatsappNumber,
  defaultMessage,
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu when route changes during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const waLink = buildWhatsAppLink(
    whatsappNumber,
    generalMessage(defaultMessage)
  );

  // Handle ESC key to close mobile menu
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        hamburgerButtonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass border-b-3 border-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-extrabold text-xl md:text-2xl tracking-tight bg-butter text-ink px-3 py-1 border-2 border-ink rounded-[8px] shadow-[var(--shadow-brutal-sm)] -rotate-1 hover:rotate-0 transition-transform"
          >
            <IconCupcake className="w-6 h-6 text-ink" />
            <span>{businessName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Navigasi Utama"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-bold transition-all relative py-1 ${
                    isActive
                      ? "text-ink underline decoration-3 underline-offset-8 decoration-pink"
                      : "text-ink/80 hover:text-ink hover:underline decoration-2 underline-offset-8"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="wa"
              size="sm"
              className="shadow-[var(--shadow-brutal-sm)] text-sm"
            >
              <IconWhatsApp className="w-4 h-4 text-ink" />
              <span>Tanya via WhatsApp</span>
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            ref={hamburgerButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Tutup menu" : "Buka menu navigasi"}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-[8px] border-2 border-ink bg-butter text-ink shadow-[var(--shadow-brutal-sm)] cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              {isOpen ? (
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
        </div>
      </header>

      {/* Mobile Menu Dialog / Drawer - ditaruh di luar header agar tidak terkurung containing-block backdrop-filter */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-between bg-cream p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
        >
          <div className="flex items-center justify-between pb-4 border-b-3 border-ink shrink-0">
            <span className="font-extrabold text-xl bg-butter px-3 py-1 border-2 border-ink rounded-[8px] shadow-[var(--shadow-brutal-sm)] -rotate-1 inline-flex items-center gap-1.5">
              <IconCupcake className="w-5 h-5 text-ink" />
              <span>{businessName}</span>
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup menu navigasi"
              className="p-2 border-2 border-ink rounded-[8px] bg-white text-ink shadow-[var(--shadow-brutal-sm)] cursor-pointer hover:bg-butter transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-4 py-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-extrabold px-4 py-3 rounded-[12px] border-3 border-ink transition-all ${
                    isActive
                      ? "bg-butter text-ink shadow-[var(--shadow-brutal-sm)]"
                      : "bg-white text-ink hover:bg-cream"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t-3 border-ink flex flex-col gap-3 shrink-0">
            <Button
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="wa"
              size="lg"
              className="w-full text-base font-bold shadow-[var(--shadow-brutal-sm)]"
            >
              <IconWhatsApp className="w-5 h-5 text-ink" />
              <span>Tanya via WhatsApp</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
