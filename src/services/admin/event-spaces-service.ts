import { apiClient } from "@/services/admin/api-client";
import type {
  AdminEventSpace,
  AdminEventSpaceFields,
  AdminEventSpaceUpdateInput,
} from "@/domain/admin/event-spaces";

const BASE_PATH = "/api/admin/event-spaces";

export function listEventSpaces(): Promise<AdminEventSpace[]> {
  return apiClient.get<AdminEventSpace[]>(BASE_PATH);
}

export function getEventSpace(id: string): Promise<AdminEventSpace> {
  return apiClient.get<AdminEventSpace>(`${BASE_PATH}/${id}`);
}

export function createEventSpace(fields: AdminEventSpaceFields): Promise<AdminEventSpace> {
  return apiClient.post<AdminEventSpace>(BASE_PATH, fields);
}

export function updateEventSpace(
  id: string,
  input: AdminEventSpaceUpdateInput,
): Promise<AdminEventSpace> {
  return apiClient.put<AdminEventSpace>(`${BASE_PATH}/${id}`, input);
}

export function deleteEventSpace(id: string): Promise<void> {
  return apiClient.remove<void>(`${BASE_PATH}/${id}`);
}
