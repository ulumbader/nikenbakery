type Status = "ready" | "preorder" | "soldout";

interface StatusBadgeProps {
  status: Status;
  preorderNote?: string;
  className?: string;
}

const statusConfig: Record<Status, { label: string; color: string }> = {
  ready: { label: "Ready", color: "bg-mint text-ink" },
  preorder: { label: "Pre-order", color: "bg-butter text-ink" },
  soldout: { label: "Habis", color: "bg-danger text-ink font-bold" },
};

export function StatusBadge({ status, preorderNote, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] border-2 border-ink text-sm font-semibold ${config.color} ${className}`}
    >
      {config.label}
      {status === "preorder" && preorderNote ? ` ${preorderNote}` : ""}
    </span>
  );
}

