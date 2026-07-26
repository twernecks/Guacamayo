import { test, expect } from "@playwright/test";

test.describe("Guest discovery on mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("guest can identify the value proposition and a contact action on first view", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /whatsapp/i }).first()).toBeVisible();
  });

  test("guest can open the mobile menu and reach the rooms without horizontal scroll", async ({
    page,
  }) => {
    await page.goto("/");

    const nav = page.locator("#primary-navigation");
    await expect(nav).toBeHidden();

    const menuToggle = page.getByRole("button", { name: /abrir menu de navegação/i });
    await menuToggle.click();
    await expect(nav).toBeVisible();

    await page.getByRole("link", { name: "Quartos" }).click();
    await expect(page.getByRole("heading", { name: /quartos/i })).toBeVisible();

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test("guest can inspect room characteristics and amenities", async ({ page }) => {
    await page.goto("/#quartos");

    const roomsSection = page.locator("#quartos");
    await expect(roomsSection.getByRole("heading", { level: 3 }).first()).toBeVisible();
  });
});
