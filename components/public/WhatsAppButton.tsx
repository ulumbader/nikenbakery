"use client";

import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/Button";

interface WhatsAppButtonProps {
  href: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  icon?: boolean;
  productId?: number;
  onClick?: () => void;
}

/**
 * Satu komponen sentral untuk semua tombol WhatsApp.
 * Dilengkapi pencatatan analitik klik (wa_click) via navigator.sendBeacon.
 */
export function WhatsAppButton({
  href,
  label = "Pesan via WhatsApp",
  variant = "wa",
  size = "default",
  className = "",
  children,
  icon = true,
  productId,
  onClick,
}: WhatsAppButtonProps) {
  function handleClick() {
    // 1. Jalankan custom onClick jika ada
    onClick?.();

    // 2. Kirim analitik klik WA tanpa memblokir pembukaan tab WA
    try {
      const payload = JSON.stringify({
        type: "wa_click",
        productId: productId || null,
      });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/events", blob);
      } else if (typeof fetch !== "undefined") {
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Abaikan error analitik
        });
      }
    } catch {
      // Abaikan bila ada issue analitik di browser
    }
  }

  return (
    <Button
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={`font-bold ${className}`}
      onClick={handleClick}
    >
      {icon && <span aria-hidden="true">💬</span>}
      {children || label}
    </Button>
  );
}
