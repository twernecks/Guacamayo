export type Messages = {
  skipLink: string;
  brand: string;
  nav: {
    ariaLabel: string;
    rooms: string;
    weddings: string;
    events: string;
    testimonials: string;
    location: string;
  };
  menuToggle: {
    open: string;
    close: string;
  };
  header: {
    whatsappCta: string;
  };
  languageSelector: {
    label: string;
    current: (language: string) => string;
    switchedAnnouncement: (language: string) => string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    whatsappCta: string;
  };
  rooms: {
    heading: string;
    empty: string;
    galleryEmptyLabel: string;
    amenitiesAriaLabel: (roomName: string) => string;
  };
  wedding: {
    eyebrow: string;
    highlights: string[];
    whatsappCta: string;
    formSubmitLabel: string;
    galleryEmptyLabel: string;
  };
  events: {
    heading: string;
    galleryEmptyLabel: string;
    whatsappCta: string;
  };
  testimonials: {
    heading: string;
    empty: string;
    previousLabel: string;
    nextLabel: string;
    listAriaLabel: string;
    positionIndicator: (current: number, total: number) => string;
  };
  location: {
    heading: string;
    loadMapButton: string;
    privacyNotice: string;
    mapUnavailable: string;
    openInGoogleMapsLink: string;
    mapTitle: string;
    streetViewTitle: string;
    streetViewUnavailableNotice: string;
  };
  footer: {
    copyright: (year: number) => string;
  };
  mediaGallery: {
    photosAriaLabel: (label: string) => string;
    viewPhotosSingle: (label: string) => string;
    viewPhotosMultiple: (count: number, label: string) => string;
  };
  lightbox: {
    close: string;
    previousPhoto: string;
    nextPhoto: string;
    positionIndicator: (current: number, total: number) => string;
    loadFailed: string;
  };
  contactPage: {
    heading: string;
  };
  contactStates: {
    error: (message: string) => string;
    empty: string;
    loading: string;
  };
  contactForm: {
    nameLabel: string;
    nameError: string;
    phoneLabel: string;
    phoneError: string;
    interestLabel: string;
    interestError: string;
    messageLabel: string;
    messageError: (maxLength: number) => string;
    submitLabel: string;
  };
  contactInterest: {
    stay: string;
    event: string;
    wedding: string;
  };
  whatsappContact: {
    defaultLabel: string;
    fallbackPrefix: string;
    fallbackCallPrefix: string;
    fallbackConnector: string;
    fallbackEmailPrefix: string;
  };
  whatsappMessage: {
    greetingWithName: (name: string) => string;
    interestLine: (interest: string) => string;
    phoneLine: (phone: string) => string;
    messageLine: (message: string) => string;
    contextualGreeting: (interest: string) => string;
  };
};
