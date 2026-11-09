import { db } from "../db";
import { products, productImages } from "../db/schema";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads"));

interface ProductImagePlan {
  productSlug: string;
  images: Array<{
    sourceType: "local" | "url";
    source: string;
    alt: string;
    isCover: boolean;
  }>;
}

const BRAIN_DIR = "C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\b2d31d5a-81fa-4638-b0b9-4dcefaa55f77";

const imagePlans: ProductImagePlan[] = [
  {
    productSlug: "strawberry-shortcake",
    images: [
      {
        sourceType: "local",
        source: path.join(BRAIN_DIR, "strawberry_shortcake_1794217523112.jpg"),
        alt: "Strawberry Shortcake potong dengan strawberry segar dan whipped cream",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80",
        alt: "Kue Strawberry Shortcake utuh dengan hiasan buah strawberry",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "red-velvet",
    images: [
      {
        sourceType: "local",
        source: path.join(BRAIN_DIR, "red_velvet_1_1794217586736.jpg"),
        alt: "Red Velvet Cake utuh dengan cream cheese frosting dan taburan remah",
        isCover: true,
      },
      {
        sourceType: "local",
        source: path.join(BRAIN_DIR, "red_velvet_2_1794217602276.jpg"),
        alt: "Potongan Red Velvet Cake dengan lapisan merah pekat dan krim lembut",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "burnt-cheesecake",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&q=80",
        alt: "Basque Burnt Cheesecake dengan permukaan gosong karamel aromatik",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=1200&q=80",
        alt: "Irisan Burnt Cheesecake dengan tekstur bagian tengah lembut creamy",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "bolu-pandan",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80",
        alt: "Bolu Pandan lembut harum khas",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1200&q=80",
        alt: "Potongan Bolu Pandan empuk teman minum kopi",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "mille-crepes",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1505976378723-9726b54e9bb9?w=1200&q=80",
        alt: "Mille Crepes dengan puluhan lapisan crepe tipis dan krim vanila",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=1200&q=80",
        alt: "Potongan Mille Crepes memperlihatkan tekstur berlapis yang rapi",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "fudgy-brownies",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&q=80",
        alt: "Fudgy Brownies dark chocolate dengan kerak berkilau dan tekstur lumer",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=1200&q=80",
        alt: "Tumpukan Fudgy Brownies cokelat premium yang padat dan legit",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "cheesecake-bars",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=1200&q=80",
        alt: "Cheesecake Bars dengan dasar crumble renyah dan topping buah berry",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1200&q=80",
        alt: "Potongan Cheesecake Bar lezat di piring keramik",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "lemon-bars",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1519869325930-281384150729?w=1200&q=80",
        alt: "Lemon Bars kuning segar dengan taburan gula halus",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&q=80",
        alt: "Lemon Bars tart asam manis di atas dasar mentega renyah",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "butter-cookies",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80",
        alt: "Aneka Butter Cookies mentega harum renyah keemasan",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1200&q=80",
        alt: "Butter Cookies bentuk putar klasik",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "double-choc-chip",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200&q=80",
        alt: "Double Choc Chip Cookies dengan butiran cokelat melimpah",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80",
        alt: "Cookies cokelat tebal dengan lelehan dark and milk chocolate",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "matcha-cookies",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=1200&q=80",
        alt: "Matcha Cookies hijau dengan chunks white chocolate manis",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1597528662465-55ece5734101?w=1200&q=80",
        alt: "Kue kering rasa matcha premium aroma teh hijau Jepang",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "croissant",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80",
        alt: "Croissant mentega renyah berlapis-lapis warna emas kecokelatan",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
        alt: "Croissant renyah fresh from the oven",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "danish-pastry",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1200&q=80",
        alt: "Danish Pastry renyah berkilau dengan isian custard lembut",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=1200&q=80",
        alt: "Danish Pastry gulung berlapis kayu manis dan apel",
        isCover: false,
      },
    ],
  },
  {
    productSlug: "egg-tart",
    images: [
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1200&q=80",
        alt: "Portuguese Egg Tart puff pastry renyah dengan custard telur karamel",
        isCover: true,
      },
      {
        sourceType: "url",
        source: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&q=80",
        alt: "Egg Tart lezat lembut dimakan hangat",
        isCover: false,
      },
    ],
  },
];

async function processImageBuffer(buffer: Buffer): Promise<{ largeFileName: string; thumbFileName: string }> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const fileId = crypto.randomUUID();
  const largeFileName = `${fileId}-1200w.webp`;
  const thumbFileName = `${fileId}-480w.webp`;

  const largePath = path.join(UPLOAD_DIR, largeFileName);
  const thumbPath = path.join(UPLOAD_DIR, thumbFileName);

  await sharp(buffer)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(largePath);

  await sharp(buffer)
    .rotate()
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  return { largeFileName, thumbFileName };
}

async function main() {
  console.log("🚀 Menyiapkan pembaruan foto produk (2 foto per menu, product style)...");
  console.log(`📁 Upload Dir: ${UPLOAD_DIR}`);

  // 1. Ambil semua produk dari DB
  const allProducts = db.select().from(products).all();
  const productMap = new Map(allProducts.map((p) => [p.slug, p]));

  // 2. Bersihkan tabel productImages saat ini
  const oldImages = db.select().from(productImages).all();
  console.log(`🗑️ Menghapus ${oldImages.length} data foto lama dari database...`);
  db.delete(productImages).run();

  // 3. Proses setiap item menu
  for (const plan of imagePlans) {
    const product = productMap.get(plan.productSlug);
    if (!product) {
      console.warn(`⚠️ Produk slug "${plan.productSlug}" tidak ditemukan di database.`);
      continue;
    }

    console.log(`\n📸 Memproses foto untuk: ${product.name} (ID: ${product.id})`);

    let sortOrder = 1;
    for (const imgConfig of plan.images) {
      let buffer: Buffer;

      if (imgConfig.sourceType === "local") {
        console.log(`  [${sortOrder}] Membaca foto AI dari: ${path.basename(imgConfig.source)}`);
        buffer = await fs.readFile(imgConfig.source);
      } else {
        console.log(`  [${sortOrder}] Mengunduh foto produk dari: ${imgConfig.source.split("?")[0]}`);
        const res = await fetch(imgConfig.source);
        if (!res.ok) {
          throw new Error(`Gagal mengunduh gambar: ${res.status} ${res.statusText}`);
        }
        const ab = await res.arrayBuffer();
        buffer = Buffer.from(ab);
      }

      const { largeFileName, thumbFileName } = await processImageBuffer(buffer);

      db.insert(productImages)
        .values({
          productId: product.id,
          fileName: `/media/${largeFileName}`,
          thumbName: `/media/${thumbFileName}`,
          alt: imgConfig.alt,
          isCover: imgConfig.isCover,
          sortOrder,
        })
        .run();

      console.log(`  ✓ Tersimpan: /media/${thumbFileName} (Cover: ${imgConfig.isCover})`);
      sortOrder++;
    }
  }

  const finalCount = db.select().from(productImages).all().length;
  console.log(`\n🎉 Selesai! Total ${finalCount} foto produk berhasil disimpan dan aktif di katalog.`);
}

main().catch((err) => {
  console.error("❌ Error saat memperbarui foto produk:", err);
  process.exit(1);
});
