import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventsSection } from "@/components/sections/EventsSection";
import type { ContactChannels, EventSpace } from "@/domain/content";

const CONTACT: ContactChannels = {
  whatsappNumber: "+5511999999999",
  address: "Endereço a confirmar",
};

const EVENT: EventSpace = {
  id: "eventos",
  name: "Espaço para Eventos",
  purpose: "Espaço versátil para aniversários e confraternizações.",
  images: [],
  contactContext: "event",
  isFeatured: false,
};

// Fixture-only: production event-space photos are not approved yet (see
// specs/001-pousada-landing-page). This proves the focused photo view works
// identically here as it does for Quartos (spec 002, User Story 2 parity).
const EVENT_WITH_PHOTOS: EventSpace = {
  ...EVENT,
  images: [
    {
      src: "/images/pousada/eventos/fixture-1.jpg",
      alt: "Salão de eventos",
      width: 800,
      height: 600,
    },
    {
      src: "/images/pousada/eventos/fixture-2.jpg",
      alt: "Área externa de eventos",
      width: 800,
      height: 600,
    },
  ],
};

describe("EventsSection", () => {
  it("renders the event space name and purpose", () => {
    render(<EventsSection events={[EVENT]} contact={CONTACT} />);

    expect(screen.getByRole("heading", { name: EVENT.name })).toBeInTheDocument();
    expect(screen.getByText(EVENT.purpose)).toBeInTheDocument();
  });

  it("shows a WhatsApp CTA contextualized for the event interest, distinct from wedding copy", () => {
    render(<EventsSection events={[EVENT]} contact={CONTACT} />);

    const link = screen.getByRole("link", { name: /evento/i });
    const decodedHref = decodeURIComponent(link.getAttribute("href") ?? "");

    expect(decodedHref).toContain("https://wa.me/5511999999999");
    expect(decodedHref).toContain("evento");
    expect(decodedHref).not.toContain("casamento");
    expect(screen.queryByText(/orçamento/i)).not.toBeInTheDocument();
  });

  it("shows a gallery fallback when the event space has no approved photo yet", () => {
    render(<EventsSection events={[EVENT]} contact={CONTACT} />);

    expect(screen.getByText(/fotos.*em breve/i)).toBeInTheDocument();
  });

  it("renders nothing when there are no non-wedding event spaces to show", () => {
    const { container } = render(<EventsSection events={[]} contact={CONTACT} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("opens the same focused photo view as Quartos when an event photo is approved (US2 parity)", async () => {
    const user = userEvent.setup();
    render(<EventsSection events={[EVENT_WITH_PHOTOS]} contact={CONTACT} />);

    await user.click(screen.getByRole("button", { name: /ver 2 fotos/i }));

    const dialog = screen.getByRole("dialog", { name: "Fotos de Espaço para Eventos" });
    expect(within(dialog).getByAltText("Salão de eventos")).toBeInTheDocument();
    expect(within(dialog).getByText("1 de 2")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Próxima foto" }));
    expect(within(dialog).getByAltText("Área externa de eventos")).toBeInTheDocument();
  });
});
