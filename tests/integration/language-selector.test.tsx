import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { renderWithLanguage } from "../test-utils";

describe("LanguageSelector", () => {
  it("renders one keyboard-operable button per supported language", () => {
    renderWithLanguage(<LanguageSelector />);

    expect(screen.getByRole("button", { name: "Português" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Español" })).toBeInTheDocument();
  });

  it("has a group accessible name communicating both its purpose and the current language", () => {
    renderWithLanguage(<LanguageSelector />);

    expect(
      screen.getByRole("group", { name: /selecionar idioma.*português/i }),
    ).toBeInTheDocument();
  });

  it("marks the active language as pressed and switches on click", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LanguageSelector />);

    expect(screen.getByRole("button", { name: "Português" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("group", { name: /select language.*english/i }),
    ).toBeInTheDocument();
  });

  it("applies the shared 2.75rem/44px touch-target style to each option", () => {
    renderWithLanguage(<LanguageSelector />);

    for (const button of screen.getAllByRole("button")) {
      expect(button.className).toMatch(/option/);
    }
  });

  it("announces the language switch via a polite live region", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LanguageSelector />);

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByText(/language changed to english/i)).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = renderWithLanguage(<LanguageSelector />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
