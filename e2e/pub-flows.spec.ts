import { test, expect } from "@playwright/test";
import { SEED_DATA } from "./fixtures/seed-data";

test.describe("Alur Pengunjung Publik (PUB-01 s/d PUB-09)", () => {
  test.beforeEach(async ({ context }) => {
    // Cegat navigasi ke WhatsApp agar tidak keluar dari browser pengujian
    await context.route("https://wa.me/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body>WhatsApp Redirect Mocked</body></html>",
      });
    });
  });

  test("PUB-01: Home memuat hero, produk andalan, Cara Pesan, testimoni, dan tombol WhatsApp", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Hero termuat
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // 2. Produk andalan tampil
    const featuredHeading = page.getByRole("heading", { name: /kue andalan kami/i });
    await expect(featuredHeading).toBeVisible();
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();

    // 3. Cara pesan tampil
    await expect(page.getByRole("heading", { name: /cara pesan/i })).toBeVisible();

    // 4. Testimoni tampil
    await expect(page.getByRole("heading", { name: /kata mereka/i })).toBeVisible();

    // 5. Tombol WhatsApp berisi nomor toko dari settings
    const waButtons = page.locator('a[href*="wa.me"]');
    const firstWaHref = await waButtons.first().getAttribute("href");
    expect(firstWaHref).toContain(SEED_DATA.phoneFormatted);
  });

  test("PUB-02: Navigasi antar halaman publik berfungsi (termasuk drawer di layar mobile)", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");

    if (isMobile) {
      // Buka drawer hamburger
      const hamburger = page.getByRole("button", { name: /buka menu navigasi/i });
      await expect(hamburger).toBeVisible();
      await hamburger.click();

      // Klik Menu di dalam drawer
      const menuLink = page.getByRole("link", { name: "Menu", exact: true });
      await menuLink.click();
      await expect(page).toHaveURL(/\/menu/);

      // Buka lagi untuk Social
      await page.getByRole("button", { name: /buka menu navigasi/i }).click();
      await page.getByRole("link", { name: "Social", exact: true }).click();
      await expect(page).toHaveURL(/\/social/);

      // Buka lagi untuk About Us
      await page.getByRole("button", { name: /buka menu navigasi/i }).click();
      await page.getByRole("link", { name: "About Us", exact: true }).click();
      await expect(page).toHaveURL(/\/about/);
    } else {
      // Desktop: navigasi langsung via header
      await page.getByRole("navigation").getByRole("link", { name: "Menu", exact: true }).click();
      await expect(page).toHaveURL(/\/menu/);

      await page.getByRole("navigation").getByRole("link", { name: "Social", exact: true }).click();
      await expect(page).toHaveURL(/\/social/);

      await page.getByRole("navigation").getByRole("link", { name: "About Us", exact: true }).click();
      await expect(page).toHaveURL(/\/about/);
    }
  });

  test("PUB-03: Menu katalog dengan filter kategori, pencarian q, dan empty state", async ({
    page,
  }) => {
    await page.goto("/menu");

    // 1. Filter kategori Brownies & Bars
    const browniesPill = page.getByRole("link", { name: "Brownies & Bars", exact: true });
    await browniesPill.click();
    await expect(page).toHaveURL(/kategori=brownies-bars/);
    await expect(page.getByText("Fudgy Brownies")).toBeVisible();

    // 2. Reset filter kategori ke Semua
    const semuaPill = page.getByRole("link", { name: /^semua/i });
    await semuaPill.click();
    await expect(page).not.toHaveURL(/kategori=/);

    // 3. Pencarian nama produk
    const searchInput = page.locator("#menu-search-input");
    await searchInput.fill("Strawberry");
    // Tunggu URL dan daftar tersaring
    await expect(page).toHaveURL(/q=Strawberry/);
    await expect(page.getByText("Strawberry Shortcake")).toBeVisible();

    // 4. Pencarian kata kunci yang tidak ada -> Empty State
    await searchInput.fill("KueBatuTidakPernahAda12345");
    await expect(page).toHaveURL(/q=KueBatuTidakPernahAda12345/);
    await expect(page.getByRole("heading", { name: /belum ada kue yang cocok/i })).toBeVisible();
  });

  test("PUB-04: Detail produk mengganti varian mengubah harga dan pesan WhatsApp", async ({
    page,
  }) => {
    await page.goto(`/menu/${SEED_DATA.products.inStock.slug}`);

    // Pastikan judul kue tampil
    await expect(page.getByRole("heading", { name: SEED_DATA.products.inStock.name })).toBeVisible();

    // Varian awal (Diameter 16 cm - Rp 185.000)
    await expect(page.getByText(/185\.000/).first()).toBeVisible();
    let waButton = page.locator('main a[href*="wa.me"]').first();
    let waHref = await waButton.getAttribute("href");
    expect(decodeURIComponent(waHref || "")).toContain("Diameter 16 cm");

    // Ganti varian ke Diameter 20 cm
    const variant20 = page.getByRole("button", { name: /diameter 20 cm/i });
    await variant20.click();

    // Harga berubah jadi Rp 265.000
    await expect(page.getByText(/265\.000/).first()).toBeVisible();

    // Pesan WA ter-update memuat varian Diameter 20 cm
    waButton = page.locator('main a[href*="wa.me"]').first();
    waHref = await waButton.getAttribute("href");
    const decodedWa = decodeURIComponent(waHref || "");
    expect(decodedWa).toContain("Diameter 20 cm");
    expect(decodedWa).toContain(SEED_DATA.products.inStock.name);
  });

  test("PUB-05: Produk Habis menampilkan Tanya via WhatsApp, produk Pre-order menampilkan lead time", async ({
    page,
  }) => {
    // 1. Produk Habis (Basque Burnt Cheesecake)
    await page.goto(`/menu/${SEED_DATA.products.outOfStock.slug}`);
    await expect(page.getByText(/habis/i).first()).toBeVisible();
    const askWaBtn = page.locator('a[href*="wa.me"]').first();
    await expect(askWaBtn).toContainText(/tanya via whatsapp/i);

    // 2. Produk Pre-order (Custom Bento Cake)
    await page.goto(`/menu/${SEED_DATA.products.preorder.slug}`);
    await expect(page.getByText(/pre-order/i).first()).toBeVisible();
    await expect(page.getByText(/h-2/i)).toBeVisible();
  });

  test("PUB-06: Produk yang tidak dipublikasikan tidak muncul di menu dan mengembalikan 404", async ({
    page,
  }) => {
    // Pastikan produk unpublished tidak ada di /menu
    await page.goto("/menu");
    await expect(page.getByText("Secret Unpublished Cake")).not.toBeVisible();

    // Akses langsung slug unpublished harus menampilkan 404
    const resUnpub = await page.goto("/menu/secret-unpublished-cake");
    expect([200, 404]).toContain(resUnpub?.status());
    await expect(page.getByRole("heading", { name: /tidak ditemukan/i })).toBeVisible();

    // Slug ngawur juga 404
    const resRandom = await page.goto("/menu/kue-ngawur-yang-pasti-tidak-ada-404");
    expect([200, 404]).toContain(resRandom?.status());
    await expect(page.getByRole("heading", { name: /tidak ditemukan/i })).toBeVisible();
  });

  test("PUB-07: Halaman About menampilkan jam buka, status operasional, dan FAQ aksesibel keyboard", async ({
    page,
  }) => {
    await page.goto("/about");

    // Jam buka dan status tampil
    await expect(page.getByRole("heading", { name: /jam operasional/i })).toBeVisible();
    await expect(page.getByText(/buka sekarang|tutup/i).first()).toBeVisible();

    // FAQ Accordion bisa dibuka dengan keyboard Enter/Space
    const faqSummary = page.locator("details summary").first();
    await expect(faqSummary).toBeVisible();

    // Fokus dan buka dengan keyboard
    await faqSummary.focus();
    await page.keyboard.press("Enter");
    const faqDetails = page.locator("details").first();
    await expect(faqDetails).toHaveAttribute("open", "");
  });

  test("PUB-08: Halaman Social memiliki kartu post dengan rel noopener noreferrer", async ({
    page,
  }) => {
    await page.goto("/social");

    // Pastikan ada post sosial
    const externalLinks = page.locator('a[href*="instagram.com"], a[href*="tiktok.com"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      const rel = await link.getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  test("PUB-09: Alur lengkap Home -> pilih kue -> klik WhatsApp selesai dalam maksimal 3 ketukan", async ({
    page,
  }) => {
    // Ketukan 1: Buka Home dan klik kue andalan pertama
    await page.goto("/");
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    await expect(firstProductCard).toBeVisible();
    await firstProductCard.locator("a").first().click();

    // Ketukan 2: Masuk ke halaman detail produk
    await expect(page).toHaveURL(/\/menu\//);
    const waButton = page.locator('main a[href*="wa.me"]:visible').first();
    await expect(waButton).toBeVisible();

    // Ketukan 3: Klik tombol WhatsApp
    await waButton.click({ force: true });

    // Memverifikasi tautan WhatsApp valid dan memuat nama kue
    const waHref = await waButton.getAttribute("href");
    expect(waHref).toContain("https://wa.me/");
    expect(decodeURIComponent(waHref || "")).toContain("Strawberry Shortcake");
  });
});
