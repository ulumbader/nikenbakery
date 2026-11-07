import { Page, expect } from "@playwright/test";
import { SEED_DATA } from "../fixtures/seed-data";

export async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.fill('input[name="username"]', SEED_DATA.admin.username);
  await page.fill('input[name="password"]', SEED_DATA.admin.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/admin(?!\/login)/);
}

