import type { PousadaContent } from "@/domain/content";

/**
 * Content approved by the pousada (see FR-011, FR-006 and
 * public/images/pousada/README.md). Remaining gaps are tracked in the
 * "Pending Before Public Launch" section of
 * specs/001-pousada-landing-page/tasks.md (e.g. event-space photos, an
 * exact GPS pin for the address, phone/email as additional contact
 * channels).
 *
 * CONTENT STATUS (2026-07-26): all 7 rooms have real photos, names and
 * descriptions; the wedding venue has approved example photos and an
 * approved narrative; WhatsApp contact is real.
 *
 * Every room shares breakfast and pool access, so `amenities` standardizes
 * "Café da manhã incluso" and "Acesso à piscina" across all rooms in addition
 * to each room's specific amenities.
 */
export const pousadaContent: PousadaContent = {
  rooms: [
    {
      id: "quarto-duplo-deluxe-vista-mar",
      name: "Quarto Duplo Deluxe com Vista do Mar",
      summary: "Excelente quarto com vista deslumbrante para o mar.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
        "Banheiro privativo",
        "Frigobar",
        "Vista do mar",
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-01.jpg",
          alt: "Quarto Duplo Deluxe com Vista do Mar: cama de casal e ambiente aconchegante",
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-02.jpg",
          alt: "Quarto Duplo Deluxe com Vista do Mar: banheiro com bancada dupla",
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-03.jpg",
          alt: "Quarto Duplo Deluxe com Vista do Mar: banheiro com bancada dupla e janela com vista para o jardim",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-04.jpg",
          alt: "Quarto Duplo Deluxe com Vista do Mar: banheiro com box de vidro",
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-05.jpg",
          alt: "Quarto Duplo Deluxe com Vista do Mar: guarda-roupas de madeira e piso amadeirado",
          width: 513,
          height: 768,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-duplo-pedra",
      name: "Quarto Duplo Pedra",
      summary: "Excelente quarto com integração natural à rocha, proporcionando uma experiência única.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
        "Banheiro privativo",
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-duplo-pedra-01.jpg",
          alt: "Quarto Duplo Pedra: cama de casal ao lado de rocha natural integrada à parede",
          width: 1024,
          height: 670,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-duplo-vista-jardim",
      name: "Quarto Duplo com Vista do Jardim",
      summary: "Excelente quarto com vista deslumbrante para o jardim.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
        "Banheiro privativo",
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-duplo-vista-jardim-01.jpg",
          alt: "Quarto Duplo com Vista do Jardim: cama de casal com cabeceira de madeira entalhada",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-vista-jardim-02.jpg",
          alt: "Quarto Duplo com Vista do Jardim: banheiro com box de vidro",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-vista-jardim-03.jpg",
          alt: "Quarto Duplo com Vista do Jardim: cama de casal com vista para o jardim pela janela",
          width: 1024,
          height: 683,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-quadruplo-familia",
      name: "Quarto Quádruplo Família",
      summary: "Excelente quarto espaçoso para famílias, com acomodações confortáveis.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
        "Banheiro privativo",
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-quadruplo-familia-01.jpg",
          alt: "Quarto Quádruplo Família: cama de casal, ventilador de teto e amplos armários",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-quadruplo-familia-02.jpg",
          alt: "Quarto Quádruplo Família: cama de solteiro adicional para acomodar o grupo",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-quadruplo-familia-03.jpg",
          alt: "Quarto Quádruplo Família: banheiro com arranjo de flores tropicais",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-quadruplo-familia-04.jpg",
          alt: "Quarto Quádruplo Família: cama de casal com vista para a varanda",
          width: 1024,
          height: 683,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-triplo-classico",
      name: "Quarto Triplo Clássico",
      summary: "Excelente quarto com acomodações clássicas e confortáveis para três pessoas.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
        "Banheiro privativo",
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-triplo-classico-01.jpg",
          alt: "Quarto Triplo Clássico: três camas em ambiente rústico e aconchegante",
          width: 1024,
          height: 670,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-classico-02.jpg",
          alt: "Quarto Triplo Clássico: banheiro com box de vidro",
          width: 1024,
          height: 707,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-triplo-vista-jardim",
      name: "Quarto Triplo com Vista do Jardim",
      summary: "Excelente quarto com vista deslumbrante para o jardim, ideal para grupos de três pessoas.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
        "Banheiro privativo",
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-jardim-01.jpg",
          alt: "Quarto Triplo com Vista do Jardim: acesso por porta emoldurada em pedra",
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-jardim-02.jpg",
          alt: "Quarto Triplo com Vista do Jardim: banheiro com bancada de madeira",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-jardim-03.jpg",
          alt: "Quarto Triplo com Vista do Jardim: cama de casal com vista para o jardim",
          width: 1024,
          height: 683,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-triplo-vista-piscina",
      name: "Quarto Triplo com Vista da Piscina",
      summary: "Excelente quarto com vista deslumbrante para a piscina, ideal para grupos de três pessoas.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
        "Banheiro privativo",
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-piscina-01.jpg",
          alt: "Quarto Triplo com Vista da Piscina: portas de vidro abertas para o quarto",
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-piscina-02.jpg",
          alt: "Quarto Triplo com Vista da Piscina: corredor com piso em tacos de madeira",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-piscina-03.jpg",
          alt: "Quarto Triplo com Vista da Piscina: cama de casal em ambiente aconchegante",
          width: 513,
          height: 768,
        },
      ],
      contactContext: "stay",
    },
  ],
  eventSpaces: [
    {
      id: "casamentos",
      name: "Casamentos na Pousada Enseada Jatobá",
      purpose:
        "Cerimônia ao ar livre cercada pela natureza, recepção personalizável e acompanhamento próximo " +
        "da equipe do início ao grande dia." +
        " A pousada oferece um espaço versátil para casamentos, com opções de decoração, catering e " +
        "serviços de apoio para tornar cada celebração única e memorável.",
      images: [
        {
          src: "/images/pousada/quartos/local-casamento-01.jpg",
          alt: "Área externa da pousada com jardim, coqueiros e vista para o entorno natural",
          width: 1024,
          height: 391,
        },
        {
          src: "/images/pousada/quartos/local-casamento-02.jpg",
          alt: "Passarela de madeira sobre a água levando à área de praia da pousada",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/local-casamento-03.jpg",
          alt: "Gramado amplo entre coqueiros com vista para a água ao fundo",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/local-casamento-04.jpg",
          alt: "Gramado e jardim tropical da pousada com vista para a água",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/local-casamento-05.jpg",
          alt: "Espaço coberto ao ar livre para recepção, cercado por coqueiros",
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/local-casamento-06.jpg",
          alt: "Vista aérea da sede da pousada com telhado colonial, piscina e jardim exuberante",
          width: 1024,
          height: 576,
        },
      ],
      contactContext: "wedding",
      isFeatured: true,
    },
    {
      id: "eventos",
      name: "Espaço para Eventos em Geral",
      purpose:
        "Espaço versátil para aniversários, confraternizações corporativas e encontros familiares, " +
        "com estrutura de apoio e ambientação natural." +
        " A pousada oferece um espaço adaptável para eventos diversos, com opções de catering, " +
        "decoração e serviços de apoio para atender às necessidades de cada ocasião.",
      // Narrative approved; photos for this (non-wedding) event space are still
      // pending business approval — see "Pending Before Public Launch" in tasks.md.
      images: [],
      contactContext: "event",
      isFeatured: false,
    },
  ],
  testimonials: [
    {
      id: "testimonial-camila-andrade",
      quote:
        "Lugar maravilhoso para quem quer uma conexão com a natureza. Proprietários Enzo e " +
        "Robson super receptivos e acolhedores, trazendo com pequenos detalhes o diferencial.",
      attribution: "Camila Andrade",
      experienceType: "stay",
      approvedAt: "2026-07-25",
    },
    {
      id: "testimonial-helena-werneck",
      quote:
        "A recepção foi excelente, pessoas educadas, atenciosas, prestativas, lugar maravilhoso, " +
        "contato com a natureza e um custo benefício q vale a pena, recomendo.",
      attribution: "Helana Werneck",
      experienceType: "stay",
      approvedAt: "2026-01-25",
    },
    {
      id: "testimonial-joao-paulo",
      quote:
        "Vista linda no entorno da pousada , arquitetura bonita , limpeza excelente, próximo" +
        " ao centro de Paraty, boa localização.",
      attribution: "João Paulo",
      experienceType: "stay",
      approvedAt: "2026-03-01",
    },
  ],
  contact: {
    whatsappNumber: "+5532988928939",
    address: "BR-101 - Km 570, Paraty, CEP 23970-000",
  },
  location: {
    address: "BR-101 - Km 570, Paraty, CEP 23970-000",
    // Centered on the CEP 23970-000 area of Paraty (geocoded via OpenStreetMap
    // Nominatim), as an approximation of the BR-101 Km 570 marker pending an
    // exact GPS pin confirmed by the business — see README.md status notes.
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-44.7226147%2C-23.2236076%2C-44.7026147%2C-23.2036076&layer=mapnik&marker=-23.2136076%2C-44.7126147",
    fallbackMapUrl: "https://www.openstreetmap.org/?mlat=-23.2136076&mlon=-44.7126147#map=15/-23.2136076/-44.7126147",
  },
};
