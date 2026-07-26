export type ContactContext = "stay" | "event" | "wedding";

export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type Room = {
  id: string;
  name: string;
  summary: string;
  amenities: string[];
  images: Media[];
  contactContext: "stay";
};

export type EventSpace = {
  id: string;
  name: string;
  purpose: string;
  images: Media[];
  contactContext: "event" | "wedding";
  isFeatured: boolean;
};

export type ExperienceType = "stay" | "event" | "wedding";

export type Testimonial = {
  id: string;
  quote: string;
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

export type Location = {
  address: string;
  mapEmbedUrl: string;
  fallbackMapUrl: string;
};

export type PousadaContent = {
  rooms: Room[];
  eventSpaces: EventSpace[];
  testimonials: Testimonial[];
  contact: ContactChannels;
  location: Location;
};
