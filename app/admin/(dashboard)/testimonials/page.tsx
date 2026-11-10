import { asc } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import {
  TestimonialManager,
  type TestimonialItem,
} from "@/components/admin/TestimonialManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Testimoni | Admin Niken Bakery",
};

export default async function AdminTestimonialsPage() {
  const allTestimonials = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder));

  return (
    <div className="space-y-6">
      <TestimonialManager initialTestimonials={allTestimonials as TestimonialItem[]} />
    </div>
  );
}
