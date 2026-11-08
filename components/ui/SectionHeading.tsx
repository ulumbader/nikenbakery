interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ title, description, className = "" }: SectionHeadingProps) {
  return (
    <div className={`mb-4 sm:mb-8 ${className}`}>
      <h2 className="text-2xl sm:text-[clamp(2rem,5vw,3.5rem)]">{title}</h2>
      {description && (
        <p className="mt-1 sm:mt-2 text-sm sm:text-lg max-w-[70ch] text-ink/80">{description}</p>
      )}
    </div>
  );
}

