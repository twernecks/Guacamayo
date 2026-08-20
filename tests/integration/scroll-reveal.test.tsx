import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * jsdom's global IntersectionObserver stub (tests/setup.ts) never invokes its
 * callback — real intersection is a layout concern verified by Playwright,
 * not jsdom (same rationale already used for the testimonials carousel).
 * This suite instead verifies the hook's own reaction logic by capturing and
 * manually firing the observer callback, which is real, testable JS behavior
 * independent of actual browser layout.
 */
function ScrollRevealProbe() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  return <div ref={ref} data-testid="probe" data-visible={isVisible} />;
}

describe("useScrollReveal", () => {
  let capturedCallback: IntersectionObserverCallback | undefined;
  let disconnect: ReturnType<typeof vi.fn>;
  let observe: ReturnType<typeof vi.fn>;
  const OriginalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    capturedCallback = undefined;
    disconnect = vi.fn();
    observe = vi.fn();

    class MockIntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = "";
      readonly thresholds: ReadonlyArray<number> = [];
      observe = observe;
      unobserve = vi.fn();
      disconnect = disconnect;
      takeRecords = (): IntersectionObserverEntry[] => [];

      constructor(callback: IntersectionObserverCallback) {
        capturedCallback = callback;
      }
    }

    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    window.IntersectionObserver = OriginalIntersectionObserver;
  });

  it("does not reveal the element until it intersects, then observes exactly once", () => {
    render(<ScrollRevealProbe />);

    expect(screen.getByTestId("probe")).toHaveAttribute("data-visible", "false");
    expect(observe).toHaveBeenCalledTimes(1);
  });

  it("reveals the element and stops observing on the first intersection", () => {
    render(<ScrollRevealProbe />);

    act(() => {
      capturedCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(screen.getByTestId("probe")).toHaveAttribute("data-visible", "true");
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("does not react to a non-intersecting entry", () => {
    render(<ScrollRevealProbe />);

    act(() => {
      capturedCallback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(screen.getByTestId("probe")).toHaveAttribute("data-visible", "false");
    expect(disconnect).not.toHaveBeenCalled();
  });
});
