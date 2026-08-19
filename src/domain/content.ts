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

export type Room = {
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  amenities: LocalizedText[];
  images: Media[];
  contactContext: "stay";
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
  rooms: Room[];
  eventSpaces: EventSpace[];
  testimonials: Testimonial[];
  contact: ContactChannels;
  location: Location;
};
