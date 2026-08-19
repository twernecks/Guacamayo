import type { Messages } from "./types";

export const pt: Messages = {
  skipLink: "Pular para o conteúdo principal",
  brand: "Pousada",
  nav: {
    ariaLabel: "Navegação principal",
    rooms: "Quartos",
    weddings: "Casamentos",
    events: "Eventos",
    testimonials: "Relatos",
    location: "Localização",
  },
  menuToggle: {
    open: "Abrir menu de navegação",
    close: "Fechar menu de navegação",
  },
  header: {
    whatsappCta: "Falar no WhatsApp",
  },
  languageSelector: {
    label: "Selecionar idioma",
    current: (language) => `Idioma atual: ${language}`,
    switchedAnnouncement: (language) => `Idioma alterado para ${language}`,
  },
  hero: {
    eyebrow: "Hospedagem, casamentos e eventos",
    title: "Uma pousada para viver a natureza e celebrar momentos especiais",
    lead:
      "Casarão colonial do século XIX (datado de 1865 ou 1885), que serviu de rota do ouro " +
      "e abrigou figuras famosas como a atriz Maria Della Costa e o cantor Djavan.",
    whatsappCta: "Falar no WhatsApp sobre hospedagem",
  },
  rooms: {
    heading: "Quartos",
    empty:
      "Em breve, novos quartos serão apresentados aqui. Fale conosco para saber mais sobre a " +
      "hospedagem disponível.",
    galleryEmptyLabel: "Foto do quarto em breve",
    amenitiesAriaLabel: (roomName) => `Comodidades de ${roomName}`,
  },
  wedding: {
    eyebrow: "Casamentos",
    highlights: [
      "Cenário natural para cerimônia e recepção",
      "Ambientação romântica e personalizável",
      "Equipe dedicada do início ao grande dia",
    ],
    whatsappCta: "Pedir orçamento pelo WhatsApp",
    formSubmitLabel: "Pedir orçamento pelo formulário",
    galleryEmptyLabel: "Fotos de casamentos em breve",
  },
  events: {
    heading: "Eventos",
    galleryEmptyLabel: "Fotos do espaço de eventos em breve",
    whatsappCta: "Falar sobre este evento",
  },
  testimonials: {
    heading: "Relatos",
    empty:
      "Ainda não há relatos aprovados para exibir. Em breve, compartilharemos experiências de " +
      "hóspedes e convidados.",
    previousLabel: "Relato anterior",
    nextLabel: "Próximo relato",
    listAriaLabel: "Lista de relatos",
    positionIndicator: (current, total) => `${current} de ${total}`,
  },
  location: {
    heading: "Localização",
    loadMapButton: "Carregar mapa",
    privacyNotice:
      "O mapa interativo é fornecido por um serviço externo e só é carregado após sua " +
      "autorização.",
    mapUnavailable: "O mapa interativo estará disponível em breve.",
    openInGoogleMapsLink: "Abrir localização no Google Maps",
    mapTitle: "Mapa da localização da pousada",
    streetViewTitle: "Visualização em nível de rua da chegada à pousada",
    streetViewUnavailableNotice:
      "A imagem de nível de rua mostra o trecho de acesso mais próximo disponível e pode não " +
      "corresponder exatamente à fachada da pousada.",
  },
  footer: {
    copyright: (year) => `© ${year} Pousada. Todos os direitos reservados.`,
  },
  mediaGallery: {
    photosAriaLabel: (label) => `Fotos de ${label}`,
    viewPhotosSingle: (label) => `Ver foto de ${label}`,
    viewPhotosMultiple: (count, label) => `Ver ${count} fotos de ${label}`,
  },
  lightbox: {
    close: "Fechar",
    previousPhoto: "Foto anterior",
    nextPhoto: "Próxima foto",
    positionIndicator: (current, total) => `${current} de ${total}`,
    loadFailed: "Não foi possível carregar esta foto.",
  },
  contactPage: {
    heading: "Fale conosco",
  },
  contactStates: {
    error: (message) =>
      `Não foi possível carregar o conteúdo da página agora (${message}). Tente novamente mais tarde.`,
    empty: "Conteúdo em atualização. Volte em breve para conhecer a pousada.",
    loading: "Carregando conteúdo…",
  },
  contactForm: {
    nameLabel: "Nome",
    nameError: "Informe um nome com 2 a 80 caracteres.",
    phoneLabel: "Telefone",
    phoneError: "Informe um telefone válido, com DDD.",
    interestLabel: "Tipo de evento/serviço",
    interestError: "Selecione o tipo de evento ou serviço.",
    messageLabel: "Mensagem (opcional)",
    messageError: (maxLength) => `A mensagem deve ter no máximo ${maxLength} caracteres.`,
    submitLabel: "Enviar pelo WhatsApp",
  },
  contactInterest: {
    stay: "hospedagem",
    event: "evento",
    wedding: "casamento",
  },
  whatsappContact: {
    defaultLabel: "Falar no WhatsApp",
    fallbackPrefix: "Prefere outro canal?",
    fallbackCallPrefix: "Ligue em",
    fallbackConnector: "ou",
    fallbackEmailPrefix: "envie um e-mail para",
  },
  whatsappMessage: {
    greetingWithName: (name) => `Olá! Meu nome é ${name}.`,
    interestLine: (interest) => `Tenho interesse em: ${interest}.`,
    phoneLine: (phone) => `Telefone para contato: ${phone}.`,
    messageLine: (message) => `Mensagem: ${message}`,
    contextualGreeting: (interest) => `Olá! Tenho interesse em ${interest} na pousada.`,
  },
};
