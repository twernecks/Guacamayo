import "@testing-library/jest-dom/vitest";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom does not implement matchMedia; components that check viewport media
// queries (e.g. to close a mobile menu on resize) need this in test runs.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// jsdom does not implement HTMLDialogElement.showModal/close (the methods are
// simply missing); components using the native <dialog> element need this
// minimal polyfill to be testable. Mirrors real behavior closely enough for
// tests: showModal/open set the `open` attribute, close removes it and fires
// the standard non-bubbling "close" event.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) {
      return;
    }
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

// jsdom does not implement IntersectionObserver (used by the testimonials
// carousel to track which card is in view while swiping). Real intersection
// computation is a layout concern verified by Playwright, not jsdom; this
// no-op stub only prevents a ReferenceError so component tests can render.
if (typeof window.IntersectionObserver === "undefined") {
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

// jsdom does not implement Element.scrollIntoView (used by the testimonials
// carousel's prev/next buttons and, more generally, keyboard navigation of
// scroll-snap carousels). No-op is sufficient here: the resulting scroll
// position is a layout concern verified by Playwright, not jsdom.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
