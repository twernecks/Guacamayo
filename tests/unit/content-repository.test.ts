import { describe, expect, it } from "vitest";
import type { ContentRepository } from "@/services/content-repository";
import { contentRepository, isContentEmpty, loadContentState } from "@/services/content-repository";
import type { PousadaContent } from "@/domain/content";

const loc = (pt: string) => ({ pt, en: pt, es: pt });

const EMPTY_CONTENT: PousadaContent = {
  rooms: [],
  eventSpaces: [],
  testimonials: [],
  contact: { whatsappNumber: "+5500000000000", address: "Endereço a confirmar" },
  location: {
    address: "Endereço a confirmar",
    coordinates: { lat: 0, lng: 0 },
    mapEmbedUrl: "",
    fallbackMapUrl: "",
  },
};

function repositoryResolvingTo(content: PousadaContent): ContentRepository {
  return {
    getContent: () => Promise.resolve(content),
  };
}

function repositoryRejectingWith(error: unknown): ContentRepository {
  return {
    getContent: () => Promise.reject(error),
  };
}

describe("isContentEmpty", () => {
  it("is true when rooms, event spaces and testimonials are all empty", () => {
    expect(isContentEmpty(EMPTY_CONTENT)).toBe(true);
  });

  it("is false when at least one collection has content", () => {
    const content: PousadaContent = {
      ...EMPTY_CONTENT,
      rooms: [
        {
          id: "quarto-1",
          name: loc("Quarto"),
          summary: loc("Resumo"),
          amenities: [],
          images: [],
          contactContext: "stay",
        },
      ],
    };

    expect(isContentEmpty(content)).toBe(false);
  });
});

describe("loadContentState", () => {
  it("returns a ready state with the repository content by default", async () => {
    const state = await loadContentState(contentRepository);

    expect(state.status).toBe("ready");
    if (state.status === "ready") {
      expect(state.content.rooms.length).toBeGreaterThan(0);
    }
  });

  it("returns an empty state when the repository resolves to no content", async () => {
    const state = await loadContentState(repositoryResolvingTo(EMPTY_CONTENT));

    expect(state).toEqual({ status: "empty" });
  });

  it("returns an error state with a message when the repository rejects", async () => {
    const state = await loadContentState(repositoryRejectingWith(new Error("network down")));

    expect(state).toEqual({ status: "error", message: "network down" });
  });

  it("falls back to a generic error message for non-Error rejections", async () => {
    const state = await loadContentState(repositoryRejectingWith("unexpected"));

    expect(state).toEqual({
      status: "error",
      message: "Não foi possível carregar o conteúdo.",
    });
  });
});
