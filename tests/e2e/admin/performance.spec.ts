import { test, expect, type Route } from "@playwright/test";

const API_BASE = "http://localhost:5249";
const ITEM_COUNT = 100;
const BUDGET_MS = 3_000;

function envelope(data: unknown) {
  return { isSuccess: true, data, error: null };
}

const SESSION = {
  accessToken: "access-token",
  accessTokenExpiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
  refreshToken: "refresh-token",
  displayName: "Admin",
};

function makeRoom(index: number) {
  return {
    id: `room-${index}`,
    name: { pt: `Quarto ${index}`, en: `Room ${index}`, es: `Habitación ${index}` },
    description: { pt: "Descrição", en: "Description", es: "Descripción" },
    amenityKeys: ["wifi"],
    isPublished: true,
    visualEmphasis: "standard",
    displayOrder: index,
    rowVersion: "v1",
  };
}

function makeLead(index: number) {
  return {
    id: `lead-${index}`,
    name: `Lead ${index}`,
    phone: "+5511988887777",
    interest: 0,
    message: null,
    status: 0,
    createdAt: new Date(Date.now() - index * 60_000).toISOString(),
    rowVersion: "v1",
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

/**
 * SC-009: listagens de até 100 itens prontas para interação em até 3s "sob
 * condições normais de rede". This measures the client-side path (fetch
 * resolution + render) against a near-instant mocked API — a reasonable
 * proxy for "the UI itself doesn't add meaningful overhead beyond the
 * network" (research.md Decision 5), but NOT a substitute for measuring
 * against the real Guacamayo API over a real network, which quickstart.md
 * calls for as a manual step (T063) that needs the API actually running.
 */
test.describe("Listing performance (SC-009)", () => {
  test(`/admin/rooms with ${ITEM_COUNT} items is interactive within ${BUDGET_MS}ms`, async ({ page }) => {
    const rooms = Array.from({ length: ITEM_COUNT }, (_, index) => makeRoom(index));
    await page.route(`${API_BASE}/api/admin/rooms`, (route: Route) => route.fulfill({ json: envelope(rooms) }));

    await loginAsAdmin(page);

    const start = Date.now();
    await page.goto("/admin/rooms");
    await expect(page.getByText("Quarto 0")).toBeVisible();
    await expect(page.getByRole("link", { name: "Novo Quarto" })).toBeEnabled();
    const elapsed = Date.now() - start;

    console.log(`[SC-009] /admin/rooms with ${ITEM_COUNT} items: ${elapsed}ms (budget ${BUDGET_MS}ms)`);
    expect(elapsed).toBeLessThan(BUDGET_MS);
  });

  test(`/admin/leads with a full page (${20} items) is interactive within ${BUDGET_MS}ms`, async ({ page }) => {
    const leads = Array.from({ length: 20 }, (_, index) => makeLead(index));
    await page.route(`${API_BASE}/api/admin/leads?*`, (route: Route) =>
      route.fulfill({ json: envelope({ items: leads, totalCount: ITEM_COUNT }) }),
    );

    await loginAsAdmin(page);

    const start = Date.now();
    await page.goto("/admin/leads");
    await expect(page.getByText("Lead 0")).toBeVisible();
    const elapsed = Date.now() - start;

    console.log(`[SC-009] /admin/leads (20/${ITEM_COUNT}): ${elapsed}ms (budget ${BUDGET_MS}ms)`);
    expect(elapsed).toBeLessThan(BUDGET_MS);
  });
});
