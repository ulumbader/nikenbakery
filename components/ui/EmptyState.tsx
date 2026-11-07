import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {/* Simple illustration */}
      <div className="w-20 h-20 bg-butter border-3 border-ink rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-brutal-sm)]">
        <span className="text-3xl" aria-hidden="true">🍰</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-base max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <a href={actionHref}>
          <Button variant="primary">{actionLabel}</Button>
        </a>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
