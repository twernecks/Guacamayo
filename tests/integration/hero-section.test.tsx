import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { HeroSection } from "@/components/sections/HeroSection";
import type { ContactChannels, Media } from "@/domain/content";
import { renderWithLanguage } from "../test-utils";

const CONTACT: ContactChannels = {
  whatsappNumber: "+5511999999999",
  address: "Endereço a confirmar",
};

const HERO_IMAGE: Media = {
  src: "/images/pousada/quartos/local-casamento-06.jpg",
  alt: {
    pt: "Vista aérea da sede da pousada com telhado colonial, piscina e jardim exuberante",
    en: "Aerial view of the guesthouse's main building with its colonial roof, pool and lush garden",
    es: "Vista aérea de la sede de la posada con techo colonial, piscina y exuberante jardín",
  },
  width: 1024,
  height: 576,
};

describe("HeroSection", () => {
  it("renders the hero photo (FR-001) with the localized alt text, not just text on a flat background", () => {
    renderWithLanguage(<HeroSection contact={CONTACT} image={HERO_IMAGE} />);

    const photo = screen.getByAltText(HERO_IMAGE.alt.pt);
    expect(photo.tagName).toBe("IMG");
  });

  it("still renders the heading, lead text and WhatsApp CTA alongside the photo", () => {
    renderWithLanguage(<HeroSection contact={CONTACT} image={HERO_IMAGE} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("https://wa.me/5511999999999"));
  });
});
