import { test, expect } from "@playwright/test";

function decodeWhatsAppUrl(url: string): string {
  return decodeURIComponent(url.replace(/\+/g, "%20"));
}

test.describe("Event inquiry", () => {
  test("organizer can identify the event space and start an event-contextualized inquiry", async ({
    page,
    context,
  }) => {
    await page.goto("/#eventos");

    const section = page.locator("#eventos");
    await expect(section.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(section.getByRole("heading", { level: 3 }).first()).toBeVisible();

    const whatsappLink = section.getByRole("link", { name: /evento/i }).first();

    const [popup] = await Promise.all([context.waitForEvent("page"), whatsappLink.click()]);

    await expect.poll(() => popup.url()).toMatch(/whatsapp\.com/);
    const decoded = decodeWhatsAppUrl(popup.url());
    expect(decoded).toMatch(/evento/i);
    expect(decoded).not.toMatch(/casamento/i);
  });
});
