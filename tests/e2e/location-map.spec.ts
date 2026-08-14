import { test, expect } from "@playwright/test";

test.describe("Location map consent", () => {
  test("keeps the address and fallback link accessible without loading the map before consent", async ({
    page,
  }) => {
    await page.goto("/#localizacao");

    const section = page.locator("#localizacao");
    await expect(section).toContainText(/BR-101|Paraty/i);
    await expect(section.locator("iframe")).toHaveCount(0);

    const fallbackLink = section.getByRole("link", { name: /outro serviço de mapas/i });
    await expect(fallbackLink).toBeVisible();
    await expect(fallbackLink).toHaveAttribute("target", "_blank");
  });

  test("loads the map only after an explicit, keyboard-operable 'Carregar mapa' action", async ({
    page,
  }) => {
    await page.goto("/#localizacao");

    const section = page.locator("#localizacao");
    const loadMapButton = section.getByRole("button", { name: "Carregar mapa" });

    await loadMapButton.focus();
    await expect(loadMapButton).toBeFocused();

    await page.keyboard.press("Enter");

    await expect(section.locator("iframe")).toHaveCount(1);
  });
});
