import { Page, expect } from "@playwright/test";

/**
 * Memastikan halaman tidak memiliki scroll horizontal (scrollWidth <= clientWidth).
 */
export async function expectNoHorizontalScroll(page: Page) {
  const result = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientWidth = Math.max(doc.clientWidth, body.clientWidth);
    return {
      hasScroll: scrollWidth > clientWidth,
      scrollWidth,
      clientWidth,
    };
  });

  expect(
    result.hasScroll,
    `Terdeteksi horizontal scroll: scrollWidth (${result.scrollWidth}px) > clientWidth (${result.clientWidth}px)`
  ).toBe(false);
}

