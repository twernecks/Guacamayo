import { test, expect } from "@playwright/test";

function decodeWhatsAppUrl(url: string): string {
  return decodeURIComponent(url.replace(/\+/g, "%20"));
}

test.describe("Wedding conversion", () => {
  test("the wedding WhatsApp CTA opens a wedding-contextualized conversation", async ({
    page,
    context,
  }) => {
    await page.goto("/#casamentos");

    const section = page.locator("#casamentos");
    const whatsappLink = section.getByRole("link", { name: /orçamento pelo whatsapp/i });

    const [popup] = await Promise.all([context.waitForEvent("page"), whatsappLink.click()]);

    await expect.poll(() => popup.url()).toMatch(/whatsapp\.com/);
    expect(decodeWhatsAppUrl(popup.url())).toMatch(/casamento/i);
  });

  test("the wedding contact form preselects the wedding interest and opens WhatsApp on submit", async ({
    page,
    context,
  }) => {
    await page.goto("/#casamentos");

    const section = page.locator("#casamentos");
    const interestSelect = section.getByLabel(/tipo de evento\/serviço/i);
    await expect(interestSelect).toHaveValue("wedding");

    await section.getByLabel("Nome").fill("Ana e Bruno");
    await section.getByLabel("Telefone").fill("(11) 91234-5678");

    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      section.getByRole("button", { name: /orçamento pelo formulário/i }).click(),
    ]);

    await expect.poll(() => popup.url()).toMatch(/whatsapp\.com/);
    const decoded = decodeWhatsAppUrl(popup.url());
    expect(decoded).toContain("Ana e Bruno");
    expect(decoded).toMatch(/casamento/i);
  });
});
