import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import type { Testimonial } from "@/domain/content";

const TESTIMONIAL: Testimonial = {
  id: "testimonial-1",
  quote: "Uma experiência incrível para o nosso casamento.",
  attribution: "Ana e Bruno",
  experienceType: "wedding",
  approvedAt: "2026-01-10",
};

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
});
