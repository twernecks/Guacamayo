import { test, expect } from "@playwright/test";

test.describe("Language switching", () => {
  test("switches all visible text across sections when a language is selected", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Quartos", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "English" }).click();

    await expect(page.getByRole("heading", { name: "Rooms", exact: true })).toBeVisible();
    await expect(page.getByText("Stays, weddings and events")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Reviews", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Location", exact: true })).toBeVisible();
    await expect(page.getByText("Quartos")).toHaveCount(0);

    await page.getByRole("button", { name: "Español" }).click();
    await expect(page.getByRole("heading", { name: "Habitaciones", exact: true })).toBeVisible();
    await expect(page.getByText("Alojamiento, bodas y eventos")).toBeVisible();
  });

  test("builds the WhatsApp contact message in the selected language", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "English" }).click();

    const heroWhatsAppLink = page.getByRole("link", { name: /whatsapp about your stay/i });
    const href = await heroWhatsAppLink.getAttribute("href");
    expect(href).toBeTruthy();
    const decoded = decodeURIComponent(href ?? "");
    expect(decoded).toContain("Hello!");
    expect(decoded).toContain("a stay");
  });

  test("opens the photo lightbox correctly in a previously selected language (modal does not reset it)", async ({
    page,
  }) => {
    await page.goto("/#quartos");

    // The lightbox is a native, focus-trapping modal <dialog> — while it's
    // open, background content (including the language selector) is
    // intentionally inert, so the switch itself happens before opening it.
    await page.getByRole("button", { name: "English" }).click();

    const firstGalleryTrigger = page.locator("#quartos button").first();
    await firstGalleryTrigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Previous photo" })).toBeVisible();
  });

  test("remembers the selected language after reloading the page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Español" }).click();
    await expect(page.getByRole("heading", { name: "Habitaciones", exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { name: "Habitaciones", exact: true })).toBeVisible();
  });

  test("is fully keyboard-operable and communicates the selected language to assistive technology", async ({
    page,
  }) => {
    await page.goto("/");

    const englishButton = page.getByRole("button", { name: "English" });
    await englishButton.focus();
    await expect(englishButton).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(englishButton).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Language switching — testimonials carousel (mobile size, 375px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("keeps the testimonials carousel position across a language switch", async ({ page }) => {
    await page.goto("/#relatos");

    const section = page.locator("#relatos");
    await section.getByRole("button", { name: /próximo relato/i }).click();
    await expect(section.getByText("2 de 3")).toBeVisible();

    await page.getByRole("button", { name: "English" }).click();

    await expect(section.getByText("2 of 3")).toBeVisible();
  });
});
