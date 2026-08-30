import type { LocalizedText, RowVersion } from "@/domain/admin/shared";
import type { ContactInterest } from "@/domain/admin/enums";

/**
 * Admin-facing Event Space (data-model.md § Espaço de Evento administrativo)
 * — confirmed live against the real API (2026-08-26) from
 * `Guacamayo.Application.Content.EventSpaces.EventSpaceDto`.
 */
export type AdminEventSpace = {
  id: string;
  name: LocalizedText;
  /** Named `Purpose` on the API, not `description`. */
  purpose: LocalizedText;
  /** `ContactInterest` enum — in practice only Event (1) or Wedding (2) for an Event Space. */
  contactContext: ContactInterest;
  /** Media ids for this space's photos — no upload/picker UI in this feature's scope; round-tripped as-is. */
  imageIds: string[];
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  rowVersion: RowVersion;
};

export type AdminEventSpaceFields = Omit<AdminEventSpace, "id" | "rowVersion">;

export type AdminEventSpaceUpdateInput = AdminEventSpaceFields & { rowVersion: RowVersion };
