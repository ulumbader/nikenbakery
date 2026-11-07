interface CardProps {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export function Card({ children, interactive = false, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal)] ${
        interactive
          ? "transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutal-sm)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
