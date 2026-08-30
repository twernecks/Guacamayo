import { test, expect, type Route } from "@playwright/test";

const API_BASE = "http://localhost:5249";

function envelope(data: unknown) {
  return { isSuccess: true, data, error: null };
}

function errorEnvelope(code: string, message: string) {
  return { isSuccess: false, data: null, error: { code, message, details: null } };
}

const SESSION = {
  accessToken: "access-token",
  accessTokenExpiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
  refreshToken: "refresh-token",
  displayName: "Admin",
};

function makeLead(overrides: Record<string, unknown> = {}) {
  return {
    id: "lead-1",
    name: "Maria Silva",
    phone: "+5511988887777",
    interest: 0,
    message: "Gostaria de saber mais sobre hospedagem.",
    status: 0,
    createdAt: "2026-08-22T22:07:57.25Z",
    rowVersion: "v1",
    ...overrides,
  };
}

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.route(`${API_BASE}/api/auth/login`, (route) => route.fulfill({ json: envelope(SESSION) }));
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Senha").fill("secret");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin\/rooms$/);
}

test.describe("Leads management (User Story 3)", () => {
  test("lists, filters, opens a lead with a conversation, and changes its status (FR-018–FR-024)", async ({
    page,
  }) => {
    let lead = makeLead();

    await page.route(`${API_BASE}/api/admin/leads?*`, async (route: Route) => {
      const url = new URL(route.request().url());
      if (url.searchParams.get("status") === "1") {
        await route.fulfill({ json: envelope({ items: [], totalCount: 0 }) });
      } else {
        await route.fulfill({ json: envelope({ items: [lead], totalCount: 1 }) });
      }
    });
    await page.route(`${API_BASE}/api/admin/leads/lead-1`, async (route: Route) => {
      await route.fulfill({
        json: envelope({
          ...lead,
          messages: [
            { direction: 0, body: "Olá, gostaria de mais informações.", timestamp: "2026-08-22T22:07:57.01Z" },
            { direction: 1, body: "Olá! Seja bem-vindo(a).", timestamp: "2026-08-22T22:07:58.00Z" },
          ],
        }),
      });
    });
    await page.route(`${API_BASE}/api/admin/leads/lead-1/status`, async (route: Route) => {
      const body = route.request().postDataJSON();
      lead = { ...lead, status: body.status, rowVersion: "v2" };
      await route.fulfill({ json: envelope(lead) });
    });

    await loginAsAdmin(page);
    await page.goto("/admin/leads");

    // Listing, most recent first (FR-018), with the "não informado" fallback exercised elsewhere.
    await expect(page.getByText("Maria Silva")).toBeVisible();

    // An invalid date range is blocked client-side (FR-020).
    await page.getByLabel("De").fill("2026-02-01");
    await page.getByLabel("Até").fill("2026-01-01");
    await expect(page.getByText(/data inicial não pode ser posterior/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Filtrar" })).toBeDisabled();
    await page.getByLabel("Até").fill("");
    await page.getByLabel("De").fill("");

    // Filtering by status narrows the list (FR-019).
    await page.getByLabel("Status").selectOption("1");
    await page.getByRole("button", { name: "Filtrar" }).click();
    await expect(page.getByText("Nenhum lead encontrado.")).toBeVisible();
    await page.getByLabel("Status").selectOption("");
    await page.getByRole("button", { name: "Filtrar" }).click();

    // Detail with conversation history (FR-021/FR-022).
    await page.getByRole("link", { name: "Ver detalhe" }).click();
    await expect(page.getByText("Olá, gostaria de mais informações.")).toBeVisible();

    // Free status transition (FR-023).
    const statusGroup = page.getByRole("group", { name: "Status do lead" });
    await expect(statusGroup.getByLabel("Novo")).toBeChecked();
    await statusGroup.getByLabel("Contatado").click();
    await expect(statusGroup.getByLabel("Contatado")).toBeChecked();
  });

  test("shows an empty conversation as a normal state, not an error", async ({ page }) => {
    await page.route(`${API_BASE}/api/admin/leads/lead-2`, (route) =>
      route.fulfill({
        json: envelope({ ...makeLead({ id: "lead-2", name: "", phone: "" }), messages: [] }),
      }),
    );

    await loginAsAdmin(page);
    await page.goto("/admin/leads/detail?id=lead-2");

    await expect(page.getByText("Não informado")).toHaveCount(2); // name and phone
    await expect(page.getByText(/conversa de origem não existe mais/)).toBeVisible();
  });

  test("shows a conflict banner instead of silently overwriting a concurrent status change (FR-024)", async ({
    page,
  }) => {
    await page.route(`${API_BASE}/api/admin/leads/lead-1`, (route) =>
      route.fulfill({ json: envelope({ ...makeLead(), messages: [] }) }),
    );
    await page.route(`${API_BASE}/api/admin/leads/lead-1/status`, (route) =>
      route.fulfill({
        status: 409,
        json: errorEnvelope("CONCURRENT_MODIFICATION", "O lead foi alterado por outra pessoa."),
      }),
    );

    await loginAsAdmin(page);
    await page.goto("/admin/leads/detail?id=lead-1");

    await page.getByRole("group", { name: "Status do lead" }).getByLabel("Fechado").click();

    await expect(page.getByText(/alterado por outra pessoa/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Recarregar" })).toBeVisible();
  });
});
