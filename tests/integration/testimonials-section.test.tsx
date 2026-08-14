import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import type { Testimonial } from "@/domain/content";

const TESTIMONIAL: Testimonial = {
  id: "testimonial-1",
  quote: "Uma experiência incrível para o nosso casamento.",
  attribution: "Ana e Bruno",
  experienceType: "wedding",
  approvedAt: "2026-01-10",
};

const TESTIMONIALS: Testimonial[] = [
  TESTIMONIAL,
  {
    id: "testimonial-2",
    quote: "Hospedagem maravilhosa, super recomendo.",
    attribution: "Camila",
    experienceType: "stay",
    approvedAt: "2026-02-01",
  },
  {
    id: "testimonial-3",
    quote: "Ótimo espaço para eventos corporativos.",
    attribution: "João",
    experienceType: "event",
    approvedAt: "2026-03-01",
  },
];

describe("TestimonialsSection", () => {
  it("shows a truthful empty state when there are no approved testimonials", () => {
    render(<TestimonialsSection testimonials={[]} />);

    expect(screen.getByRole("heading", { name: /relatos/i })).toBeInTheDocument();
    expect(screen.getByText(/não há relatos aprovados/i)).toBeInTheDocument();
    expect(screen.queryByRole("blockquote")).not.toBeInTheDocument();
  });

  it("renders an attributed testimonial with its experience context", () => {
    render(<TestimonialsSection testimonials={[TESTIMONIAL]} />);

    expect(screen.getByText(TESTIMONIAL.quote, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(TESTIMONIAL.attribution, { exact: false })).toBeInTheDocument();
    expect(screen.getByText("casamento", { selector: "span" })).toBeInTheDocument();
  });

  it("shows carousel navigation controls and a position indicator only when there is more than one testimonial", () => {
    const { rerender } = render(<TestimonialsSection testimonials={[TESTIMONIAL]} />);

    expect(screen.queryByRole("button", { name: /relato anterior/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /próximo relato/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d+ de \d+$/)).not.toBeInTheDocument();

    rerender(<TestimonialsSection testimonials={TESTIMONIALS} />);

    expect(screen.getByRole("button", { name: /relato anterior/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /próximo relato/i })).toBeInTheDocument();
    expect(screen.getByText("1 de 3")).toBeInTheDocument();
  });

  it("is navigable via the keyboard-operable controls without depending on a swipe gesture", async () => {
    const user = userEvent.setup();
    render(<TestimonialsSection testimonials={TESTIMONIALS} />);

    expect(screen.getByText("1 de 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /próximo relato/i }));
    expect(screen.getByText("2 de 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /relato anterior/i }));
    expect(screen.getByText("1 de 3")).toBeInTheDocument();
  });

  it("does not advance past the first or last testimonial (no circular wrap)", async () => {
    const user = userEvent.setup();
    render(<TestimonialsSection testimonials={TESTIMONIALS} />);

    await user.click(screen.getByRole("button", { name: /relato anterior/i }));
    expect(screen.getByText("1 de 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /próximo relato/i }));
    await user.click(screen.getByRole("button", { name: /próximo relato/i }));
    expect(screen.getByText("3 de 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /próximo relato/i }));
    expect(screen.getByText("3 de 3")).toBeInTheDocument();
  });

  it("renders every approved testimonial's quote and attribution regardless of carousel state", () => {
    render(<TestimonialsSection testimonials={TESTIMONIALS} />);

    for (const testimonial of TESTIMONIALS) {
      expect(screen.getByText(testimonial.quote, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(testimonial.attribution, { exact: false })).toBeInTheDocument();
    }
  });

  it("has no automatically detectable accessibility violations with multiple testimonials", async () => {
    const { container } = render(<TestimonialsSection testimonials={TESTIMONIALS} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
