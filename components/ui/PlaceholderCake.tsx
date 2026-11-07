type PlaceholderColor = "pink" | "butter" | "mint" | "lavender";

interface PlaceholderCakeProps {
  color?: PlaceholderColor;
  className?: string;
}

const bgClasses: Record<PlaceholderColor, string> = {
  pink: "bg-pink",
  butter: "bg-butter",
  mint: "bg-mint",
  lavender: "bg-lavender",
};

export function PlaceholderCake({ color = "pink", className = "" }: PlaceholderCakeProps) {
  return (
    <div
      className={`flex items-center justify-center border-3 border-ink rounded-[14px] aspect-[4/3] ${bgClasses[color]} ${className}`}
      role="img"
      aria-label="Placeholder gambar kue"
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-ink opacity-30"
      >
        {/* Simplified cake icon */}
        <rect x="12" y="36" width="40" height="16" rx="2" stroke="currentColor" strokeWidth="3" />
        <rect x="16" y="24" width="32" height="12" rx="2" stroke="currentColor" strokeWidth="3" />
        <rect x="20" y="14" width="24" height="10" rx="2" stroke="currentColor" strokeWidth="3" />
        {/* Candle */}
        <line x1="32" y1="8" x2="32" y2="14" stroke="currentColor" strokeWidth="3" />
        <circle cx="32" cy="6" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
