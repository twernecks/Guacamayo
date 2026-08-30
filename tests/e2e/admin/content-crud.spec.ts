import { test, expect, type Route } from "@playwright/test";

const API_BASE = "http://localhost:5249";

function envelope(data: unknown) {
  return { isSuccess: true, data, error: null };
}

function errorEnvelope(code: string, message: string, details: unknown = null) {
  return { isSuccess: false, data: null, error: { code, message, details } };
}

const SESSION = {
  accessToken: "access-token",
  accessTokenExpiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
  refreshToken: "refresh-token",
  displayName: "Admin",
};

function makeRoom(overrides: Record<string, unknown> = {}) {
  return {
    id: "room-1",
    name: { pt: "Quarto Colonial", en: "Colonial Room", es: "Habitación Colonial" },
    summary: { pt: "Descrição", en: "Description", es: "Descripción" },
    amenityKeys: [0],
    imageIds: [],
    isPublished: true,
    visualEmphasis: 0,
    displayOrder: 1,
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

test.describe("Content CRUD (User Story 2) — Rooms as the representative flow", () => {
  test("lists, blocks an incomplete publish, creates, edits, and deletes a room", async ({ page }) => {
    let rooms = [makeRoom()];

    await page.route(`${API_BASE}/api/admin/rooms`, async (route: Route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({ json: envelope(rooms) });
      } else if (route.request().method() === "POST") {
        const body = route.request().postDataJSON();
        const created = makeRoom({ id: "room-2", rowVersion: "v1", ...body });
        rooms = [...rooms, created];
        await route.fulfill({ json: envelope(created) });
      }
    });
    await page.route(`${API_BASE}/api/admin/rooms/room-1`, async (route: Route) => {
      const method = route.request().method();
      if (method === "GET") {
        await route.fulfill({ json: envelope(rooms.find((r) => r.id === "room-1")) });
      } else if (method === "PUT") {
        const body = route.request().postDataJSON();
        const updated = { ...rooms[0], ...body };
        rooms = [updated, ...rooms.slice(1)];
        await route.fulfill({ json: envelope(updated) });
      } else if (method === "DELETE") {
        rooms = rooms.filter((r) => r.id !== "room-1");
        await route.fulfill({ json: envelope(null) });
      }
    });

    await loginAsAdmin(page);

    // Listing (FR-009).
    await expect(page.getByText("Quarto Colonial")).toBeVisible();

    // Create, blocking an incomplete publish first (FR-010, FR-012).
    await page.getByRole("link", { name: "Novo Quarto" }).click();
    const nameField = page.getByRole("group", { name: "Nome", exact: true });
    await nameField.getByLabel("Nome (Português)").fill("Quarto Azul");
    await page.getByLabel("Publicado").check();
    await page.getByRole("button", { name: "Criar Quarto" }).click();
    await expect(page.getByText(/obrigatório para publicar/).first()).toBeVisible();

    await nameField.getByRole("button", { name: "English" }).click();
    await nameField.getByLabel("Nome (English)").fill("Blue Room");
    await nameField.getByRole("button", { name: "Español" }).click();
    await nameField.getByLabel("Nome (Español)").fill("Habitación Azul");

    const summaryField = page.getByRole("group", { name: "Resumo", exact: true });
    await summaryField.getByLabel("Resumo (Português)").fill("Um quarto tranquilo.");
    await summaryField.getByRole("button", { name: "English" }).click();
    await summaryField.getByLabel("Resumo (English)").fill("A quiet room.");
    await summaryField.getByRole("button", { name: "Español" }).click();
    await summaryField.getByLabel("Resumo (Español)").fill("Una habitación tranquila.");

    await page.getByRole("button", { name: "Criar Quarto" }).click();
    await expect(page).toHaveURL(/\/admin\/rooms$/);
    await expect(page.getByText("Blue Room").or(page.getByText("Quarto Azul"))).toBeVisible();

    // Edit (FR-011) — open the original room and change its name.
    await page
      .locator("tr", { hasText: "Quarto Colonial" })
      .getByRole("link", { name: "Editar" })
      .click();
    const editNameField = page.getByRole("group", { name: "Nome", exact: true });
    await editNameField.getByLabel("Nome (Português)").fill("Quarto Colonial Reformado");
    await page.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(page.getByText(/alterado por outra pessoa/)).toHaveCount(0); // no conflict banner surfaced

    // Delete with confirmation, and cancel once first (FR-013) — navigating
    // back to the listing also confirms the edit above actually persisted.
    await page.goto("/admin/rooms");
    await expect(page.getByText("Quarto Colonial Reformado")).toBeVisible();
    const row = page.locator("tr", { hasText: "Quarto Colonial Reformado" });
    await row.getByRole("button", { name: "Excluir" }).click();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByText("Quarto Colonial Reformado")).toBeVisible();

    await row.getByRole("button", { name: "Excluir" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Excluir" }).click();
    await expect(page.getByText("Quarto Colonial Reformado")).toHaveCount(0);
  });

  test("shows a conflict banner instead of silently overwriting a concurrently edited room (FR-014)", async ({
    page,
  }) => {
    const room = makeRoom();

    await page.route(`${API_BASE}/api/admin/rooms/room-1`, async (route: Route) => {
      const method = route.request().method();
      if (method === "GET") {
        await route.fulfill({ json: envelope(room) });
      } else if (method === "PUT") {
        await route.fulfill({
          status: 409,
          json: errorEnvelope("CONCURRENT_MODIFICATION", "O item foi alterado por outra pessoa."),
        });
      }
    });

    await loginAsAdmin(page);
    await page.goto("/admin/rooms/edit?id=room-1");

    await page.getByRole("group", { name: "Nome", exact: true }).getByLabel("Nome (Português)").fill("Novo nome");
    await page.getByRole("button", { name: "Salvar alterações" }).click();

    await expect(page.getByText(/alterado por outra pessoa/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Recarregar" })).toBeVisible();
  });
});

test.describe("Content CRUD — Event Spaces and Testimonials share the same shape", () => {
  test("event spaces listing loads and links to a working creation form", async ({ page }) => {
    await page.route(`${API_BASE}/api/admin/event-spaces`, (route) => route.fulfill({ json: envelope([]) }));
    await loginAsAdmin(page);

    await page.goto("/admin/event-spaces");
    await expect(page.getByRole("heading", { name: "Espaços de Evento" })).toBeVisible();
    await page.getByRole("link", { name: "Novo Espaço de Evento" }).click();
    await expect(page.getByRole("group", { name: "Nome", exact: true })).toBeVisible();
    await expect(page.getByLabel("Contexto de contato")).toBeVisible();
  });

  test("testimonials listing loads and links to a working creation form", async ({ page }) => {
    await page.route(`${API_BASE}/api/admin/testimonials`, (route) => route.fulfill({ json: envelope([]) }));
    await loginAsAdmin(page);

    await page.goto("/admin/testimonials");
    await expect(page.getByRole("heading", { name: "Depoimentos" })).toBeVisible();
    await page.getByRole("link", { name: "Novo Depoimento" }).click();
    await expect(page.getByLabel("Atribuição (nome do hóspede)")).toBeVisible();
  });
});
