import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/admin/leads",
  useSearchParams: () => new URLSearchParams("id=lead-1"),
}));

vi.mock("@/services/admin/leads-service", () => ({
  listLeads: vi.fn(),
  getLead: vi.fn(),
  updateLeadStatus: vi.fn(),
}));

import * as leadsService from "@/services/admin/leads-service";
import AdminLeadsListPage from "@/app/admin/leads/page";
import LeadDetailPage from "@/app/admin/leads/detail/page";
import type { Lead, LeadDetail } from "@/domain/admin/leads";
import { ConflictError } from "@/domain/admin/shared";

function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead-1",
    name: "Maria Silva",
    phone: "+5511988887777",
    interest: 0,
    message: "Gostaria de saber mais.",
    status: 0,
    createdAt: "2026-08-22T22:07:57.25Z",
    rowVersion: "v1",
    ...overrides,
  };
}

function makeLeadDetail(overrides: Partial<LeadDetail> = {}): LeadDetail {
  return {
    ...makeLead(),
    messages: [
      { direction: 0, body: "oi", timestamp: "2026-08-22T22:07:57.01Z" },
      { direction: 1, body: "Olá! Seja bem-vindo(a).", timestamp: "2026-08-22T22:07:57.25Z" },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(leadsService.listLeads).mockReset();
  vi.mocked(leadsService.getLead).mockReset();
  vi.mocked(leadsService.updateLeadStatus).mockReset();
});

describe("Leads listing (FR-018, FR-019, FR-020)", () => {
  it("lists leads most recent first and shows an empty state gracefully", async () => {
    vi.mocked(leadsService.listLeads).mockResolvedValue({ items: [], totalCount: 0 });

    render(<AdminLeadsListPage />);

    expect(await screen.findByText("Nenhum lead encontrado.")).toBeInTheDocument();
  });

  it("shows the fetched leads with a 'não informado' fallback for an empty name/phone (FR-021)", async () => {
    // name/phone are non-nullable strings on the API, but the UI still
    // guards against an unexpectedly empty one (`||`, not `??`).
    vi.mocked(leadsService.listLeads).mockResolvedValue({
      items: [makeLead({ name: "", phone: "" })],
      totalCount: 1,
    });

    render(<AdminLeadsListPage />);

    expect(await screen.findAllByText("Não informado")).toHaveLength(2);
  });

  it("blocks an invalid date range client-side, never calling the API with it", async () => {
    const user = userEvent.setup();
    vi.mocked(leadsService.listLeads).mockResolvedValue({ items: [makeLead()], totalCount: 1 });

    render(<AdminLeadsListPage />);
    await screen.findByText("Maria Silva");
    vi.mocked(leadsService.listLeads).mockClear();

    await user.type(screen.getByLabelText("De"), "2026-02-01");
    await user.type(screen.getByLabelText("Até"), "2026-01-01");

    expect(screen.getByText(/data inicial não pode ser posterior/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filtrar" })).toBeDisabled();
    expect(leadsService.listLeads).not.toHaveBeenCalled();
  });

  it("re-fetches with the selected status when a filter is applied", async () => {
    const user = userEvent.setup();
    vi.mocked(leadsService.listLeads).mockResolvedValue({ items: [makeLead()], totalCount: 1 });

    render(<AdminLeadsListPage />);
    await screen.findByText("Maria Silva");

    await user.selectOptions(screen.getByLabelText("Status"), "1");
    await user.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() =>
      expect(leadsService.listLeads).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 1, skip: 0, take: 20 }),
      ),
    );
  });
});

describe("Lead detail (FR-021, FR-022, FR-023, FR-024)", () => {
  it("shows the conversation history when present", async () => {
    vi.mocked(leadsService.getLead).mockResolvedValue(makeLeadDetail());

    render(<LeadDetailPage />);

    expect(await screen.findByText("oi")).toBeInTheDocument();
    expect(screen.getByText(/Olá! Seja bem-vindo/)).toBeInTheDocument();
  });

  it("treats an empty conversation as a normal state, not an error", async () => {
    vi.mocked(leadsService.getLead).mockResolvedValue(makeLeadDetail({ messages: [] }));

    render(<LeadDetailPage />);

    expect(await screen.findByText(/conversa de origem não existe mais/)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("allows changing status in either direction, including reopening a closed lead", async () => {
    const user = userEvent.setup();
    vi.mocked(leadsService.getLead).mockResolvedValue(makeLeadDetail({ status: 2 }));
    vi.mocked(leadsService.updateLeadStatus).mockResolvedValue(makeLead({ status: 0, rowVersion: "v2" }));

    render(<LeadDetailPage />);
    await screen.findByText("Maria Silva");

    const statusGroup = screen.getByRole("group", { name: "Status do lead" });
    expect(within(statusGroup).getByLabelText("Fechado")).toBeChecked();

    await user.click(within(statusGroup).getByLabelText("Novo"));

    await waitFor(() => expect(leadsService.updateLeadStatus).toHaveBeenCalledWith("lead-1", 0, "v1"));
    await waitFor(() => expect(within(statusGroup).getByLabelText("Novo")).toBeChecked());
  });

  it("shows a conflict banner instead of silently overwriting a concurrent status change", async () => {
    const user = userEvent.setup();
    vi.mocked(leadsService.getLead).mockResolvedValue(makeLeadDetail());
    vi.mocked(leadsService.updateLeadStatus).mockRejectedValue(new ConflictError("conflict"));

    render(<LeadDetailPage />);
    const statusGroup = await screen.findByRole("group", { name: "Status do lead" });

    await user.click(within(statusGroup).getByLabelText("Contatado"));

    expect(await screen.findByRole("button", { name: "Recarregar" })).toBeInTheDocument();
  });
});
