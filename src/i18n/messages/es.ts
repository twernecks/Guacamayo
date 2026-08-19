import type { Messages } from "./types";

export const es: Messages = {
  skipLink: "Saltar al contenido principal",
  brand: "Pousada",
  nav: {
    ariaLabel: "Navegación principal",
    rooms: "Habitaciones",
    weddings: "Bodas",
    events: "Eventos",
    testimonials: "Testimonios",
    location: "Ubicación",
  },
  menuToggle: {
    open: "Abrir menú de navegación",
    close: "Cerrar menú de navegación",
  },
  header: {
    whatsappCta: "Hablar por WhatsApp",
  },
  languageSelector: {
    label: "Seleccionar idioma",
    current: (language) => `Idioma actual: ${language}`,
    switchedAnnouncement: (language) => `Idioma cambiado a ${language}`,
  },
  hero: {
    eyebrow: "Alojamiento, bodas y eventos",
    title: "Una posada para vivir la naturaleza y celebrar momentos especiales",
    lead:
      "Casona colonial del siglo XIX (fechada en 1865 o 1885), que sirvió como parada en la " +
      "ruta del oro y hospedó a figuras famosas como la actriz Maria Della Costa y el cantante " +
      "Djavan.",
    whatsappCta: "Hablar por WhatsApp sobre el alojamiento",
  },
  rooms: {
    heading: "Habitaciones",
    empty:
      "Pronto presentaremos nuevas habitaciones aquí. Contáctenos para conocer más sobre el " +
      "alojamiento disponible.",
    galleryEmptyLabel: "Foto de la habitación próximamente",
    amenitiesAriaLabel: (roomName) => `Comodidades de ${roomName}`,
  },
  wedding: {
    eyebrow: "Bodas",
    highlights: [
      "Entorno natural para la ceremonia y la recepción",
      "Ambientación romántica y personalizable",
      "Equipo dedicado desde el inicio hasta el gran día",
    ],
    whatsappCta: "Solicitar presupuesto por WhatsApp",
    formSubmitLabel: "Solicitar presupuesto por el formulario",
    galleryEmptyLabel: "Fotos de bodas próximamente",
  },
  events: {
    heading: "Eventos",
    galleryEmptyLabel: "Fotos del espacio de eventos próximamente",
    whatsappCta: "Preguntar sobre este evento",
  },
  testimonials: {
    heading: "Testimonios",
    empty:
      "Aún no hay testimonios aprobados para mostrar. Pronto compartiremos experiencias de " +
      "huéspedes e invitados.",
    previousLabel: "Testimonio anterior",
    nextLabel: "Siguiente testimonio",
    listAriaLabel: "Lista de testimonios",
    positionIndicator: (current, total) => `${current} de ${total}`,
  },
  location: {
    heading: "Ubicación",
    loadMapButton: "Cargar mapa",
    privacyNotice:
      "El mapa interactivo es proporcionado por un servicio externo y solo se carga con su " +
      "autorización.",
    mapUnavailable: "El mapa interactivo estará disponible pronto.",
    openInGoogleMapsLink: "Abrir ubicación en Google Maps",
    mapTitle: "Mapa de la ubicación de la posada",
    streetViewTitle: "Vista a nivel de calle de la llegada a la posada",
    streetViewUnavailableNotice:
      "La imagen a nivel de calle muestra el punto de acceso disponible más cercano y puede no " +
      "corresponder exactamente a la fachada de la posada.",
  },
  footer: {
    copyright: (year) => `© ${year} Pousada. Todos los derechos reservados.`,
  },
  mediaGallery: {
    photosAriaLabel: (label) => `Fotos de ${label}`,
    viewPhotosSingle: (label) => `Ver foto de ${label}`,
    viewPhotosMultiple: (count, label) => `Ver ${count} fotos de ${label}`,
  },
  lightbox: {
    close: "Cerrar",
    previousPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    positionIndicator: (current, total) => `${current} de ${total}`,
    loadFailed: "No se pudo cargar esta foto.",
  },
  contactPage: {
    heading: "Contáctenos",
  },
  contactStates: {
    error: (message) =>
      `No pudimos cargar el contenido de la página en este momento (${message}). Inténtelo de ` +
      "nuevo más tarde.",
    empty: "Contenido en actualización. Vuelva pronto para conocer la posada.",
    loading: "Cargando contenido…",
  },
  contactForm: {
    nameLabel: "Nombre",
    nameError: "Ingrese un nombre de 2 a 80 caracteres.",
    phoneLabel: "Teléfono",
    phoneError: "Ingrese un teléfono válido, con código de área.",
    interestLabel: "Tipo de evento/servicio",
    interestError: "Seleccione el tipo de evento o servicio.",
    messageLabel: "Mensaje (opcional)",
    messageError: (maxLength) => `El mensaje debe tener como máximo ${maxLength} caracteres.`,
    submitLabel: "Enviar por WhatsApp",
  },
  contactInterest: {
    stay: "alojamiento",
    event: "evento",
    wedding: "boda",
  },
  whatsappContact: {
    defaultLabel: "Hablar por WhatsApp",
    fallbackPrefix: "¿Prefiere otro canal?",
    fallbackCallPrefix: "Llame al",
    fallbackConnector: "o",
    fallbackEmailPrefix: "envíe un correo a",
  },
  whatsappMessage: {
    greetingWithName: (name) => `¡Hola! Mi nombre es ${name}.`,
    interestLine: (interest) => `Tengo interés en: ${interest}.`,
    phoneLine: (phone) => `Teléfono de contacto: ${phone}.`,
    messageLine: (message) => `Mensaje: ${message}`,
    contextualGreeting: (interest) => `¡Hola! Tengo interés en ${interest} en la posada.`,
  },
};
