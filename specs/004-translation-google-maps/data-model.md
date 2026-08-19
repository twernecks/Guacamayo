# Data Model: Seletor de Idioma e Mapa com Google Maps/Street View

**Input**: `specs/004-translation-google-maps/spec.md` (Key Entities), `research.md`

## LanguageCode

Idiomas suportados pelo site.

```ts
export type LanguageCode = "pt" | "en" | "es";
export const DEFAULT_LANGUAGE: LanguageCode = "pt";
export const SUPPORTED_LANGUAGES: LanguageCode[] = ["pt", "en", "es"];
```

- Corresponde à entidade **Preferência de Idioma** da spec.
- `pt` é sempre o idioma inicial de qualquer render sem preferência salva (Decision 2 do
  `research.md`).

## LocalizedText

Tipo utilitário para qualquer texto voltado ao visitante que precisa existir nas três línguas.

```ts
export type LocalizedText = Record<LanguageCode, string>;
```

- Regra de preenchimento (FR-007): todo `LocalizedText` MUST ter as três chaves preenchidas no
  momento da implementação (o fallback em runtime só existe como rede de segurança para dados
  incompletos, não como comportamento esperado do conteúdo aprovado).
- Corresponde à entidade **Conteúdo Localizado** da spec.

## Extensões ao domínio existente (`src/domain/content.ts`)

Cada tipo abaixo é o já existente (de `001-pousada-landing-page`), com os campos de texto
voltados ao visitante convertidos de `string`/`string[]` para `LocalizedText`/`LocalizedText[]`.
Campos estruturais (ids, URLs de imagem, dimensões, datas, telefone/WhatsApp) permanecem
inalterados — são fatos, não texto para tradução.

```ts
export type Media = {
  src: string;
  alt: LocalizedText;       // era: string — texto alternativo precisa existir nas 3 línguas (a11y)
  width: number;
  height: number;
  caption?: LocalizedText;  // era: string
};

export type Room = {
  id: string;
  name: LocalizedText;         // era: string
  summary: LocalizedText;      // era: string
  amenities: LocalizedText[];  // era: string[] — cada item de comodidade traduzido
  images: Media[];
  contactContext: "stay";
};

export type EventSpace = {
  id: string;
  name: LocalizedText;     // era: string
  purpose: LocalizedText;  // era: string
  images: Media[];
  contactContext: "event" | "wedding";
  isFeatured: boolean;
};

export type Testimonial = {
  id: string;
  quote: LocalizedText;    // era: string
  attribution: string;     // inalterado — nome de pessoa não é traduzido
  experienceType: ExperienceType;
  approvedAt: string;
};
```

**Validation rule**: nenhum campo `LocalizedText`/`LocalizedText[]` pode ter uma chave de idioma
ausente ou com string vazia no conteúdo aprovado (`pousada-content.ts`) — isso seria o "gap" que o
fallback em runtime (FR-007) existe para cobrir apenas em falhas inesperadas, não em conteúdo
publicado.

## Location (mapa)

```ts
export type GeoCoordinates = {
  lat: number;
  lng: number;
};

export type Location = {
  address: string;               // inalterado — endereço físico não é "traduzido"
  coordinates: GeoCoordinates;   // novo — pino exato confirmado pelo proprietário
  mapEmbedUrl: string;           // era: URL do OpenStreetMap — passa a ser embed do Google Maps
  streetViewEmbedUrl?: string;   // novo — embed do Street View no mesmo ponto; opcional se não
                                 // houver cobertura confirmada
  fallbackMapUrl: string;        // inalterado no tipo — passa a apontar para o Google Maps
};
```

- Corresponde à entidade **Localização da Pousada** da spec.
- Valor confirmado (`specs/004-translation-google-maps/spec.md` > Key Entities):
  `coordinates = { lat: -23.1819646, lng: -44.7164933 }`.
- `streetViewEmbedUrl` ausente/`undefined` é um estado de dado válido (não um erro) — a UI
  MUST tratar a ausência mostrando o aviso definido no Edge Case correspondente da spec, em vez de
  tentar renderizar um iframe vazio.

## Catálogo de mensagens de UI (`src/i18n/messages/{pt,en,es}.ts`)

Textos que não pertencem ao conteúdo de negócio (`PousadaContent`), mas à interface em si:
rótulos de navegação, títulos de seção, textos de botão, mensagens de estado vazio/erro,
templates das mensagens de WhatsApp.

```ts
export type Messages = {
  nav: { rooms: string; weddings: string; testimonials: string; location: string };
  languageSelector: { label: string; current: (lang: LanguageCode) => string };
  location: {
    heading: string;
    loadMapButton: string;
    privacyNotice: string;
    openInGoogleMapsLink: string;
    streetViewUnavailableNotice: string;
  };
  whatsapp: {
    roomInquiry: (roomName: string) => string;
    weddingInquiry: (venueName: string) => string;
    generalContact: string;
  };
  // ...demais chaves conforme os textos de UI existentes forem inventariados na
  // fase de tasks (menu, quartos, casamentos/eventos, relatos, rodapé).
};
```

- Uma implementação (`pt.ts`, `en.ts`, `es.ts`) por idioma, todas satisfazendo o mesmo tipo
  `Messages` — erro de compilação se uma chave faltar em algum idioma (garante FR-007 em
  build-time para o catálogo de UI, complementando a validação em runtime para
  `PousadaContent`).
- `whatsapp.roomInquiry`/`weddingInquiry` são funções, não strings fixas, porque o nome do
  quarto/espaço (já um `LocalizedText`) é interpolado na mensagem final — mantém a mensagem
  gramaticalmente correta nas 3 línguas em vez de concatenação ingênua.

## State/Context (não é dado persistido no domínio, mas parte do modelo de execução)

```ts
type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Messages;                              // catálogo de UI já resolvido no idioma atual
  localize: (text: LocalizedText) => string; // resolve um LocalizedText no idioma atual, com
                                              // fallback para "pt" se a chave faltar (FR-007)
};
```

- Fornecido por um `LanguageProvider` no topo da árvore (`src/i18n/LanguageContext.tsx`),
  consumido via hook (`useLanguage()`) pelos componentes que precisam do idioma atual — não
  requer prop-drilling manual do idioma por toda a árvore de seções.
- `setLanguage` atualiza o estado do Context de forma síncrona (FR-012, sem loading state) e tenta
  persistir em `localStorage` como efeito colateral best-effort: se a escrita falhar (FR-011, ex.
  navegação privada), o estado em memória continua atualizado normalmente para a sessão atual — a
  falha de persistência é silenciosa, nunca bloqueia a troca de idioma nem lança ao chamador.
