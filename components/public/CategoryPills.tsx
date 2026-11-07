import Link from "next/link";
import { Pill } from "@/components/ui/Pill";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  color: string;
}

interface CategoryPillsProps {
  categories: CategoryItem[];
  currentCategorySlug?: string;
  currentQuery?: string;
}

export function CategoryPills({
  categories,
  currentCategorySlug,
  currentQuery,
}: CategoryPillsProps) {
  function buildUrl(categorySlug?: string) {
    const params = new URLSearchParams();
    if (categorySlug) {
      params.set("kategori", categorySlug);
    }
    if (currentQuery) {
      params.set("q", currentQuery);
    }
    const qs = params.toString();
    return qs ? `/menu?${qs}` : "/menu";
  }

  const isAllActive = !currentCategorySlug;

  return (
    <nav
      className="flex flex-wrap items-center gap-2.5 py-1"
      aria-label="Filter kategori menu"
    >
      <Link href={buildUrl(undefined)} scroll={false}>
        <Pill color="butter" active={isAllActive}>
          Semua Kue
        </Pill>
      </Link>

      {categories.map((cat) => {
        const isActive = currentCategorySlug === cat.slug;
        const color =
          ["pink", "butter", "mint", "lavender"].includes(cat.color)
            ? (cat.color as "pink" | "butter" | "mint" | "lavender")
            : "butter";

        return (
          <Link key={cat.id} href={buildUrl(cat.slug)} scroll={false}>
            <Pill color={color} active={isActive}>
              {cat.name}
            </Pill>
          </Link>
        );
      })}
    </nav>
  );
}
