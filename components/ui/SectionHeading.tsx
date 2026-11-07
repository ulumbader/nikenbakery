interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ title, description, className = "" }: SectionHeadingProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-[clamp(2rem,5vw,3.5rem)]">{title}</h2>
      {description && (
        <p className="mt-2 text-lg max-w-[70ch]">{description}</p>
      )}
    </div>
  );
}
