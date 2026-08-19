import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";

function Harness() {
  const { language, setLanguage, t, localize } = useLanguage();
  // Local, uncontrolled-by-language state: if the language switch ever
  // remounted this subtree, this counter would reset to 0.
  const [clicks, setClicks] = useState(0);

  return (
    <div>
      <p data-testid="language">{language}</p>
      <p data-testid="brand">{t.brand}</p>
      <p data-testid="localized">{localize({ pt: "Olá", en: "Hello", es: "Hola" })}</p>
      <p data-testid="fallback">{localize({ pt: "Somente PT", en: "", es: "" })}</p>
      <p data-testid="clicks">{clicks}</p>
      <button type="button" onClick={() => setClicks((count) => count + 1)}>
        Increment
      </button>
      <button type="button" onClick={() => setLanguage("en")}>
        English
      </button>
    </div>
  );
}

function renderHarness() {
  return render(
    <LanguageProvider>
      <Harness />
    </LanguageProvider>,
  );
}

describe("LanguageContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to Portuguese on first render", () => {
    renderHarness();
    expect(screen.getByTestId("language")).toHaveTextContent("pt");
    expect(screen.getByTestId("brand")).toHaveTextContent("Pousada");
  });

  it("switches language synchronously without remounting the subtree", async () => {
    const user = userEvent.setup();
    renderHarness();

    // Local component state (not tied to language) survives the switch only
    // if the subtree was not remounted.
    await user.click(screen.getByRole("button", { name: "Increment" }));
    await user.click(screen.getByRole("button", { name: "Increment" }));
    expect(screen.getByTestId("clicks")).toHaveTextContent("2");

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByTestId("language")).toHaveTextContent("en");
    expect(screen.getByTestId("clicks")).toHaveTextContent("2");
  });

  it("updates the document lang attribute together with the content", async () => {
    const user = userEvent.setup();
    renderHarness();

    expect(document.documentElement.lang).toBe("pt");
    await user.click(screen.getByRole("button", { name: "English" }));
    expect(document.documentElement.lang).toBe("en");
  });

  it("localize() resolves the current language and falls back to Portuguese when a key is empty", async () => {
    const user = userEvent.setup();
    renderHarness();

    expect(screen.getByTestId("localized")).toHaveTextContent("Olá");
    expect(screen.getByTestId("fallback")).toHaveTextContent("Somente PT");

    await user.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByTestId("localized")).toHaveTextContent("Hello");
    expect(screen.getByTestId("fallback")).toHaveTextContent("Somente PT");
  });

  it("keeps the language switch working when localStorage throws", async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    renderHarness();
    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByTestId("language")).toHaveTextContent("en");
    setItemSpy.mockRestore();
  });

  it("applies a previously saved language preference after mount", () => {
    window.localStorage.setItem("guacamayo:language", "es");
    renderHarness();

    expect(screen.getByTestId("language")).toHaveTextContent("es");
  });
});
