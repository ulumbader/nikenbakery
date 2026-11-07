import { asc } from "drizzle-orm";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { FaqManager, type FaqItem } from "@/components/admin/FaqManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Tanya Jawab (FAQ) | Admin Niken Bakery",
};

export default function AdminFaqsPage() {
  const allFaqs = db
    .select()
    .from(faqs)
    .orderBy(asc(faqs.sortOrder))
    .all();

  return (
    <div className="space-y-6">
      <FaqManager initialFaqs={allFaqs as FaqItem[]} />
    </div>
  );
}
