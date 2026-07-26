import type { PousadaContent } from "@/domain/content";

/**
 * Placeholder content pending business approval (see FR-011, FR-006 and
 * public/images/pousada/README.md). Every value below MUST be replaced by text,
 * photos, contacts and testimonials approved by the pousada before this content
 * is shown to real visitors. Testimonials stay empty until approved records
 * exist, so the UI exercises its documented empty/fallback states.
 *
 * PHOTO STATUS (2026-07-26): all 7 rooms now have real, approved photos and
 * names derived from the approved file names; `summary` text is still
 * placeholder copy pending approved descriptions from the business. The
 * wedding venue also has approved example photos of the grounds — see
 * public/images/pousada/README.md and the "Pending Before Public Launch"
 * section of tasks.md for tracking.
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
      // Real name and photos approved; summary is still placeholder copy.
      summary: "Descrição de exemplo a substituir por texto aprovado pelo negócio.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
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
      // Real name and photo approved; summary is still placeholder copy.
      summary: "Descrição de exemplo a substituir por texto aprovado pelo negócio.",
      amenities: ["Café da manhã incluso", "Acesso à piscina", "Wi-Fi", "Ar-condicionado"],
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
      // Real name and photos approved; summary is still placeholder copy.
      summary: "Descrição de exemplo a substituir por texto aprovado pelo negócio.",
      amenities: ["Café da manhã incluso", "Acesso à piscina", "Wi-Fi", "Vista do jardim"],
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
      // Real name and photos approved; summary is still placeholder copy.
      summary: "Descrição de exemplo a substituir por texto aprovado pelo negócio.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Ar-condicionado",
        "Cama adicional",
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
      // Real name and photos approved; summary is still placeholder copy.
      summary: "Descrição de exemplo a substituir por texto aprovado pelo negócio.",
      amenities: [
        "Café da manhã incluso",
        "Acesso à piscina",
        "Wi-Fi",
        "Varanda privativa",
        "Frigobar",
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
      // Real name and photos approved; summary is still placeholder copy.
      summary: "Descrição de exemplo a substituir por texto aprovado pelo negócio.",
      amenities: ["Café da manhã incluso", "Acesso à piscina", "Wi-Fi", "Vista do jardim"],
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
      // Real name and photos approved; summary is still placeholder copy.
      summary: "Descrição de exemplo a substituir por texto aprovado pelo negócio.",
      amenities: ["Café da manhã incluso", "Acesso à piscina", "Wi-Fi", "Vista da piscina"],
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
      name: "Casamentos na Pousada (placeholder)",
      purpose:
        "Narrativa de exemplo a substituir pela proposta aprovada de casamentos: cerimônia " +
        "ao ar livre cercada pela natureza, recepção personalizável e acompanhamento próximo " +
        "da equipe do início ao grande dia.",
      // Approved example photos of the wedding venue/grounds; purpose text above is
      // still placeholder copy pending the business's approved wedding narrative.
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
      name: "Espaço para Eventos (placeholder)",
      purpose:
        "Narrativa de exemplo a substituir pela proposta aprovada de eventos: espaço " +
        "versátil para aniversários, confraternizações corporativas e encontros familiares, " +
        "com estrutura de apoio e ambientação natural.",
      images: [],
      contactContext: "event",
      isFeatured: false,
    },
  ],
  // Only one of the three testimonials supplied so far is included below; the
  // other two were identical duplicates and are pending a corrected second
  // quote from the business before being added (see chat/PR notes).
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
    whatsappNumber: "+5500000000000",
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
