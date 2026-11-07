import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import fs from "node:fs";
import { expectNoHorizontalScroll } from "./helpers/scroll";
import { SEED_DATA } from "./fixtures/seed-data";

const PAGES_TO_TEST = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Detail", path: `/menu/${SEED_DATA.products.inStock.slug}` },
  { name: "About", path: "/about" },
  { name: "Social", path: "/social" },
  { name: "Login", path: "/admin/login" },
];

test.describe("Kualitas Lintas Halaman (QLT-01 s/d QLT-04)", () => {
  const screenshotsDir = path.resolve(process.cwd(), "e2e/screenshots");

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test("QLT-01: Tidak ada scroll horizontal pada seluruh halaman utama (desktop & mobile)", async ({
    page,
  }) => {
    for (const p of PAGES_TO_TEST) {
      await page.goto(p.path);
      await expectNoHorizontalScroll(page);
    }
  });

  test("QLT-02: Audit aksesibilitas axe-core bebas dari pelanggaran serious dan critical", async ({
    page,
  }) => {
    for (const p of PAGES_TO_TEST) {
      await page.goto(p.path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const severeViolations = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      );

      expect(
        severeViolations,
        `Pelanggaran a11y terdeteksi pada ${p.path}: ${severeViolations.map((v) => v.help).join(", ")}`
      ).toEqual([]);
    }
  });

  test("QLT-03: Tidak ada error console atau request gagal saat menelusuri halaman utama", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("requestfailed", (request) => {
      // Abaikan request ke domain eksternal atau request navigasi yang dibatalkan browser saat pindah halaman
      const url = request.url();
      const failureError = request.failure()?.errorText || "";
      if (
        !url.includes("google") &&
        !url.includes("wa.me") &&
        failureError !== "net::ERR_ABORTED"
      ) {
        failedRequests.push(`${request.method()} ${url}: ${failureError}`);
      }
    });

    for (const p of PAGES_TO_TEST) {
      await page.goto(p.path);
    }

    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test("QLT-04: Menghasilkan tangkapan layar tinjauan visual neo-brutalism + glass ke e2e/screenshots/", async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name; // desktop atau mobile

    for (const p of PAGES_TO_TEST) {
      await page.goto(p.path);
      const fileName = `${projectName}-${p.name.toLowerCase()}.png`;
      await page.screenshot({
        path: path.join(screenshotsDir, fileName),
        fullPage: true,
      });
    }

    // Tangkapan layar khusus menu drawer mobile saat terbuka
    if (projectName === "mobile") {
      await page.goto("/");
      const hamburger = page.getByRole("button", { name: /buka menu navigasi/i });
      if (await hamburger.isVisible()) {
        await hamburger.click();
        await page.waitForSelector("#mobile-navigation");
        await page.screenshot({
          path: path.join(screenshotsDir, "mobile-menu-drawer.png"),
        });
      }
    }
  });
});
