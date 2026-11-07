type BadgeColor = "pink" | "butter" | "mint" | "lavender" | "danger" | "ink";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  pink: "bg-pink text-ink",
  butter: "bg-butter text-ink",
  mint: "bg-mint text-ink",
  lavender: "bg-lavender text-ink",
  danger: "bg-danger text-white",
  ink: "bg-ink text-cream",
};

export function Badge({ children, color = "butter", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] border-2 border-ink text-sm font-semibold ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}

interface StickerProps {
  children: React.ReactNode;
  color?: BadgeColor;
  rotate?: boolean;
  className?: string;
}

export function Sticker({
  children,
  color = "pink",
  rotate = true,
  className = "",
}: StickerProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 border-2 border-ink text-sm font-bold shadow-[var(--shadow-brutal-sm)] ${
        rotate ? "-rotate-2" : ""
      } ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}

