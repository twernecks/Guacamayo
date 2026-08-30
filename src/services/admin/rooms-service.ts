import { apiClient } from "@/services/admin/api-client";
import type { AdminRoom, AdminRoomFields, AdminRoomUpdateInput } from "@/domain/admin/rooms";

const BASE_PATH = "/api/admin/rooms";

export function listRooms(): Promise<AdminRoom[]> {
  return apiClient.get<AdminRoom[]>(BASE_PATH);
}

export function getRoom(id: string): Promise<AdminRoom> {
  return apiClient.get<AdminRoom>(`${BASE_PATH}/${id}`);
}

export function createRoom(fields: AdminRoomFields): Promise<AdminRoom> {
  return apiClient.post<AdminRoom>(BASE_PATH, fields);
}

export function updateRoom(id: string, input: AdminRoomUpdateInput): Promise<AdminRoom> {
  return apiClient.put<AdminRoom>(`${BASE_PATH}/${id}`, input);
}

export function deleteRoom(id: string): Promise<void> {
  return apiClient.remove<void>(`${BASE_PATH}/${id}`);
}
