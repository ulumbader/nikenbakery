import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { Button, PlaceholderCake } from "@/components/ui";
import {
  IconWhatsApp,
  IconCakeSlice,
  IconMapPin,
  IconClock,
  IconSparkle,
} from "@/components/ui/Icons";

type HeroProduct = {
  name: string;
  slug: string;
  displayPrice: number;
  coverImage?: {
    fileName: string;
    thumbName: string;
    alt: string;
  } | null;
  category?: {
    name: string;
    color: string;
  } | null;
};

interface HeroSectionProps {
  generalWaLink: string;
  address: string;
  featuredProduct?: HeroProduct;
  todayHour?: {
    day: string;
    open: string;
    close: string;
    closed: boolean;
  };
}

export function HeroSection({
  generalWaLink,
  address,
  featuredProduct,
  todayHour,
}: HeroSectionProps) {
  const shortAddress = address.split(",")[0] || address;
  const hoursText = todayHour
    ? todayHour.closed
      ? "Tutup"
      : `${todayHour.open} - ${todayHour.close}`
    : "08:00 - 20:00";
  const categoryColor = featuredProduct?.category?.color;
  const placeholderColor =
    categoryColor === "pink" ||
    categoryColor === "butter" ||
    categoryColor === "mint" ||
    categoryColor === "lavender"
      ? categoryColor
      : "butter";

  return (
    <section className="relative isolate overflow-hidden bg-cream py-8 sm:py-12 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 select-none"
        aria-hidden="true"
      >
        <div className="absolute -right-40 -top-8 h-36 w-72 rotate-[-18deg] rounded-full bg-butter/60 lg:hidden" />
        <div className="absolute -right-28 -top-56 hidden h-[31rem] w-[48rem] rotate-[-12deg] rounded-full bg-butter/75 lg:block" />
        <IconSparkle className="absolute right-[8%] top-[39%] hidden h-7 w-7 text-pink sm:block" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        <div className="max-w-2xl text-left">
          <div className="mb-5 inline-flex -rotate-2 items-center gap-2 rounded-[9px] border-2 border-ink bg-pink px-3 py-2 shadow-[3px_3px_0_#2B1B17] sm:mb-6 sm:px-4">
            <IconSparkle className="h-4 w-4 shrink-0 text-white" />
            <span className="font-heading text-xs font-extrabold text-ink sm:text-sm">
              Dipanggang segar setiap pagi
            </span>
          </div>

          <h1 className="font-heading text-[clamp(2.75rem,6.2vw,5.25rem)] font-black leading-[0.98] tracking-[-0.045em] text-ink">
            Kue lezat,
            <br />
            momen lebih
            <br />
            <span className="relative inline-block whitespace-nowrap pb-2 sm:pb-3">
              manis.
              <svg
                className="absolute -bottom-0.5 left-0 h-3 w-full overflow-visible sm:h-4"
                viewBox="0 0 200 16"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 9 C55 15, 133 15, 197 4"
                  stroke="#FA4D75"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/75 sm:mt-6 sm:text-lg">
            Cake, brownies, dan pastry yang dibuat segar untuk momen spesialmu.
            Pilih favoritmu, lalu pesan langsung lewat WhatsApp.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button
              href={generalWaLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="wa"
              size="lg"
              className="w-full text-sm font-extrabold shadow-[var(--shadow-brutal)] sm:w-auto sm:text-base"
            >
              <IconWhatsApp className="h-5 w-5 text-ink" />
              <span>Pesan via WhatsApp</span>
            </Button>
            <Button
              href="/menu"
              variant="primary"
              size="lg"
              className="w-full text-sm font-extrabold shadow-[var(--shadow-brutal)] sm:w-auto sm:text-base"
            >
              <IconCakeSlice className="h-5 w-5 text-ink" />
              <span>Lihat koleksi menu</span>
            </Button>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t-2 border-ink/15 pt-4 text-sm font-semibold text-ink/75 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
            <div className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4 shrink-0 text-ink" />
              <span>Toko di {shortAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="h-4 w-4 shrink-0 text-ink" />
              <span>Hari ini: {hoursText}</span>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto">
          <div
            className="absolute -bottom-4 -left-4 right-5 top-5 rotate-[-4deg] rounded-[16px] border-3 border-ink bg-pink sm:-bottom-5 sm:-left-5 sm:right-7 sm:top-7"
            aria-hidden="true"
          />
          <div className="relative rounded-[14px] border-3 border-ink bg-white p-2.5 shadow-[8px_8px_0_#2B1B17] sm:p-3">
            <Link
              href={featuredProduct ? `/menu/${featuredProduct.slug}` : "/menu"}
              className="group relative block aspect-[4/3] overflow-hidden rounded-[8px] border-3 border-ink bg-butter focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink focus-visible:ring-offset-2"
              aria-label={
                featuredProduct
                  ? `Lihat detail ${featuredProduct.name}`
                  : "Lihat koleksi menu Niken Bakery"
              }
            >
              {featuredProduct?.coverImage ? (
                <Image
                  src={
                    featuredProduct.coverImage.thumbName ||
                    featuredProduct.coverImage.fileName
                  }
                  alt={featuredProduct.coverImage.alt || featuredProduct.name}
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  loading="eager"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <PlaceholderCake
                  color={placeholderColor}
                  className="h-full w-full rounded-none border-0 aspect-auto"
                />
              )}
            </Link>

            <div className="flex items-end justify-between gap-4 px-1 pb-1 pt-3 sm:px-2 sm:pt-4">
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink/75">
                  {featuredProduct?.category?.name || "Menu andalan"}
                </p>
                <h2 className="mt-0.5 truncate font-heading text-lg font-extrabold leading-tight text-ink sm:text-2xl">
                  {featuredProduct ? (
                    <Link
                      href={`/menu/${featuredProduct.slug}`}
                      className="rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink"
                    >
                      {featuredProduct.name}
                    </Link>
                  ) : (
                    "Fresh dari dapur"
                  )}
                </h2>
              </div>
              {featuredProduct ? (
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-semibold text-ink/75 sm:text-xs">
                    Mulai dari
                  </p>
                  <p className="tabular-nums font-heading text-base font-extrabold text-ink sm:text-lg">
                    {formatRupiah(featuredProduct.displayPrice)}
                  </p>
                </div>
              ) : (
                <Link
                  href="/menu"
                  className="shrink-0 rounded-full border-2 border-ink bg-butter px-3 py-2 text-xs font-extrabold text-ink shadow-[2px_2px_0_#2B1B17] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none sm:text-sm"
                >
                  Jelajahi menu
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
