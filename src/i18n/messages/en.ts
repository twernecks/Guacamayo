import type { Messages } from "./types";

export const en: Messages = {
  skipLink: "Skip to main content",
  brand: "Pousada",
  nav: {
    ariaLabel: "Main navigation",
    rooms: "Rooms",
    weddings: "Weddings",
    events: "Events",
    testimonials: "Reviews",
    location: "Location",
  },
  menuToggle: {
    open: "Open navigation menu",
    close: "Close navigation menu",
  },
  header: {
    whatsappCta: "Chat on WhatsApp",
  },
  languageSelector: {
    label: "Select language",
    current: (language) => `Current language: ${language}`,
    switchedAnnouncement: (language) => `Language changed to ${language}`,
  },
  hero: {
    eyebrow: "Stays, weddings and events",
    title: "A guesthouse to live nature and celebrate special moments",
    lead:
      "A 19th-century colonial manor (dated 1865 or 1885) that once served as a stop on the " +
      "gold route and hosted famous figures such as actress Maria Della Costa and singer Djavan.",
    whatsappCta: "Chat on WhatsApp about your stay",
  },
  rooms: {
    heading: "Rooms",
    empty:
      "New rooms will be presented here soon. Get in touch to learn more about the stays " +
      "available.",
    galleryEmptyLabel: "Room photo coming soon",
    amenitiesAriaLabel: (roomName) => `Amenities of ${roomName}`,
  },
  wedding: {
    eyebrow: "Weddings",
    highlights: [
      "Natural setting for the ceremony and reception",
      "Romantic, customizable ambiance",
      "A dedicated team from start to the big day",
    ],
    whatsappCta: "Request a quote on WhatsApp",
    formSubmitLabel: "Request a quote via the form",
    galleryEmptyLabel: "Wedding photos coming soon",
  },
  events: {
    heading: "Events",
    galleryEmptyLabel: "Event space photos coming soon",
    whatsappCta: "Ask about this event",
  },
  testimonials: {
    heading: "Reviews",
    empty: "No approved reviews yet. We'll soon share guest and visitor experiences here.",
    previousLabel: "Previous review",
    nextLabel: "Next review",
    listAriaLabel: "List of reviews",
    positionIndicator: (current, total) => `${current} of ${total}`,
  },
  location: {
    heading: "Location",
    loadMapButton: "Load map",
    privacyNotice:
      "The interactive map is provided by an external service and only loads after your " +
      "consent.",
    mapUnavailable: "The interactive map will be available soon.",
    openInGoogleMapsLink: "Open location in Google Maps",
    mapTitle: "Map of the guesthouse's location",
    streetViewTitle: "Street-level view of the arrival to the guesthouse",
    streetViewUnavailableNotice:
      "The street-level image shows the closest available access point and may not exactly " +
      "match the guesthouse's front.",
  },
  footer: {
    copyright: (year) => `© ${year} Pousada. All rights reserved.`,
  },
  mediaGallery: {
    photosAriaLabel: (label) => `Photos of ${label}`,
    viewPhotosSingle: (label) => `View photo of ${label}`,
    viewPhotosMultiple: (count, label) => `View ${count} photos of ${label}`,
  },
  lightbox: {
    close: "Close",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    positionIndicator: (current, total) => `${current} of ${total}`,
    loadFailed: "This photo could not be loaded.",
  },
  contactPage: {
    heading: "Get in touch",
  },
  contactStates: {
    error: (message) =>
      `We couldn't load the page content right now (${message}). Please try again later.`,
    empty: "Content is being updated. Check back soon to learn about the guesthouse.",
    loading: "Loading content…",
  },
  contactForm: {
    nameLabel: "Name",
    nameError: "Enter a name with 2 to 80 characters.",
    phoneLabel: "Phone",
    phoneError: "Enter a valid phone number, with area code.",
    interestLabel: "Type of event/service",
    interestError: "Select the type of event or service.",
    messageLabel: "Message (optional)",
    messageError: (maxLength) => `The message must be at most ${maxLength} characters.`,
    submitLabel: "Send via WhatsApp",
  },
  contactInterest: {
    stay: "a stay",
    event: "an event",
    wedding: "a wedding",
  },
  whatsappContact: {
    defaultLabel: "Chat on WhatsApp",
    fallbackPrefix: "Prefer another channel?",
    fallbackCallPrefix: "Call",
    fallbackConnector: "or",
    fallbackEmailPrefix: "email",
  },
  whatsappMessage: {
    greetingWithName: (name) => `Hello! My name is ${name}.`,
    interestLine: (interest) => `I'm interested in: ${interest}.`,
    phoneLine: (phone) => `Contact phone: ${phone}.`,
    messageLine: (message) => `Message: ${message}`,
    contextualGreeting: (interest) => `Hello! I'm interested in ${interest} at the guesthouse.`,
  },
};
