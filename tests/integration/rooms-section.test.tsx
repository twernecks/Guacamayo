import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeroSection } from "@/components/sections/HeroSection";
import { RoomsSection } from "@/components/sections/RoomsSection";
import type { ContactChannels, Room } from "@/domain/content";
import { loc, renderWithLanguage } from "../test-utils";

const CONTACT: ContactChannels = {
  whatsappNumber: "+5511999999999",
  address: "Endereço a confirmar",
};

const ROOM_WITH_IMAGE: Room = {
  id: "quarto-jardim",
  name: loc("Quarto Jardim"),
  summary: loc("Vista para o jardim com varanda privativa."),
  amenities: [loc("Wi-Fi"), loc("Ar-condicionado")],
  images: [
    { src: "/images/pousada/quarto-jardim.avif", alt: loc("Quarto Jardim"), width: 800, height: 600 },
  ],
  contactContext: "stay",
};

const ROOM_WITH_MULTIPLE_IMAGES: Room = {
  id: "quarto-jardim",
  name: loc("Quarto Jardim"),
  summary: loc("Vista para o jardim com varanda privativa."),
  amenities: [loc("Wi-Fi"), loc("Ar-condicionado")],
  images: [
    {
      src: "/images/pousada/quarto-jardim-1.avif",
      alt: loc("Quarto Jardim"),
      width: 800,
      height: 600,
    },
    {
      src: "/images/pousada/quarto-jardim-2.avif",
      alt: loc("Quarto Jardim, banheiro"),
      width: 800,
      height: 600,
    },
  ],
  contactContext: "stay",
};

const ROOM_WITHOUT_IMAGE: Room = {
  id: "quarto-varanda",
  name: loc("Quarto Varanda"),
  summary: loc("Quarto com varanda privativa."),
  amenities: [],
  images: [],
  contactContext: "stay",
};

describe("HeroSection", () => {
  it("renders a heading and a WhatsApp contact action for the stay interest", () => {
    renderWithLanguage(<HeroSection contact={CONTACT} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("https://wa.me/5511999999999"));
  });
});

describe("RoomsSection", () => {
  it("renders each room's name, summary and amenities", () => {
    renderWithLanguage(<RoomsSection rooms={[ROOM_WITH_IMAGE]} />);

    expect(screen.getByRole("heading", { name: "Quarto Jardim" })).toBeInTheDocument();
    expect(screen.getByText(ROOM_WITH_IMAGE.summary.pt)).toBeInTheDocument();
    expect(screen.getByText("Wi-Fi")).toBeInTheDocument();
    expect(screen.getByText("Ar-condicionado")).toBeInTheDocument();
  });

  it("renders the room's cover photo, clickable, with contextual alt text when an image is approved", () => {
    renderWithLanguage(<RoomsSection rooms={[ROOM_WITH_IMAGE]} />);

    const trigger = screen.getByRole("button", { name: /ver foto de fotos de quarto jardim/i });
    expect(within(trigger).getByAltText("Quarto Jardim")).toBeInTheDocument();
  });

  it("shows a photo-count indicator only when the room has more than one photo", () => {
    const { rerender } = renderWithLanguage(<RoomsSection rooms={[ROOM_WITH_IMAGE]} />);
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();

    rerender(<RoomsSection rooms={[ROOM_WITH_MULTIPLE_IMAGES]} />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("opens the focused photo view for that room when its cover photo is activated", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<RoomsSection rooms={[ROOM_WITH_MULTIPLE_IMAGES]} />);

    await user.click(
      screen.getByRole("button", { name: /ver 2 fotos de fotos de quarto jardim/i }),
    );

    const dialog = screen.getByRole("dialog", { name: "Fotos de Quarto Jardim" });
    expect(within(dialog).getByAltText("Quarto Jardim")).toBeInTheDocument();
    expect(within(dialog).getByText("1 de 2")).toBeInTheDocument();
  });

  it("shows an understandable fallback when a room has no approved photo yet", () => {
    renderWithLanguage(<RoomsSection rooms={[ROOM_WITHOUT_IMAGE]} />);

    expect(screen.getByText(/foto.*em breve/i)).toBeInTheDocument();
  });

  it("shows an editorial empty state when there are no rooms to display", () => {
    renderWithLanguage(<RoomsSection rooms={[]} />);

    expect(screen.getByRole("heading", { name: /quartos/i })).toBeInTheDocument();
    expect(screen.getByText(/em breve/i)).toBeInTheDocument();
  });
});
