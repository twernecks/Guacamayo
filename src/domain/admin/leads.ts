import type { RowVersion } from "@/domain/admin/shared";
import { CONTACT_INTEREST_LABELS, type ContactInterest } from "@/domain/admin/enums";

/** `0 Novo`, `1 Contatado`, `2 Fechado` — confirmed by contracts/leads.md and `Guacamayo.Domain.Enums.LeadStatus`. */
export type LeadStatus = 0 | 1 | 2;

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  0: "Novo",
  1: "Contatado",
  2: "Fechado",
};

/** `Guacamayo.Domain.Enums.MessageDirection`: `0 Inbound` (from the lead), `1 Outbound` (from the bot). */
export type LeadMessageDirection = 0 | 1;

export type LeadMessage = {
  direction: LeadMessageDirection;
  body: string;
  /** ISO 8601 timestamp. */
  timestamp: string;
};

/**
 * Lead captured by the WhatsApp bot (data-model.md § Lead), confirmed live
 * against `Guacamayo.Application.Leads.LeadDto` (2026-08-26). `name`/`phone`
 * are `required string` on the API (never `null`) — the UI's "não
 * informado" fallback (FR-021) is kept anyway as a defensive display rule
 * for an unexpectedly empty string, not because the API can send `null`.
 * `interest` reuses the same `ContactInterest` enum as
 * EventSpace.contactContext/Testimonial.experienceType.
 */
export type Lead = {
  id: string;
  name: string;
  phone: string;
  interest: ContactInterest;
  message: string | null;
  status: LeadStatus;
  /** ISO 8601 timestamp. */
  createdAt: string;
  rowVersion: RowVersion;
};

export const LEAD_INTEREST_LABELS = CONTACT_INTEREST_LABELS;

/** Only present on `GET /api/admin/leads/{id}` — always an array, `[]` when the source conversation is gone (FR-022). */
export type LeadDetail = Lead & { messages: LeadMessage[] };

export type LeadListFilters = {
  status?: LeadStatus;
  /** ISO 8601 date (inclusive lower bound). */
  from?: string;
  /** ISO 8601 date (inclusive upper bound). */
  to?: string;
  skip: number;
  take: number;
};

export type LeadListResult = {
  items: Lead[];
  totalCount: number;
};
