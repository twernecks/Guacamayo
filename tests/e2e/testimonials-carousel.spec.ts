import { test, expect } from "@playwright/test";

test.describe("Testimonials carousel — mobile size (375px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("shows a horizontal carousel with a position indicator instead of a stacked list", async ({
    page,
  }) => {
    await page.goto("/#relatos");

    const section = page.locator("#relatos");
    await expect(section.getByText("1 de 3")).toBeVisible();
    await expect(section.getByText("Camila Andrade", { exact: false })).toBeVisible();
  });

  test("navigates via the previous/next buttons without depending on a swipe gesture", async ({
    page,
  }) => {
    await page.goto("/#relatos");

    const section = page.locator("#relatos");
    await expect(section.getByText("1 de 3")).toBeVisible();

    await section.getByRole("button", { name: /próximo relato/i }).click();
    await expect(section.getByText("2 de 3")).toBeVisible();

    await section.getByRole("button", { name: /próximo relato/i }).click();
    await expect(section.getByText("3 de 3")).toBeVisible();

    // No circular wrap for testimonials (unlike the photo lightbox).
    await section.getByRole("button", { name: /próximo relato/i }).click();
    await expect(section.getByText("3 de 3")).toBeVisible();

    await section.getByRole("button", { name: /relato anterior/i }).click();
    await expect(section.getByText("2 de 3")).toBeVisible();
  });

  test("is fully operable using only the keyboard", async ({ page }) => {
    await page.goto("/#relatos");

    const section = page.locator("#relatos");
    const nextButton = section.getByRole("button", { name: /próximo relato/i });

    await nextButton.focus();
    await expect(nextButton).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(section.getByText("2 de 3")).toBeVisible();
  });

  test("updates the position indicator when the visitor scrolls the carousel directly (swipe equivalent)", async ({
    page,
  }) => {
    await page.goto("/#relatos");

    const section = page.locator("#relatos");
    await expect(section.getByText("1 de 3")).toBeVisible();

    const carousel = section.getByRole("blockquote").first().locator("xpath=ancestor::ul");
    await carousel.evaluate((el) => {
      el.scrollTo({ left: el.scrollWidth, behavior: "instant" });
    });

    await expect(section.getByText("3 de 3")).toBeVisible();
  });
});

test.describe("Testimonials carousel — desktop preserves the existing grid", () => {
  // Forced explicitly: the "mobile-chrome" project's default viewport
  // (~412px) is itself below the 48rem mobile breakpoint, so this needs an
  // explicit wide viewport regardless of which project runs it.
  test.use({ viewport: { width: 1280, height: 800 } });

  test("hides carousel controls and shows multiple testimonials at once", async ({ page }) => {
    await page.goto("/#relatos");

    const section = page.locator("#relatos");
    await expect(section.getByText("Camila Andrade", { exact: false })).toBeVisible();

    await expect(section.getByRole("button", { name: /próximo relato/i })).toBeHidden();
    await expect(section.getByRole("button", { name: /relato anterior/i })).toBeHidden();
    await expect(section.getByText(/^\d de \d$/)).toBeHidden();

    // The grid, not the carousel, is active: more than one testimonial is
    // visible in the viewport at once without needing to scroll/navigate.
    await expect(section.getByText(/a recepção foi excelente/i)).toBeVisible();
  });
});
