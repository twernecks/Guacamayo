import type { PousadaContent } from "@/domain/content";

/**
 * Content approved by the pousada (see FR-011, FR-006 and
 * public/images/pousada/README.md). Remaining gaps are tracked in the
 * "Pending Before Public Launch" section of
 * specs/001-pousada-landing-page/tasks.md.
 *
 * CONTENT STATUS (2026-08-18): all 7 rooms, the wedding venue and the 3
 * testimonials have their visitor-facing text in Portuguese, English and
 * Spanish (feature 004-translation-google-maps, FR-006). English/Spanish
 * text was drafted during implementation and is pending the owner's
 * asynchronous review (FR-006, spec.md Assumptions) — it is not a launch
 * blocker.
 *
 * Every room shares breakfast and pool access, so `amenities` standardizes
 * "Café da manhã incluso"/"Breakfast included"/"Desayuno incluido" and
 * "Acesso à piscina"/"Pool access"/"Acceso a la piscina" across all rooms in
 * addition to each room's specific amenities.
 *
 * The Localização coordinates were confirmed by the owner via a Google Maps
 * pin (see specs/004-translation-google-maps/spec.md > Key Entities); the
 * map/Street View embeds use Google's keyless embed URL pattern
 * (research.md Decision 3) rather than the paid Maps Embed API.
 */
export const pousadaContent: PousadaContent = {
  hero: {
    image: {
      src: "/images/pousada/quartos/local-casamento-06.jpg",
      alt: {
        pt: "Vista aérea da sede da pousada com telhado colonial, piscina e jardim exuberante",
        en: "Aerial view of the guesthouse's main building with its colonial roof, pool and lush garden",
        es: "Vista aérea de la sede de la posada con techo colonial, piscina y exuberante jardín",
      },
      width: 1024,
      height: 576,
    },
  },
  rooms: [
    {
      id: "quarto-duplo-deluxe-vista-mar",
      visualEmphasis: "featured",
      name: {
        pt: "Quarto Duplo Deluxe com Vista do Mar",
        en: "Deluxe Double Room with Sea View",
        es: "Habitación Doble Deluxe con Vista al Mar",
      },
      summary: {
        pt: "Excelente quarto com vista deslumbrante para o mar.",
        en: "An excellent room with a stunning view of the sea.",
        es: "Excelente habitación con una vista impresionante al mar.",
      },
      amenities: [
        {
          key: "breakfast",
          label: { pt: "Café da manhã incluso", en: "Breakfast included", es: "Desayuno incluido" },
        },
        { key: "pool", label: { pt: "Acesso à piscina", en: "Pool access", es: "Acceso a la piscina" } },
        { key: "wifi", label: { pt: "Wi-Fi", en: "Wi-Fi", es: "Wi-Fi" } },
        {
          key: "airConditioning",
          label: { pt: "Ar-condicionado", en: "Air conditioning", es: "Aire acondicionado" },
        },
        {
          key: "privateBathroom",
          label: { pt: "Banheiro privativo", en: "Private bathroom", es: "Baño privado" },
        },
        { key: "miniFridge", label: { pt: "Frigobar", en: "Mini fridge", es: "Minibar" } },
        { key: "seaView", label: { pt: "Vista do mar", en: "Sea view", es: "Vista al mar" } },
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-01.jpg",
          alt: {
            pt: "Quarto Duplo Deluxe com Vista do Mar: cama de casal e ambiente aconchegante",
            en: "Deluxe Double Room with Sea View: double bed in a cozy setting",
            es: "Habitación Doble Deluxe con Vista al Mar: cama de matrimonio en un ambiente acogedor",
          },
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-02.jpg",
          alt: {
            pt: "Quarto Duplo Deluxe com Vista do Mar: banheiro com bancada dupla",
            en: "Deluxe Double Room with Sea View: bathroom with a double vanity",
            es: "Habitación Doble Deluxe con Vista al Mar: baño con encimera doble",
          },
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-03.jpg",
          alt: {
            pt: "Quarto Duplo Deluxe com Vista do Mar: banheiro com bancada dupla e janela com vista para o jardim",
            en: "Deluxe Double Room with Sea View: bathroom with a double vanity and a window overlooking the garden",
            es: "Habitación Doble Deluxe con Vista al Mar: baño con encimera doble y ventana con vista al jardín",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-04.jpg",
          alt: {
            pt: "Quarto Duplo Deluxe com Vista do Mar: banheiro com box de vidro",
            en: "Deluxe Double Room with Sea View: bathroom with a glass shower enclosure",
            es: "Habitación Doble Deluxe con Vista al Mar: baño con mampara de vidrio",
          },
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-deluxe-vista-mar-05.jpg",
          alt: {
            pt: "Quarto Duplo Deluxe com Vista do Mar: guarda-roupas de madeira e piso amadeirado",
            en: "Deluxe Double Room with Sea View: wooden wardrobe and wood-look flooring",
            es: "Habitación Doble Deluxe con Vista al Mar: armario de madera y piso de madera",
          },
          width: 513,
          height: 768,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-duplo-pedra",
      name: {
        pt: "Quarto Duplo Pedra",
        en: "Double Stone Room",
        es: "Habitación Doble de Piedra",
      },
      summary: {
        pt: "Excelente quarto com integração natural à rocha, proporcionando uma experiência única.",
        en: "An excellent room naturally integrated with the rock, offering a unique experience.",
        es: "Excelente habitación integrada naturalmente con la roca, que ofrece una experiencia única.",
      },
      amenities: [
        {
          key: "breakfast",
          label: { pt: "Café da manhã incluso", en: "Breakfast included", es: "Desayuno incluido" },
        },
        { key: "pool", label: { pt: "Acesso à piscina", en: "Pool access", es: "Acceso a la piscina" } },
        { key: "wifi", label: { pt: "Wi-Fi", en: "Wi-Fi", es: "Wi-Fi" } },
        {
          key: "airConditioning",
          label: { pt: "Ar-condicionado", en: "Air conditioning", es: "Aire acondicionado" },
        },
        {
          key: "privateBathroom",
          label: { pt: "Banheiro privativo", en: "Private bathroom", es: "Baño privado" },
        },
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-duplo-pedra-01.jpg",
          alt: {
            pt: "Quarto Duplo Pedra: cama de casal ao lado de rocha natural integrada à parede",
            en: "Double Stone Room: double bed next to natural rock integrated into the wall",
            es: "Habitación Doble de Piedra: cama de matrimonio junto a roca natural integrada en la pared",
          },
          width: 1024,
          height: 670,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-duplo-vista-jardim",
      name: {
        pt: "Quarto Duplo com Vista do Jardim",
        en: "Double Room with Garden View",
        es: "Habitación Doble con Vista al Jardín",
      },
      summary: {
        pt: "Excelente quarto com vista deslumbrante para o jardim.",
        en: "An excellent room with a stunning view of the garden.",
        es: "Excelente habitación con una vista impresionante al jardín.",
      },
      amenities: [
        {
          key: "breakfast",
          label: { pt: "Café da manhã incluso", en: "Breakfast included", es: "Desayuno incluido" },
        },
        { key: "pool", label: { pt: "Acesso à piscina", en: "Pool access", es: "Acceso a la piscina" } },
        { key: "wifi", label: { pt: "Wi-Fi", en: "Wi-Fi", es: "Wi-Fi" } },
        {
          key: "airConditioning",
          label: { pt: "Ar-condicionado", en: "Air conditioning", es: "Aire acondicionado" },
        },
        {
          key: "privateBathroom",
          label: { pt: "Banheiro privativo", en: "Private bathroom", es: "Baño privado" },
        },
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-duplo-vista-jardim-01.jpg",
          alt: {
            pt: "Quarto Duplo com Vista do Jardim: cama de casal com cabeceira de madeira entalhada",
            en: "Double Room with Garden View: double bed with a carved wooden headboard",
            es: "Habitación Doble con Vista al Jardín: cama de matrimonio con cabecero de madera tallada",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-vista-jardim-02.jpg",
          alt: {
            pt: "Quarto Duplo com Vista do Jardim: banheiro com box de vidro",
            en: "Double Room with Garden View: bathroom with a glass shower enclosure",
            es: "Habitación Doble con Vista al Jardín: baño con mampara de vidrio",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-duplo-vista-jardim-03.jpg",
          alt: {
            pt: "Quarto Duplo com Vista do Jardim: cama de casal com vista para o jardim pela janela",
            en: "Double Room with Garden View: double bed with a garden view through the window",
            es: "Habitación Doble con Vista al Jardín: cama de matrimonio con vista al jardín por la ventana",
          },
          width: 1024,
          height: 683,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-quadruplo-familia",
      name: {
        pt: "Quarto Quádruplo Família",
        en: "Family Quadruple Room",
        es: "Habitación Cuádruple Familiar",
      },
      summary: {
        pt: "Excelente quarto espaçoso para famílias, com acomodações confortáveis.",
        en: "An excellent spacious room for families, with comfortable accommodations.",
        es: "Excelente habitación espaciosa para familias, con alojamiento confortable.",
      },
      amenities: [
        {
          key: "breakfast",
          label: { pt: "Café da manhã incluso", en: "Breakfast included", es: "Desayuno incluido" },
        },
        { key: "pool", label: { pt: "Acesso à piscina", en: "Pool access", es: "Acceso a la piscina" } },
        { key: "wifi", label: { pt: "Wi-Fi", en: "Wi-Fi", es: "Wi-Fi" } },
        {
          key: "airConditioning",
          label: { pt: "Ar-condicionado", en: "Air conditioning", es: "Aire acondicionado" },
        },
        {
          key: "privateBathroom",
          label: { pt: "Banheiro privativo", en: "Private bathroom", es: "Baño privado" },
        },
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-quadruplo-familia-01.jpg",
          alt: {
            pt: "Quarto Quádruplo Família: cama de casal, ventilador de teto e amplos armários",
            en: "Family Quadruple Room: double bed, ceiling fan and ample wardrobes",
            es: "Habitación Cuádruple Familiar: cama de matrimonio, ventilador de techo y amplios armarios",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-quadruplo-familia-02.jpg",
          alt: {
            pt: "Quarto Quádruplo Família: cama de solteiro adicional para acomodar o grupo",
            en: "Family Quadruple Room: additional single bed to accommodate the group",
            es: "Habitación Cuádruple Familiar: cama individual adicional para alojar al grupo",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-quadruplo-familia-03.jpg",
          alt: {
            pt: "Quarto Quádruplo Família: banheiro com arranjo de flores tropicais",
            en: "Family Quadruple Room: bathroom with a tropical flower arrangement",
            es: "Habitación Cuádruple Familiar: baño con arreglo de flores tropicales",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-quadruplo-familia-04.jpg",
          alt: {
            pt: "Quarto Quádruplo Família: cama de casal com vista para a varanda",
            en: "Family Quadruple Room: double bed with a view of the veranda",
            es: "Habitación Cuádruple Familiar: cama de matrimonio con vista a la veranda",
          },
          width: 1024,
          height: 683,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-triplo-classico",
      name: {
        pt: "Quarto Triplo Clássico",
        en: "Classic Triple Room",
        es: "Habitación Triple Clásica",
      },
      summary: {
        pt: "Excelente quarto com acomodações clássicas e confortáveis para três pessoas.",
        en: "An excellent room with classic, comfortable accommodations for three people.",
        es: "Excelente habitación con alojamiento clásico y confortable para tres personas.",
      },
      amenities: [
        {
          key: "breakfast",
          label: { pt: "Café da manhã incluso", en: "Breakfast included", es: "Desayuno incluido" },
        },
        { key: "pool", label: { pt: "Acesso à piscina", en: "Pool access", es: "Acceso a la piscina" } },
        { key: "wifi", label: { pt: "Wi-Fi", en: "Wi-Fi", es: "Wi-Fi" } },
        {
          key: "airConditioning",
          label: { pt: "Ar-condicionado", en: "Air conditioning", es: "Aire acondicionado" },
        },
        {
          key: "privateBathroom",
          label: { pt: "Banheiro privativo", en: "Private bathroom", es: "Baño privado" },
        },
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-triplo-classico-01.jpg",
          alt: {
            pt: "Quarto Triplo Clássico: três camas em ambiente rústico e aconchegante",
            en: "Classic Triple Room: three beds in a rustic, cozy setting",
            es: "Habitación Triple Clásica: tres camas en un ambiente rústico y acogedor",
          },
          width: 1024,
          height: 670,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-classico-02.jpg",
          alt: {
            pt: "Quarto Triplo Clássico: banheiro com box de vidro",
            en: "Classic Triple Room: bathroom with a glass shower enclosure",
            es: "Habitación Triple Clásica: baño con mampara de vidrio",
          },
          width: 1024,
          height: 707,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-triplo-vista-jardim",
      name: {
        pt: "Quarto Triplo com Vista do Jardim",
        en: "Triple Room with Garden View",
        es: "Habitación Triple con Vista al Jardín",
      },
      summary: {
        pt: "Excelente quarto com vista deslumbrante para o jardim, ideal para grupos de três pessoas.",
        en: "An excellent room with a stunning garden view, ideal for groups of three.",
        es: "Excelente habitación con una vista impresionante al jardín, ideal para grupos de tres personas.",
      },
      amenities: [
        {
          key: "breakfast",
          label: { pt: "Café da manhã incluso", en: "Breakfast included", es: "Desayuno incluido" },
        },
        { key: "pool", label: { pt: "Acesso à piscina", en: "Pool access", es: "Acceso a la piscina" } },
        { key: "wifi", label: { pt: "Wi-Fi", en: "Wi-Fi", es: "Wi-Fi" } },
        {
          key: "airConditioning",
          label: { pt: "Ar-condicionado", en: "Air conditioning", es: "Aire acondicionado" },
        },
        {
          key: "privateBathroom",
          label: { pt: "Banheiro privativo", en: "Private bathroom", es: "Baño privado" },
        },
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-jardim-01.jpg",
          alt: {
            pt: "Quarto Triplo com Vista do Jardim: acesso por porta emoldurada em pedra",
            en: "Triple Room with Garden View: entrance through a stone-framed door",
            es: "Habitación Triple con Vista al Jardín: acceso por puerta enmarcada en piedra",
          },
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-jardim-02.jpg",
          alt: {
            pt: "Quarto Triplo com Vista do Jardim: banheiro com bancada de madeira",
            en: "Triple Room with Garden View: bathroom with a wooden vanity",
            es: "Habitación Triple con Vista al Jardín: baño con encimera de madera",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-jardim-03.jpg",
          alt: {
            pt: "Quarto Triplo com Vista do Jardim: cama de casal com vista para o jardim",
            en: "Triple Room with Garden View: double bed with a garden view",
            es: "Habitación Triple con Vista al Jardín: cama de matrimonio con vista al jardín",
          },
          width: 1024,
          height: 683,
        },
      ],
      contactContext: "stay",
    },
    {
      id: "quarto-triplo-vista-piscina",
      visualEmphasis: "featured",
      name: {
        pt: "Quarto Triplo com Vista da Piscina",
        en: "Triple Room with Pool View",
        es: "Habitación Triple con Vista a la Piscina",
      },
      summary: {
        pt: "Excelente quarto com vista deslumbrante para a piscina, ideal para grupos de três pessoas.",
        en: "An excellent room with a stunning pool view, ideal for groups of three.",
        es: "Excelente habitación con una vista impresionante a la piscina, ideal para grupos de tres personas.",
      },
      amenities: [
        {
          key: "breakfast",
          label: { pt: "Café da manhã incluso", en: "Breakfast included", es: "Desayuno incluido" },
        },
        { key: "pool", label: { pt: "Acesso à piscina", en: "Pool access", es: "Acceso a la piscina" } },
        { key: "wifi", label: { pt: "Wi-Fi", en: "Wi-Fi", es: "Wi-Fi" } },
        {
          key: "airConditioning",
          label: { pt: "Ar-condicionado", en: "Air conditioning", es: "Aire acondicionado" },
        },
        {
          key: "privateBathroom",
          label: { pt: "Banheiro privativo", en: "Private bathroom", es: "Baño privado" },
        },
      ],
      images: [
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-piscina-01.jpg",
          alt: {
            pt: "Quarto Triplo com Vista da Piscina: portas de vidro abertas para o quarto",
            en: "Triple Room with Pool View: open glass doors leading into the room",
            es: "Habitación Triple con Vista a la Piscina: puertas de vidrio abiertas hacia la habitación",
          },
          width: 513,
          height: 768,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-piscina-02.jpg",
          alt: {
            pt: "Quarto Triplo com Vista da Piscina: corredor com piso em tacos de madeira",
            en: "Triple Room with Pool View: hallway with a wood parquet floor",
            es: "Habitación Triple con Vista a la Piscina: pasillo con piso de parqué de madera",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/quarto-triplo-vista-piscina-03.jpg",
          alt: {
            pt: "Quarto Triplo com Vista da Piscina: cama de casal em ambiente aconchegante",
            en: "Triple Room with Pool View: double bed in a cozy setting",
            es: "Habitación Triple con Vista a la Piscina: cama de matrimonio en un ambiente acogedor",
          },
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
      name: {
        pt: "Casamentos na Pousada Enseada Jatobá",
        en: "Weddings at Pousada Enseada Jatobá",
        es: "Bodas en Pousada Enseada Jatobá",
      },
      purpose: {
        pt:
          "Cerimônia ao ar livre cercada pela natureza, recepção personalizável e acompanhamento próximo " +
          "da equipe do início ao grande dia. A pousada oferece um espaço versátil para casamentos, com " +
          "opções de decoração, catering e serviços de apoio para tornar cada celebração única e memorável.",
        en:
          "An open-air ceremony surrounded by nature, a fully customizable reception, and close support " +
          "from our team from start to the big day. The guesthouse offers a versatile space for weddings, " +
          "with decoration, catering and support-service options to make every celebration unique and " +
          "memorable.",
        es:
          "Ceremonia al aire libre rodeada de naturaleza, recepción personalizable y acompañamiento " +
          "cercano del equipo desde el inicio hasta el gran día. La posada ofrece un espacio versátil " +
          "para bodas, con opciones de decoración, catering y servicios de apoyo para hacer de cada " +
          "celebración algo único y memorable.",
      },
      images: [
        {
          src: "/images/pousada/quartos/local-casamento-01.jpg",
          alt: {
            pt: "Área externa da pousada com jardim, coqueiros e vista para o entorno natural",
            en: "Outdoor area of the guesthouse with a garden, coconut palms and a view of the surrounding nature",
            es: "Área exterior de la posada con jardín, cocoteros y vista al entorno natural",
          },
          width: 1024,
          height: 391,
        },
        {
          src: "/images/pousada/quartos/local-casamento-02.jpg",
          alt: {
            pt: "Passarela de madeira sobre a água levando à área de praia da pousada",
            en: "Wooden walkway over the water leading to the guesthouse's beach area",
            es: "Pasarela de madera sobre el agua que conduce al área de playa de la posada",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/local-casamento-03.jpg",
          alt: {
            pt: "Gramado amplo entre coqueiros com vista para a água ao fundo",
            en: "Wide lawn among coconut palms with the water visible in the background",
            es: "Amplio césped entre cocoteros con vista al agua de fondo",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/local-casamento-04.jpg",
          alt: {
            pt: "Gramado e jardim tropical da pousada com vista para a água",
            en: "Lawn and tropical garden of the guesthouse with a view of the water",
            es: "Césped y jardín tropical de la posada con vista al agua",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/local-casamento-05.jpg",
          alt: {
            pt: "Espaço coberto ao ar livre para recepção, cercado por coqueiros",
            en: "Covered open-air space for the reception, surrounded by coconut palms",
            es: "Espacio cubierto al aire libre para la recepción, rodeado de cocoteros",
          },
          width: 1024,
          height: 683,
        },
        {
          src: "/images/pousada/quartos/local-casamento-06.jpg",
          alt: {
            pt: "Vista aérea da sede da pousada com telhado colonial, piscina e jardim exuberante",
            en: "Aerial view of the guesthouse's main building with its colonial roof, pool and lush garden",
            es: "Vista aérea de la sede de la posada con techo colonial, piscina y exuberante jardín",
          },
          width: 1024,
          height: 576,
        },
      ],
      contactContext: "wedding",
      isFeatured: true,
    },
    {
      id: "eventos",
      name: {
        pt: "Espaço para Eventos em Geral",
        en: "General Events Space",
        es: "Espacio para Eventos en General",
      },
      purpose: {
        pt:
          "Espaço versátil para aniversários, confraternizações corporativas e encontros familiares, " +
          "com estrutura de apoio e ambientação natural. A pousada oferece um espaço adaptável para " +
          "eventos diversos, com opções de catering, decoração e serviços de apoio para atender às " +
          "necessidades de cada ocasião.",
        en:
          "A versatile space for birthdays, corporate gatherings and family get-togethers, with " +
          "supporting infrastructure and a natural setting. The guesthouse offers an adaptable space " +
          "for a variety of events, with catering, decoration and support-service options to meet the " +
          "needs of each occasion.",
        es:
          "Espacio versátil para cumpleaños, encuentros corporativos y reuniones familiares, con " +
          "infraestructura de apoyo y ambientación natural. La posada ofrece un espacio adaptable para " +
          "eventos diversos, con opciones de catering, decoración y servicios de apoyo para atender las " +
          "necesidades de cada ocasión.",
      },
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
      quote: {
        pt:
          "Lugar maravilhoso para quem quer uma conexão com a natureza. Proprietários Enzo e " +
          "Robson super receptivos e acolhedores, trazendo com pequenos detalhes o diferencial.",
        en:
          "A wonderful place for anyone looking to connect with nature. The owners, Enzo and " +
          "Robson, are extremely welcoming and attentive, and their attention to small details " +
          "makes all the difference.",
        es:
          "Un lugar maravilloso para quienes buscan una conexión con la naturaleza. Los " +
          "propietarios, Enzo y Robson, son súper receptivos y acogedores, y los pequeños " +
          "detalles marcan la diferencia.",
      },
      attribution: "Camila Andrade",
      experienceType: "stay",
      approvedAt: "2026-07-25",
    },
    {
      id: "testimonial-helena-werneck",
      quote: {
        pt:
          "A recepção foi excelente, pessoas educadas, atenciosas, prestativas, lugar maravilhoso, " +
          "contato com a natureza e um custo benefício q vale a pena, recomendo.",
        en:
          "The reception was excellent — polite, attentive and helpful staff, a wonderful place " +
          "with close contact with nature, and great value for money. I recommend it.",
        es:
          "La recepción fue excelente, personas educadas, atentas y serviciales, un lugar " +
          "maravilloso, contacto con la naturaleza y una buena relación calidad-precio. Lo " +
          "recomiendo.",
      },
      attribution: "Helana Werneck",
      experienceType: "stay",
      approvedAt: "2026-01-25",
    },
    {
      id: "testimonial-joao-paulo",
      quote: {
        pt:
          "Vista linda no entorno da pousada , arquitetura bonita , limpeza excelente, próximo" +
          " ao centro de Paraty, boa localização.",
        en:
          "Beautiful views around the guesthouse, lovely architecture, excellent cleanliness, " +
          "close to downtown Paraty, and a great location.",
        es:
          "Hermosa vista alrededor de la posada, arquitectura bonita, limpieza excelente, cerca " +
          "del centro de Paraty, buena ubicación.",
      },
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
    coordinates: { lat: -23.1819646, lng: -44.7164933 },
    mapEmbedUrl: "https://maps.google.com/maps?q=-23.1819646,-44.7164933&z=16&output=embed",
    streetViewEmbedUrl:
      "https://maps.google.com/maps?cbll=-23.1819646,-44.7164933&layer=c&cbp=11,0,0,0,0&output=svembed",
    fallbackMapUrl: "https://www.google.com/maps?q=-23.1819646,-44.7164933",
  },
};
