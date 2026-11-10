import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { listSocialPosts } from "@/db/queries";
import {
  SectionHeading,
  PlaceholderCake,
  Button,
  Badge,
  EmptyState,
} from "@/components/ui";
import {
  IconInstagram,
  IconTikTok,
  IconCamera,
  IconHeart,
} from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: `Dapur & Media Sosial | ${settings.business_name}`,
    description: `Ikuti keseharian, proses memanggang, dan keseruan kreasi kue manis di media sosial ${settings.business_name}.`,
  };
}

export default async function SocialPage() {
  const [settings, posts] = await Promise.all([
    getSettings(),
    listSocialPosts(),
  ]);

  const placeholderColors: Array<"pink" | "butter" | "mint" | "lavender"> = [
    "pink",
    "butter",
    "mint",
    "lavender",
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-12 md:space-y-16">
      {/* ─── Header Halaman & Tombol Ikuti ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-3 border-ink">
        <SectionHeading
          title="Dapur & Media Sosial"
          description="Intip proses pembuatan kue, tips memanggang, dan momen manis pelanggan kami di Instagram & TikTok."
          className="mb-0"
        />

        {/* Tombol Ikuti Akun */}
        <div className="flex flex-wrap items-center gap-3">
          {settings.instagram_url && (
            <Button
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="bg-pink text-ink hover:bg-pink/80 font-bold text-sm shadow-[var(--shadow-brutal-sm)] inline-flex items-center gap-2"
            >
              <IconInstagram className="w-4 h-4 text-ink" />
              <span>Instagram</span>
              <span aria-hidden="true">↗</span>
            </Button>
          )}

          {settings.tiktok_url && (
            <Button
              href={settings.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="bg-mint text-ink hover:bg-mint/80 font-bold text-sm shadow-[var(--shadow-brutal-sm)] inline-flex items-center gap-2"
            >
              <IconTikTok className="w-4 h-4 text-ink" />
              <span>TikTok</span>
              <span aria-hidden="true">↗</span>
            </Button>
          )}
        </div>
      </div>

      {/* ─── Grid Postingan Media Sosial ─── */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {posts.map((post, idx) => {
            const isInstagram = post.platform === "instagram";
            const platformBadgeColor = isInstagram ? "pink" : "mint";
            const placeholderColor =
              placeholderColors[idx % placeholderColors.length];

            return (
              <article
                key={post.id}
                className="bg-white border-2 sm:border-3 border-ink rounded-[10px] sm:rounded-[14px] shadow-[var(--shadow-brutal-sm)] sm:shadow-[var(--shadow-brutal)] overflow-hidden flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
              >
                {/* Gambar Postingan */}
                <div className="relative aspect-[4/3] w-full border-b-2 sm:border-b-3 border-ink bg-cream overflow-hidden">
                  {post.imageFile ? (
                    <Image
                      src={post.imageFile}
                      alt={post.caption || "Postingan media sosial Niken Bakery"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <PlaceholderCake
                      color={placeholderColor}
                      className="w-full h-full rounded-none border-0 group-hover:scale-105 transition-transform duration-200"
                    />
                  )}
                  <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10">
                    <Badge color={platformBadgeColor} className="text-[10px] sm:text-xs font-bold uppercase px-1.5 sm:px-2.5 py-0.5 inline-flex items-center gap-1">
                      {isInstagram ? (
                        <>
                          <IconInstagram className="w-3 h-3 text-ink" />
                          <span>IG</span>
                        </>
                      ) : (
                        <>
                          <IconTikTok className="w-3 h-3 text-ink" />
                          <span>TikTok</span>
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Konten & Caption */}
                <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-4">
                  <p className="text-xs sm:text-base text-ink font-medium leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {post.caption}
                  </p>

                  <div className="pt-2 sm:pt-3 border-t sm:border-t-2 border-ink/10 flex items-center justify-between">
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] sm:text-sm font-extrabold text-ink hover:underline"
                    >
                      <span>Lihat Post</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                    <span className="hidden sm:inline text-xs text-ink/80 font-bold" aria-hidden="true">
                      ● Niken Bakery
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal)]">
          <EmptyState
            title="Belum ada postingan"
            description="Postingan kurasi media sosial sedang dipersiapkan. Cek langsung akun Instagram dan TikTok kami!"
            actionLabel="Buka Instagram"
            actionHref={settings.instagram_url || "#"}
          />
        </div>
      )}

      {/* ─── Ajakan "Tag Kami!" ─── */}
      <section className="bg-butter border-3 border-ink rounded-[14px] p-8 md:p-12 shadow-[var(--shadow-brutal-lg)] text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-white border-2 border-ink flex items-center justify-center shadow-[var(--shadow-brutal-sm)]">
          <IconCamera className="w-6 h-6 text-ink" />
        </div>
        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold text-ink">
            Punya Momen Manis Bersama Kue Kami?
          </h2>
          <p className="text-sm md:text-base text-ink/80 font-medium leading-relaxed">
            Abadikan momen spesialmu dan jangan lupa tag kami di Instagram{" "}
            <span className="font-bold underline">@nikenbakery</span> atau TikTok{" "}
            <span className="font-bold underline">@nikenbakery</span>. Kami senang
            sekali melihat senyum bahagiamu!{" "}
            <IconHeart className="w-4 h-4 text-danger fill-danger inline ml-1" />
          </p>
        </div>
      </section>
    </main>
  );
}
