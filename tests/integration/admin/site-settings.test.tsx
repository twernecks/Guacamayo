import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/admin/site-settings",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/services/admin/site-settings-service", () => ({
  getSiteSettings: vi.fn(),
  updateSiteSettings: vi.fn(),
}));

import * as siteSettingsService from "@/services/admin/site-settings-service";
import SiteSettingsPage from "@/app/admin/site-settings/page";
import type { AdminSiteSettings } from "@/domain/admin/site-settings";
import { ConflictError } from "@/domain/admin/shared";

function makeSettings(overrides: Partial<AdminSiteSettings> = {}): AdminSiteSettings {
  return {
    whatsappNumber: "+5511999999999",
    phone: null,
    email: "contato@pousada.com",
    address: "Rua 1",
    latitude: -23.5,
    longitude: -46.6,
    mapEmbedUrl: "https://maps.example/embed",
    streetViewEmbedUrl: null,
    fallbackMapUrl: "https://maps.example/fallback",
    heroMediaId: "media-1",
    rowVersion: "v1",
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(siteSettingsService.getSiteSettings).mockReset();
  vi.mocked(siteSettingsService.updateSiteSettings).mockReset();
});

describe("Site Settings (FR-015, FR-016, FR-017)", () => {
  it("loads and displays the current values, with no create/delete affordance anywhere", async () => {
    vi.mocked(siteSettingsService.getSiteSettings).mockResolvedValue(makeSettings());

    render(<SiteSettingsPage />);

    expect(await screen.findByDisplayValue("+5511999999999")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /criar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /excluir/i })).not.toBeInTheDocument();
  });

  it("edits a field and saves, sending the loaded rowVersion back", async () => {
    const user = userEvent.setup();
    vi.mocked(siteSettingsService.getSiteSettings).mockResolvedValue(makeSettings());
    vi.mocked(siteSettingsService.updateSiteSettings).mockResolvedValue(
      makeSettings({ email: "novo@pousada.com", rowVersion: "v2" }),
    );

    render(<SiteSettingsPage />);
    await screen.findByDisplayValue("+5511999999999");

    const emailField = screen.getByLabelText("Email");
    await user.clear(emailField);
    await user.type(emailField, "novo@pousada.com");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() =>
      expect(siteSettingsService.updateSiteSettings).toHaveBeenCalledWith(
        expect.objectContaining({ rowVersion: "v1", email: "novo@pousada.com" }),
      ),
    );
  });

  it("shows a conflict banner instead of silently overwriting a concurrent edit", async () => {
    const user = userEvent.setup();
    vi.mocked(siteSettingsService.getSiteSettings).mockResolvedValue(makeSettings());
    vi.mocked(siteSettingsService.updateSiteSettings).mockRejectedValue(new ConflictError("conflict"));

    render(<SiteSettingsPage />);
    await screen.findByDisplayValue("+5511999999999");

    await user.type(screen.getByLabelText("Telefone"), "11912345678");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(await screen.findByRole("button", { name: "Recarregar" })).toBeInTheDocument();
  });

  it("warns before discarding unsaved changes when navigating away", async () => {
    const user = userEvent.setup();
    vi.mocked(siteSettingsService.getSiteSettings).mockResolvedValue(makeSettings());

    render(
      <>
        <a href="/admin/rooms">Quartos</a>
        <SiteSettingsPage />
      </>,
    );
    await screen.findByDisplayValue("+5511999999999");

    await user.type(screen.getByLabelText("Telefone"), "11912345678");
    await user.click(screen.getByRole("link", { name: "Quartos" }));

    expect(await screen.findByRole("dialog", { name: "Descartar alterações?" })).toBeInTheDocument();
  });
});
