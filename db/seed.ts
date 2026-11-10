import { eq } from "drizzle-orm";
import { db, postgresClient } from "./index";
import { first } from "./first";
import {
  categories,
  products,
  productVariants,
  banners,
  testimonials,
  socialPosts,
  faqs,
  siteSettings,
} from "./schema";

async function seed() {
  console.log("🌱 Seeding missing sample content (existing data is preserved)...");

  // ─── Categories ───
  const categoryData = [
    { name: "Cake", slug: "cake", color: "pink" as const, sortOrder: 1 },
    { name: "Brownies & Bars", slug: "brownies-bars", color: "butter" as const, sortOrder: 2 },
    { name: "Cookies", slug: "cookies", color: "mint" as const, sortOrder: 3 },
    { name: "Pastry", slug: "pastry", color: "lavender" as const, sortOrder: 4 },
  ];

  for (const cat of categoryData) {
    const existing = await first(db.select().from(categories).where(eq(categories.slug, cat.slug)).limit(1));
    if (!existing) {
      await db.insert(categories).values(cat);
    }
  }
  console.log("  ✓ Categories");

  // Fetch inserted categories for FK references
  const allCats = await db.select().from(categories);
  const catMap = Object.fromEntries(allCats.map((c) => [c.slug, c.id]));

  // ─── Products ───
  const productData = [
    {
      name: "Strawberry Shortcake",
      slug: "strawberry-shortcake",
      description: "Sponge cake lembut dengan strawberry segar dan whipped cream. Favorit sepanjang masa!",
      basePrice: 185000,
      categorySlug: "cake",
      status: "ready" as const,
      ingredients: "Tepung terigu, telur, gula, mentega, strawberry segar, whipped cream",
      allergens: "Gluten, telur, susu",
      isFeatured: true,
      sortOrder: 1,
      variants: [
        { label: "Diameter 16 cm", price: 185000, sortOrder: 1 },
        { label: "Diameter 20 cm", price: 265000, sortOrder: 2 },
        { label: "Diameter 24 cm", price: 350000, sortOrder: 3 },
      ],
    },
    {
      name: "Red Velvet Cake",
      slug: "red-velvet",
      description: "Red velvet klasik dengan cream cheese frosting yang creamy. Cantik untuk segala acara.",
      basePrice: 195000,
      categorySlug: "cake",
      status: "ready" as const,
      ingredients: "Tepung terigu, kakao, buttermilk, cream cheese, mentega",
      allergens: "Gluten, telur, susu",
      isFeatured: true,
      sortOrder: 2,
      variants: [
        { label: "Diameter 16 cm", price: 195000, sortOrder: 1 },
        { label: "Diameter 20 cm", price: 285000, sortOrder: 2 },
      ],
    },
    {
      name: "Burnt Cheesecake",
      slug: "burnt-cheesecake",
      description: "Basque burnt cheesecake dengan tekstur creamy di dalam dan karamelisasi sempurna di luar.",
      basePrice: 165000,
      categorySlug: "cake",
      status: "ready" as const,
      ingredients: "Cream cheese, telur, gula, heavy cream, tepung terigu",
      allergens: "Gluten, telur, susu",
      isFeatured: true,
      sortOrder: 3,
      variants: [],
    },
    {
      name: "Bolu Pandan",
      slug: "bolu-pandan",
      description: "Bolu pandan harum dengan tekstur lembut khas. Cocok buat teman ngopi sore.",
      basePrice: 75000,
      categorySlug: "cake",
      status: "ready" as const,
      ingredients: "Tepung terigu, telur, gula, santan, daun pandan, mentega",
      allergens: "Gluten, telur, susu",
      isFeatured: false,
      sortOrder: 4,
      variants: [],
    },
    {
      name: "Mille Crepes",
      slug: "mille-crepes",
      description: "Puluhan lapisan crepe tipis dengan pastry cream. Butuh waktu dan kesabaran, tapi worth it!",
      basePrice: 210000,
      categorySlug: "cake",
      status: "preorder" as const,
      preorderNote: "Pre-order H-2",
      ingredients: "Tepung terigu, telur, susu, mentega, pastry cream",
      allergens: "Gluten, telur, susu",
      isFeatured: true,
      sortOrder: 5,
      variants: [
        { label: "Original", price: 210000, sortOrder: 1 },
        { label: "Matcha", price: 225000, sortOrder: 2 },
        { label: "Chocolate", price: 225000, sortOrder: 3 },
      ],
    },
    {
      name: "Fudgy Brownies",
      slug: "fudgy-brownies",
      description: "Brownies super fudgy dengan dark chocolate premium. Dijamin bikin nagih!",
      basePrice: 65000,
      categorySlug: "brownies-bars",
      status: "ready" as const,
      ingredients: "Dark chocolate, mentega, telur, gula, tepung terigu",
      allergens: "Gluten, telur, susu",
      isFeatured: true,
      sortOrder: 1,
      variants: [
        { label: "6 potong", price: 65000, sortOrder: 1 },
        { label: "12 potong", price: 120000, sortOrder: 2 },
      ],
    },
    {
      name: "Cheesecake Bars",
      slug: "cheesecake-bars",
      description: "Bar cheesecake dengan base crumble renyah dan topping buah segar.",
      basePrice: 85000,
      categorySlug: "brownies-bars",
      status: "ready" as const,
      ingredients: "Cream cheese, biskuit, mentega, telur, gula, buah segar",
      allergens: "Gluten, telur, susu",
      isFeatured: false,
      sortOrder: 2,
      variants: [],
    },
    {
      name: "Lemon Bars",
      slug: "lemon-bars",
      description: "Lemon bars segar dengan shortbread base yang buttery. Asam manis sempurna.",
      basePrice: 75000,
      categorySlug: "brownies-bars",
      status: "soldout" as const,
      ingredients: "Tepung terigu, mentega, telur, lemon, gula",
      allergens: "Gluten, telur, susu",
      isFeatured: false,
      sortOrder: 3,
      variants: [],
    },
    {
      name: "Butter Cookies",
      slug: "butter-cookies",
      description: "Cookies mentega renyah di luar, lembut di dalam. Kemasan cantik, cocok buat hampers.",
      basePrice: 85000,
      categorySlug: "cookies",
      status: "ready" as const,
      ingredients: "Mentega, tepung terigu, gula halus, telur, vanilla",
      allergens: "Gluten, telur, susu",
      isFeatured: true,
      sortOrder: 1,
      variants: [
        { label: "Toples kecil (200g)", price: 85000, sortOrder: 1 },
        { label: "Toples besar (400g)", price: 155000, sortOrder: 2 },
      ],
    },
    {
      name: "Double Choc Chip Cookies",
      slug: "double-choc-chip",
      description: "Cookies dengan double chocolate chips — dark dan milk. Chewy perfection!",
      basePrice: 95000,
      categorySlug: "cookies",
      status: "ready" as const,
      ingredients: "Tepung terigu, mentega, dark chocolate chips, milk chocolate chips, telur, gula",
      allergens: "Gluten, telur, susu",
      isFeatured: false,
      sortOrder: 2,
      variants: [],
    },
    {
      name: "Matcha Cookies",
      slug: "matcha-cookies",
      description: "Cookies matcha premium dengan white chocolate chunks. Rasa unik yang bikin ketagihan.",
      basePrice: 95000,
      categorySlug: "cookies",
      status: "preorder" as const,
      preorderNote: "Pre-order H-1",
      ingredients: "Tepung terigu, mentega, matcha premium, white chocolate, telur",
      allergens: "Gluten, telur, susu",
      isFeatured: false,
      sortOrder: 3,
      variants: [],
    },
    {
      name: "Croissant",
      slug: "croissant",
      description: "Croissant butter berlapis-lapis dengan tekstur flaky yang bikin happy setiap pagi.",
      basePrice: 25000,
      categorySlug: "pastry",
      status: "ready" as const,
      ingredients: "Tepung terigu, mentega, ragi, susu, telur, gula, garam",
      allergens: "Gluten, telur, susu",
      isFeatured: false,
      sortOrder: 1,
      variants: [
        { label: "Plain", price: 25000, sortOrder: 1 },
        { label: "Almond", price: 35000, sortOrder: 2 },
        { label: "Chocolate", price: 32000, sortOrder: 3 },
      ],
    },
    {
      name: "Danish Pastry",
      slug: "danish-pastry",
      description: "Danish pastry renyah dengan pilihan isian. Teman sempurna untuk kopi pagi.",
      basePrice: 28000,
      categorySlug: "pastry",
      status: "ready" as const,
      ingredients: "Tepung terigu, mentega, ragi, susu, telur, custard cream",
      allergens: "Gluten, telur, susu",
      isFeatured: false,
      sortOrder: 2,
      variants: [
        { label: "Custard", price: 28000, sortOrder: 1 },
        { label: "Cinnamon Apple", price: 32000, sortOrder: 2 },
      ],
    },
    {
      name: "Egg Tart",
      slug: "egg-tart",
      description: "Egg tart ala Portugis dengan pastry renyah dan custard lembut. Dimakan hangat lebih nikmat!",
      basePrice: 18000,
      categorySlug: "pastry",
      status: "soldout" as const,
      ingredients: "Tepung terigu, mentega, telur, susu, gula, vanilla",
      allergens: "Gluten, telur, susu",
      isFeatured: false,
      sortOrder: 3,
      variants: [],
    },
  ];

  for (const p of productData) {
    const existing = await first(db.select().from(products).where(eq(products.slug, p.slug)).limit(1));
    if (!existing) {
      const { variants, categorySlug, preorderNote, ...rest } = p;
      const [inserted] = await db
        .insert(products)
        .values({
          ...rest,
          preorderNote: preorderNote ?? null,
          categoryId: catMap[categorySlug] ?? null,
        })
        .returning();

      if (!inserted) continue;

      for (const v of variants) {
        await db
          .insert(productVariants)
          .values({ ...v, productId: inserted.id });
      }
    }
  }
  console.log("  ✓ Products & variants");

  // ─── Banners ───
  const bannerData = [
    {
      title: "Promo Akhir Pekan!",
      subtitle: "Diskon 15% untuk semua brownies. Berlaku Sabtu-Minggu.",
      ctaLabel: "Lihat menu",
      ctaUrl: "/menu?kategori=brownies-bars",
      color: "butter" as const,
      sortOrder: 1,
    },
    {
      title: "Custom Cake untuk Acara Spesialmu",
      subtitle: "Mau kue ulang tahun custom? Hubungi kami via WhatsApp!",
      ctaLabel: "Hubungi kami",
      ctaUrl: "#",
      color: "pink" as const,
      sortOrder: 2,
    },
  ];

  for (const b of bannerData) {
    const existing = await first(db.select().from(banners).where(eq(banners.title, b.title)).limit(1));
    if (!existing) {
      await db.insert(banners).values(b);
    }
  }
  console.log("  ✓ Banners");

  // ─── Testimonials ───
  const testimonialData = [
    {
      name: "Rina",
      handle: "@rina_foodie",
      content: "Burnt cheesecake-nya juara banget! Creamy dan nggak terlalu manis. Pasti repeat order 😍",
      rating: 5,
      sortOrder: 1,
    },
    {
      name: "Dimas",
      handle: "@dimas.k",
      content: "Brownies paling fudgy yang pernah aku coba. Satu loyang habis sendiri, nggak bohong.",
      rating: 5,
      sortOrder: 2,
    },
    {
      name: "Sari",
      handle: "@sarisbake",
      content: "Pesan red velvet untuk ultah adik, semua suka! Dekorasinya juga cantik banget.",
      rating: 5,
      sortOrder: 3,
    },
    {
      name: "Budi",
      handle: null,
      content: "Croissant-nya flaky dan buttery, kayak di bakery Perancis. Langganan tiap weekend!",
      rating: 4,
      sortOrder: 4,
    },
    {
      name: "Maya",
      handle: "@mayacooks",
      content: "Butter cookies-nya renyah banget, kemasan cantik. Selalu jadi pilihan hampers lebaran kami.",
      rating: 5,
      sortOrder: 5,
    },
  ];

  for (const t of testimonialData) {
    const existing = await first(db
      .select()
      .from(testimonials)
      .where(eq(testimonials.name, t.name))
      .limit(1));
    if (!existing) {
      await db.insert(testimonials).values(t);
    }
  }
  console.log("  ✓ Testimonials");

  // ─── Social Posts ───
  const socialData = [
    {
      platform: "instagram" as const,
      caption: "Fresh from the oven! 🥐 Croissant butter kami sudah siap menemani pagimu.",
      postUrl: "https://instagram.com/p/contoh1",
      sortOrder: 1,
    },
    {
      platform: "instagram" as const,
      caption: "Behind the scenes: proses bikin mille crepes 20 lapisan ✨",
      postUrl: "https://instagram.com/p/contoh2",
      sortOrder: 2,
    },
    {
      platform: "tiktok" as const,
      caption: "Tutorial mini: dekorasi strawberry shortcake 🍓 #bakingathome",
      postUrl: "https://tiktok.com/@nikenbakery_contoh/video/contoh1",
      sortOrder: 3,
    },
    {
      platform: "instagram" as const,
      caption: "Customer happy = kita happy! 💕 Terima kasih Kak @rina_foodie atas ordernya.",
      postUrl: "https://instagram.com/p/contoh3",
      sortOrder: 4,
    },
    {
      platform: "tiktok" as const,
      caption: "Brownies potong yang bikin nagih 🍫 Siapa yang mau?",
      postUrl: "https://tiktok.com/@nikenbakery_contoh/video/contoh2",
      sortOrder: 5,
    },
    {
      platform: "instagram" as const,
      caption: "Weekend vibes: Danish pastry + kopi ☕ Combo sempurna!",
      postUrl: "https://instagram.com/p/contoh4",
      sortOrder: 6,
    },
  ];

  for (const s of socialData) {
    const existing = await first(db
      .select()
      .from(socialPosts)
      .where(eq(socialPosts.postUrl, s.postUrl))
      .limit(1));
    if (!existing) {
      await db.insert(socialPosts).values(s);
    }
  }
  console.log("  ✓ Social posts");

  // ─── FAQs ───
  const faqData = [
    {
      question: "Bagaimana cara memesan kue?",
      answer:
        "Pilih kue yang kamu mau di halaman Menu, lalu klik tombol 'Pesan via WhatsApp'. Kamu akan diarahkan ke WhatsApp untuk melanjutkan pemesanan.",
      sortOrder: 1,
    },
    {
      question: "Berapa lama waktu pembuatan kue custom?",
      answer:
        "Untuk kue custom, kami butuh minimal 3 hari kerja. Untuk kue yang lebih kompleks, bisa sampai 5–7 hari kerja.",
      sortOrder: 2,
    },
    {
      question: "Apakah bisa dikirim ke luar kota?",
      answer:
        "Saat ini kami hanya melayani pengiriman di area Kota Contoh dan sekitarnya. Untuk luar kota, silakan hubungi kami via WhatsApp untuk diskusi lebih lanjut.",
      sortOrder: 3,
    },
    {
      question: "Bagaimana sistem pembayarannya?",
      answer:
        "DP 50% saat pemesanan via transfer bank. Pelunasan dilakukan saat pengambilan atau sebelum pengiriman.",
      sortOrder: 4,
    },
    {
      question: "Apakah produk Niken Bakery halal?",
      answer:
        "Ya, semua produk kami dibuat dari bahan-bahan halal. Kami berkomitmen menjaga kualitas dan kehalalan setiap produk.",
      sortOrder: 5,
    },
    {
      question: "Bisa request desain kue ulang tahun?",
      answer:
        "Tentu! Kirimkan referensi desain yang kamu mau via WhatsApp, dan kami akan diskusikan bersama. Harga menyesuaikan tingkat kesulitan.",
      sortOrder: 6,
    },
  ];

  for (const f of faqData) {
    const existing = await first(db
      .select()
      .from(faqs)
      .where(eq(faqs.question, f.question))
      .limit(1));
    if (!existing) {
      await db.insert(faqs).values(f);
    }
  }
  console.log("  ✓ FAQs");

  // ─── Site Settings ───
  const settingsData: { key: string; value: string }[] = [
    { key: "business_name", value: "Niken Bakery" },
    { key: "tagline", value: "Kue lezat untuk setiap momen spesialmu" },
    { key: "timezone", value: "Asia/Jakarta" },
    { key: "whatsapp_number", value: "6281234567890" },
    {
      key: "wa_default_message",
      value: "Halo Niken Bakery! Aku mau tanya-tanya soal kue 🙌",
    },
    { key: "email", value: "contoh@nikenbakery.id" },
    { key: "address", value: "Alamat CONTOH, Jl. Contoh No. 1, Kota Contoh" },
    { key: "maps_url", value: "https://maps.google.com" },
    { key: "maps_embed_url", value: "" },
    {
      key: "opening_hours",
      value: JSON.stringify([
        { day: "Senin", open: "08:00", close: "20:00", closed: false },
        { day: "Selasa", open: "08:00", close: "20:00", closed: false },
        { day: "Rabu", open: "08:00", close: "20:00", closed: false },
        { day: "Kamis", open: "08:00", close: "20:00", closed: false },
        { day: "Jumat", open: "08:00", close: "20:00", closed: false },
        { day: "Sabtu", open: "09:00", close: "21:00", closed: false },
        { day: "Minggu", open: "09:00", close: "21:00", closed: false },
      ]),
    },
    {
      key: "instagram_url",
      value: "https://instagram.com/nikenbakery_contoh",
    },
    {
      key: "tiktok_url",
      value: "https://tiktok.com/@nikenbakery_contoh",
    },
    {
      key: "about_story",
      value:
        "Niken Bakery lahir dari dapur kecil di rumah Niken pada tahun 2020. Berawal dari hobi membuat kue untuk keluarga dan teman, ternyata banyak yang suka dan mulai pesan. Sekarang kami melayani ratusan pelanggan setiap bulan dengan kue-kue yang dibuat dari bahan pilihan dan penuh cinta.",
    },
    {
      key: "about_values",
      value: JSON.stringify([
        "Bahan berkualitas premium tanpa pengawet",
        "Dibuat fresh setiap hari dengan cinta",
        "Harga ramah untuk semua kalangan",
      ]),
    },
    { key: "about_image", value: "" },
    {
      key: "delivery_info",
      value:
        "Kami melayani pengiriman di area Kota Contoh dan sekitarnya. Ongkir dihitung berdasarkan jarak. Bisa juga diambil langsung di toko kami.",
    },
    {
      key: "order_policy",
      value:
        "DP 50% saat pemesanan, pelunasan saat pengambilan/pengiriman. Pembatalan maksimal H-2 sebelum tanggal ambil/kirim.",
    },
    {
      key: "halal_info",
      value: "Semua produk Niken Bakery menggunakan bahan halal.",
    },
    { key: "custom_order_enabled", value: "false" },
    { key: "custom_order_min_days", value: "3" },
  ];

  for (const s of settingsData) {
    const existing = await first(db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, s.key))
      .limit(1));
    if (!existing) {
      await db.insert(siteSettings).values(s);
    }
  }
  console.log("  ✓ Site settings");

  console.log("✅ Seed complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exitCode = 1;
}).finally(async () => {
  await postgresClient.end();
});

