import type { LocalizedText, RowVersion } from "@/domain/admin/shared";
import type { ContactInterest } from "@/domain/admin/enums";

/**
 * Admin-facing Testimonial (data-model.md § Depoimento administrativo) —
 * confirmed live against the real API (2026-08-26) from
 * `Guacamayo.Application.Content.Testimonials.TestimonialDto`.
 */
export type AdminTestimonial = {
  id: string;
  quote: LocalizedText;
  /** Not localized — a person's name isn't translated (confirmed: `string`, not `LocalizedText`). */
  attribution: string;
  experienceType: ContactInterest;
  /** `DateOnly` on the API — plain `"yyyy-MM-dd"`, no time component (e.g. `"2026-01-15"`). */
  approvedAt: string;
  isPublished: boolean;
  rowVersion: RowVersion;
};

export type AdminTestimonialFields = Omit<AdminTestimonial, "id" | "rowVersion">;

export type AdminTestimonialUpdateInput = AdminTestimonialFields & { rowVersion: RowVersion };
