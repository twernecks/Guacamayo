import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { HeroSection } from "@/components/sections/HeroSection";
import { RoomsSection } from "@/components/sections/RoomsSection";
import { WeddingSection } from "@/components/sections/WeddingSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { ContactForm } from "@/components/contact/ContactForm";
import type { ContactChannels, EventSpace, Location, Room, Testimonial } from "@/domain/content";

/**
 * jsdom cannot compute real rendered colors/layout, so axe's color-contrast
 * rule is unreliable here and is covered instead by the Playwright-driven
 * manual accessibility pass (see specs/.../validation/accessibility.md).
 * `iframes: false` avoids axe trying to reach into the map iframe's content
 * window, which jsdom does not model like a real browser.
 */
const AXE_OPTIONS = {
  rules: {
    "color-contrast": { enabled: false },
  },
  iframes: false,
};

const CONTACT: ContactChannels = {
  whatsappNumber: "+5511999999999",
  phone: "+5511988888888",
  email: "contato@example.com",
  address: "Endereço a confirmar",
};

const ROOM: Room = {
  id: "quarto-jardim",
  name: "Quarto Jardim",
  summary: "Vista para o jardim com varanda privativa.",
  amenities: ["Wi-Fi", "Ar-condicionado"],
  images: [],
  contactContext: "stay",
};

const ROOM_WITH_PHOTOS: Room = {
  id: "quarto-varanda",
  name: "Quarto Varanda",
  summary: "Quarto com varanda privativa.",
  amenities: ["Wi-Fi"],
  images: [
    {
      src: "/images/pousada/quarto-varanda-1.avif",
      alt: "Quarto Varanda",
      width: 800,
      height: 600,
    },
    {
      src: "/images/pousada/quarto-varanda-2.avif",
      alt: "Quarto Varanda, banheiro",
      width: 800,
      height: 600,
    },
  ],
  contactContext: "stay",
};

const WEDDING: EventSpace = {
  id: "casamentos",
  name: "Casamentos na Pousada",
  purpose: "Cerimônia ao ar livre cercada pela natureza.",
  images: [],
  contactContext: "wedding",
  isFeatured: true,
};

const EVENT: EventSpace = {
  id: "eventos",
  name: "Espaço para Eventos",
  purpose: "Espaço versátil para aniversários e confraternizações.",
  images: [],
  contactContext: "event",
  isFeatured: false,
};

const TESTIMONIAL: Testimonial = {
  id: "testimonial-1",
  quote: "Uma experiência incrível para o nosso casamento.",
  attribution: "Ana e Bruno",
  experienceType: "wedding",
  approvedAt: "2026-01-10",
};

const LOCATION: Location = {
  address: "Endereço a confirmar",
  mapEmbedUrl: "https://www.openstreetmap.org/export/embed.html?bbox=0,0,1,1&layer=mapnik",
  fallbackMapUrl: "https://www.openstreetmap.org/",
};

describe("Accessibility of primary sections", () => {
  it("HeroSection has no automatically detectable violations", async () => {
    const { container } = render(<HeroSection contact={CONTACT} />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("RoomsSection has no automatically detectable violations, including empty state", async () => {
    const { container: withRooms } = render(<RoomsSection rooms={[ROOM]} />);
    expect(await axe(withRooms, AXE_OPTIONS)).toHaveNoViolations();

    const { container: empty } = render(<RoomsSection rooms={[]} />);
    expect(await axe(empty, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("RoomsSection's focused photo view has no automatically detectable violations while open", async () => {
    const user = userEvent.setup();
    const { container } = render(<RoomsSection rooms={[ROOM_WITH_PHOTOS]} />);

    await user.click(screen.getByRole("button", { name: /ver 2 fotos/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("WeddingSection has no automatically detectable violations", async () => {
    const { container } = render(<WeddingSection wedding={WEDDING} contact={CONTACT} />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("EventsSection has no automatically detectable violations", async () => {
    const { container } = render(<EventsSection events={[EVENT]} contact={CONTACT} />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("TestimonialsSection has no automatically detectable violations, including empty state", async () => {
    const { container: withTestimonial } = render(
      <TestimonialsSection testimonials={[TESTIMONIAL]} />,
    );
    expect(await axe(withTestimonial, AXE_OPTIONS)).toHaveNoViolations();

    const { container: empty } = render(<TestimonialsSection testimonials={[]} />);
    expect(await axe(empty, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("LocationSection has no automatically detectable violations before and after loading the map", async () => {
    const user = userEvent.setup();
    const { container } = render(<LocationSection location={LOCATION} />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: "Carregar mapa" }));
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("SiteHeader has no automatically detectable violations", async () => {
    const { container } = render(<SiteHeader contact={CONTACT} />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("SiteFooter has no automatically detectable violations", async () => {
    const { container } = render(<SiteFooter contact={CONTACT} />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("ContactForm has no automatically detectable violations in its default state", async () => {
    const { container } = render(<ContactForm whatsappNumber={CONTACT.whatsappNumber} />);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("ContactForm has no automatically detectable violations once validation errors are shown", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm whatsappNumber={CONTACT.whatsappNumber} />);

    await user.click(screen.getByRole("button", { name: /enviar pelo whatsapp/i }));

    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });
});
