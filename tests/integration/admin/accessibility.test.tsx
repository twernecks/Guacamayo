import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/admin/rooms",
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/services/admin/rooms-service", () => ({
  listRooms: vi.fn(),
  getRoom: vi.fn(),
  createRoom: vi.fn(),
  updateRoom: vi.fn(),
  deleteRoom: vi.fn(),
}));

vi.mock("@/services/admin/event-spaces-service", () => ({
  listEventSpaces: vi.fn(),
  getEventSpace: vi.fn(),
  createEventSpace: vi.fn(),
  updateEventSpace: vi.fn(),
  deleteEventSpace: vi.fn(),
}));

vi.mock("@/services/admin/testimonials-service", () => ({
  listTestimonials: vi.fn(),
  getTestimonial: vi.fn(),
  createTestimonial: vi.fn(),
  updateTestimonial: vi.fn(),
  deleteTestimonial: vi.fn(),
}));

vi.mock("@/services/admin/leads-service", () => ({
  listLeads: vi.fn(),
  getLead: vi.fn(),
  updateLeadStatus: vi.fn(),
}));

function makeLeadDetail(overrides: Partial<LeadDetail> = {}): LeadDetail {
  return {
    id: "lead-1",
    name: "Maria",
    phone: "+5511988887777",
    interest: 0,
    message: "Gostaria de saber sobre disponibilidade",
    status: 0,
    createdAt: new Date().toISOString(),
    rowVersion: "v1",
    messages: [],
    ...overrides,
  };
}

vi.mock("@/services/admin/site-settings-service", () => ({
  getSiteSettings: vi.fn(),
  updateSiteSettings: vi.fn(),
}));

import * as roomsService from "@/services/admin/rooms-service";
import * as leadsService from "@/services/admin/leads-service";
import * as siteSettingsService from "@/services/admin/site-settings-service";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import AdminRoomsListPage from "@/app/admin/rooms/page";
import NewRoomPage from "@/app/admin/rooms/new/page";
import NewEventSpacePage from "@/app/admin/event-spaces/new/page";
import NewTestimonialPage from "@/app/admin/testimonials/new/page";
import AdminLeadsListPage from "@/app/admin/leads/page";
import LeadDetailPage from "@/app/admin/leads/detail/page";
import SiteSettingsPage from "@/app/admin/site-settings/page";
import type { AdminRoom } from "@/domain/admin/rooms";
import type { AdminSiteSettings } from "@/domain/admin/site-settings";
import type { LeadDetail } from "@/domain/admin/leads";
import { AMENITY_KEY, VISUAL_EMPHASIS } from "@/domain/admin/enums";

/**
 * research.md Decision 7: a baseline semantic pass (labels, roles, focus),
 * not a formal WCAG audit — the admin area is internal-use and explicitly
 * out of that gate's scope (spec.md Assumptions). Same axe options as the
 * public site's accessibility.test.tsx.
 */
const AXE_OPTIONS = { rules: { "color-contrast": { enabled: false } }, iframes: false };

function makeRoom(overrides: Partial<AdminRoom> = {}): AdminRoom {
  return {
    id: "room-1",
    name: { pt: "Quarto Colonial", en: "Colonial Room", es: "Habitación Colonial" },
    summary: { pt: "Descrição", en: "Description", es: "Descripción" },
    amenityKeys: [AMENITY_KEY.Wifi],
    imageIds: [],
    isPublished: true,
    visualEmphasis: VISUAL_EMPHASIS.Standard,
    displayOrder: 1,
    rowVersion: "v1",
    ...overrides,
  };
}

function makeSiteSettings(): AdminSiteSettings {
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
  };
}

beforeEach(() => {
  vi.mocked(roomsService.listRooms).mockReset();
  vi.mocked(leadsService.listLeads).mockReset();
  vi.mocked(leadsService.getLead).mockReset();
  vi.mocked(siteSettingsService.getSiteSettings).mockReset();
  mockSearchParams = new URLSearchParams();
});

describe("Accessibility of admin screens (baseline pass)", () => {
  it("LoginForm has no automatically detectable violations", async () => {
    const { container } = render(
      <AdminAuthProvider>
        <LoginForm />
      </AdminAuthProvider>,
    );
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("LoginForm has no violations once a validation message is shown", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AdminAuthProvider>
        <LoginForm />
      </AdminAuthProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("Rooms listing has no automatically detectable violations, including the empty state", async () => {
    vi.mocked(roomsService.listRooms).mockResolvedValue([]);
    const { container } = render(<AdminRoomsListPage />);
    await screen.findByText("Nenhum item cadastrado ainda.");
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("Rooms listing has no violations with the delete confirmation dialog open", async () => {
    const user = userEvent.setup();
    vi.mocked(roomsService.listRooms).mockResolvedValue([makeRoom()]);
    const { container } = render(<AdminRoomsListPage />);
    await screen.findByText("Quarto Colonial");

    await user.click(screen.getByRole("button", { name: "Excluir" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("New Room form has no automatically detectable violations", async () => {
    const { container } = render(<NewRoomPage />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("New Room form has no violations once publish-blocked validation messages are shown", async () => {
    const user = userEvent.setup();
    const { container } = render(<NewRoomPage />);
    await user.click(screen.getByLabelText("Publicado"));
    await user.click(screen.getByRole("button", { name: "Criar Quarto" }));
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("New Event Space form has no automatically detectable violations", async () => {
    const { container } = render(<NewEventSpacePage />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("New Testimonial form has no automatically detectable violations", async () => {
    const { container } = render(<NewTestimonialPage />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("Leads listing has no automatically detectable violations", async () => {
    vi.mocked(leadsService.listLeads).mockResolvedValue({ items: [], totalCount: 0 });
    const { container } = render(<AdminLeadsListPage />);
    await screen.findByText("Nenhum lead encontrado.");
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("Lead detail has no automatically detectable violations, with and without conversation history", async () => {
    mockSearchParams = new URLSearchParams("id=lead-1");

    vi.mocked(leadsService.getLead).mockResolvedValueOnce(makeLeadDetail());
    const { container, unmount } = render(<LeadDetailPage />);
    await screen.findByText("Histórico da conversa");
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
    unmount();

    vi.mocked(leadsService.getLead).mockResolvedValueOnce(
      makeLeadDetail({ messages: [{ direction: 0, body: "Olá!", timestamp: new Date().toISOString() }] }),
    );
    const { container: containerWithMessages } = render(<LeadDetailPage />);
    await screen.findByText("Olá!");
    expect(await axe(containerWithMessages, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("Site Settings form has no automatically detectable violations", async () => {
    vi.mocked(siteSettingsService.getSiteSettings).mockResolvedValue(makeSiteSettings());
    const { container } = render(<SiteSettingsPage />);
    await screen.findByDisplayValue("+5511999999999");
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });
});
