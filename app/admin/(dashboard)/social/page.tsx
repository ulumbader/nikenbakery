import { asc } from "drizzle-orm";
import { db } from "@/db";
import { socialPosts } from "@/db/schema";
import {
  SocialManager,
  type SocialPostItem,
} from "@/components/admin/SocialManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Postingan Sosial | Admin Niken Bakery",
};

export default async function AdminSocialPage() {
  const allPosts = await db
    .select()
    .from(socialPosts)
    .orderBy(asc(socialPosts.sortOrder));

  return (
    <div className="space-y-6">
      <SocialManager initialPosts={allPosts as SocialPostItem[]} />
    </div>
  );
}
