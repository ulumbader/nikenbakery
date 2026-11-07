import { type ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "wa" | "ghost" | "danger";
export type ButtonSize = "default" | "sm" | "lg";

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-butter border-ink text-ink shadow-[var(--shadow-brutal-sm)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  wa: "bg-wa border-ink text-white shadow-[var(--shadow-brutal-sm)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  ghost:
    "bg-transparent border-ink text-ink shadow-none hover:bg-cream",
  danger:
    "bg-danger border-ink text-white shadow-[var(--shadow-brutal-sm)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
};

export const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm min-h-[36px]",
  default: "px-5 py-2.5 text-base min-h-[44px]",
  lg: "px-7 py-3 text-lg min-h-[52px]",
};

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const commonClasses = `inline-flex items-center justify-center gap-2 rounded-full border-3 border-ink font-semibold transition-all cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={commonClasses} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={commonClasses} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
