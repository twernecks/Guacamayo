import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { MediaGalleryLightbox } from "@/components/sections/MediaGalleryLightbox";
import type { Media } from "@/domain/content";

const AXE_OPTIONS = {
  rules: {
    "color-contrast": { enabled: false },
  },
};

const IMAGES: Media[] = [
  { src: "/images/pousada/quartos/foto-1.jpg", alt: "Foto 1 do quarto", width: 800, height: 600 },
  { src: "/images/pousada/quartos/foto-2.jpg", alt: "Foto 2 do quarto", width: 800, height: 600 },
  { src: "/images/pousada/quartos/foto-3.jpg", alt: "Foto 3 do quarto", width: 800, height: 600 },
];

const SINGLE_IMAGE: Media[] = [IMAGES[0]!];

describe("MediaGalleryLightbox", () => {
  it("shows the photo at initialIndex with the item label as the dialog's accessible name", () => {
    render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de Quarto Duplo Deluxe com Vista do Mar"
        initialIndex={1}
        isOpen
        onClose={vi.fn()}
      />,
    );

    const dialog = screen.getByRole("dialog", {
      name: "Fotos de Quarto Duplo Deluxe com Vista do Mar",
    });
    expect(within(dialog).getByAltText("Foto 2 do quarto")).toBeInTheDocument();
  });

  it("shows position indicator only when there is more than one photo", () => {
    const { rerender } = render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de teste"
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("1 de 3")).toBeInTheDocument();

    rerender(
      <MediaGalleryLightbox
        images={SINGLE_IMAGE}
        itemLabel="Fotos de teste"
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );

    expect(screen.queryByText(/de 1/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Próxima foto" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Foto anterior" })).not.toBeInTheDocument();
  });

  it("navigates forward and wraps from the last photo back to the first", async () => {
    const user = userEvent.setup();
    render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de teste"
        initialIndex={2}
        isOpen
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("3 de 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Próxima foto" }));

    expect(screen.getByText("1 de 3")).toBeInTheDocument();
    expect(screen.getByAltText("Foto 1 do quarto")).toBeInTheDocument();
  });

  it("navigates backward and wraps from the first photo to the last", async () => {
    const user = userEvent.setup();
    render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de teste"
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Foto anterior" }));

    expect(screen.getByText("3 de 3")).toBeInTheDocument();
    expect(screen.getByAltText("Foto 3 do quarto")).toBeInTheDocument();
  });

  it("calls onClose when the close button is activated", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de teste"
        initialIndex={0}
        isOpen
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de teste"
        initialIndex={0}
        isOpen
        onClose={onClose}
      />,
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked but not when the photo itself is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de teste"
        initialIndex={0}
        isOpen
        onClose={onClose}
      />,
    );

    await user.click(screen.getByAltText("Foto 1 do quarto"));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows an understandable fallback when a photo fails to load, without breaking navigation", async () => {
    const user = userEvent.setup();
    render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de teste"
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );

    const firstImage = screen.getByAltText("Foto 1 do quarto");
    firstImage.dispatchEvent(new Event("error", { bubbles: true }));

    expect(await screen.findByText(/não foi possível carregar/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Próxima foto" }));
    expect(screen.getByAltText("Foto 2 do quarto")).toBeInTheDocument();
  });

  it("has no automatically detectable accessibility violations while open", async () => {
    const { container } = render(
      <MediaGalleryLightbox
        images={IMAGES}
        itemLabel="Fotos de teste"
        initialIndex={0}
        isOpen
        onClose={vi.fn()}
      />,
    );

    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });
});
