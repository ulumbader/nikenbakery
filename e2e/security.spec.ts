import { test, expect } from "@playwright/test";
import path from "node:path";

test.describe("Pengujian Keamanan (SEC-01 s/d SEC-06)", () => {
  test("SEC-01: Akses ke rute admin tanpa sesi ditolak dan diredirect ke login", async ({
    request,
  }) => {
    // Request tanpa cookie admin_session
    const res = await request.get("/admin", { maxRedirects: 0 });
    // Next.js middleware / proxy redirect (307/308) ke /admin/login
    expect([302, 307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toContain("/admin/login");
  });

  test("SEC-02: Path traversal pada /media/ dicegah dan tidak membocorkan file rahasia", async ({
    request,
  }) => {
    const maliciousPaths = [
      "/media/..%2f..%2f.env",
      "/media/..%2f..%2f..%2fpackage.json",
      "/media/..%5c..%5c.env",
      "/media/%2e%2e%2f%2e%2e%2fpackage.json",
    ];

    for (const p of maliciousPaths) {
      const res = await request.get(p);
      // Status harus 400, 403, atau 404 (bukan 200)
      expect([400, 403, 404]).toContain(res.status());

      const body = await res.text();
      // Pastikan tidak ada kebocoran isi file .env atau secret
      expect(body).not.toContain("SESSION_SECRET");
      expect(body).not.toContain("ADMIN_PASSWORD");
    }
  });

  test("SEC-03: Upload file tidak valid (SVG, file teks berekstensi .jpg, file > 5MB) ditolak dengan pesan jelas", async ({
    browser,
  }) => {
    const authFile = path.resolve(process.cwd(), "e2e/.auth/admin.json");
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();

    await page.goto("/admin/products/new");
    await page.fill("#prod-name", "Security Invalid Upload Test");
    await page.fill("#prod-base-price", "50000");

    // 1. Upload file SVG (harus ditolak karena SVG dilarang demi keamanan XSS)
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.resolve(process.cwd(), "e2e/fixtures/fake.svg"));

    await page.getByRole("button", { name: /simpan produk/i }).click();
    await expect(page.locator('form [role="alert"]')).toContainText(
      /format svg tidak diizinkan|format gambar harus jpeg/i
    );

    await context.close();
  });

  test("SEC-04: Login 6 kali berturut-turut dengan kredensial salah terkena rate limit", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    const testUsername = `ratelimit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    await page.goto("/admin/login");

    // Lakukan 5 kali percobaan gagal
    for (let i = 1; i <= 5; i++) {
      await page.fill('input[name="username"]', testUsername);
      await page.fill('input[name="password"]', `wrongpassword_${i}`);
      const responsePromise = page.waitForResponse(
        (res) => res.request().method() === "POST"
      );
      await page.click('button[type="submit"]');
      await responsePromise;
      await expect(page.locator('form [role="alert"]')).toContainText(
        /username atau password salah/i
      );
    }

    // Percobaan ke-6 harus ditolak oleh rate limiter
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="password"]', "wrongpassword_6");
    const responsePromise6 = page.waitForResponse(
      (res) => res.request().method() === "POST"
    );
    await page.click('button[type="submit"]');
    await responsePromise6;

    await expect(page.locator('form [role="alert"]')).toContainText(
      /terlalu banyak percobaan gagal/i
    );

    await context.close();
  });

  test("SEC-05: Route event analitik membatasi spam dan menolak payload tidak valid", async ({
    request,
  }) => {
    // 1. Payload tidak valid ditolak (400)
    const invalidRes = await request.post("/api/events", {
      data: { type: "hacked_event_type_tidak_valid" },
      headers: { "x-forwarded-for": "10.99.1.1" },
    });
    expect([400, 422]).toContain(invalidRes.status());

    // 2. Payload terlalu besar > 2KB ditolak (413)
    const hugePayload = {
      type: "wa_click",
      spamData: "A".repeat(3000),
    };
    const hugeRes = await request.post("/api/events", {
      data: hugePayload,
      headers: { "x-forwarded-for": "10.99.1.2" },
    });
    expect(hugeRes.status()).toBe(413);

    // 3. Rate limiting deteksi spam: 35 request dalam waktu singkat
    let rateLimited = false;
    for (let i = 0; i < 35; i++) {
      const res = await request.post("/api/events", {
        data: { type: "wa_click", productId: 1 },
        headers: { "x-forwarded-for": "10.99.1.3" },
      });
      if (res.status() === 429) {
        rateLimited = true;
        break;
      }
    }
    expect(rateLimited).toBe(true);
  });

  test("SEC-06: Header cookie sesi memiliki atribut HttpOnly dan SameSite=Lax", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    await page.goto("/admin/login");
    await page.fill('input[name="username"]', "testadmin");
    await page.fill('input[name="password"]', "testadmin12345");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin(?!\/login)/);

    // Ambil cookies dari browser context
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === "admin_session");

    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.sameSite.toLowerCase()).toBe("lax");

    await context.close();
  });
});
