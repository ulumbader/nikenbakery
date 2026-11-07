"use client";

import { useEffect, useRef } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // pixels per second
  className?: string;
}

export function Marquee({ children, speed = 40, className = "" }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const content = contentRef.current;
    if (!content) return;

    const width = content.scrollWidth / 2; // We duplicate content
    const duration = width / speed;

    content.style.animationDuration = `${duration}s`;
    content.classList.add("animate-marquee");
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden border-y-3 border-ink bg-butter py-3 ${className}`}
      aria-hidden="true"
    >
      <div ref={contentRef} className="flex w-max gap-8 whitespace-nowrap">
        {/* Duplicate content for seamless loop */}
        <span className="flex items-center gap-8">{children}</span>
        <span className="flex items-center gap-8">{children}</span>
      </div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee-scroll linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

