import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/Button";

interface WhatsAppButtonProps {
  href: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  icon?: boolean;
}

/**
 * Satu komponen sentral untuk semua tombol WhatsApp.
 * Memudahkan penambahan pelacakan event analitik (klik WA) di Tahap 09.
 */
export function WhatsAppButton({
  href,
  label = "Pesan via WhatsApp",
  variant = "wa",
  size = "default",
  className = "",
  children,
  icon = true,
}: WhatsAppButtonProps) {
  return (
    <Button
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={`font-bold ${className}`}
    >
      {icon && <span aria-hidden="true">💬</span>}
      {children || label}
    </Button>
  );
}
