import { test, expect } from "@playwright/test";

test.describe("Media gallery focused photo view (Quartos)", () => {
  test("opens from a room's cover photo showing that room's photos only", async ({ page }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    await roomCard.getByRole("button", { name: /ver.*fotos/i }).click();

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("1 de 2")).toBeVisible();
  });

  test("navigates between photos with circular wrap at both ends", async ({ page }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    await roomCard.getByRole("button", { name: /ver.*fotos/i }).click();

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await expect(dialog.getByText("1 de 2")).toBeVisible();

    await dialog.getByRole("button", { name: "Próxima foto" }).click();
    await expect(dialog.getByText("2 de 2")).toBeVisible();

    // Wrap forward: from the last photo, "next" goes back to the first.
    await dialog.getByRole("button", { name: "Próxima foto" }).click();
    await expect(dialog.getByText("1 de 2")).toBeVisible();

    // Wrap backward: from the first photo, "previous" goes to the last.
    await dialog.getByRole("button", { name: "Foto anterior" }).click();
    await expect(dialog.getByText("2 de 2")).toBeVisible();
  });

  test("closes via the close button and restores focus to the cover photo trigger", async ({
    page,
  }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    const trigger = roomCard.getByRole("button", { name: /ver.*fotos/i });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await dialog.getByRole("button", { name: "Fechar" }).click();

    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes via clicking outside the dialog", async ({ page }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    await roomCard.getByRole("button", { name: /ver.*fotos/i }).click();

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await expect(dialog).toBeVisible();

    // The dialog is centered with visible margin on all sides, so the very
    // corner of the viewport is always outside its content (the backdrop).
    await page.mouse.click(2, 2);

    await expect(dialog).toBeHidden();
  });

  test("closes via the Escape key", async ({ page }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    await roomCard.getByRole("button", { name: /ver.*fotos/i }).click();

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(dialog).toBeHidden();
  });

  test("is fully operable using only the keyboard", async ({ page }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    const trigger = roomCard.getByRole("button", { name: /ver.*fotos/i });

    await trigger.focus();
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Foto anterior" })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Próxima foto" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(dialog.getByText("2 de 2")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe("Media gallery focused photo view — mobile size (375px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("occupies at least 90% of the viewport height, per SC-001", async ({ page }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    await roomCard.getByRole("button", { name: /ver.*fotos/i }).click();

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await expect(dialog).toBeVisible();

    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(812 * 0.9);
  });

  test("keeps a tappable backdrop margin: closes via clicking outside the dialog", async ({
    page,
  }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    await roomCard.getByRole("button", { name: /ver.*fotos/i }).click();

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await expect(dialog).toBeVisible();

    // The dialog is centered with a visible backdrop margin even at the
    // near-fullscreen mobile size (Clarifications), so the very corner of
    // the viewport is always outside its content.
    await page.mouse.click(2, 2);

    await expect(dialog).toBeHidden();
  });

  test("keeps the header, close button and position indicator visible and operable", async ({
    page,
  }) => {
    await page.goto("/#quartos");

    const roomCard = page.locator("li", { has: page.getByText("Quarto Triplo Clássico") });
    await roomCard.getByRole("button", { name: /ver.*fotos/i }).click();

    const dialog = page.getByRole("dialog", { name: /quarto triplo clássico/i });
    await expect(dialog.getByRole("button", { name: "Fechar" })).toBeVisible();
    await expect(dialog.getByText("1 de 2")).toBeVisible();

    await dialog.getByRole("button", { name: "Próxima foto" }).click();
    await expect(dialog.getByText("2 de 2")).toBeVisible();

    await dialog.getByRole("button", { name: "Fechar" }).click();
    await expect(dialog).toBeHidden();
  });
});
