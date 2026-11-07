"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function SearchInput({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  // Sync internal state if URL param changes externally
  if (prevInitialValue !== initialValue) {
    setPrevInitialValue(initialValue);
    setSearchTerm(initialValue);
  }

  // Debounce search input update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm === initialValue) return;

      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set("q", searchTerm.trim());
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, initialValue, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="menu-search-input" className="sr-only">
        Cari kue favoritmu
      </label>
      <div className="relative">
        <span
          className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-ink/60 font-bold"
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          id="menu-search-input"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari kue, brownies, cookies..."
          className="w-full pl-10 pr-10 py-2.5 rounded-[8px] border-3 border-ink bg-white text-base text-ink placeholder:text-ink/50 shadow-[var(--shadow-brutal-sm)] focus-visible:outline-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink/60 hover:text-ink font-bold text-sm"
            aria-label="Hapus kata kunci pencarian"
          >
            ✕
          </button>
        )}
      </div>
      {isPending && (
        <span className="absolute right-12 top-3 text-xs text-ink/50 animate-pulse font-semibold">
          Mencari...
        </span>
      )}
    </div>
  );
}
