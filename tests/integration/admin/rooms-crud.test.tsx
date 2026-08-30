import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockRouter = { replace: vi.fn(), push: vi.fn() };

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/admin/rooms",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/services/admin/rooms-service", () => ({
  listRooms: vi.fn(),
  getRoom: vi.fn(),
  createRoom: vi.fn(),
  updateRoom: vi.fn(),
  deleteRoom: vi.fn(),
}));

import * as roomsService from "@/services/admin/rooms-service";
import AdminRoomsListPage from "@/app/admin/rooms/page";
import NewRoomPage from "@/app/admin/rooms/new/page";
import type { AdminRoom } from "@/domain/admin/rooms";
import { AMENITY_KEY, VISUAL_EMPHASIS } from "@/domain/admin/enums";

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

beforeEach(() => {
  vi.mocked(roomsService.listRooms).mockReset();
  vi.mocked(roomsService.getRoom).mockReset();
  vi.mocked(roomsService.createRoom).mockReset();
  vi.mocked(roomsService.updateRoom).mockReset();
  vi.mocked(roomsService.deleteRoom).mockReset();
  mockRouter.push.mockReset();
});

describe("Rooms listing (FR-009)", () => {
  it("shows a loading indicator, then the fetched rooms, including unpublished ones", async () => {
    vi.mocked(roomsService.listRooms).mockResolvedValue([
      makeRoom({ id: "room-1", isPublished: true }),
      makeRoom({ id: "room-2", isPublished: false, name: { pt: "Rascunho", en: "Draft", es: "Borrador" } }),
    ]);

    render(<AdminRoomsListPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(await screen.findByText("Quarto Colonial")).toBeInTheDocument();
    expect(screen.getByText("Rascunho")).toBeInTheDocument();
  });

  it("shows an error state when the listing fails to load, instead of an empty table (Principle II)", async () => {
    vi.mocked(roomsService.listRooms).mockRejectedValue(new Error("network down"));

    render(<AdminRoomsListPage />);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("deletes an item only after confirming, and does nothing on cancel (FR-013)", async () => {
    const user = userEvent.setup();
    vi.mocked(roomsService.listRooms).mockResolvedValue([makeRoom()]);
    vi.mocked(roomsService.deleteRoom).mockResolvedValue(undefined);

    render(<AdminRoomsListPage />);
    await screen.findByText("Quarto Colonial");

    await user.click(screen.getByRole("button", { name: "Excluir" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(roomsService.deleteRoom).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Excluir" }));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Excluir" }));

    expect(roomsService.deleteRoom).toHaveBeenCalledWith("room-1");
    // The row must disappear from the table once the deletion succeeds —
    // not just fire the API call and leave a stale row on screen.
    await waitFor(() => expect(screen.queryByText("Quarto Colonial")).not.toBeInTheDocument());
  });
});

describe("New room form (FR-010, FR-012)", () => {
  it("blocks publishing when a required field is empty in some language", async () => {
    const user = userEvent.setup();

    render(<NewRoomPage />);

    const nameField = screen.getByRole("group", { name: "Nome" });
    await user.type(within(nameField).getByLabelText("Nome (Português)"), "Quarto Azul");
    // Description is left empty in every language on purpose.
    await user.click(screen.getByLabelText("Publicado"));
    await user.click(screen.getByRole("button", { name: "Criar Quarto" }));

    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(roomsService.createRoom).not.toHaveBeenCalled();
  });

  it(
    "creates the room once every language is filled in and returns to the listing",
    async () => {
      const user = userEvent.setup();
      vi.mocked(roomsService.createRoom).mockResolvedValue(makeRoom());

      render(<NewRoomPage />);

      async function fillLocalized(fieldLabel: string, values: { label: string; text: string }[]) {
        const field = screen.getByRole("group", { name: fieldLabel });
        for (const { label, text } of values) {
          if (label !== "Português") {
            await user.click(within(field).getByRole("button", { name: label }));
          }
          const input = within(field).getByLabelText(`${fieldLabel} (${label})`);
          await user.type(input, text);
        }
      }

      await fillLocalized("Nome", [
        { label: "Português", text: "Quarto Azul" },
        { label: "English", text: "Blue Room" },
        { label: "Español", text: "Habitación Azul" },
      ]);
      await fillLocalized("Resumo", [
        { label: "Português", text: "Um quarto tranquilo." },
        { label: "English", text: "A quiet room." },
        { label: "Español", text: "Una habitación tranquila." },
      ]);

      await user.click(screen.getByLabelText("Publicado"));
      await user.click(screen.getByRole("button", { name: "Criar Quarto" }));

      expect(roomsService.createRoom).toHaveBeenCalledWith(
        expect.objectContaining({
          name: { pt: "Quarto Azul", en: "Blue Room", es: "Habitación Azul" },
          summary: {
            pt: "Um quarto tranquilo.",
            en: "A quiet room.",
            es: "Una habitación tranquila.",
          },
          isPublished: true,
        }),
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/admin/rooms");
    },
    10_000,
  );
});
