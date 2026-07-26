import type { PousadaContent } from "@/domain/content";
import { pousadaContent } from "@/data/pousada-content";

export interface ContentRepository {
  getContent(): Promise<PousadaContent>;
}

export class LocalContentRepository implements ContentRepository {
  async getContent(): Promise<PousadaContent> {
    return pousadaContent;
  }
}

export const contentRepository: ContentRepository = new LocalContentRepository();

export type ContentState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "ready"; content: PousadaContent };

export function isContentEmpty(content: PousadaContent): boolean {
  return (
    content.rooms.length === 0 &&
    content.eventSpaces.length === 0 &&
    content.testimonials.length === 0
  );
}

export async function loadContentState(
  repository: ContentRepository = contentRepository,
): Promise<ContentState> {
  try {
    const content = await repository.getContent();
    return isContentEmpty(content) ? { status: "empty" } : { status: "ready", content };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível carregar o conteúdo.",
    };
  }
}
