import type { ReactNode } from "react";
import { CakeSplashVisual } from "./CakeSplashVisual";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="page-transition">
      <div className="page-transition__content">{children}</div>
      <div
        className="page-transition__splash"
        role="status"
        aria-live="polite"
        aria-label="Menyiapkan halaman Niken Bakery"
      >
        <div className="cake-splash-card">
          <CakeSplashVisual />
        </div>
        <p className="cake-splash-title">Menyiapkan yang manis...</p>
        <span className="cake-splash-brand">Niken Bakery</span>
      </div>
    </div>
  );
}
