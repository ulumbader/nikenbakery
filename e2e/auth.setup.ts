import { test as setup, expect } from "@playwright/test";
import path from "node:path";
import { SEED_DATA } from "./fixtures/seed-data";

const authFile = path.resolve(process.cwd(), "e2e/.auth/admin.json");

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill('input[name="username"]', SEED_DATA.admin.username);
  await page.fill('input[name="password"]', SEED_DATA.admin.password);
  await page.click('button[type="submit"]');

  // Pastikan berhasil masuk ke dashboard
  await expect(page).toHaveURL(/\/admin(?!\/login)/);
  await expect(page.locator("h1")).toContainText(/dashboard/i);

  // Simpan storage state
  await page.context().storageState({ path: authFile });
});

