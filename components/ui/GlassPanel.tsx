interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div className={`glass rounded-[14px] p-4 ${className}`}>
      {children}
    </div>
  );
}

