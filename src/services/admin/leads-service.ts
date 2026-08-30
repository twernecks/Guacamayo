import { apiClient } from "@/services/admin/api-client";
import type { Lead, LeadDetail, LeadListFilters, LeadListResult, LeadStatus } from "@/domain/admin/leads";
import type { RowVersion } from "@/domain/admin/shared";

const BASE_PATH = "/api/admin/leads";

function buildQuery(filters: LeadListFilters): string {
  const params = new URLSearchParams();
  if (filters.status !== undefined) params.set("status", String(filters.status));
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  params.set("skip", String(filters.skip));
  params.set("take", String(filters.take));
  return params.toString();
}

export function listLeads(filters: LeadListFilters): Promise<LeadListResult> {
  return apiClient.get<LeadListResult>(`${BASE_PATH}?${buildQuery(filters)}`);
}

export function getLead(id: string): Promise<LeadDetail> {
  return apiClient.get<LeadDetail>(`${BASE_PATH}/${id}`);
}

export function updateLeadStatus(id: string, status: LeadStatus, rowVersion: RowVersion): Promise<Lead> {
  return apiClient.put<Lead>(`${BASE_PATH}/${id}/status`, { status, rowVersion });
}
