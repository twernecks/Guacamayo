import type { LocalizedText, RowVersion } from "@/domain/admin/shared";
import type { AmenityKeyValue, VisualEmphasisValue } from "@/domain/admin/enums";

/**
 * Admin-facing Room (data-model.md § Quarto administrativo) — the wire shape
 * of `/api/admin/rooms`, confirmed live against the real API (2026-08-26)
 * from `Guacamayo.Application.Content.Rooms.RoomDto`. Deliberately separate
 * from the public site's `Room` (src/domain/content.ts): different
 * lifecycle, different fields (`rowVersion`, `isPublished`), different data
 * source.
 */
export type AdminRoom = {
  id: string;
  name: LocalizedText;
  /** Named `Summary` on the API, not `description`. */
  summary: LocalizedText;
  amenityKeys: AmenityKeyValue[];
  /** Media ids for this room's photos — no upload/picker UI in this feature's scope; round-tripped as-is. */
  imageIds: string[];
  isPublished: boolean;
  visualEmphasis: VisualEmphasisValue;
  displayOrder: number;
  rowVersion: RowVersion;
};

/** Editable fields — everything the form captures, minus server-assigned ones. */
export type AdminRoomFields = Omit<AdminRoom, "id" | "rowVersion">;

/** Sent on `PUT` — the API requires the `rowVersion` read at load time back (FR-014). */
export type AdminRoomUpdateInput = AdminRoomFields & { rowVersion: RowVersion };
