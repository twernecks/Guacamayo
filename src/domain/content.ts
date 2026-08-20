import type { LanguageCode } from "@/i18n/languages";

export type ContactContext = "stay" | "event" | "wedding";

export type LocalizedText = Record<LanguageCode, string>;

export type Media = {
  src: string;
  alt: LocalizedText;
  width: number;
  height: number;
  caption?: LocalizedText;
};

export type AmenityKey =
  | "wifi"
  | "airConditioning"
  | "breakfast"
  | "pool"
  | "privateBathroom"
  | "miniFridge"
  | "seaView";

export type RoomAmenity = {
  key: AmenityKey;
  label: LocalizedText;
};

export type Room = {
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  amenities: RoomAmenity[];
  images: Media[];
  contactContext: "stay";
  /** Drives editorial grid variation (FR-002); absent is treated as "standard". */
  visualEmphasis?: "standard" | "featured";
};

export type EventSpace = {
  id: string;
  name: LocalizedText;
  purpose: LocalizedText;
  images: Media[];
  contactContext: "event" | "wedding";
  isFeatured: boolean;
};

export type ExperienceType = "stay" | "event" | "wedding";

export type Testimonial = {
  id: string;
  quote: LocalizedText;
  attribution: string;
  experienceType: ExperienceType;
  approvedAt: string;
};

export type ContactChannels = {
  whatsappNumber: string;
  phone?: string;
  email?: string;
  address: string;
};

export type GeoCoordinates = {
  lat: number;
  lng: number;
};

export type Location = {
  address: string;
  coordinates: GeoCoordinates;
  mapEmbedUrl: string;
  streetViewEmbedUrl?: string;
  fallbackMapUrl: string;
};

export type PousadaContent = {
  hero: { image: Media };
  rooms: Room[];
  eventSpaces: EventSpace[];
  testimonials: Testimonial[];
  contact: ContactChannels;
  location: Location;
};
