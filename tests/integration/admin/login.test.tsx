import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "@/domain/admin/shared";

const mockRouter = { replace: vi.fn(), push: vi.fn() };
let mockPathname = "/admin/login";
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/services/admin/auth-service", () => ({
  login: vi.fn(),
  refresh: vi.fn(),
  logout: vi.fn(),
}));

import { login as mockLogin } from "@/services/admin/auth-service";
import { authStore } from "@/domain/admin/auth-store";
import { AdminShell } from "@/components/admin/AdminShell";
import { LoginForm } from "@/components/admin/LoginForm";

function renderAdminRoute(pathname: string, search = "") {
  mockPathname = pathname;
  mockSearchParams = new URLSearchParams(search);
  // AdminShell only supplies the guard/nav chrome — the children below stand
  // in for whatever Next.js page would actually render at `pathname`,
  // exactly like `src/app/admin/login/page.tsx` renders `<LoginForm />`.
  const pageContent =
    pathname === "/admin/login" ? (
      <LoginForm />
    ) : (
      <div data-testid="protected-content">Protected</div>
    );
  return render(<AdminShell>{pageContent}</AdminShell>);
}

beforeEach(() => {
  window.localStorage.clear();
  authStore.clearSession();
  mockRouter.replace.mockReset();
  mockRouter.push.mockReset();
  vi.mocked(mockLogin).mockReset();
});

describe("Admin login flow", () => {
  it("logs in with valid credentials and lets the route guard take over from there (FR-001)", async () => {
    const user = userEvent.setup();
    vi.mocked(mockLogin).mockResolvedValue({
      accessToken: "access-token",
      // Comfortably beyond the test's lifetime, so the store's proactive
      // renewal timer doesn't fire mid-test (it's exercised separately in
      // tests/unit/admin/auth-store.test.ts).
      accessTokenExpiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
      refreshToken: "refresh-token",
      displayName: "Admin",
    });

    renderAdminRoute("/admin/login");

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Senha"), "secret");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("admin@example.com", "secret"));
    // FR-008: AdminShell's guard reacts to the now-authenticated status and
    // moves away from /admin/login — no `?from=` here, so the default landing.
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/admin"));
  });

  it("shows one generic message for both a wrong password and an unknown email (FR-006)", async () => {
    const user = userEvent.setup();
    vi.mocked(mockLogin).mockRejectedValue(
      new ApiError({ code: "INVALID_CREDENTIALS", message: "Invalid email or password.", details: null }),
    );

    renderAdminRoute("/admin/login");

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Senha"), "wrong");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email ou senha inválidos.");
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("shows a distinct message when the server can't be reached (FR-027)", async () => {
    const user = userEvent.setup();
    vi.mocked(mockLogin).mockRejectedValue(
      new ApiError({ code: "NETWORK_ERROR", message: "unreachable", details: null }),
    );

    renderAdminRoute("/admin/login");

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Senha"), "secret");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível se comunicar com o servidor.",
    );
  });

  it("redirects an unauthenticated visit to a protected route to login, preserving it via ?from= (FR-007/FR-008)", async () => {
    renderAdminRoute("/admin/rooms");

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/admin/login?from=%2Fadmin%2Frooms"),
    );
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });
});
