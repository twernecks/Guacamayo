import type { RowVersion } from "@/domain/admin/shared";

/**
 * Singleton record — confirmed live against the real API (2026-08-26) from
 * `Guacamayo.Application.Content.SiteSettings.SiteSettingsDto`. **Flat**,
 * not nested under `contact`/`location` as originally guessed in
 * data-model.md — there is a single shared `address` field, not one per
 * concern, and coordinates are plain `latitude`/`longitude` numbers, not a
 * `coordinates: {lat, lng}` object. No `id` in the DTO at all. No
 * create/delete (FR-016).
 */
export type AdminSiteSettings = {
  whatsappNumber: string;
  phone: string | null;
  email: string | null;
  address: string;
  latitude: number;
  longitude: number;
  mapEmbedUrl: string;
  streetViewEmbedUrl: string | null;
  fallbackMapUrl: string;
  /** Reference to a media item managed elsewhere — this screen only stores the id, no upload UI. */
  heroMediaId: string | null;
  rowVersion: RowVersion;
};

export type AdminSiteSettingsFields = Omit<AdminSiteSettings, "rowVersion">;

export type AdminSiteSettingsUpdateInput = AdminSiteSettingsFields & { rowVersion: RowVersion };
