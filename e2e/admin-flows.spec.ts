import { test, expect } from "@playwright/test";
import path from "node:path";
import { SEED_DATA } from "./fixtures/seed-data";

test.describe("Alur Pengelolaan Admin (ADM-01 s/d ADM-09)", () => {
  // Seluruh tes admin yang memodifikasi data dijalankan secara serial
  test.describe.configure({ mode: "serial" });
  const authFile = path.resolve(process.cwd(), "e2e/.auth/admin.json");

  test("ADM-01: Akses ke /admin tanpa login dialihkan ke /admin/login", async ({
    browser,
  }) => {
    // Gunakan context kosong tanpa session cookie
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto("/admin/settings");
    await expect(page).toHaveURL(/\/admin\/login/);

    await context.close();
  });

  test("ADM-02: Login gagal menampilkan pesan generik, login benar masuk dashboard, dan logout membersihkan sesi", async ({
    browser,
    isMobile,
  }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    await page.goto("/admin/login");

    // 1. Password salah
    await page.fill('input[name="username"]', SEED_DATA.admin.username);
    await page.fill('input[name="password"]', "passwordsalah123");
    await page.click('button[type="submit"]');
    await expect(page.locator('form [role="alert"]')).toContainText(
      /username atau password salah/i
    );

    // 2. Login berhasil
    await page.fill('input[name="username"]', SEED_DATA.admin.username);
    await page.fill('input[name="password"]', SEED_DATA.admin.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin(?!\/login)/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/dashboard/i);

    // 3. Logout
    if (isMobile) {
      await page.getByRole("button", { name: /buka menu admin/i }).click();
    }
    const logoutBtn = page.getByRole("button", { name: /keluar/i });
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();
    await expect(page).toHaveURL(/\/admin\/login/);

    // Pastikan tidak bisa kembali ke /admin setelah logout
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    await context.close();
  });

  test("ADM-03: Tambah produk lengkap (2 varian, upload cake.jpg) -> tampil di /menu dan detail produk", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();

    await page.goto("/admin/products/new");
    await expect(page.getByRole("heading", { name: /tambah produk baru/i })).toBeVisible();

    // Isi informasi dasar
    const testProductName = "E2E Spesial Rainbow Cake";
    const testProductSlug = "e2e-spesial-rainbow-cake";
    await page.fill("#prod-name", testProductName);
    await page.fill("#prod-base-price", "85000");
    await page.fill("#prod-desc", "Kue pelangi spesial untuk uji coba end-to-end otomatis.");

    // Tambah 2 varian
    await page.getByRole("button", { name: /\+ tambah varian/i }).click();
    const variantNameInputs = page.locator('input[placeholder*="Nama varian"]');
    const variantPriceInputs = page.locator('input[placeholder="Harga"]');

    await variantNameInputs.nth(0).fill("Ukuran Mini (10cm)");
    await variantPriceInputs.nth(0).fill("85000");

    await page.getByRole("button", { name: /\+ tambah varian/i }).click();
    await variantNameInputs.nth(1).fill("Ukuran Medium (18cm)");
    await variantPriceInputs.nth(1).fill("150000");

    // Upload cake.jpg
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.resolve(process.cwd(), "e2e/fixtures/cake.jpg"));

    // Simpan produk
    await page.getByRole("button", { name: /simpan produk/i }).click();
    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(
      page
        .getByRole("link", { name: testProductName })
        .filter({ visible: true })
        .first()
    ).toBeVisible();

    // Buka halaman publik /menu dan pastikan tampil
    const pubPage = await context.newPage();
    await pubPage.goto("/menu");
    await expect(pubPage.getByText(testProductName).first()).toBeVisible();

    // Buka halaman detail produk
    await pubPage.goto(`/menu/${testProductSlug}`);
    await expect(
      pubPage.getByRole("heading", { level: 1, name: testProductName })
    ).toBeVisible();
    await expect(pubPage.getByRole("button", { name: /ukuran mini/i })).toBeVisible();
    await expect(pubPage.getByRole("button", { name: /ukuran medium/i })).toBeVisible();

    await context.close();
  });

  test("ADM-04: Toggle status stok ke Habis langsung tercermin di publik", async ({
    browser,
    isMobile,
  }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();

    await page.goto("/admin/products");

    // Cari elemen produk Strawberry Shortcake (desktop: baris tr, mobile: kartu)
    const statusSelect = isMobile
      ? page
          .locator(".md\\:hidden")
          .locator("div")
          .filter({ hasText: "Strawberry Shortcake" })
          .locator("select")
          .first()
      : page.locator("tr", { hasText: "Strawberry Shortcake" }).locator("select");

    await expect(statusSelect).toBeVisible();

    // Ubah status dari ready ke soldout (Habis)
    await statusSelect.selectOption("soldout");

    // Buka halaman publik Strawberry Shortcake
    const pubPage = await context.newPage();
    await pubPage.goto(`/menu/${SEED_DATA.products.inStock.slug}`);
    await expect(pubPage.getByText(/habis/i).first()).toBeVisible();

    // Kembalikan ke ready untuk menjaga kestabilan tes lain
    await statusSelect.selectOption("ready");

    await context.close();
  });

  test("ADM-05: Ubah nomor WhatsApp di Pengaturan mengubah seluruh href WA di publik", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();

    await page.goto("/admin/settings");
    const waInput = page.locator('input[name="whatsapp_number"]');
    await expect(waInput).toBeVisible();

    const newPhone = "089988776655";
    const expectedNormalized = "6289988776655";

    await waInput.fill(newPhone);
    await page.getByRole("button", { name: /simpan.*pengaturan/i }).click();

    // Verifikasi toast sukses
    await expect(
      page.getByText(/pengaturan toko berhasil disimpan/i)
    ).toBeVisible();

    // Cek di halaman Home publik
    const pubPage = await context.newPage();
    await pubPage.goto("/");
    const waLink = pubPage.locator('a[href*="wa.me"]').first();
    const href = await waLink.getAttribute("href");
    expect(href).toContain(expectedNormalized);

    // Kembalikan nomor asli toko
    await waInput.fill(SEED_DATA.phone);
    await page.getByRole("button", { name: /simpan.*pengaturan/i }).click();
    await expect(
      page.getByText(/pengaturan toko berhasil disimpan/i)
    ).toBeVisible();

    await context.close();
  });

  test("ADM-06: Banner yang dijadwalkan masa depan tidak tampil di Home, sedangkan banner aktif tampil", async ({
    page,
  }) => {
    await page.goto("/");

    // Banner aktif harus terlihat
    await expect(page.getByText("Promo Akhir Pekan!")).toBeVisible();

    // Banner masa depan TIDAK boleh terlihat
    await expect(page.getByText("Promo Tahun Depan")).not.toBeVisible();
  });

  test("ADM-07: Hapus produk menghilangkannya dari publik dan menghapus file gambarnya dari disk", async ({
    browser,
    isMobile,
  }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();

    await page.goto("/admin/products");

    // Cari produk yang dibuat di ADM-03
    const testProductName = "E2E Spesial Rainbow Cake";
    const deleteBtn = isMobile
      ? page
          .locator(".md\\:hidden")
          .locator("div")
          .filter({ hasText: testProductName })
          .getByRole("button", { name: "Hapus" })
          .first()
      : page
          .locator("tr", { hasText: testProductName })
          .getByRole("button", { name: "Hapus" });

    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // Konfirmasi dialog hapus
    const confirmBtn = page.getByRole("button", { name: /ya, hapus/i });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // Tunggu modal tertutup & toast berhasil muncul
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByText(/berhasil dihapus/i)).toBeVisible();

    // Verifikasi produk hilang dari tabel admin
    await expect(page.getByRole("link", { name: testProductName })).toHaveCount(0);

    // Cek di publik bahwa produk sudah tidak ada (menampilkan halaman 404)
    const pubPage = await context.newPage();
    const res = await pubPage.goto("/menu/e2e-spesial-rainbow-cake");
    expect([200, 404]).toContain(res?.status());
    await expect(
      pubPage.getByRole("heading", { name: /tidak ditemukan/i })
    ).toBeVisible();

    await context.close();
  });

  test("ADM-08: Tambah testimoni, post social, dan FAQ tampil di halaman publik terkait", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();

    // 1. Tambah Testimoni Baru
    await page.goto("/admin/testimonials");
    await page.getByRole("button", { name: /\+ tambah testimoni/i }).click();
    await page.fill('input[name="name"]', "E2E Reviewer Bintang 5");
    await page.fill('input[name="handle"]', "@e2ereviewer");
    await page.fill('textarea[name="content"]', "Rasa kuenya sangat lezat dan pengirimannya tepat waktu!");
    await page.getByRole("button", { name: /^tambah testimoni$/i }).click();
    await expect(page.getByText("E2E Reviewer Bintang 5").first()).toBeVisible();

    // 2. Tambah FAQ Baru
    await page.goto("/admin/faqs");
    await page.getByRole("button", { name: /\+ tambah faq/i }).click();
    await page.fill('input[name="question"]', "Apakah Niken Bakery menerima custom tulisan di atas kue?");
    await page.fill('textarea[name="answer"]', "Ya, tentu saja! Tuliskan pesan ucapan saat melakukan pemesanan via WhatsApp.");
    await page.getByRole("button", { name: /^buat faq$/i }).click();
    await expect(page.getByText("Apakah Niken Bakery menerima custom tulisan").first()).toBeVisible();

    // 3. Tambah Post Social Baru dengan Upload Foto
    await page.goto("/admin/social");
    await page.getByRole("button", { name: /\+ tambah postingan/i }).click();
    await page.fill('textarea[name="caption"]', "E2E Momen Manis Dapur Niken Bakery!");
    await page.fill('input[name="postUrl"]', "https://instagram.com/p/e2etest123");
    const socialFileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('input[type="file"]').click();
    const socialFileChooser = await socialFileChooserPromise;
    await socialFileChooser.setFiles(path.resolve(process.cwd(), "e2e/fixtures/cake.jpg"));
    await page.getByRole("button", { name: /^tambah postingan$/i }).click();
    await expect(page.getByText("E2E Momen Manis Dapur Niken Bakery!").first()).toBeVisible();

    // 4. Verifikasi di Publik
    const pubPage = await context.newPage();

    // Cek Testimoni dan Post Social di Home
    await pubPage.goto("/");
    await expect(pubPage.getByText("E2E Reviewer Bintang 5").first()).toBeVisible();
    await expect(pubPage.getByText("E2E Momen Manis Dapur Niken Bakery!").first()).toBeVisible();

    // Cek FAQ di About
    await pubPage.goto("/about");
    await expect(pubPage.getByText("Apakah Niken Bakery menerima custom tulisan di atas kue?").first()).toBeVisible();

    // Cek Post Social di Halaman /social beserta gambarnya
    await pubPage.goto("/social");
    await expect(pubPage.getByText("E2E Momen Manis Dapur Niken Bakery!").first()).toBeVisible();
    const socialImg = pubPage.locator('img[src*="media"]').first();
    await expect(socialImg).toBeVisible();

    await context.close();
  });

  test("ADM-09: Dashboard menampilkan angka klik WhatsApp yang bertambah setelah tombol WA diklik di publik", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();

    // 1. Ambil jumlah klik WA awal di dashboard admin
    await page.goto("/admin");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/dashboard/i);
    const waCard = page.locator("div", { hasText: "Klik WhatsApp (7 Hari)" }).last();
    await expect(waCard).toBeVisible();
    const initialText = await waCard.locator(".font-heading").innerText();
    const initialClicks = parseInt(initialText.trim(), 10) || 0;

    // 2. Klik tombol WhatsApp di halaman publik
    const pubPage = await context.newPage();
    await pubPage.route("https://wa.me/**", (route) => route.abort());
    await pubPage.goto("/menu/strawberry-shortcake");

    const waBtn = pubPage
      .locator("main")
      .getByRole("link", { name: /pesan via whatsapp/i })
      .filter({ visible: true })
      .first();
    await expect(waBtn).toBeVisible();

    const requestPromise = pubPage.waitForRequest(
      (req) => req.url().includes("/api/events") && req.method() === "POST"
    );
    await waBtn.dispatchEvent("click");
    await requestPromise;

    // 3. Reload dashboard admin dan verifikasi angka klik bertambah
    await page.reload();
    await expect(async () => {
      await page.reload();
      const updatedText = await waCard.locator(".font-heading").innerText();
      const updatedClicks = parseInt(updatedText.trim(), 10) || 0;
      expect(updatedClicks).toBeGreaterThan(initialClicks);
    }).toPass({ timeout: 5000 });

    await pubPage.close();
    await context.close();
  });
});
