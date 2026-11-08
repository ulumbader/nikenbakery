"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconAlert, IconReload, IconHome } from "@/components/ui/Icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error secara aman
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream text-ink text-center">
      <div className="w-24 h-24 bg-danger text-white border-3 border-ink rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-brutal)]">
        <IconAlert className="w-12 h-12 text-white" />
      </div>

      <span className="inline-block bg-butter text-ink font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-[6px] border-2 border-ink mb-3 shadow-[var(--shadow-brutal-sm)] -rotate-1">
        Ada Kendala Teknis
      </span>

      <h1 className="text-3xl md:text-5xl font-extrabold mb-3 font-heading">
        Terjadi Kesalahan di Dapur Kami
      </h1>

      <p className="text-base text-ink/80 max-w-md mb-8 leading-relaxed font-body">
        Maaf, sistem kami mengalami kendala sementara saat memuat halaman ini.
        Kamu bisa mencoba memuat ulang atau kembali ke beranda.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          onClick={() => reset()}
          variant="primary"
          size="lg"
          className="shadow-[var(--shadow-brutal)] inline-flex items-center gap-1.5"
        >
          <IconReload className="w-5 h-5 text-ink" />
          <span>Coba Muat Ulang</span>
        </Button>
        <Link href="/">
          <Button
            variant="ghost"
            size="lg"
            className="border-2 bg-white hover:bg-cream inline-flex items-center gap-1.5"
          >
            <IconHome className="w-5 h-5 text-ink" />
            <span>Kembali ke Beranda</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

