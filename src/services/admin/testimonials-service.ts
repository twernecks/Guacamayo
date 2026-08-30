import { apiClient } from "@/services/admin/api-client";
import type {
  AdminTestimonial,
  AdminTestimonialFields,
  AdminTestimonialUpdateInput,
} from "@/domain/admin/testimonials";

const BASE_PATH = "/api/admin/testimonials";

export function listTestimonials(): Promise<AdminTestimonial[]> {
  return apiClient.get<AdminTestimonial[]>(BASE_PATH);
}

export function getTestimonial(id: string): Promise<AdminTestimonial> {
  return apiClient.get<AdminTestimonial>(`${BASE_PATH}/${id}`);
}

export function createTestimonial(fields: AdminTestimonialFields): Promise<AdminTestimonial> {
  return apiClient.post<AdminTestimonial>(BASE_PATH, fields);
}

export function updateTestimonial(
  id: string,
  input: AdminTestimonialUpdateInput,
): Promise<AdminTestimonial> {
  return apiClient.put<AdminTestimonial>(`${BASE_PATH}/${id}`, input);
}

export function deleteTestimonial(id: string): Promise<void> {
  return apiClient.remove<void>(`${BASE_PATH}/${id}`);
}
