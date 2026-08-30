import { apiClient } from "@/services/admin/api-client";
import type { AdminSiteSettings, AdminSiteSettingsUpdateInput } from "@/domain/admin/site-settings";

const PATH = "/api/admin/site-settings";

export function getSiteSettings(): Promise<AdminSiteSettings> {
  return apiClient.get<AdminSiteSettings>(PATH);
}

export function updateSiteSettings(input: AdminSiteSettingsUpdateInput): Promise<AdminSiteSettings> {
  return apiClient.put<AdminSiteSettings>(PATH, input);
}
