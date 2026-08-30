import { test, expect, type Route } from "@playwright/test";

const API_BASE = "http://localhost:5249";

function envelope(data: unknown) {
  return { isSuccess: true, data, error: null };
}

function errorEnvelope(code: string, message: string) {
  return { isSuccess: false, data: null, error: { code, message, details: null } };
}

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    accessToken: "access-token",
    accessTokenExpiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    refreshToken: "refresh-token",
    displayName: "Admin",
    ...overrides,
  };
}

async function mockLogin(route: Route, session: Record<string, unknown>) {
  await route.fulfill({ json: envelope(session) });
}

test.describe("Admin authentication (User Story 1)", () => {
  test("valid credentials authenticate and the guard takes over navigation (FR-001, FR-008, SC-001)", async ({
    page,
  }) => {
    await page.route(`${API_BASE}/api/auth/login`, (route) => mockLogin(route, makeSession()));

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Senha").fill("secret");
    await page.getByRole("button", { name: "Entrar" }).click();

    // The guard moves away from /admin/login once authenticated, then the
    // landing page (/admin) hands off to /admin/rooms — which doesn't exist
    // until User Story 2 ships. Reaching that URL is still the correct,
    // observable end of the User Story 1 flow on its own.
    await expect(page).toHaveURL(/\/admin\/rooms$/);
  });

  test("invalid credentials show one generic message and keep the admin on the login screen (FR-006)", async ({
    page,
  }) => {
    await page.route(`${API_BASE}/api/auth/login`, (route) =>
      route.fulfill({ status: 401, json: errorEnvelope("INVALID_CREDENTIALS", "Invalid email or password.") }),
    );

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Senha").fill("wrong-password");
    await page.getByRole("button", { name: "Entrar" }).click();

    // `getByRole("alert")` alone also matches Next.js's own route-announcer
    // element (`#__next-route-announcer__`, also `role="alert"`), so this
    // scopes to the one carrying the actual message.
    await expect(page.getByText("Email ou senha inválidos.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("a direct, unauthenticated visit to the admin area redirects to login and preserves the destination (FR-007, SC-007)", async ({
    page,
  }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL("/admin/login?from=%2Fadmin");
  });

  test("logging out ends the session — a direct visit to the admin area requires logging in again (FR-005)", async ({
    page,
  }) => {
    await page.route(`${API_BASE}/api/auth/login`, (route) => mockLogin(route, makeSession()));
    await page.route(`${API_BASE}/api/auth/logout`, (route) => route.fulfill({ json: envelope(null) }));

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Senha").fill("secret");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin\/rooms$/);

    await page.getByRole("button", { name: "Sair" }).click();
    // FR-007/FR-008 apply uniformly here too: logging out while on a
    // protected route (/admin/rooms) is just another unauthenticated visit
    // to it, so the guard correctly preserves it via `?from=`.
    await expect(page).toHaveURL("/admin/login?from=%2Fadmin%2Frooms");

    await page.goto("/admin");
    await expect(page).toHaveURL("/admin/login?from=%2Fadmin");
  });

  test("renews the session automatically before it expires, without interrupting navigation (FR-003, SC-002)", async ({
    page,
  }) => {
    await page.clock.install();

    let refreshCalls = 0;
    await page.route(`${API_BASE}/api/auth/login`, (route) =>
      // A short-lived token makes the scheduled renewal (expiry - 60s
      // margin) fire soon after fast-forwarding the clock below.
      mockLogin(route, makeSession({ accessTokenExpiresAt: new Date(Date.now() + 120_000).toISOString() })),
    );
    await page.route(`${API_BASE}/api/auth/refresh`, (route) => {
      refreshCalls += 1;
      return mockLogin(route, makeSession({ accessToken: "renewed-access-token" }));
    });

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Senha").fill("secret");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin\/rooms$/);

    // Past the (expiry - 60s margin) point: the store's proactive renewal
    // timer should fire on its own, with no user action and no navigation.
    await page.clock.fastForward(61_000);
    await expect.poll(() => refreshCalls).toBeGreaterThan(0);

    // Still on the same page — renewal happened transparently in the background.
    await expect(page).toHaveURL(/\/admin\/rooms$/);
  });

  test("forces a logout when the session can no longer be renewed (FR-004)", async ({ page }) => {
    await page.clock.install();

    await page.route(`${API_BASE}/api/auth/login`, (route) =>
      mockLogin(route, makeSession({ accessTokenExpiresAt: new Date(Date.now() + 120_000).toISOString() })),
    );
    await page.route(`${API_BASE}/api/auth/refresh`, (route) =>
      route.fulfill({
        status: 401,
        json: errorEnvelope("REFRESH_TOKEN_REUSE_DETECTED", "Refresh token already used."),
      }),
    );

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Senha").fill("secret");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin\/rooms$/);

    // The refresh failure clears the session in the background (the store's
    // timer runs independently of whichever page happens to be mounted, and
    // `/admin/rooms` itself doesn't exist yet outside User Story 1's scope).
    // A fresh visit to a real, always-present admin route is what reliably
    // observes the forced logout, exactly like a follow-up click would.
    await page.clock.fastForward(61_000);
    await page.goto("/admin");

    await expect(page).toHaveURL("/admin/login?from=%2Fadmin");
  });
});
