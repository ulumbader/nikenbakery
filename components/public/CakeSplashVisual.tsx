"use client";

import { useEffect, useState } from "react";

const CAKE_VARIANT_COUNT = 4;

export function CakeSplashVisual() {
  const [variant, setVariant] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVariant(Math.floor(Math.random() * CAKE_VARIANT_COUNT));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <svg
      viewBox="0 0 200 170"
      className="cake-splash-illustration"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="100" cy="143" rx="62" ry="11" fill="#2B1B17" fillOpacity="0.12" />
      <ellipse cx="100" cy="137" rx="62" ry="11" fill="#FFF4E0" stroke="#2B1B17" strokeWidth="4" />

      {variant === 0 && (
        <g stroke="#2B1B17" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          <path d="M48 91h104v34c0 7-6 12-13 12H61c-7 0-13-5-13-12V91Z" fill="#FF8FAB" />
          <path d="M48 93c7-8 13 7 20 0s13 7 20 0 13 7 20 0 13 7 20 0 17 7 24 0V82H48v11Z" fill="#FFF4E0" />
          <path d="M68 103v19m32-19v19m32-19v19" />
          <path d="M74 82V55m26 27V48m26 34V55" stroke="#FFD93D" />
          <path d="M71 49c-5-7 5-8 2-15m24 8c-5-7 5-8 2-15m24 22c-5-7 5-8 2-15" stroke="#FA4D75" />
        </g>
      )}

      {variant === 1 && (
        <g stroke="#2B1B17" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          <path d="m58 78 8 57h68l8-57H58Z" fill="#FFD93D" />
          <path d="m58 80 10-9h64l10 9" fill="#FFF4E0" />
          <path d="M78 91v10m22-10v10m22-10v10" />
          <path d="M57 78c-2-13 8-20 18-20 1-14 14-21 25-14 9-14 30-8 31 8 14 3 20 16 15 26H57Z" fill="#FF8FAB" />
          <path d="M99 42c-7-7 4-10 0-18" stroke="#FA4D75" />
          <circle cx="100" cy="39" r="7" fill="#FA4D75" />
        </g>
      )}

      {variant === 2 && (
        <g stroke="#2B1B17" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          <path d="m45 122 48-69 63 69H45Z" fill="#FFD93D" />
          <path d="m45 122 48-69 63 69" fill="#FF8FAB" />
          <path d="m61 100 68 8m-80 14 89 0" />
          <path d="m93 53 7-12 8 12" fill="#FF8FAB" />
          <circle cx="101" cy="38" r="8" fill="#FA4D75" />
          <path d="m92 73 7 6 8-6m13 17 7 6 8-6" stroke="#FFF4E0" />
        </g>
      )}

      {variant === 3 && (
        <g stroke="#2B1B17" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          <path d="M55 78h90v55H55z" fill="#C9B6FF" />
          <path d="M55 88c8-8 12 8 20 0s12 8 20 0 12 8 20 0 12 8 20 0 8 4 10 3V70H55v18Z" fill="#FFF4E0" />
          <path d="M75 100v20m25-20v20m25-20v20" />
          <path d="M75 70V49m25 21V39m25 31V49" stroke="#FFD93D" />
          <path d="M72 44c-5-7 5-8 2-15m24 7c-5-7 5-8 2-15m23 23c-5-7 5-8 2-15" stroke="#FA4D75" />
        </g>
      )}

      <path className="cake-splash-sparkle" d="M34 53c0 8-4 12-12 12 8 0 12 4 12 12 0-8 4-12 12-12-8 0-12-4-12-12Z" fill="#FA4D75" />
      <path className="cake-splash-sparkle cake-splash-sparkle--late" d="M164 47c0 6-3 9-9 9 6 0 9 3 9 9 0-6 3-9 9-9-6 0-9-3-9-9Z" fill="#FFBF00" />
    </svg>
  );
}
