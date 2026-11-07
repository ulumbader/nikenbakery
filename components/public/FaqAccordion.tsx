interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  if (faqs.length === 0) return null;

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <details
          key={faq.id}
          className="group border-3 border-ink rounded-[12px] bg-white shadow-[var(--shadow-brutal-sm)] overflow-hidden transition-all open:bg-cream"
        >
          <summary className="flex items-center justify-between p-4 md:p-5 cursor-pointer font-extrabold text-base md:text-lg text-ink select-none list-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink">
            <span className="pr-4">{faq.question}</span>
            <span
              className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-ink bg-butter flex items-center justify-center text-sm font-black transition-transform duration-200 group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <div className="px-4 pb-4 md:px-5 md:pb-5 text-sm md:text-base text-ink/85 border-t-2 border-ink/10 pt-3 leading-relaxed">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
