type PillColor = "pink" | "butter" | "mint" | "lavender";

interface PillProps {
  children: React.ReactNode;
  color?: PillColor;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

const activeColorClasses: Record<PillColor, string> = {
  pink: "bg-pink text-ink",
  butter: "bg-butter text-ink",
  mint: "bg-mint text-ink",
  lavender: "bg-lavender text-ink",
};

export function Pill({
  children,
  color = "butter",
  active = false,
  className = "",
  onClick,
}: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-4 py-1.5 rounded-full border-2 border-ink text-sm font-semibold min-h-[44px] transition-colors cursor-pointer ${
        active ? activeColorClasses[color] : "bg-white text-ink hover:bg-cream"
      } ${className}`}
    >
      {children}
    </button>
  );
}
