import { type ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "wa" | "ghost" | "danger";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-butter border-ink text-ink shadow-[var(--shadow-brutal-sm)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  wa: "bg-wa border-ink text-white shadow-[var(--shadow-brutal-sm)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  ghost:
    "bg-transparent border-ink text-ink shadow-none hover:bg-cream",
  danger:
    "bg-danger border-ink text-white shadow-[var(--shadow-brutal-sm)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm min-h-[36px]",
  default: "px-5 py-2.5 text-base min-h-[44px]",
  lg: "px-7 py-3 text-lg min-h-[52px]",
};

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full border-3 border-ink font-semibold transition-all cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
