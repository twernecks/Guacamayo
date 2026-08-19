import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { LocationSection } from "@/components/sections/LocationSection";
import type { Location } from "@/domain/content";
import { renderWithLanguage } from "../test-utils";

const LOCATION_WITH_STREET_VIEW: Location = {
  address: "BR-101 - Km 570, Paraty, CEP 23970-000",
  coordinates: { lat: -23.1819646, lng: -44.7164933 },
  mapEmbedUrl: "https://maps.google.com/maps?q=-23.1819646,-44.7164933&z=16&output=embed",
  streetViewEmbedUrl:
    "https://maps.google.com/maps?layer=c&cbll=-23.1819646,-44.7164933&output=embed",
  fallbackMapUrl: "https://www.google.com/maps?q=-23.1819646,-44.7164933",
};

const LOCATION_WITHOUT_STREET_VIEW: Location = {
  ...LOCATION_WITH_STREET_VIEW,
  streetViewEmbedUrl: undefined,
};

describe("LocationSection", () => {
  it("does not load the map until the visitor authorizes it", () => {
    renderWithLanguage(<LocationSection location={LOCATION_WITH_STREET_VIEW} />);

    expect(screen.queryByTitle(/mapa da localização/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Carregar mapa" })).toBeInTheDocument();
  });

  it("loads the Google Maps embed and the Street View embed together on demand, each with an accessible title", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LocationSection location={LOCATION_WITH_STREET_VIEW} />);

    await user.click(screen.getByRole("button", { name: "Carregar mapa" }));

    const mapFrame = screen.getByTitle(/mapa da localização/i);
    expect(mapFrame).toHaveAttribute("src", LOCATION_WITH_STREET_VIEW.mapEmbedUrl);

    const streetViewFrame = screen.getByTitle(/visualização em nível de rua/i);
    expect(streetViewFrame).toHaveAttribute("src", LOCATION_WITH_STREET_VIEW.streetViewEmbedUrl);
  });

  it("always shows the coverage disclaimer next to the Street View area, even when the embed is present", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LocationSection location={LOCATION_WITH_STREET_VIEW} />);

    await user.click(screen.getByRole("button", { name: "Carregar mapa" }));

    expect(
      screen.getByText(/pode não corresponder exatamente à fachada/i),
    ).toBeInTheDocument();
  });

  it("shows the disclaimer instead of an empty iframe when Street View coverage was not confirmed", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LocationSection location={LOCATION_WITHOUT_STREET_VIEW} />);

    await user.click(screen.getByRole("button", { name: "Carregar mapa" }));

    expect(screen.getByTitle(/mapa da localização/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/visualização em nível de rua/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/pode não corresponder exatamente à fachada/i),
    ).toBeInTheDocument();
  });

  it("keeps the 'open in Google Maps' fallback link available before loading the map", () => {
    renderWithLanguage(<LocationSection location={LOCATION_WITH_STREET_VIEW} />);

    const link = screen.getByRole("link", { name: /abrir localização no google maps/i });
    expect(link).toHaveAttribute("href", LOCATION_WITH_STREET_VIEW.fallbackMapUrl);
  });

  it("has no automatically detectable accessibility violations before and after loading", async () => {
    const user = userEvent.setup();
    const { container } = renderWithLanguage(
      <LocationSection location={LOCATION_WITH_STREET_VIEW} />,
    );
    expect(await axe(container, { iframes: false })).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: "Carregar mapa" }));
    expect(await axe(container, { iframes: false })).toHaveNoViolations();
  });
});
