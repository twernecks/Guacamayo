import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeddingSection } from "@/components/sections/WeddingSection";
import type { ContactChannels, EventSpace } from "@/domain/content";

const CONTACT: ContactChannels = {
  whatsappNumber: "+5511999999999",
  address: "Endereço a confirmar",
};

const WEDDING: EventSpace = {
  id: "casamentos",
  name: "Casamentos na Pousada",
  purpose: "Cerimônia ao ar livre cercada pela natureza.",
  images: [],
  contactContext: "wedding",
  isFeatured: true,
};

// Fixture-only: production wedding photos are not approved yet (see
// specs/001-pousada-landing-page). This proves the focused photo view works
// identically here as it does for Quartos (spec 002, User Story 2 parity).
const WEDDING_WITH_PHOTOS: EventSpace = {
  ...WEDDING,
  images: [
    {
      src: "/images/pousada/casamentos/fixture-1.jpg",
      alt: "Cerimônia de casamento",
      width: 800,
      height: 600,
    },
    {
      src: "/images/pousada/casamentos/fixture-2.jpg",
      alt: "Recepção de casamento",
      width: 800,
      height: 600,
    },
  ],
};

describe("WeddingSection", () => {
  it("renders the wedding name and purpose with emphasis", () => {
    render(<WeddingSection wedding={WEDDING} contact={CONTACT} />);

    expect(screen.getByRole("heading", { name: WEDDING.name })).toBeInTheDocument();
    expect(screen.getByText(WEDDING.purpose)).toBeInTheDocument();
  });

  it("shows a WhatsApp CTA contextualized for the wedding interest", () => {
    render(<WeddingSection wedding={WEDDING} contact={CONTACT} />);

    const link = screen.getByRole("link", { name: /orçamento/i });
    const decodedHref = decodeURIComponent(link.getAttribute("href") ?? "");

    expect(decodedHref).toContain("https://wa.me/5511999999999");
    expect(decodedHref).toContain("casamento");
  });

  it("preselects the wedding interest in the contact form", () => {
    render(<WeddingSection wedding={WEDDING} contact={CONTACT} />);

    const interestSelect = screen.getByLabelText(/tipo de evento\/serviço/i);
    expect(interestSelect).toHaveValue("wedding");
  });

  it("shows a gallery fallback when there is no approved wedding photo yet", () => {
    render(<WeddingSection wedding={WEDDING} contact={CONTACT} />);

    expect(screen.getByText(/fotos de casamentos em breve/i)).toBeInTheDocument();
  });

  it("renders nothing when there is no wedding experience to feature", () => {
    const { container } = render(<WeddingSection wedding={undefined} contact={CONTACT} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("opens the same focused photo view as Quartos when a wedding photo is approved (US2 parity)", async () => {
    const user = userEvent.setup();
    render(<WeddingSection wedding={WEDDING_WITH_PHOTOS} contact={CONTACT} />);

    await user.click(screen.getByRole("button", { name: /ver 2 fotos/i }));

    const dialog = screen.getByRole("dialog", { name: "Fotos de Casamentos na Pousada" });
    expect(within(dialog).getByAltText("Cerimônia de casamento")).toBeInTheDocument();
    expect(within(dialog).getByText("1 de 2")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Próxima foto" }));
    expect(within(dialog).getByAltText("Recepção de casamento")).toBeInTheDocument();
  });
});
