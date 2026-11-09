import { CakeSplashVisual } from "@/components/public/CakeSplashVisual";

export default function PublicLoading() {
  return (
    <div
      className="public-loading-fallback flex min-h-[55vh] flex-col items-center justify-center gap-4 px-4 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="cake-splash-card">
        <CakeSplashVisual />
      </div>
      <p className="cake-splash-title">Sedang menyiapkan halaman...</p>
    </div>
  );
}
