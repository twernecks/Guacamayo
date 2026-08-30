/**
 * Numeric enum wire values confirmed live against the real Guacamayo API
 * (2026-08-26) — the API has no `JsonStringEnumConverter` registered for its
 * controller JSON options (only `PropertyNamingPolicy = CamelCase`), so
 * every C# enum serializes as a plain integer, matching its declaration
 * order in `Guacamayo.Domain.Enums`. These were previously guessed as
 * string unions in the frontend types — corrected here from the actual
 * source (`ContactInterest`, `AmenityKey`, `VisualEmphasis`) and live
 * request/response probes, not just the contracts doc (which showed
 * `"field": "name.pt"` casing that also turned out not to match the real
 * API's `"Name.Pt"` — see FieldError.tsx).
 */

/** `Guacamayo.Domain.Enums.ContactInterest` — shared by EventSpace.contactContext, Testimonial.experienceType, Lead.interest. */
export const CONTACT_INTEREST = { Stay: 0, Event: 1, Wedding: 2 } as const;
export type ContactInterest = (typeof CONTACT_INTEREST)[keyof typeof CONTACT_INTEREST];

export const CONTACT_INTEREST_LABELS: Record<ContactInterest, string> = {
  0: "Hospedagem",
  1: "Evento",
  2: "Casamento",
};

/** `Guacamayo.Domain.Enums.AmenityKey`. */
export const AMENITY_KEY = {
  Wifi: 0,
  AirConditioning: 1,
  Breakfast: 2,
  Pool: 3,
  PrivateBathroom: 4,
  MiniFridge: 5,
  SeaView: 6,
} as const;
export type AmenityKeyValue = (typeof AMENITY_KEY)[keyof typeof AMENITY_KEY];

export const AMENITY_KEY_LABELS: Record<AmenityKeyValue, string> = {
  0: "Wi-Fi",
  1: "Ar-condicionado",
  2: "Café da manhã",
  3: "Piscina",
  4: "Banheiro privativo",
  5: "Frigobar",
  6: "Vista para o mar",
};

/** `Guacamayo.Domain.Enums.VisualEmphasis`. */
export const VISUAL_EMPHASIS = { Standard: 0, Featured: 1 } as const;
export type VisualEmphasisValue = (typeof VISUAL_EMPHASIS)[keyof typeof VISUAL_EMPHASIS];

export const VISUAL_EMPHASIS_LABELS: Record<VisualEmphasisValue, string> = {
  0: "Padrão",
  1: "Destaque",
};
