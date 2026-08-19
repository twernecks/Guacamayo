import { test, expect } from "@playwright/test";

test.describe("Location map consent", () => {
  test("keeps the address and fallback link accessible without loading the map before consent", async ({
    page,
  }) => {
    await page.goto("/#localizacao");

    const section = page.locator("#localizacao");
    await expect(section).toContainText(/BR-101|Paraty/i);
    await expect(section.locator("iframe")).toHaveCount(0);

    const fallbackLink = section.getByRole("link", { name: /abrir localização no google maps/i });
    await expect(fallbackLink).toBeVisible();
    await expect(fallbackLink).toHaveAttribute("target", "_blank");
    await expect(fallbackLink).toHaveAttribute("href", /google\.com\/maps/);
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

    await expect(section.locator("iframe")).toHaveCount(2);
  });

  test("loads Google Maps (not OpenStreetMap), centered on the exact coordinate, plus a Street View embed", async ({
    page,
  }) => {
    await page.goto("/#localizacao");

    const section = page.locator("#localizacao");
    await section.getByRole("button", { name: "Carregar mapa" }).click();

    const mapFrame = section.getByTitle(/mapa da localização/i);
    await expect(mapFrame).toBeVisible();
    await expect(mapFrame).toHaveAttribute("src", /google\.com\/maps/);
    await expect(mapFrame).toHaveAttribute("src", /-23\.18|-44\.71/);
    await expect(mapFrame).not.toHaveAttribute("src", /openstreetmap/);

    const streetViewFrame = section.getByTitle(/visualização em nível de rua/i);
    await expect(streetViewFrame).toBeVisible();
    await expect(streetViewFrame).toHaveAttribute("src", /google\.com\/maps/);

    await expect(section.getByText(/pode não corresponder exatamente à fachada/i)).toBeVisible();
  });

  test("translates the surrounding text (heading, button, disclaimer) across the three languages", async ({
    page,
  }) => {
    await page.goto("/#localizacao");

    const section = page.locator("#localizacao");
    await expect(section.getByRole("heading", { name: "Localização" })).toBeVisible();

    await page.getByRole("button", { name: "English" }).click();
    await expect(section.getByRole("heading", { name: "Location" })).toBeVisible();
    await expect(section.getByRole("button", { name: "Load map" })).toBeVisible();

    await page.getByRole("button", { name: "Español" }).click();
    await expect(section.getByRole("heading", { name: "Ubicación" })).toBeVisible();
    await expect(section.getByRole("button", { name: "Cargar mapa" })).toBeVisible();
  });
});
