import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { CarouselControls } from "@/components/ui/CarouselControls";

describe("CarouselControls", () => {
  it("renders previous/next buttons and the position indicator when there is more than one item", () => {
    render(
      <CarouselControls
        activeIndex={1}
        total={3}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        previousLabel="Item anterior"
        nextLabel="Próximo item"
        positionLabel={(current, total) => `${current} de ${total}`}
      >
        <p>Conteúdo do item 2</p>
      </CarouselControls>,
    );

    expect(screen.getByRole("button", { name: "Item anterior" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próximo item" })).toBeInTheDocument();
    expect(screen.getByText("2 de 3")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do item 2")).toBeInTheDocument();
  });

  it("announces the position indicator via aria-live for assistive technology", () => {
    render(
      <CarouselControls
        activeIndex={0}
        total={2}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        previousLabel="Item anterior"
        nextLabel="Próximo item"
        positionLabel={(current, total) => `${current} de ${total}`}
      >
        <p>Conteúdo</p>
      </CarouselControls>,
    );

    expect(screen.getByText("1 de 2")).toHaveAttribute("aria-live", "polite");
  });

  it("calls onPrevious and onNext when the respective buttons are activated", async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    render(
      <CarouselControls
        activeIndex={0}
        total={2}
        onPrevious={onPrevious}
        onNext={onNext}
        previousLabel="Item anterior"
        nextLabel="Próximo item"
        positionLabel={(current, total) => `${current} de ${total}`}
      >
        <p>Conteúdo</p>
      </CarouselControls>,
    );

    await user.click(screen.getByRole("button", { name: "Próximo item" }));
    expect(onNext).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Item anterior" }));
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it("renders no buttons or position indicator when there is one item or none", () => {
    const { rerender } = render(
      <CarouselControls
        activeIndex={0}
        total={1}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        previousLabel="Item anterior"
        nextLabel="Próximo item"
        positionLabel={(current, total) => `${current} de ${total}`}
      >
        <p>Conteúdo único</p>
      </CarouselControls>,
    );

    expect(screen.queryByRole("button", { name: "Item anterior" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Próximo item" })).not.toBeInTheDocument();
    expect(screen.queryByText(/de 1/)).not.toBeInTheDocument();

    rerender(
      <CarouselControls
        activeIndex={0}
        total={0}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        previousLabel="Item anterior"
        nextLabel="Próximo item"
        positionLabel={(current, total) => `${current} de ${total}`}
      >
        <p>Sem conteúdo</p>
      </CarouselControls>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <CarouselControls
        activeIndex={1}
        total={3}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        previousLabel="Item anterior"
        nextLabel="Próximo item"
        positionLabel={(current, total) => `${current} de ${total}`}
      >
        <p>Conteúdo do item 2</p>
      </CarouselControls>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
